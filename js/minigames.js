/**
 * ==========================================================================
 * Persona 3 Reload - Mini Games Arcade (three.js)
 * --------------------------------------------------------------------------
 * Five self-contained 3D mini games rendered with a locally vendored copy of
 * three.js (js/three.module.min.js - no CDN, no build step):
 *
 *   01 SHADOW DODGE   survive a neon corridor, dodge shadows, grab orbs
 *   02 EVOKER TARGET  aim & shoot floating targets, 30s combo run
 *   03 BLOCK BREAKER  paddle / ball / block wall, 3 lives, level ups
 *   04 RING RUSH      fly through rings before the shields drop
 *   05 MICRO TARTARUS roam a procedural floor & win Persona style battles
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
  },
  {
    id: "micro-tartarus",
    code: "05",
    name: "MICRO TARTARUS",
    desc: "Jelajahi lantai Tartarus mikro lalu kalahkan 5 bayangan dengan pertarungan giliran ala Persona.",
    controls: [
      { key: "W A S D", label: "Jelajahi lantai" },
      { key: "\u2190 \u2191 \u2193 \u2192", label: "Pilih menu battle" },
      { key: "ENTER", label: "Konfirmasi aksi" },
      { key: "ESC", label: "Batal / berhenti" }
    ],
    icon: '<path d="M20 56V24l12-16 12 16v32"/><path d="M13 56h38"/><path class="acc-s" d="M27 56V42h10v14"/><circle class="acc-f" cx="32" cy="30" r="3.6"/>',
    time: 0,
    lives: 3,
    shadows: 5,
    hudTime: true,
    hudTimeLabel: "SHADOWS",
    hudLivesLabel: "PARTY"
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
  shadows: 0,
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
      let value = pad2(state.time);
      if (g.hudTimeLabel === "LEVEL") value = pad2(state.level);
      else if (g.hudTimeLabel === "SHADOWS") value = pad2(state.shadows);
      setNode(el.time, "time", value);
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
  state.shadows = g.shadows || 0;
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
const ATTRACT_GEOS = ["octahedron", "torus", "box", "knot", "tower"];

function makeAttractGeo(kind, THREE_) {
  switch (kind) {
    case "torus":
      return new THREE_.TorusGeometry(1.7, 0.36, 14, 56);
    case "box":
      return new THREE_.BoxGeometry(2.4, 1.2, 1.2);
    case "knot":
      return new THREE_.TorusKnotGeometry(1.25, 0.3, 130, 18);
    case "tower":
      /* tapered hexagonal spire - the Tartarus silhouette */
      return new THREE_.CylinderGeometry(0.7, 1.8, 2.9, 6, 1);
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

/* =========================================================================
 * GAME 05 - MICRO TARTARUS
 * --------------------------------------------------------------------------
 * Two halves in one scene:
 *   - a procedural Tartarus floor the player walks around in, with the
 *     party trailing the leader in formation and 5 shadows roaming it
 *   - a separate battle stage (high up on Y) for a Persona style turn
 *     based fight: elemental weaknesses, 1 MORE, ALL-OUT ATTACK and a
 *     party THEURGY ultimate
 * ====================================================================== */
function gameMicroTartarus() {
  /* ---- world scale ----------------------------------------------------- */
  const GW = 19;                 /* tiles across  (odd)                     */
  const GH = 15;                 /* tiles down    (odd)                     */
  const TILE = 3;
  const WALL_H = 2.7;
  const ARENA_Y = 60;            /* battle stage floats above the floor     */
  const MOVE_R = 0.62;
  const HERO_SPEED = 5.7;
  const MAP_W = 133;
  const MAP_H = 105;
  const SHADOWS_TOTAL = 5;

  const SKILL_NAMES = { fire: "AGI", ice: "BUFU", elec: "ZIO", wind: "GARU" };

  const ELEM = {
    fire: { tag: "FIRE", color: 0xff7a3c, css: "#ff9a5c", freq: 640 },
    ice: { tag: "ICE", color: 0x7ce3ff, css: "#9fe9ff", freq: 940 },
    elec: { tag: "ELEC", color: 0xffe14d, css: "#ffe97a", freq: 1240 },
    wind: { tag: "WIND", color: 0x8fffb0, css: "#a8ffc4", freq: 1060 },
    phys: { tag: "PHYS", color: 0xffffff, css: "#ffffff", freq: 330 },
    heal: { tag: "HEAL", color: 0x7ce38b, css: "#9df0b4", freq: 780 },
    almighty: { tag: "ALMIGHTY", color: 0xff6bf5, css: "#ff9df7", freq: 520 }
  };

  /* the five shadows of this floor - weakest one sits nearest the stairs */
  const FOES = [
    { name: "STRAY SHADE", hp: 84, agi: 26, atk: 13, weak: "ice", elem: "phys", color: 0x9b6bff, reward: 450 },
    { name: "HOLLOW WISP", hp: 106, agi: 33, atk: 16, weak: "elec", elem: "wind", color: 0x39e2ff, reward: 620 },
    { name: "IRON MASK", hp: 134, agi: 22, atk: 19, weak: "fire", elem: "ice", color: 0xffc857, reward: 800 },
    { name: "CRIMSON FIEND", hp: 160, agi: 39, atk: 22, weak: "wind", elem: "fire", color: 0xff5f7a, reward: 1000 },
    { name: "UMBRA KING", hp: 214, agi: 46, atk: 27, weak: "elec", elem: "elec", color: 0xe60024, reward: 1500 }
  ];

  const HEROES = [
    {
      name: "MAKOTO", color: 0x16cffb, hp: 152, sp: 48, agi: 42, atk: 26, weak: null,
      skills: [
        { name: "AGI", el: "fire", cost: 8, power: 36 },
        { name: "BUFU", el: "ice", cost: 8, power: 36 },
        { name: "ZIO", el: "elec", cost: 8, power: 36 },
        { name: "GARU", el: "wind", cost: 8, power: 36 }
      ]
    },
    {
      name: "YUKARI", color: 0x7ce38b, hp: 118, sp: 46, agi: 35, atk: 21, weak: "ice",
      skills: [
        { name: "GARU", el: "wind", cost: 8, power: 31 },
        { name: "DIARAMA", el: "heal", cost: 12, power: 0.55 },
        { name: "PATRA", el: "heal", cost: 10, power: 0.34 }
      ]
    },
    {
      name: "AKIHIKO", color: 0xffb020, hp: 142, sp: 34, agi: 38, atk: 24, weak: "wind",
      skills: [
        { name: "ZIO", el: "elec", cost: 8, power: 34 },
        { name: "SCRATCH", el: "phys", cost: 6, power: 45 }
      ]
    }
  ];

  const HERO_HOME = [
    { x: -3.7, z: 3.6 },
    { x: -1.1, z: 4.4 },
    { x: 1.5, z: 3.6 }
  ];
  const FOE_HOME = { x: 0.7, z: -3.6 };

  /* ---- small helpers --------------------------------------------------- */
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ramp = (t, a, b) => {
    const x = clamp((t - a) / (b - a || 1), 0, 1);
    return x * x * (3 - 2 * x);
  };
  const worldX = (tx) => (tx - (GW - 1) / 2) * TILE;
  const worldZ = (tz) => (tz - (GH - 1) / 2) * TILE;

  function setTxt(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }

  function setBar(node, ratio, cls) {
    if (!node) return;
    const w = Math.round(clamp(ratio, 0, 1) * 100) + "%";
    if (node.style.width !== w) node.style.width = w;
    const next = cls + (ratio <= 0.3 ? " low" : ratio <= 0.6 ? " mid" : "");
    if (node.className !== next) node.className = next;
  }

  function makeFigure(color, scale) {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0b2444, emissive: color, emissiveIntensity: 0.45, metalness: 0.55, roughness: 0.35
    });
    const body = wireWrap(new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.72, 4, 12), bodyMat), 0xffffff);
    body.position.y = 0.86;
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x14406e, emissive: color, emissiveIntensity: 0.6, metalness: 0.4, roughness: 0.3
    });
    const head = wireWrap(new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12), headMat), 0xffffff);
    head.position.y = 1.56;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.52, 0.05, 8, 26),
      new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.95 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.06;
    const halo = glowSprite(color, 2.6);
    halo.position.y = 1.15;
    g.add(body, head, ring, halo);
    g.userData.ring = ring;
    g.userData.mats = [bodyMat, headMat];
    g.userData.base = [0.45, 0.6];
    g.scale.setScalar(scale || 1);
    return g;
  }

  function makeShadowMesh(def, scale) {
    const g = new THREE.Group();
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x150c2e, emissive: def.color, emissiveIntensity: 0.55, metalness: 0.6, roughness: 0.3
    });
    const core = wireWrap(new THREE.Mesh(new THREE.IcosahedronGeometry(0.74, 0), coreMat), def.color);
    core.position.y = 1.3;
    const ringMat = new THREE.MeshStandardMaterial({
      color: def.color, emissive: def.color, emissiveIntensity: 1.15, metalness: 0.5, roughness: 0.3
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.07, 8, 34), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.3;
    const crown = wireWrap(
      new THREE.Mesh(
        new THREE.ConeGeometry(0.34, 0.8, 5),
        new THREE.MeshStandardMaterial({
          color: 0x0d0620, emissive: def.color, emissiveIntensity: 0.7, metalness: 0.5, roughness: 0.35
        })
      ),
      def.color
    );
    crown.position.y = 2.0;
    const halo = glowSprite(def.color, 5);
    halo.position.y = 1.3;
    g.add(core, ring, crown, halo);
    g.userData.ring = ring;
    g.userData.mats = [coreMat, ringMat];
    g.userData.base = [0.55, 1.15];
    g.scale.setScalar(scale || 1);
    return g;
  }

  function setFlash(mesh, amount) {
    if (!mesh || !mesh.userData.mats) return;
    const mats = mesh.userData.mats;
    const base = mesh.userData.base;
    for (let i = 0; i < mats.length; i++) mats[i].emissiveIntensity = base[i] + amount * 5;
  }

  function faceGroup(g, target, dt) {
    if (!g) return;
    let d = target - g.rotation.y;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    g.rotation.y += d * Math.min(1, dt * 9);
  }

  /* ---- maze ------------------------------------------------------------ */
  let grid = null;
  let floorList = [];

  function genMaze() {
    grid = [];
    for (let z = 0; z < GH; z++) grid.push(new Array(GW).fill(1));
    grid[1][1] = 0;

    const stack = [[1, 1]];
    while (stack.length) {
      const cur = stack[stack.length - 1];
      const x = cur[0];
      const y = cur[1];
      const dirs = [[2, 0], [-2, 0], [0, 2], [0, -2]];
      for (let i = dirs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = dirs[i];
        dirs[i] = dirs[j];
        dirs[j] = t;
      }
      let moved = false;
      for (let d = 0; d < dirs.length; d++) {
        const nx = x + dirs[d][0];
        const ny = y + dirs[d][1];
        if (nx > 0 && ny > 0 && nx < GW - 1 && ny < GH - 1 && grid[ny][nx] === 1) {
          grid[y + dirs[d][1] / 2][x + dirs[d][0] / 2] = 0;
          grid[ny][nx] = 0;
          stack.push([nx, ny]);
          moved = true;
          break;
        }
      }
      if (!moved) stack.pop();
    }

    /* knock a few holes in so the floor is not a pure tree */
    for (let i = 0; i < 14; i++) {
      const x = 1 + Math.floor(Math.random() * (GW - 2));
      const y = 1 + Math.floor(Math.random() * (GH - 2));
      if (grid[y][x] !== 1) continue;
      const h = grid[y][x - 1] === 0 && grid[y][x + 1] === 0;
      const v = grid[y - 1][x] === 0 && grid[y + 1][x] === 0;
      if (h || v) grid[y][x] = 0;
    }

    floorList = [];
    for (let z = 0; z < GH; z++) {
      for (let x = 0; x < GW; x++) if (grid[z][x] === 0) floorList.push({ x: x, z: z });
    }
  }

  function bfsDist(sx, sy) {
    const dist = [];
    for (let z = 0; z < GH; z++) dist.push(new Array(GW).fill(-1));
    const queue = [[sx, sy]];
    dist[sy][sx] = 0;
    for (let i = 0; i < queue.length; i++) {
      const x = queue[i][0];
      const y = queue[i][1];
      const around = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (let a = 0; a < around.length; a++) {
        const nx = x + around[a][0];
        const ny = y + around[a][1];
        if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
        if (grid[ny][nx] !== 0 || dist[ny][nx] !== -1) continue;
        dist[ny][nx] = dist[y][x] + 1;
        queue.push([nx, ny]);
      }
    }
    return dist;
  }

  function pickShadowTiles() {
    const dist = bfsDist(1, 1);
    const cands = floorList
      .filter((t) => dist[t.z][t.x] > 0)
      .sort((a, b) => dist[b.z][b.x] - dist[a.z][a.x]);

    const picked = [];
    let sep = 7;
    while (picked.length < SHADOWS_TOTAL && sep > 1) {
      for (let i = 0; i < cands.length && picked.length < SHADOWS_TOTAL; i++) {
        const t = cands[i];
        let ok = true;
        for (let p = 0; p < picked.length; p++) {
          const d = Math.abs(picked[p].x - t.x) + Math.abs(picked[p].z - t.z);
          if (d < sep) { ok = false; break; }
        }
        if (ok) picked.push(t);
      }
      sep -= 2;
    }
    let idx = 0;
    while (picked.length < SHADOWS_TOTAL && idx < cands.length) {
      const t = cands[idx++];
      if (picked.indexOf(t) === -1) picked.push(t);
    }
    picked.sort((a, b) => dist[a.z][a.x] - dist[b.z][b.x]);
    return picked;
  }

  function tileAt(x, z) {
    const tx = Math.round(x / TILE + (GW - 1) / 2);
    const tz = Math.round(z / TILE + (GH - 1) / 2);
    if (tx < 0 || tz < 0 || tx >= GW || tz >= GH) return 1;
    return grid[tz][tx];
  }

  function blocked(x, z, r) {
    return (
      tileAt(x - r, z - r) === 1 ||
      tileAt(x + r, z - r) === 1 ||
      tileAt(x - r, z + r) === 1 ||
      tileAt(x + r, z + r) === 1
    );
  }

  /* Corner assist - turning into an opening while hugging the side wall would
   * wedge the party against the diagonal tile. Ease it back to the middle of
   * the corridor it is trying to enter so a single direction always gets thru. */
  function slip(dx, dz, amount) {
    if (dz) {
      const tx = Math.round(leader.x / TILE + (GW - 1) / 2);
      const tz = Math.round(leader.z / TILE + (GH - 1) / 2) + (dz > 0 ? 1 : -1);
      if (tx < 0 || tx >= GW || tz < 0 || tz >= GH || grid[tz][tx] !== 0) return;
      const d = worldX(tx) - leader.x;
      if (Math.abs(d) > 0.015) leader.x += Math.sign(d) * Math.min(Math.abs(d), amount);
    } else if (dx) {
      const tz = Math.round(leader.z / TILE + (GH - 1) / 2);
      const tx = Math.round(leader.x / TILE + (GW - 1) / 2) + (dx > 0 ? 1 : -1);
      if (tx < 0 || tx >= GW || tz < 0 || tz >= GH || grid[tz][tx] !== 0) return;
      const d = worldZ(tz) - leader.z;
      if (Math.abs(d) > 0.015) leader.z += Math.sign(d) * Math.min(Math.abs(d), amount);
    }
  }

  /* ---- scene pieces ----------------------------------------------------- */
  let dungeonGroup = null;
  let arenaGroup = null;
  let mapCanvas = null;
  let mapCtx = null;
  const shadeList = [];
  const leader = { x: 0, z: 0 };
  const trail = [];
  let arrow = null;
  let bursts = [];

  const ui = {};

  function makeTileGrid() {
    const pts = [];
    const hw = (GW * TILE) / 2;
    const hh = (GH * TILE) / 2;
    for (let x = 0; x <= GW; x++) {
      const px = -hw + x * TILE;
      pts.push(px, 0.02, -hh, px, 0.02, hh);
    }
    for (let z = 0; z <= GH; z++) {
      const pz = -hh + z * TILE;
      pts.push(-hw, 0.02, pz, hw, 0.02, pz);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.LineSegments(
      g,
      new THREE.LineBasicMaterial({ color: 0x0e63a0, transparent: true, opacity: 0.55 })
    );
  }

  function buildDungeon() {
    dungeonGroup = new THREE.Group();
    scene.add(dungeonGroup);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(GW * TILE, GH * TILE),
      new THREE.MeshStandardMaterial({
        color: 0x04101f, emissive: 0x062a4d, emissiveIntensity: 0.35, roughness: 0.88, metalness: 0.12
      })
    );
    floor.rotation.x = -Math.PI / 2;
    dungeonGroup.add(floor);
    dungeonGroup.add(makeTileGrid());

    const boxGeo = new THREE.BoxGeometry(TILE, WALL_H, TILE);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0a1c36, emissive: 0x0b3a66, emissiveIntensity: 0.5, roughness: 0.55, metalness: 0.35
    });
    const cells = [];
    for (let z = 0; z < GH; z++) {
      for (let x = 0; x < GW; x++) if (grid[z][x] === 1) cells.push({ x: x, z: z });
    }

    const inst = new THREE.InstancedMesh(boxGeo, wallMat, cells.length);
    const m4 = new THREE.Matrix4();
    const col = new THREE.Color();
    cells.forEach((c, i) => {
      m4.makeTranslation(worldX(c.x), WALL_H / 2, worldZ(c.z));
      inst.setMatrixAt(i, m4);
      col.setHex((c.x + c.z) % 2 === 0 ? 0x113358 : 0x0a2142);
      inst.setColorAt(i, col);
    });
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    inst.frustumCulled = false;
    dungeonGroup.add(inst);

    /* one merged wireframe holding the edges of every wall block */
    const edgeSrc = new THREE.EdgesGeometry(boxGeo);
    const ep = edgeSrc.getAttribute("position");
    const out = new Float32Array(ep.count * cells.length * 3);
    const v = new THREE.Vector3();
    let o = 0;
    cells.forEach((c) => {
      m4.makeTranslation(worldX(c.x), WALL_H / 2, worldZ(c.z));
      for (let i = 0; i < ep.count; i++) {
        v.fromBufferAttribute(ep, i).applyMatrix4(m4);
        out[o++] = v.x;
        out[o++] = v.y;
        out[o++] = v.z;
      }
    });
    edgeSrc.dispose();
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(out, 3));
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0x16cffb, transparent: true, opacity: 0.5 })
    );
    lines.frustumCulled = false;
    dungeonGroup.add(lines);

    const stars = starfield(360, 130, 0x8fd8ff, 0.13);
    stars.position.y = 14;
    dungeonGroup.add(stars);

    heroes.forEach((h, i) => {
      h.dgn = makeFigure(h.color, i === 0 ? 1 : 0.92);
      dungeonGroup.add(h.dgn);
    });

    shadeList.length = 0;
    const spots = pickShadowTiles();
    spots.forEach((t, i) => {
      const def = FOES[i] || FOES[FOES.length - 1];
      const mesh = makeShadowMesh(def, 0.78);
      const s = {
        index: i,
        def: def,
        x: worldX(t.x),
        z: worldZ(t.z),
        tx: t.x,
        tz: t.z,
        phase: Math.random() * 6.28,
        retarget: rnd(1.5, 4),
        dead: false,
        mesh: mesh
      };
      mesh.position.set(s.x, 0, s.z);
      dungeonGroup.add(mesh);
      shadeList.push(s);
    });
  }

  function buildArena() {
    arenaGroup = new THREE.Group();
    arenaGroup.position.y = ARENA_Y;
    arenaGroup.visible = false;
    scene.add(arenaGroup);

    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(9.6, 9.6, 0.5, 46),
      new THREE.MeshStandardMaterial({
        color: 0x05182f, emissive: 0x0a3b66, emissiveIntensity: 0.5, roughness: 0.5, metalness: 0.45
      })
    );
    disc.position.y = -0.25;
    arenaGroup.add(disc);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(9.6, 0.13, 10, 64),
      new THREE.MeshStandardMaterial({ color: 0x16cffb, emissive: 0x16cffb, emissiveIntensity: 1.1 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.04;
    arenaGroup.add(rim);

    const inner = new THREE.Mesh(
      new THREE.TorusGeometry(5.4, 0.07, 8, 48),
      new THREE.MeshStandardMaterial({ color: 0xe60024, emissive: 0xe60024, emissiveIntensity: 0.9 })
    );
    inner.rotation.x = Math.PI / 2;
    inner.position.y = 0.04;
    arenaGroup.add(inner);

    const gridFloor = new THREE.GridHelper(19, 19, 0x16cffb, 0x0a3160);
    gridFloor.position.y = 0.03;
    gridFloor.material.transparent = true;
    gridFloor.material.opacity = 0.4;
    arenaGroup.add(gridFloor);

    const stars = starfield(460, 110, 0xbfefff, 0.14);
    stars.position.y = 6;
    arenaGroup.add(stars);

    const key = new THREE.PointLight(0x16cffb, 70, 46);
    key.position.set(-5, 7, 6);
    arenaGroup.add(key);
    const fill = new THREE.PointLight(0xe60024, 50, 46);
    fill.position.set(6, 5, -5);
    arenaGroup.add(fill);

    heroes.forEach((h, i) => {
      h.mesh = makeFigure(h.color, 1);
      h.home = HERO_HOME[i];
      h.mesh.position.set(h.home.x, 0, h.home.z);
      h.mesh.rotation.y = Math.PI;
      arenaGroup.add(h.mesh);
    });

    arrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.56, 4),
      new THREE.MeshStandardMaterial({ color: 0x16cffb, emissive: 0x16cffb, emissiveIntensity: 1.3 })
    );
    arrow.rotation.x = Math.PI;
    arrow.visible = false;
    arenaGroup.add(arrow);
  }

  /* ---- party (persists between battles) ---------------------------------- */
  const heroes = HEROES.map((d, i) => ({
    def: d,
    index: i,
    isFoe: false,
    name: d.name,
    color: d.color,
    weak: d.weak,
    skills: d.skills,
    maxHp: d.hp,
    hp: d.hp,
    maxSp: d.sp,
    sp: d.sp,
    agi: d.agi,
    atk: d.atk,
    alive: true,
    down: false,
    guarding: false,
    hitT: 0,
    mesh: null,
    dgn: null,
    home: HERO_HOME[i]
  }));

  let foe = null;
  let activeShade = null;

  /* ---- battle state ------------------------------------------------------ */
  let phase = "dungeon";   /* dungeon|intro|menu|act|gap|victory|defeat */
  let phaseT = 0;
  let gapT = 0;
  let pendingExtra = false;
  let queue = [];
  let current = null;
  let anim = null;
  let entries = [];
  let cursor = 0;
  let subMenu = null;
  let round = 0;
  let gauge = 65;
  let shake = 0;
  let bannerT = 0;
  let toastT = 0;
  let uiDirty = true;
  const logLines = [];
  let camMode = "dungeon";
  let camPos = null;
  let camLook = null;
  let elapsed = 0;

  /* ---- DOM ---------------------------------------------------------------- */
  function makeDiv(cls, html) {
    const d = document.createElement("div");
    if (cls) d.className = cls;
    if (html) d.innerHTML = html || "";
    return d;
  }

  function buildUI() {
    if (!el.wrap) return;

    ui.root = makeDiv(
      "p3r-battle",
      '<div class="p3r-battle-round"></div>' +
        '<div class="p3r-battle-log"></div>' +
        '<div class="p3r-battle-foe">' +
          '<div class="p3r-battle-foe-head"><span class="p3r-battle-foe-name"></span><span class="p3r-battle-foe-hpnum"></span></div>' +
          '<div class="p3r-battle-bar p3r-battle-foe-bar"><i></i></div>' +
          '<div class="p3r-battle-tags"><span class="p3r-battle-weak"></span><span class="p3r-battle-down">DOWN</span></div>' +
        "</div>" +
        '<div class="p3r-battle-banner"></div>' +
        '<div class="p3r-battle-bottom">' +
          '<div class="p3r-battle-party"></div>' +
          '<div class="p3r-battle-menu">' +
            '<div class="p3r-battle-menu-head"><span>COMMAND</span><b class="p3r-battle-actor"></b></div>' +
            '<ul class="p3r-battle-menu-list"></ul>' +
            '<div class="p3r-battle-menu-hint"></div>' +
          "</div>" +
        "</div>"
    );
    el.wrap.appendChild(ui.root);

    ui.round = ui.root.querySelector(".p3r-battle-round");
    ui.log = ui.root.querySelector(".p3r-battle-log");
    ui.foeName = ui.root.querySelector(".p3r-battle-foe-name");
    ui.foeHpNum = ui.root.querySelector(".p3r-battle-foe-hpnum");
    ui.foeBar = ui.root.querySelector(".p3r-battle-foe-bar i");
    ui.foeWeak = ui.root.querySelector(".p3r-battle-weak");
    ui.foeDown = ui.root.querySelector(".p3r-battle-down");
    ui.banner = ui.root.querySelector(".p3r-battle-banner");
    ui.party = ui.root.querySelector(".p3r-battle-party");
    ui.menu = ui.root.querySelector(".p3r-battle-menu");
    ui.menuList = ui.root.querySelector(".p3r-battle-menu-list");
    ui.menuActor = ui.root.querySelector(".p3r-battle-actor");
    ui.menuHint = ui.root.querySelector(".p3r-battle-menu-hint");

    ui.cards = heroes.map((h) => {
      const card = makeDiv(
        "p3r-battle-card",
        '<span class="p3r-battle-card-name">' + h.name + "</span>" +
          '<span class="p3r-battle-card-hp"></span>' +
          '<div class="p3r-battle-bar"><i></i></div>' +
          '<span class="p3r-battle-card-sp"></span>'
      );
      ui.party.appendChild(card);
      return {
        root: card,
        hp: card.querySelector(".p3r-battle-card-hp"),
        bar: card.querySelector(".p3r-battle-bar i"),
        sp: card.querySelector(".p3r-battle-card-sp")
      };
    });

    ui.map = makeDiv("p3r-mg-map");
    ui.map.innerHTML =
      '<canvas width="' + MAP_W + '" height="' + MAP_H + '"></canvas><span>TARTARUS &middot; B1F</span>';
    el.wrap.appendChild(ui.map);
    mapCanvas = ui.map.querySelector("canvas");
    mapCtx = mapCanvas ? mapCanvas.getContext("2d") : null;

    ui.toast = makeDiv("p3r-mg-toast");
    el.wrap.appendChild(ui.toast);

    ui.flash = makeDiv("p3r-mg-flash");
    el.wrap.appendChild(ui.flash);

    ui.gauge = makeDiv(
      "p3r-mg-gauge",
      '<span>THEURGY</span><div class="p3r-mg-gauge-bar"><i></i></div><strong>65</strong>'
    );
    const hud = document.getElementById("minigame-hud");
    if (hud) hud.appendChild(ui.gauge);
    ui.gaugeBar = ui.gauge.querySelector("i");
    ui.gaugeNum = ui.gauge.querySelector("strong");
  }

  function killUI() {
    if (el.wrap) el.wrap.classList.remove("battle-on");
    ["root", "map", "toast", "flash", "gauge"].forEach((k) => {
      const n = ui[k];
      if (n && n.parentNode) n.parentNode.removeChild(n);
      ui[k] = null;
    });
    ui.cards = null;
    ui.round = null;
    ui.log = null;
    ui.foeName = null;
    ui.foeHpNum = null;
    ui.foeBar = null;
    ui.foeWeak = null;
    ui.foeDown = null;
    ui.banner = null;
    ui.party = null;
    ui.menu = null;
    ui.menuList = null;
    ui.menuActor = null;
    ui.menuHint = null;
    ui.gaugeBar = null;
    ui.gaugeNum = null;
    mapCtx = null;
    mapCanvas = null;
  }

  function log(text) {
    logLines.push(text);
    if (logLines.length > 3) logLines.shift();
    if (ui.log) ui.log.innerHTML = logLines.map((t) => "<div>" + t + "</div>").join("");
  }

  function showBanner(text, cls) {
    if (!ui.banner) return;
    ui.banner.textContent = text;
    ui.banner.className = "p3r-battle-banner " + (cls || "");
    void ui.banner.offsetWidth;
    ui.banner.classList.add("show");
    bannerT = 1.15;
  }

  function showToast(text, dur) {
    if (!ui.toast) return;
    ui.toast.textContent = text;
    ui.toast.classList.add("show");
    toastT = dur || 2.6;
  }

  function flash() {
    if (!ui.flash) return;
    ui.flash.classList.remove("on");
    void ui.flash.offsetWidth;
    ui.flash.classList.add("on");
  }

  function spawnFloat(text, cssColor, mesh) {
    if (!ui.root || !mesh || !camera || !el.wrap) return;
    const w = new THREE.Vector3();
    mesh.getWorldPosition(w);
    w.y += 2.1;
    const rect = el.wrap.getBoundingClientRect();
    const p = w.project(camera);
    const f = document.createElement("div");
    f.className = "p3r-float";
    f.textContent = text;
    f.style.color = cssColor || "#ffffff";
    f.style.left = (p.x * 0.5 + 0.5) * rect.width + "px";
    f.style.top = (-p.y * 0.5 + 0.5) * rect.height + "px";
    ui.root.appendChild(f);
    window.setTimeout(() => {
      if (f.parentNode) f.parentNode.removeChild(f);
    }, 1000);
  }

  function spawnBurst(pos, color, big) {
    if (!arenaGroup) return;
    const s = glowSprite(color, big ? 11 : 5.5);
    s.position.copy(pos);
    arenaGroup.add(s);
    bursts.push({ obj: s, t: 0, dur: big ? 0.75 : 0.45, ring: false });

    const r = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.07, 8, 34),
      new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    r.position.copy(pos);
    r.rotation.x = Math.PI / 2;
    arenaGroup.add(r);
    bursts.push({ obj: r, t: 0, dur: big ? 0.8 : 0.55, ring: true });
  }

  function updateBursts(dt) {
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.t += dt;
      const k = clamp(b.t / b.dur, 0, 1);
      if (b.ring) {
        b.obj.scale.setScalar(1 + k * (b.dur > 0.7 ? 9 : 4.5));
        b.obj.material.opacity = (1 - k) * 0.95;
      } else {
        b.obj.scale.setScalar((b.dur > 0.7 ? 11 : 5.5) * (0.5 + k * 1.5));
        b.obj.material.opacity = 1 - k;
      }
      if (k >= 1) {
        if (b.obj.parent) b.obj.parent.remove(b.obj);
        if (b.obj.material) b.obj.material.dispose();
        bursts.splice(i, 1);
      }
    }
  }

  /* ---- UI rendering ------------------------------------------------------ */
  function renderCards() {
    if (!ui.cards) return;
    heroes.forEach((h, i) => {
      const c = ui.cards[i];
      if (!c) return;
      setTxt(c.hp, h.hp + "/" + h.maxHp);
      setBar(c.bar, h.hp / h.maxHp, "p3r-battle-bar-fill");
      setTxt(c.sp, "SP " + h.sp);
      const cls =
        "p3r-battle-card" +
        (!h.alive || h.down ? " down" : "") +
        (phase !== "dungeon" && current === h ? " active" : "");
      if (c.root.className !== cls) c.root.className = cls;
    });
  }

  function renderFoe() {
    if (!ui.root || !ui.foeName) return;
    const on = !!foe;
    if (on !== ui.root.classList.contains("has-foe")) ui.root.classList.toggle("has-foe", on);
    if (!on) return;
    setTxt(ui.foeName, foe.name);
    setTxt(ui.foeHpNum, foe.hp + "/" + foe.maxHp);
    setBar(ui.foeBar, foe.hp / foe.maxHp, "p3r-battle-bar-fill");
    setTxt(ui.foeWeak, "WEAK \u00b7 " + (ELEM[foe.weak] ? ELEM[foe.weak].tag : "-"));
    ui.foeDown.classList.toggle("on", foe.down);
  }

  function renderGauge() {
    if (!ui.gaugeBar) return;
    const v = Math.round(gauge);
    setBar(ui.gaugeBar, v / 100, "p3r-mg-gauge-fill");
    setTxt(ui.gaugeNum, String(v));
    ui.gauge.classList.toggle("full", v >= 100);
  }

  function renderMenu() {
    if (!ui.menuList) return;
    ui.menuList.innerHTML = entries
      .map((e, i) => {
        const cls = ["p3r-battle-opt"];
        if (i === cursor) cls.push("sel");
        if (!e.ok) cls.push("off");
        if (e.weak) cls.push("weak");
        const right =
          (e.weak ? '<i class="p3r-battle-wk">LEMAH</i>' : "") +
          (e.hint ? "<em>" + e.hint + "</em>" : "");
        return '<li class="' + cls.join(" ") + '"><span>' + e.label + "</span>" + right + "</li>";
      })
      .join("");
    setTxt(ui.menuActor, current && !current.isFoe ? current.name : "SHADOW");
    const e = entries[cursor];
    setTxt(ui.menuHint, e && e.desc ? e.desc : "");
  }

  function renderFrame() {
    uiDirty = false;
    if (!ui.root) return;
    ui.menu.classList.toggle("on", phase === "menu");
    renderCards();
    renderFoe();
    renderGauge();
  }

  /* ---- minimap ------------------------------------------------------------ */
  function drawMinimap() {
    if (!mapCtx || !grid) return;
    const cw = MAP_W / GW;
    const ch = MAP_H / GH;
    mapCtx.clearRect(0, 0, MAP_W, MAP_H);
    mapCtx.fillStyle = "rgba(2, 11, 24, 0.86)";
    mapCtx.fillRect(0, 0, MAP_W, MAP_H);
    mapCtx.fillStyle = "rgba(22, 207, 251, 0.26)";
    for (let z = 0; z < GH; z++) {
      for (let x = 0; x < GW; x++) {
        if (grid[z][x] === 1) mapCtx.fillRect(x * cw, z * ch, cw + 0.5, ch + 0.5);
      }
    }
    for (let i = 0; i < shadeList.length; i++) {
      const s = shadeList[i];
      if (s.dead) continue;
      mapCtx.fillStyle = "#e60024";
      mapCtx.beginPath();
      mapCtx.arc(
        (s.x / TILE + (GW - 1) / 2 + 0.5) * cw,
        (s.z / TILE + (GH - 1) / 2 + 0.5) * ch,
        3,
        0,
        6.283
      );
      mapCtx.fill();
    }
    for (let i = heroes.length - 1; i >= 0; i--) {
      const m = heroes[i].dgn;
      if (!m) continue;
      const px = (m.position.x / TILE + (GW - 1) / 2 + 0.5) * cw;
      const pz = (m.position.z / TILE + (GH - 1) / 2 + 0.5) * ch;
      mapCtx.fillStyle = i === 0 ? "#7de6fd" : "#" + heroes[i].color.toString(16).padStart(6, "0");
      mapCtx.beginPath();
      mapCtx.arc(px, pz, i === 0 ? 3.4 : 2.2, 0, 6.283);
      mapCtx.fill();
    }
  }

  /* ---- roaming the floor -------------------------------------------------- */
  function trailAt(dist) {
    let acc = 0;
    for (let i = trail.length - 1; i > 0; i--) {
      const a = trail[i];
      const b = trail[i - 1];
      const d = Math.hypot(a.x - b.x, a.z - b.z);
      if (acc + d >= dist && d > 0.0001) {
        const k = (dist - acc) / d;
        return { x: a.x + (b.x - a.x) * k, z: a.z + (b.z - a.z) * k };
      }
      acc += d;
    }
    return trail.length ? trail[0] : { x: leader.x, z: leader.z };
  }

  function pickShadeTarget(s) {
    let best = null;
    const stx = Math.round(s.x / TILE + (GW - 1) / 2);
    const stz = Math.round(s.z / TILE + (GH - 1) / 2);
    for (let i = 0; i < 16; i++) {
      const t = floorList[Math.floor(Math.random() * floorList.length)];
      if (!t) continue;
      const d = Math.abs(t.x - stx) + Math.abs(t.z - stz);
      if (d >= 3 && d <= 8) {
        best = t;
        break;
      }
      if (!best) best = t;
    }
    if (best) {
      s.tx = best.x;
      s.tz = best.z;
    }
    s.retarget = rnd(3.5, 7);
  }

  function updateDungeon(dt) {
    const dx = (keyDown("ArrowRight", "d") ? 1 : 0) - (keyDown("ArrowLeft", "a") ? 1 : 0);
    const dz = (keyDown("ArrowDown", "s") ? 1 : 0) - (keyDown("ArrowUp", "w") ? 1 : 0);
    if (dx || dz) {
      const len = Math.hypot(dx, dz);
      const vx = (dx / len) * HERO_SPEED * dt;
      const vz = (dz / len) * HERO_SPEED * dt;
      const ox = leader.x;
      const oz = leader.z;
      if (!blocked(leader.x + vx, leader.z, MOVE_R)) leader.x += vx;
      if (!blocked(leader.x, leader.z + vz, MOVE_R)) leader.z += vz;
      if (dz && !dx && leader.z === oz) slip(dx, dz, HERO_SPEED * 0.85 * dt);
      else if (dx && !dz && leader.x === ox) slip(dx, dz, HERO_SPEED * 0.85 * dt);
      faceGroup(heroes[0].dgn, Math.atan2(vx, vz), dt);
    }

    const last = trail[trail.length - 1];
    if (!last || Math.hypot(last.x - leader.x, last.z - leader.z) > 0.13) {
      trail.push({ x: leader.x, z: leader.z });
      if (trail.length > 150) trail.shift();
    }

    heroes[0].dgn.position.x = leader.x;
    heroes[0].dgn.position.z = leader.z;
    for (let i = 1; i < heroes.length; i++) {
      const m = heroes[i].dgn;
      if (!m) continue;
      const p = trailAt(i * 1.9);
      const ox = m.position.x;
      const oz = m.position.z;
      m.position.x = p.x;
      m.position.z = p.z;
      if (Math.hypot(p.x - ox, p.z - oz) > 0.005) faceGroup(m, Math.atan2(p.x - ox, p.z - oz), dt);
      if (m.userData.ring) m.userData.ring.rotation.z += dt * 1.4;
    }

    let triggered = null;
    for (let i = 0; i < shadeList.length; i++) {
      const s = shadeList[i];
      if (s.dead) continue;
      s.retarget -= dt;
      s.mesh.rotation.y += dt * 0.9;
      if (s.mesh.userData.ring) s.mesh.userData.ring.rotation.z += dt * 2;
      s.mesh.position.y = Math.sin(elapsed * 2 + s.phase) * 0.18;

      const tx = worldX(s.tx);
      const tz = worldZ(s.tz);
      const ddx = tx - s.x;
      const ddz = tz - s.z;
      const dd = Math.hypot(ddx, ddz);
      if (dd < 0.16 || s.retarget <= 0) {
        pickShadeTarget(s);
      } else {
        const step = 1.9 * dt;
        const nx = s.x + (ddx / dd) * step;
        const nz = s.z + (ddz / dd) * step;
        if (!blocked(nx, nz, 0.5)) {
          s.x = nx;
          s.z = nz;
        } else pickShadeTarget(s);
      }
      s.mesh.position.x = s.x;
      s.mesh.position.z = s.z;

      const near = Math.hypot(s.x - leader.x, s.z - leader.z);
      setFlash(s.mesh, near < 5.5 ? (1 - near / 5.5) * 0.5 : 0);
      if (near < 2.1) {
        triggered = s;
        break;
      }
    }

    drawMinimap();
    if (triggered) beginBattle(triggered);
  }

  function nearestShadeTiles() {
    let best = null;
    let bd = Infinity;
    for (let i = 0; i < shadeList.length; i++) {
      const s = shadeList[i];
      if (s.dead) continue;
      const d = Math.hypot(s.x - leader.x, s.z - leader.z) / TILE;
      if (d < bd) {
        bd = d;
        best = s;
      }
    }
    return best ? Math.round(bd) : -1;
  }

  /* ---- battle: setup ------------------------------------------------------- */
  function beginBattle(s) {
    activeShade = s;
    const def = s.def;
    foe = {
      isFoe: true,
      name: def.name,
      weak: def.weak,
      elem: def.elem,
      color: def.color,
      reward: def.reward,
      maxHp: def.hp,
      hp: def.hp,
      agi: def.agi,
      atk: def.atk,
      alive: true,
      down: false,
      guarding: false,
      hitT: 0,
      turns: 0,
      home: FOE_HOME,
      mesh: makeShadowMesh(def, 1.35)
    };
    foe.mesh.position.set(FOE_HOME.x, 0, FOE_HOME.z);
    foe.mesh.rotation.y = Math.PI;
    arenaGroup.add(foe.mesh);

    heroes.forEach((h) => {
      h.down = false;
      h.guarding = false;
      h.hitT = 0;
      h.mesh.position.set(h.home.x, 0, h.home.z);
      h.mesh.rotation.y = Math.PI;
      setFlash(h.mesh, 0);
    });

    dungeonGroup.visible = false;
    arenaGroup.visible = true;
    camMode = "battle";
    phase = "intro";
    phaseT = 0;
    round = 0;
    queue = [];
    current = null;
    anim = null;
    subMenu = null;
    cursor = 0;
    pendingExtra = false;
    logLines.length = 0;
    if (ui.log) ui.log.innerHTML = "";
    if (ui.round) ui.round.classList.remove("show");

    if (ui.root) ui.root.classList.add("on");
    if (ui.map) ui.map.classList.remove("on");
    if (el.wrap) el.wrap.classList.add("battle-on");
    showBanner("SHADOW APPEARS!", "warn");
    log("Bayangan menghadang party!");
    uiDirty = true;
    shake = 0.5;
    blip(170, 0.4, "sawtooth", 0.07);
    window.setTimeout(() => blip(240, 0.3, "square", 0.05), 140);
    updateHUD();
  }

  function hideBattleUI() {
    if (ui.root) ui.root.classList.remove("on");
    if (ui.map) ui.map.classList.remove("on");
    if (el.wrap) el.wrap.classList.remove("battle-on");
    if (ui.banner) ui.banner.classList.remove("show");
    if (ui.round) ui.round.classList.remove("show");
    bannerT = 0;
  }

  function returnToDungeon() {
    if (foe && foe.mesh) {
      arenaGroup.remove(foe.mesh);
      killObject(foe.mesh);
      foe = null;
    }
    activeShade = null;
    phase = "dungeon";
    current = null;
    anim = null;
    queue = [];
    if (arrow) arrow.visible = false;
    arenaGroup.visible = false;
    dungeonGroup.visible = true;
    camMode = "dungeon";
    hideBattleUI();
    if (ui.map) ui.map.classList.add("on");
    showToast("SISA BAYANGAN: " + state.shadows, 2.4);
    uiDirty = true;
    updateHUD();
  }

  /* ---- battle: turn order --------------------------------------------------- */
  function advance() {
    let guard = 0;
    for (;;) {
      if (++guard > 60) return;
      if (foe && !foe.alive) { doVictory(); return; }
      if (!heroes.some((h) => h.alive)) { doDefeat(); return; }
      if (queue.length === 0) { beginRound(); return; }
      const a = queue.shift();
      if (!a || !a.alive) continue;
      if (a.down) {
        a.down = false;
        log(a.name + " bangkit kembali.");
        uiDirty = true;
        continue;
      }
      current = a;
      if (a.isFoe) foeTurn();
      else openMenu();
      return;
    }
  }

  function beginRound() {
    round += 1;
    const actors = [];
    if (foe && foe.alive) actors.push(foe);
    heroes.forEach((h) => { if (h.alive) actors.push(h); });
    actors.sort((a, b) => b.agi - a.agi);
    queue = actors;
    if (ui.round) {
      ui.round.textContent = "ROUND " + round;
      ui.round.classList.remove("show");
      void ui.round.offsetWidth;
      ui.round.classList.add("show");
    }
    advance();
  }

  function openMenu() {
    if (current.guarding) current.guarding = false;
    phase = "menu";
    subMenu = null;
    cursor = 0;
    entries = rootEntries();
    renderMenu();
    uiDirty = true;
    blip(720, 0.05, "square", 0.035);
  }

  function rootEntries() {
    const h = current;
    return [
      {
        label: "ATTACK",
        ok: true,
        desc: "Serangan fisik biasa",
        run: () => heroStrike({ kind: "strike", el: "phys", name: "ATTACK", power: h.atk })
      },
      {
        label: "SKILL",
        ok: true,
        hint: h.skills.length + " buah",
        desc: "Magic &amp; elemen - cek kelemahan",
        sub: "skill"
      },
      {
        label: "ALL-OUT",
        ok: !!(foe && foe.down),
        hint: foe && foe.down ? "READY" : "butuh DOWN",
        desc: "Serangan tim penuh saat bayangan DOWN",
        run: () => heroAllOut()
      },
      {
        label: "THEURGY",
        ok: gauge >= 100,
        hint: Math.round(gauge) + "%",
        desc: "Ultimate party - damage ALMIGHTY",
        run: () => heroTheurgy()
      },
      {
        label: "GUARD",
        ok: true,
        desc: "Turunkan damage sampai giliran berikutnya",
        run: () => heroGuard()
      }
    ];
  }

  function skillEntries() {
    const h = current;
    const list = h.skills.map((sk) => ({
      label: sk.name,
      hint: sk.cost + " SP",
      ok: h.sp >= sk.cost,
      weak: !!(foe && sk.el === foe.weak),
      desc: ELEM[sk.el].tag + (foe && sk.el === foe.weak ? " - LEMAH!" : ""),
      run: () => heroSkill(sk)
    }));
    list.push({
      label: "KEMBALI",
      ok: true,
      hint: "ESC",
      desc: "Kembali ke menu utama",
      back: true
    });
    return list;
  }

  function moveCursor(delta) {
    if (phase !== "menu" || entries.length === 0) return;
    cursor = (cursor + delta + entries.length) % entries.length;
    renderMenu();
    blip(560, 0.035, "square", 0.03);
  }

  function closeSub() {
    subMenu = null;
    cursor = 0;
    entries = rootEntries();
    renderMenu();
    blip(420, 0.05, "square", 0.035);
  }

  function confirmMenu() {
    if (phase !== "menu") return;
    const e = entries[cursor];
    if (!e) return;
    if (!e.ok) {
      blip(150, 0.13, "square", 0.05);
      if (ui.menu) {
        ui.menu.classList.remove("shake");
        void ui.menu.offsetWidth;
        ui.menu.classList.add("shake");
      }
      return;
    }
    if (e.back) { closeSub(); return; }
    if (e.sub === "skill") {
      subMenu = "skill";
      cursor = 0;
      entries = skillEntries();
      renderMenu();
      blip(760, 0.06, "square", 0.04);
      return;
    }
    if (typeof e.run === "function") {
      subMenu = null;
      blip(880, 0.07, "square", 0.045);
      e.run();
    }
  }

  /* ---- battle: action plumbing ---------------------------------------------- */
  function lungeDest(from, to, reach) {
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const d = Math.hypot(dx, dz) || 1;
    const k = Math.max(0, d - reach) / d;
    return { x: from.x + dx * k, z: from.z + dz * k };
  }

  function beginAction(cfg) {
    cfg.dur = cfg.dur || 1.05;
    cfg.lunges = cfg.lunges || [];
    anim = { t: 0, hit: false, cfg: cfg };
    phase = "act";
    uiDirty = true;
  }

  function afterAction(delay, extra) {
    pendingExtra = !!extra;
    gapT = delay;
    phase = "gap";
    uiDirty = true;
  }

  function stepAnim(dt) {
    anim.t += dt;
    const a = anim;
    const k = clamp(ramp(a.t, 0.06, 0.42) - ramp(a.t, 0.5, 0.94), 0, 1);
    for (let i = 0; i < a.cfg.lunges.length; i++) {
      const l = a.cfg.lunges[i];
      l.mesh.position.x = l.from.x + (l.to.x - l.from.x) * k;
      l.mesh.position.z = l.from.z + (l.to.z - l.from.z) * k;
    }
    if (!a.hit && a.t >= 0.44) {
      a.hit = true;
      a.cfg.onImpact();
    }
    if (a.t >= a.cfg.dur) {
      for (let i = 0; i < a.cfg.lunges.length; i++) {
        const l = a.cfg.lunges[i];
        l.mesh.position.x = l.from.x;
        l.mesh.position.z = l.from.z;
      }
      const cfg = a.cfg;
      anim = null;
      cfg.onDone();
    }
  }

  function calcHit(power, target, el) {
    let dmg = power * rnd(0.9, 1.12);
    if (target.guarding) dmg *= 0.45;
    const magical = el && el !== "phys" && el !== "heal" && el !== "almighty";
    const exploit = !!magical && target.weak === el;
    const crit = Math.random() < 0.12;
    if (crit) dmg *= 1.7;
    if (exploit) dmg *= 1.65;
    return { dmg: Math.max(1, Math.round(dmg)), exploit: exploit, crit: crit };
  }

  function applyDamage(target, dmg, opts) {
    opts = opts || {};
    target.hp = Math.max(0, target.hp - dmg);
    target.hitT = 0.4;
    const e = ELEM[opts.el] || ELEM.phys;
    spawnFloat("-" + dmg, opts.css || e.css, target.mesh);
    spawnBurst(target.mesh.position, e.color, !!opts.big);
    shake = Math.min(1.3, shake + (opts.big ? 0.75 : 0.32));
    blip(e.freq, 0.16, "sawtooth", 0.06);

    if (target.isFoe) {
      state.score += dmg;
      gauge = Math.min(100, gauge + dmg * 0.13 + (opts.exploit ? 22 : 0));
      if (opts.exploit) state.score += 180;
      else if (opts.crit) state.score += 120;
      if (target.hp <= 0 && target.alive) {
        target.alive = false;
        target.down = false;
      }
    } else {
      gauge = Math.min(100, gauge + dmg * 0.26);
      if (target.hp <= 0) {
        target.alive = false;
        target.down = false;
        log(target.name + " K.O.!");
        showBanner(target.name + " K.O.!", "ko");
      }
      state.lives = heroes.filter((h) => h.alive).length;
    }
    uiDirty = true;
    updateHUD();
  }

  function logImpact(name, dmg, res, target) {
    let t = name + " \u2192 " + target.name + " " + dmg;
    if (res.exploit) t += " LEMAH!";
    else if (res.crit) t += " CRIT!";
    log(t);
  }

  function heroStrike(cfg) {
    const h = current;
    const from = { x: h.mesh.position.x, z: h.mesh.position.z };
    const to = lungeDest(from, foe.mesh.position, 2.6);
    log(h.name + (cfg.kind === "strike" ? " menyerang!" : " menggunakan " + cfg.name + "!"));
    beginAction({
      dur: 1.05,
      lunges: [{ mesh: h.mesh, from: from, to: to }],
      onImpact() {
        foe.guarding = false;
        const res = calcHit(cfg.power, foe, cfg.el);
        applyDamage(foe, res.dmg, { el: cfg.el, exploit: res.exploit, crit: res.crit });
        logImpact(cfg.name, res.dmg, res, foe);
        if (foe.alive && (res.exploit || res.crit)) {
          showBanner(res.exploit ? "WEAKNESS!" : "CRITICAL!", "crit");
          if (!foe.down) {
            foe.down = true;
            pendingExtra = true;
            gauge = Math.min(100, gauge + 8);
          }
        }
        if (!foe.alive) log(foe.name + " dikalahkan!");
      },
      onDone() {
        const extra = pendingExtra;
        pendingExtra = false;
        afterAction(extra ? 0.95 : 0.5, extra);
      }
    });
  }

  function heroSkill(sk) {
    const h = current;
    if (h.sp < sk.cost) return;
    h.sp = Math.max(0, h.sp - sk.cost);
    if (sk.el === "heal") heroHeal(sk);
    else heroStrike({ kind: "skill", el: sk.el, name: sk.name, power: sk.power });
    uiDirty = true;
  }

  function heroHeal(sk) {
    const h = current;
    const alive = heroes.filter((x) => x.alive);
    let targets = alive;
    if (sk.name !== "PATRA" && alive.length) {
      const sorted = alive.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
      targets = [sorted[0]];
    }
    log(h.name + " menggunakan " + sk.name + "!");
    beginAction({
      dur: 1.0,
      lunges: [],
      onImpact() {
        let total = 0;
        targets.forEach((t) => {
          const before = t.hp;
          t.hp = Math.min(t.maxHp, t.hp + Math.round(t.maxHp * sk.power));
          const healed = t.hp - before;
          total += healed;
          spawnFloat("+" + healed, "#9df0b4", t.mesh);
          spawnBurst(t.mesh.position, ELEM.heal.color, false);
        });
        state.score += 60;
        blip(880, 0.2, "sine", 0.06);
        log("Pulih " + total + " HP.");
        uiDirty = true;
      },
      onDone() { afterAction(0.5, false); }
    });
  }

  function heroGuard() {
    const h = current;
    h.guarding = true;
    log(h.name + " bertahan.");
    spawnBurst(h.mesh.position, 0x7de6fd, false);
    blip(300, 0.14, "triangle", 0.05);
    afterAction(0.55, false);
  }

  function teamLunges(reach) {
    return heroes
      .filter((h) => h.alive)
      .map((h) => {
        const from = { x: h.mesh.position.x, z: h.mesh.position.z };
        return { mesh: h.mesh, from: from, to: lungeDest(from, foe.mesh.position, reach) };
      });
  }

  function heroAllOut() {
    if (!foe || !foe.down) return;
    const team = heroes.filter((h) => h.alive);
    log("ALL-OUT ATTACK!");
    showBanner("ALL-OUT ATTACK!", "allout");
    blip(220, 0.3, "sawtooth", 0.07);
    beginAction({
      dur: 1.35,
      lunges: teamLunges(2.5),
      onImpact() {
        const power = team.reduce((s, h) => s + h.atk, 0) * 1.15;
        const res = calcHit(power, foe, "phys");
        applyDamage(foe, res.dmg, { el: "phys", css: "#ffd23f", big: true });
        log("Kerusakan " + res.dmg + " ke " + foe.name + "!");
        state.score += 350;
        flash();
      },
      onDone() {
        if (foe.alive) foe.down = false;
        afterAction(0.75, false);
      }
    });
  }

  function heroTheurgy() {
    if (gauge < 100) return;
    gauge = 0;
    log("THEURGY - MEGIDOALA!");
    showBanner("THEURGY!", "theurgy");
    blip(140, 0.5, "sawtooth", 0.08);
    beginAction({
      dur: 1.6,
      lunges: teamLunges(3.2),
      onImpact() {
        const dmg = Math.round(rnd(105, 148));
        applyDamage(foe, dmg, { el: "almighty", css: "#ff9df7", big: true });
        log("THEURGY " + dmg + " ALMIGHTY!");
        state.score += 500;
        shake = 1.2;
        flash();
        if (foe.alive) foe.down = true;
      },
      onDone() { afterAction(0.9, false); }
    });
  }

  function foeTurn() {
    const f = foe;
    if (f.guarding) f.guarding = false;
    f.turns += 1;
    const alive = heroes.filter((h) => h.alive);
    if (!alive.length) { doDefeat(); return; }

    const r = Math.random();
    if (f.hp < f.maxHp * 0.35 && r < 0.2 && f.turns > 1) {
      f.guarding = true;
      log(f.name + " berlindung.");
      spawnBurst(f.mesh.position, f.color, false);
      blip(240, 0.16, "triangle", 0.05);
      afterAction(0.6, false);
      return;
    }

    const heavy = f.turns % 3 === 0;
    const useElem = f.elem !== "phys" && r > 0.4;
    const el = useElem ? f.elem : "phys";
    const name = useElem ? SKILL_NAMES[f.elem] || "MAUL" : heavy ? "RAMPAGE" : "MAUL";
    const power = f.atk * (useElem ? (heavy ? 1.5 : 1.15) : heavy ? 1.45 : 1.0);
    const all = heavy && r > 0.72;
    const target = alive[Math.floor(Math.random() * alive.length)];

    log(f.name + " menggunakan " + name + "!");
    const from = { x: f.mesh.position.x, z: f.mesh.position.z };
    beginAction({
      dur: 1.15,
      lunges: [{ mesh: f.mesh, from: from, to: lungeDest(from, target.mesh.position, 2.6) }],
      onImpact() {
        const victims = all ? alive : [target];
        victims.forEach((v) => {
          const res = calcHit(power, v, all ? "phys" : el);
          applyDamage(v, res.dmg, { el: all ? "phys" : el });
          log(f.name + " \u2192 " + v.name + " " + res.dmg + (res.crit ? " CRIT" : "") + (res.exploit ? " LEMAH" : ""));
          if ((res.exploit || res.crit) && v.alive) {
            showBanner(res.exploit ? "WEAKNESS!" : "CRITICAL!", "crit");
            v.down = true;
          }
        });
        if (all) showBanner("DARK PULSE!", "warn");
      },
      onDone() { afterAction(0.6, false); }
    });
  }

  /* ---- battle: end states ---------------------------------------------------- */
  function doVictory() {
    phase = "victory";
    phaseT = 0;
    queue = [];
    current = null;
    pendingExtra = false;
    if (arrow) arrow.visible = false;
    const reward = foe ? foe.reward : 500;
    state.score += reward;
    state.shadows = Math.max(0, state.shadows - 1);
    if (activeShade) {
      activeShade.dead = true;
      if (activeShade.mesh) activeShade.mesh.visible = false;
    }
    if (ui.round) ui.round.classList.remove("show");
    showBanner("SHADOW PURIFIED!", "win");
    log((foe ? foe.name : "Bayangan") + " ditaklukkan! +" + reward);
    blip(880, 0.14, "square", 0.06);
    window.setTimeout(() => blip(1180, 0.16, "square", 0.06), 150);
    window.setTimeout(() => blip(1580, 0.26, "square", 0.06), 320);
    uiDirty = true;
    updateHUD();
  }

  function finishVictory() {
    heroes.forEach((h) => {
      if (!h.alive) {
        h.alive = true;
        h.hp = Math.round(h.maxHp * 0.45);
        log(h.name + " hidup kembali.");
      } else {
        h.hp = Math.min(h.maxHp, h.hp + Math.round(h.maxHp * 0.4));
      }
      h.sp = Math.min(h.maxSp, h.sp + 10);
      h.down = false;
      h.guarding = false;
    });
    state.lives = heroes.filter((h) => h.alive).length;
    if (state.shadows <= 0) {
      hideBattleUI();
      updateHUD();
      endGame(
        "FLOOR CLEAR",
        SHADOWS_TOTAL + " bayangan ditaklukkan - " + Math.floor(state.score) + " poin"
      );
    } else {
      returnToDungeon();
    }
  }

  function doDefeat() {
    phase = "defeat";
    phaseT = 0;
    queue = [];
    current = null;
    pendingExtra = false;
    if (arrow) arrow.visible = false;
    state.lives = 0;
    showBanner("WIPE OUT", "lose");
    log("Party gugur...");
    blip(160, 0.6, "sawtooth", 0.07);
    uiDirty = true;
    updateHUD();
  }

  function finishDefeat() {
    hideBattleUI();
    updateHUD();
    endGame(
      "WIPE OUT",
      SHADOWS_TOTAL - state.shadows + " bayangan ditaklukkan - " + Math.floor(state.score) + " poin"
    );
  }

  /* ---- rendering per frame ---------------------------------------------------- */
  function updateCamera(dt) {
    if (!camPos || !camera) return;
    let tx, ty, tz, lx, ly, lz;
    if (camMode === "battle") {
      tx = 0; ty = 5.6; tz = 13.8;
      lx = 0; ly = -0.3; lz = 0;
    } else {
      tx = leader.x; ty = 11.8; tz = leader.z + 9.6;
      lx = leader.x; ly = 1.5; lz = leader.z;
    }
    const k = 1 - Math.exp(-dt * (camMode === "battle" ? 4.5 : 6));
    camPos.x += (tx - camPos.x) * k;
    camPos.y += (ty - camPos.y) * k;
    camPos.z += (tz - camPos.z) * k;
    camLook.x += (lx - camLook.x) * k;
    camLook.y += (ly - camLook.y) * k;
    camLook.z += (lz - camLook.z) * k;
    camera.position.set(camPos.x, camPos.y, camPos.z);
    if (shake > 0) {
      camera.position.x += rnd(-shake, shake) * 0.4;
      camera.position.y += rnd(-shake, shake) * 0.4;
    }
    camera.lookAt(camLook);
  }

  function animateBattle(dt) {
    if (foe && foe.mesh) {
      foe.mesh.position.y = Math.sin(elapsed * 2.2) * 0.18;
      foe.mesh.rotation.y += dt * 0.5;
      if (foe.mesh.userData.ring) foe.mesh.userData.ring.rotation.z += dt * 1.8;
      foe.hitT = Math.max(0, foe.hitT - dt * 2.6);
      setFlash(foe.mesh, foe.hitT);
    }
    heroes.forEach((h) => {
      if (!h.mesh) return;
      h.hitT = Math.max(0, h.hitT - dt * 2.6);
      setFlash(h.mesh, h.hitT);
      if (h.mesh.userData.ring) {
        h.mesh.userData.ring.rotation.z += dt * (current === h && phase === "menu" ? 3.6 : 1.2);
      }
    });
    if (arrow) {
      const act = current && current.mesh ? current : null;
      const show = !!act && phase !== "victory" && phase !== "defeat";
      if (arrow.visible !== show) arrow.visible = show;
      if (act) {
        const top = act.isFoe ? 3.5 : 2.4;
        arrow.position.set(
          act.mesh.position.x,
          act.mesh.position.y + top + Math.sin(elapsed * 5) * 0.14,
          act.mesh.position.z
        );
        const hex = act.isFoe ? 0xe60024 : 0x16cffb;
        if (arrow.material.color.getHex() !== hex) {
          arrow.material.color.setHex(hex);
          arrow.material.emissive.setHex(hex);
        }
      }
    }
  }

  function update(dt) {
    elapsed += dt;
    phaseT += dt;
    if (bannerT > 0) {
      bannerT -= dt;
      if (bannerT <= 0 && ui.banner) ui.banner.classList.remove("show");
    }
    if (toastT > 0) {
      toastT -= dt;
      if (toastT <= 0 && ui.toast) ui.toast.classList.remove("show");
    }
    shake = Math.max(0, shake - dt * 1.7);
    updateBursts(dt);

    if (phase === "dungeon") {
      updateDungeon(dt);
    } else {
      animateBattle(dt);
      if (phase === "intro") {
        if (phaseT >= 1.35) {
          phaseT = 0;
          beginRound();
        }
      } else if (phase === "act" && anim) {
        stepAnim(dt);
      } else if (phase === "gap") {
        gapT -= dt;
        if (gapT <= 0) {
          if (pendingExtra && current && current.alive) {
            queue.unshift(current);
            log(current.name + " mendapat 1 MORE!");
            showBanner("1 MORE!", "more");
          }
          pendingExtra = false;
          advance();
        }
      } else if (phase === "victory" && phaseT >= 2.0) {
        finishVictory();
      } else if (phase === "defeat" && phaseT >= 2.0) {
        finishDefeat();
      }
    }

    updateCamera(dt);
    if (uiDirty) renderFrame();
  }

  /* ---- public game interface -------------------------------------------------- */
  function init() {
    scene = newScene(0x030a20, 18, 96);
    camera = new THREE.PerspectiveCamera(56, 1, 0.1, 400);
    camera.position.set(0, 14, 22);
    addLights(scene);

    camPos = camera.position.clone();
    camLook = new THREE.Vector3(0, 1, 0);

    genMaze();
    buildDungeon();
    buildArena();
    buildUI();

    leader.x = worldX(1);
    leader.z = worldZ(1);
    trail.length = 0;
    for (let i = 0; i < 24; i++) trail.push({ x: leader.x, z: leader.z + i * 0.15 });
    heroes.forEach((h, i) => {
      if (h.dgn) {
        h.dgn.position.set(leader.x, 0, leader.z + (i + 1) * 1.9);
        h.dgn.rotation.y = Math.PI;
      }
      if (h.mesh) setFlash(h.mesh, 0);
    });

    phase = "dungeon";
    camMode = "dungeon";
    gauge = 65;
    round = 0;
    shake = 0;
    elapsed = 0;
    bursts = [];
    uiDirty = true;
    if (ui.map) ui.map.classList.add("on");
    renderGauge();
    updateHUD();
    showToast("HUNT THE " + SHADOWS_TOTAL + " SHADOWS", 3);
    blip(660, 0.1, "square", 0.05);
  }

  function action() {
    if (phase === "menu") {
      confirmMenu();
      return;
    }
    if (phase === "dungeon") {
      const d = nearestShadeTiles();
      showToast(d < 0 ? "TIDAK ADA BAYANGAN" : "BAYANGAN TERDEKAT: " + d + " TILE", 1.8);
      blip(700, 0.06, "square", 0.04);
    }
  }

  function handleKey(e, k) {
    if (phase === "dungeon") return false;
    const up = k === "ArrowUp" || k === "w" || k === "ArrowLeft" || k === "a";
    const down = k === "ArrowDown" || k === "s" || k === "ArrowRight" || k === "d";
    if (up || down) {
      e.preventDefault();
      if (phase === "menu") moveCursor(up ? -1 : 1);
      return true;
    }
    if (k === "Enter" || k === "enter" || k === " ") {
      e.preventDefault();
      action();
      return true;
    }
    if (k === "escape" || k === "Escape" || k === "b" || k === "backspace") {
      if (phase === "menu" && subMenu) {
        e.preventDefault();
        closeSub();
        return true;
      }
      return false;
    }
    return true;
  }

  function dispose() {
    killUI();
    shadeList.length = 0;
    trail.length = 0;
    bursts = [];
    dungeonGroup = null;
    arenaGroup = null;
    arrow = null;
    foe = null;
    activeShade = null;
    current = null;
    queue = [];
    anim = null;
    entries = [];
    grid = null;
    floorList = [];
    camPos = null;
    camLook = null;
    heroes.forEach((h) => {
      h.mesh = null;
      h.dgn = null;
    });
    phase = "dungeon";
  }

  return {
    id: "micro-tartarus",
    init,
    update,
    action,
    handleKey,
    dispose
  };
}

const GAME_FACTORIES = {
  "shadow-dodge": gameShadowDodge,
  "evoker-target": gameEvokerTarget,
  "block-breaker": gameBlockBreaker,
  "ring-rush": gameRingRush,
  "micro-tartarus": gameMicroTartarus
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
  state.shadows = g.shadows || 0;
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

  /* A running game may claim the key first (menus, sub-menus, cancels) */
  if (state.running && game && typeof game.handleKey === "function") {
    try {
      if (game.handleKey(e, k) === true) return true;
    } catch (err) {
      console.warn("[MiniGames] game.handleKey failed:", err);
    }
  }

  if (state.running) {
    if (k === "escape" || k === "Escape" || k === "b" || k === "backspace") {
      e.preventDefault();
      stop();
      return true;
    }
    if (k === " " || k === "enter" || k === "Enter") {
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
      shadows: state.shadows,
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
