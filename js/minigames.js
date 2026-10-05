/**
 * ==========================================================================
 * Persona 3 Reload - Mini Games Arcade (three.js)
 * --------------------------------------------------------------------------
 * Four self-contained 3D mini games rendered with a locally vendored copy of
 * three.js (js/three.module.min.js - no CDN, no build step):
 *
 *   01 SHADOW DODGE   survive a neon corridor, dodge shadows, grab orbs
 *   02 EVOKER TARGET  aim & shoot floating targets, 30s combo run
 *   03 BLOCK BREAKER  paddle / ball / block wall, 3 lives, level ups
 *   04 RING RUSH      fly through rings before the shields drop
 *
 * main.js owns the page shell (tabs, routing, HUD buttons) and talks to this
 * module through window.MiniGames. Everything below only cares about the
 * WebGL viewport, the game state and the in-canvas HUD.
 * ==========================================================================
 */

const MG_BEST_KEY = "p3r-mg-best-";

const GAMES = [
  {
    id: "shadow-dodge",
    code: "01",
    name: "SHADOW DODGE",
    desc: "Hindari bayangan di koridor neon dan bertahan selama mungkin.",
    controls: [
      { key: "\u2190 \u2192", label: "Geser kapal" },
      { key: "A / D", label: "Alternatif" },
      { key: "ESC", label: "Berhenti" }
    ],
    icon: '<path d="M32 8 14 40h36z"/><path d="M32 40v14"/><path class="acc-s" d="M20 54h24"/>',
    time: 0,
    lives: 3,
    hudTime: false,
    hudLivesLabel: "LIVES"
  },
  {
    id: "evoker-target",
    code: "02",
    name: "EVOKER TARGET",
    desc: "Bidik target melayang selama 30 detik dan jaga combomu.",
    controls: [
      { key: "MOUSE", label: "Bidik target" },
      { key: "CLICK", label: "Tembak" },
      { key: "SPACE", label: "Tembak (alt)" }
    ],
    icon: '<circle cx="32" cy="32" r="18"/><path class="acc-s" d="M32 6v12M32 46v12M6 32h12M46 32h12"/><circle class="acc-f" cx="32" cy="32" r="5"/>',
    time: 30,
    lives: 0,
    hudTime: true,
    hudTimeLabel: "TIME",
    hudLivesLabel: "COMBO"
  },
  {
    id: "block-breaker",
    code: "03",
    name: "BLOCK BREAKER",
    desc: "Pantulkan bola, runtuhkan balok — 3 nyawa, tiap lantai lebih cepat.",
    controls: [
      { key: "\u2190 \u2192", label: "Geser paddle" },
      { key: "SPACE", label: "Leparkan bola" },
      { key: "ESC", label: "Berhenti" }
    ],
    icon: '<rect x="8" y="12" width="15" height="10"/><rect class="acc-f" x="25" y="12" width="15" height="10"/><rect x="42" y="12" width="14" height="10"/><rect x="8" y="26" width="15" height="10"/><rect x="25" y="26" width="15" height="10"/><rect x="42" y="26" width="14" height="10"/><rect class="acc-s" x="24" y="50" width="18" height="5"/><circle cx="33" cy="42" r="3"/>',
    time: 0,
    lives: 3,
    hudTime: true,
    hudTimeLabel: "LEVEL",
    hudLivesLabel: "LIVES"
  },
  {
    id: "ring-rush",
    code: "04",
    name: "RING RUSH",
    desc: "Tembus cincin yang datang sebelum tiga perisaimu habis.",
    controls: [
      { key: "\u2190 \u2192 \u2191 \u2193", label: "Steering" },
      { key: "W A S D", label: "Alternatif" },
      { key: "ESC", label: "Berhenti" }
    ],
    icon: '<ellipse cx="32" cy="32" rx="22" ry="10"/><ellipse class="acc-s" cx="32" cy="32" rx="12" ry="5"/><path d="M32 18v-8M32 54v-8"/>',
    time: 45,
    lives: 3,
    hudTime: true,
    hudTimeLabel: "TIME",
    hudLivesLabel: "SHIELDS"
  }
];

/* -------------------------------------------------------------------------
 * DOM
 * ---------------------------------------------------------------------- */
const el = {
  wrap: document.querySelector(".p3r-minigame-canvas-wrap"),
  canvas: document.getElementById("minigame-canvas"),
  status: document.getElementById("minigame-status"),
  best: document.getElementById("minigame-best"),
  icon: document.getElementById("minigame-icon"),
  code: document.getElementById("minigame-code"),
  title: document.getElementById("minigame-title"),
  desc: document.getElementById("minigame-desc"),
  controls: document.getElementById("minigame-controls"),
  playBtn: document.getElementById("minigame-play-btn"),
  playLabel: document.getElementById("minigame-play-label"),
  score: document.getElementById("minigame-score"),
  hudTime: document.getElementById("minigame-hud-time"),
  timeLabel: document.getElementById("minigame-time-label"),
  time: document.getElementById("minigame-time"),
  hudLives: document.getElementById("minigame-hud-lives"),
  livesLabel: document.getElementById("minigame-lives-label"),
  lives: document.getElementById("minigame-lives"),
  overlay: document.getElementById("minigame-overlay"),
  overlayTitle: document.getElementById("minigame-overlay-title"),
  overlaySub: document.getElementById("minigame-overlay-sub"),
  crosshair: document.getElementById("minigame-crosshair"),
  section: document.getElementById("minigame-page")
};

/* -------------------------------------------------------------------------
 * State
 * ---------------------------------------------------------------------- */
const state = {
  mounted: false,
  ready: false,
  failed: false,
  running: false,
  index: 0,
  score: 0,
  combo: 0,
  bestCombo: 0,
  lives: 3,
  level: 1,
  time: 0,
  shots: 0,
  hits: 0,
  keys: Object.create(null),
  pointer: { x: 0, y: 0, ndc: { x: 0, y: 0 } }
};

let THREE = null;
let renderer = null;
let scene = null;
let camera = null;
let game = null;
let attract = null;
let rafId = 0;
let lastT = 0;
let frameCount = 0;
/* invalidates an in-flight start() when the player switches game or stops */
let runToken = 0;
let resizeObserver = null;
let listenersBound = false;
let glowTextureCache = null;

/* -------------------------------------------------------------------------
 * Small utilities
 * ---------------------------------------------------------------------- */
const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);
const pad6 = (n) => Math.max(0, Math.floor(n)).toString().padStart(6, "0");
const pad2 = (n) => Math.max(0, Math.floor(n)).toString().padStart(2, "0");
const keyDown = (...names) => names.some((n) => state.keys[n] === true);

function normalizeKey(e) {
  const k = e.key;
  if (!k) return "";
  return k.length === 1 ? k.toLowerCase() : k;
}

function getBest(id) {
  try {
    return parseInt(localStorage.getItem(MG_BEST_KEY + id) || "0", 10) || 0;
  } catch (err) {
    return 0;
  }
}

function saveBest(id, value) {
  try {
    if (value > getBest(id)) localStorage.setItem(MG_BEST_KEY + id, String(Math.floor(value)));
  } catch (err) {
    /* private mode / storage disabled - score simply is not persisted */
  }
  return getBest(id);
}

/* Tiny procedural blips so the arcade has feedback without extra audio files */
let audioCtx = null;
function blip(freq = 520, dur = 0.09, type = "square", vol = 0.05) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(50, freq * 0.45), now + dur);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.03);
  } catch (err) {
    /* audio is a bonus, never a blocker */
  }
}

/* -------------------------------------------------------------------------
 * HUD / overlay / info panel
 * ---------------------------------------------------------------------- */
function setStatus(text) {
  if (el.status) el.status.textContent = text;
}

function setPlayLabel(text) {
  if (el.playLabel) el.playLabel.textContent = text;
}

function showOverlay(title, sub) {
  if (!el.overlay) return;
  if (el.overlayTitle) el.overlayTitle.textContent = title;
  if (el.overlaySub) el.overlaySub.textContent = sub || "";
  el.overlay.classList.remove("hidden");
}

function hideOverlay() {
  if (el.overlay) el.overlay.classList.add("hidden");
}

function showCrosshair(show) {
  if (el.crosshair) el.crosshair.classList.toggle("show", !!show);
}

function updateHUD() {
  const g = GAMES[state.index];
  if (!g) return;

  setNode(el.score, "score", pad6(state.score));

  if (el.hudTime) {
    const showTime = g.hudTime ? "" : "none";
    if (el.hudTime.style.display !== showTime) el.hudTime.style.display = showTime;
    if (g.hudTime) {
      setNode(el.timeLabel, "timeLabel", g.hudTimeLabel || "TIME");
      setNode(el.time, "time", g.hudTimeLabel === "LEVEL" ? pad2(state.level) : pad2(state.time));
    }
  }

  if (el.hudLives) {
    setNode(el.livesLabel, "livesLabel", g.hudLivesLabel || "LIVES");
    setNode(el.lives, "lives", String(state.lives));
  }
}

/* Only touch the DOM when a value actually changed (updateHUD runs per frame) */
const hudCache = Object.create(null);
function setNode(node, cacheKey, value) {
  if (!node) return;
  if (hudCache[cacheKey] === value) return;
  hudCache[cacheKey] = value;
  node.textContent = value;
}

function renderInfo() {
  const g = GAMES[state.index];
  if (!g) return;

  if (el.code) el.code.textContent = g.code;
  if (el.title) el.title.textContent = g.name;
  if (el.desc) el.desc.textContent = g.desc;
  if (el.icon) {
    el.icon.innerHTML =
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
      g.icon +
      "</svg>";
  }
  if (el.controls) {
    el.controls.innerHTML = g.controls
      .map(
        (c) =>
          '<div class="p3r-minigame-key"><span class="k">' +
          c.key +
          '</span><span class="v">' +
          c.label +
          "</span></div>"
      )
      .join("");
  }
  if (el.best) el.best.textContent = pad6(getBest(g.id));

  state.score = 0;
  state.combo = 0;
  state.lives = g.lives || 0;
  state.time = g.time || 0;
  state.shots = 0;
  state.hits = 0;
  updateHUD();
}

/* -------------------------------------------------------------------------
 * three.js helpers (shared look & feel)
 * ---------------------------------------------------------------------- */
function newScene(bg = 0x030b1e, fogNear = 16, fogFar = 78) {
  const s = new THREE.Scene();
  s.background = new THREE.Color(bg);
  s.fog = new THREE.Fog(bg, fogNear, fogFar);
  return s;
}

function addLights(s, ambient = 0.6, dir = 0.85) {
  s.add(new THREE.AmbientLight(0x9fd8ff, ambient));
  const d = new THREE.DirectionalLight(0xffffff, dir);
  d.position.set(6, 12, 9);
  s.add(d);
  const cyan = new THREE.PointLight(0x16cffb, 90, 60);
  cyan.position.set(-7, 5, 5);
  s.add(cyan);
  const red = new THREE.PointLight(0xe60024, 55, 60);
  red.position.set(8, -3, -6);
  s.add(red);
}

function glowTexture() {
  if (glowTextureCache) return glowTextureCache;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  glowTextureCache = new THREE.CanvasTexture(c);
  return glowTextureCache;
}

function glowSprite(color, size) {
  const mat = new THREE.SpriteMaterial({
    map: glowTexture(),
    color: color,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const sp = new THREE.Sprite(mat);
  sp.scale.setScalar(size);
  return sp;
}

function neonBox(w, h, d, color, edgeColor = 0xffffff) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.5,
    roughness: 0.35,
    metalness: 0.25
  });
  const mesh = new THREE.Mesh(geo, mat);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: 0.92 })
  );
  mesh.add(edges);
  return mesh;
}

function wireWrap(mesh, color = 0xffffff) {
  mesh.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.85 })
    )
  );
  return mesh;
}

function starfield(count, spread, color = 0x9fe8ff, size = 0.09) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.55;
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: color,
    size: size,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  return new THREE.Points(geo, mat);
}

function killObject(obj) {
  obj.traverse((node) => {
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach((m) => m.dispose());
    }
  });
}

function clearScene() {
  if (scene) killObject(scene);
  scene = null;
  camera = null;
}

function removeMesh(s, mesh, list, index) {
  s.remove(mesh);
  if (mesh.geometry) mesh.geometry.dispose();
  if (mesh.material) mesh.material.dispose();
  list.splice(index, 1);
}

/* -------------------------------------------------------------------------
 * Attract mode (idle showcase rendered behind the dossier panel)
 * ---------------------------------------------------------------------- */
const ATTRACT_GEOS = ["octahedron", "torus", "box", "knot"];

function makeAttractGeo(kind, THREE_) {
  switch (kind) {
    case "torus":
      return new THREE_.TorusGeometry(1.7, 0.36, 14, 56);
    case "box":
      return new THREE_.BoxGeometry(2.4, 1.2, 1.2);
    case "knot":
      return new THREE_.TorusKnotGeometry(1.25, 0.3, 130, 18);
    default:
      return new THREE_.OctahedronGeometry(1.7, 0);
  }
}

function buildAttract() {
  clearScene();

  scene = newScene(0x02091c, 18, 86);
  camera = new THREE.PerspectiveCamera(55, 1, 0.1, 240);
  camera.position.set(0, 2.8, 10);
  camera.lookAt(0, 0.4, 0);
  addLights(scene);

  const grid = new THREE.GridHelper(160, 80, 0x16cffb, 0x0a2f57);
  grid.position.y = -2.6;
  scene.add(grid);

  const stars = starfield(700, 110);
  scene.add(stars);

  const core = wireWrap(
    new THREE.Mesh(
      makeAttractGeo(ATTRACT_GEOS[state.index % ATTRACT_GEOS.length], THREE),
      new THREE.MeshStandardMaterial({
        color: 0x0b2f5c,
        emissive: 0x16cffb,
        emissiveIntensity: 0.65,
        metalness: 0.6,
        roughness: 0.28
      })
    ),
    0xffffff
  );
  core.position.y = 0.6;
  scene.add(core);

  const halo = glowSprite(0x16cffb, 9);
  halo.position.y = 0.6;
  scene.add(halo);

  attract = {
    t: 0,
    grid: grid,
    stars: stars,
    core: core,
    update(dt) {
      this.t += dt;
      this.core.rotation.y += dt * 0.55;
      this.core.rotation.x = Math.sin(this.t * 0.5) * 0.35;
      this.core.position.y = 0.6 + Math.sin(this.t * 1.2) * 0.25;
      this.grid.position.z = (this.grid.position.z + dt * 6) % 4;
      this.stars.rotation.y += dt * 0.02;
      camera.position.x = Math.sin(this.t * 0.22) * 1.6;
      camera.lookAt(0, 0.5, 0);
    }
  };
}

function swapAttractCore() {
  if (!attract || !attract.core) return;
  const old = attract.core.geometry;
  attract.core.geometry = makeAttractGeo(ATTRACT_GEOS[state.index % ATTRACT_GEOS.length], THREE);
  old.dispose();
}

/* =========================================================================
 * GAME 01 - SHADOW DODGE
 * ====================================================================== */
function gameShadowDodge() {
  const LANE = 4.4;
  let player = null;
  let grid = null;
  const obstacles = [];
  const orbs = [];
  let spawnT = 0.6;
  let orbT = 2.2;
  let elapsed = 0;
  let speed = 15;
  let targetX = 0;
  let invuln = 0;

  function spawnObstacle() {
    const size = 1.5 + Math.random() * 0.9;
    const box = neonBox(size, size * 0.9, 1.4, 0x120a22, 0xe60024);
    box.position.set((Math.random() * 2 - 1) * LANE, 0.1, -62);
    box.userData.spin = (Math.random() - 0.5) * 1.6;
    scene.add(box);
    obstacles.push(box);
  }

  function spawnOrb() {
    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.38, 0),
      new THREE.MeshStandardMaterial({ color: 0x0a3d5c, emissive: 0x2ce8ff, emissiveIntensity: 1.2, roughness: 0.2 })
    );
    wireWrap(orb, 0x7de6fd);
    orb.add(glowSprite(0x2ce8ff, 3));
    orb.position.set((Math.random() * 2 - 1) * LANE, 0.4, -62);
    scene.add(orb);
    orbs.push(orb);
  }

  function hitPlayer() {
    if (invuln > 0) return;
    invuln = 1.5;
    state.lives -= 1;
    blip(120, 0.22, "sawtooth", 0.07);
    flashPlayer();
    if (state.lives <= 0) {
      state.lives = 0;
      endGame("GAME OVER", "Bertahan " + Math.floor(elapsed) + " detik");
    }
    updateHUD();
  }

  function flashPlayer() {
    const body = player.children[0];
    if (body && body.material) {
      body.material.emissiveIntensity = 2.4;
      setTimeout(() => {
        if (body.material) body.material.emissiveIntensity = 0.9;
      }, 160);
    }
  }

  return {
    id: "shadow-dodge",
    init() {
      scene = newScene(0x040d24, 14, 74);
      camera = new THREE.PerspectiveCamera(62, 1, 0.1, 240);
      camera.position.set(0, 3.7, 9.2);
      camera.lookAt(0, 1, -10);
      addLights(scene);

      grid = new THREE.GridHelper(220, 110, 0x16cffb, 0x0a3160);
      grid.position.y = -1.5;
      scene.add(grid);

      [-5.6, 5.6].forEach((x) => {
        const rail = neonBox(0.34, 0.34, 240, 0x0d3b66, 0x16cffb);
        rail.position.set(x, -1.3, -70);
        scene.add(rail);
      });

      player = new THREE.Group();
      const body = wireWrap(
        new THREE.Mesh(
          new THREE.OctahedronGeometry(0.62, 0),
          new THREE.MeshStandardMaterial({
            color: 0x0d4170,
            emissive: 0x16cffb,
            emissiveIntensity: 0.9,
            metalness: 0.65,
            roughness: 0.22
          })
        ),
        0xffffff
      );
      player.add(body);
      player.add(glowSprite(0x16cffb, 4.2));
      const lamp = new THREE.PointLight(0x16cffb, 60, 18);
      player.add(lamp);
      player.position.set(0, 0.35, 0);
      scene.add(player);

      scene.add(starfield(500, 130));
      updateHUD();
    },

    update(dt) {
      elapsed += dt;
      invuln = Math.max(0, invuln - dt);
      speed = Math.min(34, 15 + elapsed * 0.85);
      state.score += dt * 12;

      /* steering */
      const dir = (keyDown("ArrowRight", "d") ? 1 : 0) - (keyDown("ArrowLeft", "a") ? 1 : 0);
      targetX = clamp(targetX + dir * dt * 13, -LANE, LANE);
      const prevX = player.position.x;
      player.position.x += (targetX - player.position.x) * Math.min(1, dt * 11);
      player.rotation.z = clamp((player.position.x - prevX) * -6, -0.7, 0.7);
      player.rotation.y += dt * 1.4;
      if (invuln > 0) player.visible = Math.floor(elapsed * 14) % 2 === 0;
      else player.visible = true;

      /* corridor scroll */
      grid.position.z += speed * dt;
      if (grid.position.z > 2) grid.position.z -= 2;

      /* spawning */
      spawnT -= dt;
      if (spawnT <= 0) {
        spawnT = Math.max(0.34, 0.95 - elapsed * 0.012);
        spawnObstacle();
      }
      orbT -= dt;
      if (orbT <= 0) {
        orbT = 2.4 + Math.random() * 2.2;
        spawnOrb();
      }

      /* obstacles */
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.position.z += speed * dt;
        o.rotation.x += dt * (o.userData.spin || 0);
        o.rotation.y += dt * 0.7;

        if (Math.abs(o.position.z) < 1.2 && Math.abs(o.position.x - player.position.x) < 1.5) {
          removeMesh(scene, o, obstacles, i);
          hitPlayer();
          continue;
        }
        if (o.position.z > 14) removeMesh(scene, o, obstacles, i);
      }

      /* orbs */
      for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];
        orb.position.z += speed * dt;
        orb.rotation.y += dt * 2.4;

        if (Math.abs(orb.position.z) < 1.2 && Math.abs(orb.position.x - player.position.x) < 1.4) {
          state.score += 40;
          blip(880, 0.1, "sine", 0.06);
          removeMesh(scene, orb, orbs, i);
          updateHUD();
          continue;
        }
        if (orb.position.z > 14) removeMesh(scene, orb, orbs, i);
      }

      camera.position.x += (player.position.x * 0.35 - camera.position.x) * Math.min(1, dt * 4);
      camera.lookAt(player.position.x * 0.3, 1, -10);
      updateHUD();
    },

    action() {},
    dispose() {}
  };
}

/* =========================================================================
 * GAME 02 - EVOKER TARGET
 * ====================================================================== */
function gameEvokerTarget() {
  const targets = [];
  const pops = [];
  let spawnT = 0.4;
  let backdrop = null;

  function randomSpot() {
    return {
      x: (Math.random() * 2 - 1) * 5.6,
      y: (Math.random() * 2 - 1) * 3.3,
      z: -3 + Math.random() * 7
    };
  }

  function spawnTarget() {
    const spot = randomSpot();
    const color = Math.random() < 0.35 ? 0xffd23f : 0x16cffb;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 24, 18),
      new THREE.MeshStandardMaterial({
        color: 0x082445,
        emissive: color,
        emissiveIntensity: 1.1,
        metalness: 0.4,
        roughness: 0.25,
        transparent: true,
        opacity: 1
      })
    );
    wireWrap(mesh, 0xffffff);
    mesh.add(glowSprite(color, 4.4));
    mesh.position.set(spot.x, spot.y, spot.z);
    scene.add(mesh);
    targets.push({ mesh: mesh, life: 2.3, max: 2.3, spin: (Math.random() - 0.5) * 2 });
  }

  function popTarget(t) {
    pops.push({ mesh: t.mesh, t: 0.28, base: t.mesh.scale.x });
  }

  function shoot() {
    if (!state.running) return;
    state.shots += 1;

    const origin = new THREE.Vector3(state.pointer.ndc.x, state.pointer.ndc.y, 0.5);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(origin, camera);
    const list = targets.filter((t) => !pops.some((p) => p.mesh === t.mesh));
    const hits = ray.intersectObjects(list.map((t) => t.mesh), false);

    if (hits.length) {
      const mesh = hits[0].object;
      const idx = targets.findIndex((t) => t.mesh === mesh);
      if (idx >= 0) {
        const t = targets[idx];
        targets.splice(idx, 1);
        state.hits += 1;
        state.combo += 1;
        state.bestCombo = Math.max(state.bestCombo, state.combo);
        state.score += 100 + (state.combo - 1) * 25;
        blip(560 + Math.min(state.combo, 12) * 40, 0.1, "square", 0.055);
        popTarget(t);
        updateHUD();
      }
    } else {
      state.combo = 0;
      blip(150, 0.07, "sawtooth", 0.04);
      updateHUD();
    }
  }

  return {
    id: "evoker-target",
    init() {
      scene = newScene(0x04071a, 22, 96);
      camera = new THREE.PerspectiveCamera(55, 1, 0.1, 240);
      camera.position.set(0, 0, 13);
      camera.lookAt(0, 0, 0);
      addLights(scene);

      backdrop = new THREE.Mesh(
        new THREE.TorusGeometry(7.6, 0.14, 10, 96),
        new THREE.MeshStandardMaterial({ color: 0x0a2c52, emissive: 0x16cffb, emissiveIntensity: 0.9 })
      );
      backdrop.position.set(0, 0, -9);
      scene.add(backdrop);

      const floor = new THREE.GridHelper(90, 45, 0x16cffb, 0x082c54);
      floor.position.y = -4.6;
      scene.add(floor);

      for (let i = 0; i < 7; i++) {
        const pillar = neonBox(0.5, 0.5 + Math.random() * 4, 0.5, 0x0c2f57, 0x7de6fd);
        pillar.position.set((Math.random() * 2 - 1) * 7.5, -3.4 + Math.random() * 2, -6 - Math.random() * 4);
        scene.add(pillar);
      }

      scene.add(starfield(420, 90));
      showCrosshair(true);
      updateHUD();
    },

    update(dt) {
      state.time = Math.max(0, state.time - dt);
      if (state.time <= 0) {
        const acc = state.shots ? Math.round((state.hits / state.shots) * 100) : 0;
        endGame("TIME UP", "Akurasi " + acc + "% - combo terbaik " + state.bestCombo);
        return;
      }

      backdrop.rotation.z += dt * 0.18;

      spawnT -= dt;
      if (spawnT <= 0 && targets.length < 4) {
        spawnT = 0.72;
        spawnTarget();
      }

      for (let i = targets.length - 1; i >= 0; i--) {
        const t = targets[i];
        t.life -= dt;
        t.mesh.rotation.y += dt * (1.2 + t.spin);
        const k = t.life / t.max;
        if (k < 0.35) {
          const s = Math.max(0.01, k / 0.35);
          t.mesh.scale.setScalar(s);
          t.mesh.material.opacity = s;
        }
        if (t.life <= 0) {
          removeMesh(scene, t.mesh, targets, i);
          state.combo = 0;
          updateHUD();
        }
      }

      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i];
        p.t -= dt;
        const k = 1 + (1 - p.t / 0.28) * 1.6;
        p.mesh.scale.setScalar(p.base * k);
        p.mesh.material.opacity = Math.max(0, p.t / 0.28);
        p.mesh.material.transparent = true;
        if (p.t <= 0) {
          scene.remove(p.mesh);
          if (p.mesh.geometry) p.mesh.geometry.dispose();
          if (p.mesh.material) p.mesh.material.dispose();
          pops.splice(i, 1);
        }
      }

      updateHUD();
    },

    action() {
      shoot();
    },
    dispose() {
      targets.length = 0;
      pops.length = 0;
    }
  };
}

/* =========================================================================
 * GAME 03 - BLOCK BREAKER
 * ====================================================================== */
function gameBlockBreaker() {
  const COLS = 9;
  const ROWS = 5;
  const ROW_COLORS = [0xe60024, 0xff6a4d, 0xffd23f, 0x7ce38b, 0x16cffb];

  let paddle = null;
  let ball = null;
  let blocks = [];
  let field = { w: 16, h: 14 };
  const vel = { x: 0, y: 0 };
  let launched = false;
  let paddleX = 0;

  function measure() {
    const dist = camera.position.z;
    const vH = 2 * Math.tan(((camera.fov * Math.PI) / 180) / 2) * dist;
    const vW = vH * camera.aspect;
    field.h = Math.min(vH * 0.76, 19);
    field.w = Math.min(vW * 0.56, 30);
  }

  function paddleWidth() {
    return Math.max(2.6, field.w * 0.17);
  }

  function clearBlocks() {
    while (blocks.length) removeMesh(scene, blocks[blocks.length - 1], blocks, blocks.length - 1);
    blocks = [];
  }

  /* Block positions are derived from the play field, so a window resize can
     re-layout the wall without touching the player's progress. */
  function blockX(col) {
    return -field.w / 2 + (col + 0.5) * ((field.w * 0.94) / COLS) + field.w * 0.03;
  }

  function blockY(row) {
    return field.h / 2 - 1.6 - row * (0.95 + 0.22);
  }

  function blockW() {
    return ((field.w * 0.94) / COLS) * 0.92;
  }

  function layoutBlocks() {
    blocks.forEach((b) => {
      b.position.x = blockX(b.userData.col);
      b.position.y = blockY(b.userData.row);
      if (b.userData.baseW) b.scale.x = blockW() / b.userData.baseW;
    });
  }

  function buildBlocks() {
    clearBlocks();
    const bh = 0.95;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const color = ROW_COLORS[r % ROW_COLORS.length];
        const b = neonBox(blockW(), bh, 0.7, color, 0xffffff);
        b.position.set(blockX(c), blockY(r), 0);
        b.userData.row = r;
        b.userData.col = c;
        b.userData.baseW = blockW();
        scene.add(b);
        blocks.push(b);
      }
    }
  }

  function resetBall() {
    launched = false;
    ball.position.set(paddleX, paddle.position.y + 0.72, 0);
    vel.x = 0;
    vel.y = 0;
  }

  function launch() {
    if (launched) return;
    launched = true;
    const angle = (Math.random() * 0.6 - 0.3) + Math.PI / 2;
    const speed = 15 + state.level * 1.2;
    vel.x = Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1);
    vel.y = Math.sin(angle) * speed;
    blip(720, 0.08, "square", 0.05);
  }

  function loseLife() {
    state.lives -= 1;
    blip(140, 0.25, "sawtooth", 0.07);
    updateHUD();
    if (state.lives <= 0) {
      state.lives = 0;
      endGame("GAME OVER", "Level " + state.level + " - " + blocks.length + " balok tersisa");
      return;
    }
    resetBall();
  }

  function step(dt) {
    ball.position.x += vel.x * dt;
    ball.position.y += vel.y * dt;

    const r = 0.38;
    const halfW = field.w / 2;
    const halfH = field.h / 2;

    if (ball.position.x < -halfW + r) {
      ball.position.x = -halfW + r;
      vel.x = Math.abs(vel.x);
      blip(420, 0.04, "square", 0.035);
    } else if (ball.position.x > halfW - r) {
      ball.position.x = halfW - r;
      vel.x = -Math.abs(vel.x);
      blip(420, 0.04, "square", 0.035);
    }

    if (ball.position.y > halfH - r) {
      ball.position.y = halfH - r;
      vel.y = -Math.abs(vel.y);
      blip(460, 0.04, "square", 0.035);
    }

    /* paddle */
    const pw = paddleWidth();
    if (
      vel.y < 0 &&
      ball.position.y - r <= paddle.position.y + 0.3 &&
      ball.position.y > paddle.position.y - 0.5 &&
      Math.abs(ball.position.x - paddle.position.x) < pw / 2 + r
    ) {
      ball.position.y = paddle.position.y + 0.3 + r;
      vel.y = Math.abs(vel.y);
      const offset = (ball.position.x - paddle.position.x) / (pw / 2);
      vel.x = clamp(vel.x + offset * 9, -26, 26);
      blip(640, 0.06, "square", 0.05);
    }

    /* blocks */
    for (let i = blocks.length - 1; i >= 0; i--) {
      const b = blocks[i];
      const bw = (field.w * 0.94) / COLS;
      const bh = 0.95;
      const dx = ball.position.x - b.position.x;
      const dy = ball.position.y - b.position.y;
      if (Math.abs(dx) < bw * 0.46 + r && Math.abs(dy) < bh * 0.5 + r) {
        if (Math.abs(dx) / (bw * 0.46 + r) > Math.abs(dy) / (bh * 0.5 + r)) vel.x = dx > 0 ? Math.abs(vel.x) : -Math.abs(vel.x);
        else vel.y = dy > 0 ? Math.abs(vel.y) : -Math.abs(vel.y);

        state.score += 10 * state.level;
        blip(320 + (4 - b.userData.row) * 90, 0.07, "triangle", 0.05);
        removeMesh(scene, b, blocks, i);

        if (blocks.length === 0) {
          state.score += 500 * state.level;
          state.level += 1;
          blip(980, 0.22, "sine", 0.07);
          buildBlocks();
          resetBall();
          updateHUD();
          return;
        }
        updateHUD();
        break;
      }
    }

    if (ball.position.y < -halfH - 1.4) loseLife();
  }

  return {
    id: "block-breaker",
    init() {
      scene = newScene(0x03081a, 30, 120);
      camera = new THREE.PerspectiveCamera(48, 1, 0.1, 240);
      camera.position.set(0, 0, 26);
      camera.lookAt(0, 0, 0);
      addLights(scene, 0.7, 0.9);

      const backdrop = new THREE.GridHelper(120, 60, 0x0e4a80, 0x072a4d);
      backdrop.rotation.x = Math.PI / 2;
      backdrop.position.z = -10;
      scene.add(backdrop);

      measure();
      buildBlocks();

      paddle = neonBox(paddleWidth(), 0.55, 0.8, 0x16cffb, 0xffffff);
      paddle.userData.baseW = paddleWidth();
      paddle.position.set(0, -field.h / 2 + 1.3, 0);
      scene.add(paddle);
      paddle.add(glowSprite(0x16cffb, 3.4));

      ball = wireWrap(
        new THREE.Mesh(
          new THREE.SphereGeometry(0.38, 20, 16),
          new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x9fe8ff, emissiveIntensity: 1.3, roughness: 0.2 })
        ),
        0xffffff
      );
      ball.add(glowSprite(0x7de6fd, 3));
      scene.add(ball);

      paddleX = 0;
      resetBall();
      updateHUD();
    },

    update(dt) {
      const dir = (keyDown("ArrowRight", "d") ? 1 : 0) - (keyDown("ArrowLeft", "a") ? 1 : 0);
      const limit = field.w / 2 - paddleWidth() / 2;
      paddleX = clamp(paddleX + dir * dt * 17, -limit, limit);
      paddle.position.x += (paddleX - paddle.position.x) * Math.min(1, dt * 18);

      if (!launched) {
        ball.position.x = paddle.position.x;
        ball.position.y = paddle.position.y + 0.72;
        return;
      }

      const steps = Math.max(1, Math.ceil(dt / 0.008));
      const sdt = dt / steps;
      for (let i = 0; i < steps; i++) {
        if (!state.running || !launched) break;
        step(sdt);
      }
      ball.rotation.x += vel.y * dt * 0.4;
      ball.rotation.y += vel.x * dt * 0.4;
    },

    action() {
      if (launched) {
        /* while live: a second action does nothing, keeps the run pure */
        return;
      }
      launch();
    },

    /* play field is derived from the camera frustum - keep it in sync */
    onResize() {
      if (!camera || !paddle) return;
      const prevW = field.w;
      measure();
      if (Math.abs(prevW - field.w) < 0.02) return;

      layoutBlocks();
      const limit = field.w / 2 - paddleWidth() / 2;
      paddleX = clamp(paddleX, -limit, limit);
      paddle.position.y = -field.h / 2 + 1.3;
      paddle.scale.x = paddleWidth() / paddle.userData.baseW;
      if (launched) ball.position.y = clamp(ball.position.y, -field.h / 2 + 1, field.h / 2 - 1);
    },

    dispose() {
      blocks = [];
      paddle = null;
      ball = null;
    }
  };
}

/* =========================================================================
 * GAME 04 - RING RUSH
 * ====================================================================== */
function gameRingRush() {
  const RING_R = 1.65;
  let player = null;
  const rings = [];
  const frames = [];
  let streaks = null;
  let spawnT = 1.2;
  let elapsed = 0;
  let speed = 20;
  const pos = { x: 0, y: 0 };

  function spawnRing() {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(RING_R, 0.17, 12, 44),
      new THREE.MeshStandardMaterial({
        color: 0x0a3a63,
        emissive: 0x16cffb,
        emissiveIntensity: 1.1,
        metalness: 0.5,
        roughness: 0.3
      })
    );
    mesh.position.set((Math.random() * 2 - 1) * 3.4, (Math.random() * 2 - 1) * 2.2, -74);
    mesh.userData.done = false;
    mesh.userData.scored = false;
    scene.add(mesh);
    rings.push(mesh);
  }

  function judge(ring) {
    ring.userData.done = true;
    const dx = player.position.x - ring.position.x;
    const dy = player.position.y - ring.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < RING_R - 0.55) {
      ring.userData.scored = true;
      state.score += 60;
      ring.material.emissive.setHex(0x7ce38b);
      blip(900, 0.1, "sine", 0.06);
    } else {
      state.lives -= 1;
      ring.material.emissive.setHex(0xe60024);
      blip(130, 0.22, "sawtooth", 0.07);
      if (state.lives <= 0) {
        state.lives = 0;
        updateHUD();
        endGame("SHIELDS DOWN", Math.floor(elapsed) + " detik terbang");
        return;
      }
    }
    updateHUD();
  }

  return {
    id: "ring-rush",
    init() {
      scene = newScene(0x030a20, 16, 96);
      camera = new THREE.PerspectiveCamera(64, 1, 0.1, 260);
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, -30);
      addLights(scene);

      for (let i = 0; i < 7; i++) {
        const frame = new THREE.Mesh(
          new THREE.TorusGeometry(9.5, 0.09, 8, 48),
          new THREE.MeshStandardMaterial({ color: 0x0b3a66, emissive: 0x16cffb, emissiveIntensity: 0.75 })
        );
        frame.position.z = -i * 22 - 6;
        scene.add(frame);
        frames.push(frame);
      }

      streaks = starfield(900, 90, 0xbfefff, 0.14);
      scene.add(streaks);

      player = wireWrap(
        new THREE.Mesh(
          new THREE.ConeGeometry(0.6, 1.7, 4),
          new THREE.MeshStandardMaterial({
            color: 0x0d4170,
            emissive: 0x16cffb,
            emissiveIntensity: 0.95,
            metalness: 0.6,
            roughness: 0.25
          })
        ),
        0xffffff
      );
      player.rotation.x = -Math.PI / 2;
      player.add(glowSprite(0x16cffb, 4));
      scene.add(player);
      updateHUD();
    },

    update(dt) {
      elapsed += dt;
      speed = Math.min(46, 20 + elapsed * 0.55);
      state.score += dt * 6;

      state.time = Math.max(0, state.time - dt);
      if (state.time <= 0) {
        updateHUD();
        endGame("TIME UP", Math.floor(elapsed) + " detik terbang - " + Math.floor(state.score) + " poin");
        return;
      }

      /* steering */
      const dx = (keyDown("ArrowRight", "d") ? 1 : 0) - (keyDown("ArrowLeft", "a") ? 1 : 0);
      const dy = (keyDown("ArrowUp", "w") ? 1 : 0) - (keyDown("ArrowDown", "s") ? 1 : 0);
      pos.x = clamp(pos.x + dx * dt * 9, -4, 4);
      pos.y = clamp(pos.y + dy * dt * 7, -2.6, 2.6);
      player.position.x += (pos.x - player.position.x) * Math.min(1, dt * 9);
      player.position.y += (pos.y - player.position.y) * Math.min(1, dt * 9);
      player.rotation.z = -dx * 0.6;
      player.rotation.y = Math.sin(elapsed * 3) * 0.12;

      /* tunnel frames */
      for (let i = frames.length - 1; i >= 0; i--) {
        const f = frames[i];
        f.position.z += speed * dt;
        f.rotation.z += dt * 0.12;
        if (f.position.z > 12) f.position.z -= frames.length * 22;
      }

      /* star streaks */
      const attr = streaks.geometry.attributes.position;
      for (let i = 0; i < attr.count; i++) {
        let z = attr.getZ(i) + speed * dt * 1.2;
        if (z > 14) z -= 110;
        attr.setZ(i, z);
      }
      attr.needsUpdate = true;

      /* rings */
      spawnT -= dt;
      if (spawnT <= 0) {
        spawnT = Math.max(0.55, 1.5 - elapsed * 0.02);
        spawnRing();
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.position.z += speed * dt;
        ring.rotation.z += dt * 0.6;

        if (!ring.userData.done && ring.position.z >= -0.9) judge(ring);

        if (ring.position.z > 11) removeMesh(scene, ring, rings, i);
      }

      updateHUD();
    },

    action() {},
    dispose() {
      rings.length = 0;
      frames.length = 0;
      streaks = null;
      player = null;
    }
  };
}

const GAME_FACTORIES = {
  "shadow-dodge": gameShadowDodge,
  "evoker-target": gameEvokerTarget,
  "block-breaker": gameBlockBreaker,
  "ring-rush": gameRingRush
};

/* =========================================================================
 * Engine: renderer, loop, resize
 * ====================================================================== */
function resize() {
  if (!renderer || !camera || !el.wrap) return;
  const w = el.wrap.clientWidth;
  const h = el.wrap.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  if (game && game.onResize) game.onResize();
}

function loop(t) {
  rafId = requestAnimationFrame(loop);
  if (!renderer || !scene || !camera) return;
  const dt = Math.min((t - lastT) / 1000 || 0, 0.05);
  lastT = t;
  frameCount += 1;

  if (state.running && game && game.update) {
    game.update(dt);
  } else if (!state.running && attract && attract.update) {
    attract.update(dt);
  }

  renderer.render(scene, camera);
}

function startLoop() {
  if (rafId) return;
  lastT = performance.now();
  rafId = requestAnimationFrame(loop);
}

function stopLoop() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
}

async function ensureEngine() {
  if (state.failed) return false;
  if (state.ready) return true;

  showOverlay("MEMUAT 3D ENGINE", "three.js dimuat dari berkas lokal");
  try {
    if (!THREE) THREE = await import("./three.module.min.js");
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({
        canvas: el.canvas,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x02091c, 1);
    }
    state.ready = true;
    resize();
    return true;
  } catch (err) {
    state.failed = true;
    console.warn("[MiniGames] three.js / WebGL unavailable:", err);
    showOverlay("WEBGL TIDAK TERSEDIA", "Peramban ini tidak mendukung WebGL 3D");
    setStatus("OFFLINE");
    return false;
  }
}

/* =========================================================================
 * Lifecycle: mount / unmount / select / start / stop / end
 * ====================================================================== */
function addListeners() {
  if (listenersBound) return;
  listenersBound = true;

  window.addEventListener("keydown", (e) => {
    if (!state.mounted) return;
    const k = normalizeKey(e);
    if (!k) return;
    state.keys[k] = true;
    if (state.running && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
      e.preventDefault();
    }
  });

  window.addEventListener("keyup", (e) => {
    const k = normalizeKey(e);
    if (k) state.keys[k] = false;
  });

  window.addEventListener("blur", () => {
    state.keys = Object.create(null);
  });

  if (el.canvas) {
    el.canvas.addEventListener("mousemove", (e) => {
      if (!state.mounted) return;
      const r = el.canvas.getBoundingClientRect();
      state.pointer.x = e.clientX - r.left;
      state.pointer.y = e.clientY - r.top;
      state.pointer.ndc.x = (state.pointer.x / Math.max(1, r.width)) * 2 - 1;
      state.pointer.ndc.y = -(state.pointer.y / Math.max(1, r.height)) * 2 + 1;
      if (el.crosshair) {
        el.crosshair.style.left = state.pointer.x + "px";
        el.crosshair.style.top = state.pointer.y + "px";
      }
    });

    el.canvas.addEventListener("click", () => {
      if (!state.mounted) return;
      if (state.running && game && game.action) game.action();
    });
  }

  if (el.overlay) {
    el.overlay.addEventListener("click", () => {
      if (!state.running) start();
    });
  }

  /* the PLAY/STOP button is wired by main.js (startMiniGame -> toggle), so
     this module only owns the canvas + overlay */

  window.addEventListener("resize", resize);

  if (window.ResizeObserver && el.wrap) {
    resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(el.wrap);
  }
}

function removeListeners() {
  state.keys = Object.create(null);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
}

async function mount() {
  if (state.mounted) return;
  state.mounted = true;
  addListeners();

  const ok = await ensureEngine();
  if (!ok || !state.mounted) return;

  if (!scene) buildAttract();
  startLoop();
  resize();

  if (!state.running && !game) {
    showOverlay("PRESS PLAY", "ENTER atau tombol PLAY untuk memulai");
    setStatus("READY");
    setPlayLabel("PLAY");
  }
}

function unmount() {
  if (!state.mounted) return;
  state.mounted = false;
  runToken += 1;

  if (state.running) state.running = false;
  if (game) {
    if (game.dispose) game.dispose();
    game = null;
  }
  stopLoop();
  removeListeners();
  showCrosshair(false);
}

function select(index) {
  const total = GAMES.length;
  state.index = ((index % total) + total) % total;
  runToken += 1;
  renderInfo();

  if (state.running) stop();
  else if (game) {
    if (game.dispose) game.dispose();
    game = null;
    if (state.ready && scene) buildAttract();
    showOverlay("PRESS PLAY", "ENTER atau tombol PLAY untuk memulai");
    setStatus("READY");
    setPlayLabel("PLAY");
    showCrosshair(false);
  } else if (state.ready && attract) {
    swapAttractCore();
  }
}

async function start() {
  if (!state.mounted) {
    mount().then(() => {
      if (state.mounted) start();
    });
    return false;
  }
  const token = ++runToken;
  const ok = await ensureEngine();
  if (!ok || token !== runToken) return false;

  /* tear down a previous run first */
  if (game) {
    if (game.dispose) game.dispose();
    game = null;
  }
  clearScene();

  const g = GAMES[state.index];
  state.running = true;
  state.score = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.level = 1;
  state.lives = g.lives || 0;
  state.time = g.time || 0;
  state.shots = 0;
  state.hits = 0;

  const factory = GAME_FACTORIES[g.id];
  if (!factory) {
    state.running = false;
    showOverlay("GAME TIDAK ADA", "Pilih game lain dari menu");
    return false;
  }

  game = factory();
  attract = null;
  game.init();
  resize();

  hideOverlay();
  showCrosshair(g.id === "evoker-target");
  setStatus("PLAYING");
  setPlayLabel("STOP");
  updateHUD();
  blip(660, 0.12, "square", 0.06);
  return true;
}

function stop() {
  if (!state.running && !game) return false;

  runToken += 1;
  state.running = false;
  if (game) {
    if (game.dispose) game.dispose();
    game = null;
  }
  attract = null;
  clearScene();

  if (state.ready) buildAttract();

  showCrosshair(false);
  setStatus("READY");
  setPlayLabel("PLAY");
  showOverlay("PRESS PLAY", "ENTER atau tombol PLAY untuk memulai");
  renderInfo();
  return true;
}

function endGame(title, sub) {
  if (!state.running) return;
  state.running = false;
  state.keys = Object.create(null);

  const g = GAMES[state.index];
  const score = Math.floor(state.score);
  const before = getBest(g.id);
  const after = saveBest(g.id, score);
  const isBest = after > before;

  if (el.score) el.score.textContent = pad6(score);
  if (el.best) el.best.textContent = pad6(after);

  showOverlay(title, sub + (isBest ? " - NEW BEST!" : ""));
  setStatus("GAME OVER");
  setPlayLabel("RESTART");
  showCrosshair(false);
  updateHUD();
  blip(220, 0.4, "sawtooth", 0.06);
}

function toggle() {
  if (state.running) {
    stop();
    return true;
  }
  start();
  return true;
}

/* =========================================================================
 * Keyboard bridge (called by main.js while the arcade screen is open)
 * ====================================================================== */
function handleKey(e) {
  if (!state.mounted) return false;
  const k = normalizeKey(e);

  if (state.running) {
    if (k === "escape" || k === "Escape" || k === "b" || k === "backspace") {
      e.preventDefault();
      stop();
      return true;
    }
    if (k === " " || k === "enter") {
      e.preventDefault();
      if (game && game.action) game.action();
      return true;
    }
    /* arrows / WASD are consumed by the key-state listener for movement */
    return true;
  }

  if (k === "ArrowUp" || k === "ArrowLeft" || k === "w" || k === "q") {
    e.preventDefault();
    stepSelection(-1);
    return true;
  }
  if (k === "ArrowDown" || k === "ArrowRight" || k === "s" || k === "e") {
    e.preventDefault();
    stepSelection(1);
    return true;
  }
  if (k === "Enter" || k === " ") {
    e.preventDefault();
    start();
    return true;
  }
  return false;
}

function stepSelection(delta) {
  const next = state.index + delta;
  if (typeof window.selectMiniGame === "function") window.selectMiniGame(next);
  else select(next);
}

/* =========================================================================
 * Public API + bootstrap
 * ====================================================================== */
window.MiniGames = {
  getGames() {
    return GAMES.map((g) => ({ id: g.id, code: g.code, name: g.name }));
  },
  select,
  start,
  stop,
  toggle,
  mount,
  unmount,
  handleKey,
  isRunning() {
    return state.running;
  },
  getState() {
    return {
      index: state.index,
      running: state.running,
      ready: state.ready,
      mounted: state.mounted,
      score: Math.floor(state.score),
      lives: state.lives,
      time: Math.round(state.time * 10) / 10,
      level: state.level,
      frames: frameCount,
      combo: state.combo,
      shots: state.shots,
      hits: state.hits,
      objects: scene ? scene.children.length : 0,
      drawCalls: renderer ? renderer.info.render.calls : -1,
      triangles: renderer ? renderer.info.render.triangles : -1
    };
  }
};

renderInfo();
showOverlay("3D ENGINE", "Memuat three.js\u2026");

/* main.js may already be waiting on us (deep link ?page=minigame) */
if (typeof window.syncMiniGameSelection === "function") {
  window.syncMiniGameSelection();
}
