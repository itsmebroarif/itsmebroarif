<div align="center">

# ✦ ARIF PERMANA ✦
### *Fullstack Web Developer · UI/UX Designer · Graphic Designer*

**An interactive portfolio wrapped in a Persona&nbsp;3&nbsp;Reload interface.**

![Live](https://img.shields.io/badge/live-GitHub%20Pages-brightgreen?style=for-the-badge)
![Theme](https://img.shields.io/badge/theme-Persona%203%20Reload-00A3E0?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff&style=for-the-badge)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=fff&style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=for-the-badge)

[**▶ Visit Portfolio**](https://itsmebroarif.github.io/itsmebroarif/) · [Report an Issue](https://github.com/itsmebroarif/itsmebroarif/issues)

</div>

---

<img src="../assets/screenshots/main-menu.png" alt="Main menu — Persona 3 Reload inspired navigation" width="100%">

> *"I am thou, thou art I…"* — the same invitation, rebuilt as a **menu-driven portfolio**:
> nine Arcana-styled sections, cinematic transitions, and a soundtrack that follows you.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Controls](#%EF%B8%8F-controls)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Editing the Content](#-editing-the-content)
- [Deployment](#-deployment)
- [Credits & Disclaimer](#-credits--disclaimer)
- [Contact](#-contact)

---

## 🎯 Overview

A **single-page, menu-driven portfolio** built from scratch with plain HTML, CSS and JavaScript — no framework, no build step.

Instead of a conventional scroll-down page, visitors start at a **Persona 3 Reload style splash screen**, then navigate a slanted main menu where each entry opens its own full-screen section with dedicated background video, motion design and sound:

| # | Section | Contents |
|:-:|---|---|
| 1 | **PROJECT** | Scrollable stack of 11 work experiences — Sintesa Persada, Sadaraga, Hangang Solution, Young On Top, Rumah Coding and more |
| 2 | **STORE** | `PRODUCT` menu — a filterable catalogue of 16 digital products I can build (ERP, SIMRS, LMS, CMS, EMS, POS, Inventory, HRIS, CRM, WMS, Company Profile, Landing Page, Undangan Digital, E-Commerce, APK Kehadiran, QR Menu), each on an illustrated card |
| 3 | **MINI GAMES** | `ARCADE` menu — five playable three.js 3D mini games (**Shadow Dodge**, **Evoker Target**, **Block Breaker**, **Ring Rush**, **Micro Tartarus**) rendered live in the page, each with its own HUD, best score and dossier |
| 4 | **EDUCATION** | FreeCodeCamp, SMK Taruna Bhakti Depok, SMP Yapemri Depok |
| 5 | **ORGANIZATION** | Social links — Karang Taruna (2025), Kafeinarts Tech Organization (2022) |
| 6 | **SKILLS** | Persona-style skill screen — four tabs (frontend, backend, design, languages), each group presented as a Persona (Orpheus, Thanatos, Orpheus Telos, Messiah) with element-typed skill chips and meters |
| 7 | **GEAR** | Daily hardware — monitor, laptop, mouse, keyboard, earphone |
| 8 | **ABOUT** | Full biography, philosophy and contact channels |
| 9 | **CONTACT** | Email, Discord, Instagram and phone |

**Live site:** https://itsmebroarif.github.io/itsmebroarif/

---

## ✨ Features

- 🎴 **Nine-entry slanted main menu** with per-item banner, rotation, depth and focus highlighting
- 🛍️ **Store / PRODUCT catalogue** — category menu (`ALL`, `ENTERPRISE`, `WEB`, `MOBILE`, `COMMERCE`) over a responsive grid of illustrated product cards with live counter and hover/keyboard selection
- 🕹️ **three.js arcade** — a `MINI GAMES` section running five 3D games in a real WebGL renderer: endless corridor dodging (**Shadow Dodge**), a shooting-gallery aim test (**Evoker Target**), neon **Block Breaker** with levels, an endless ring-flight (**Ring Rush**) and a pocket dungeon (**Micro Tartarus**). Tab menu, live HUD (score / time / lives), attract mode behind the dossier, procedural WebAudio SFX, `localStorage` best scores — all local, no CDN
- 🗼 **Micro Tartarus (game 05)** — a procedurally generated Tartarus floor you actually walk around in (recursive-backtracker maze, instanced walls, live minimap) with the party trailing the leader in formation and **5 roaming shadows**; touching one starts a **Persona-style turn-based battle**: elemental weaknesses → knockdown → **1 MORE** → **ALL-OUT ATTACK**, a charging **THEURGY** gauge for the party's almighty ultimate, agility-ordered turns, animated lunges, screen shake, floating damage numbers and a full command menu
- 🎬 **Background video per section** (`intro`, `loop`, `skills`, `about`, `contact`) with preloading on hover
- 🎵 **Full audio design** — looping backsound (`music/ost.mp3`) with fade-in, plus menu, navigation and close SFX
- 🃏 **Card-stack sub-pages** — skewed, overflowing cards with smooth auto-scroll and selection tracking
- ⚔️ **Persona-style skill screen** — every skill group is presented as a Persona (Orpheus, Thanatos, Orpheus Telos, Messiah) with element-colored type chips, wrap-safe skill names and animated meters
- ⌨️ **Keyboard-first navigation** — arrow keys, `Enter` to confirm, `Esc` to go back (inside the arcade the same keys steer, fire and stop a run)
- 🔗 **Deep links** — every section is routable (`?page=project`, `?page=store`, `?page=minigame&game=ring-rush`, `?page=education`, `?page=organization`, `?page=skill`, `?page=gear`, `?page=about`, `?page=contact`)
- 📱 **Loading screen with progress bar** and a clear desktop-only notice for small screens
- ⚡ **Zero build pipeline** — plain static assets, cache-busted CSS/JS, fast first paint
- 🧠 **Cross-browser audio** — autoplay-blocked environments (Firefox included) recover on first user gesture

---

## 🎮 Controls

| Key | Action |
|---|---|
| `↑` `↓` | Move between menu entries |
| `Enter` | Confirm / open section |
| `Esc` | Back to main menu |
| `Scroll` | Browse cards inside a section |

**Inside `MINI GAMES`:**

| Key | Action |
|---|---|
| `↑` `↓` `←` `→` / `W` `A` `S` `D` | Pick a game (idle) · steer / aim (playing) · roam the floor or move the battle cursor |
| `Enter` / `Space` | Start · launch the ball · fire the Evoker · confirm a battle command |
| `Esc` | Stop the current run → second `Esc` leaves the section (in a battle menu it goes back) |
| Mouse | Aim the Evoker reticle, click to shoot · click to confirm a battle command |

**Micro Tartarus** also shows a floor minimap (bottom-right), the party cards and the
command menu during a fight, plus a `THEURGY` gauge inside the shared HUD.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic sections, Open Graph metadata) |
| Styling | CSS3 — custom properties, keyframe animations, `clip-path`/skew compositions |
| Logic | Vanilla ES6+ JavaScript — module-free, event-driven state machine |
| Arcade | **three.js r169** (vendored ES module) — WebGL renderer, raycasting, `EdgesGeometry` wireframes, additive glow sprites, WebAudio SFX |
| Media | MP4 background loops, MP3/WAV SFX, Web Audio API + `<audio>` elements |
| Type | Google Fonts (Poppins) + bundled **Rodin Pro** / Skip OTF fonts |
| Hosting | GitHub Pages |

---

## 📁 Project Structure

```text
itsmebroarif/
├── index.html                 # Single entry: splash, menu, all nine sections
├── css/
│   └── style.css              # Full theme, menu, card stack, scrollbars, arcade
├── js/
│   ├── main.js                # Data, routing, audio engine, UI state machine
│   ├── minigames.js           # MINI GAMES section: engine + 5 three.js games
│   └── three.module.min.js    # Vendored three.js r169 (ES module, no CDN)
├── assets/
│   ├── profile.jpg            # Profile portrait
│   ├── favicon.png
│   ├── screenshots/           # README imagery
│   └── *.mp4                  # Section background videos
├── fonts/                     # Rodin Pro & Skip (self-hosted OTF)
├── music/
│   └── ost.mp3                # Looping backsound
├── sfx/                       # menu-utama, navigation, close-menu
└── README.md
```

---

## 🚀 Getting Started

Clone and serve locally — any static server works:

```bash
git clone https://github.com/itsmebroarif/itsmebroarif.git
cd itsmebroarif
```

```bash
# Option A — Python
python -m http.server 8000
# Option B — Node
npx serve .
```

Open `http://localhost:8000` on a **desktop browser** (the experience targets pointer + keyboard).

---

## ✏️ Editing the Content

Everything is plain data — no templates to rebuild:

| Content | Location |
|---|---|
| Menu entries & labels | `js/main.js` → `options[]` |
| Work experiences | `js/main.js` → `slinkData` |
| Store products (16) | `js/main.js` → `storeProductsData` (`name`, `cat`, `desc`, `icon` SVG), `storeTabsList` |
| Mini games (4) | `js/minigames.js` → `GAMES[]` (`code`, `name`, `desc`, `controls`, `hudTime`, `lives`) and `GAME_FACTORIES` |
| Education | `js/main.js` → `educationData` |
| Organization | `js/main.js` → `organizationData` |
| Gear | `js/main.js` → `gearData` |
| Skills | `js/main.js` → `skillTabsList`, `skillGroupsData` (`persona` per group, `tag` + `elem` per skill) |
| About, contact channels, profile | `index.html` |
| Backsound & SFX | `music/`, `sfx/` + `js/main.js` audio engine |

> Cache-bust after editing: bump `css/style.css?v=`, `js/main.js?v=` and `js/minigames.js?v=` in `index.html`.

---

## 🌐 Deployment

Published via **GitHub Pages** from this repository:

1. Repo → **Settings → Pages**
2. **Source:** Deploy from a branch → `main` / `/ (root)`
3. Site: `https://itsmebroarif.github.io/itsmebroarif/`

All asset paths are relative, so the site works on any sub-path or custom domain.

---

## 🎓 Credits & Disclaimer

- **UI direction inspired by [Persona 3 Reload](https://persona.atlus.com/)** (ATLUS / SEGA) — the menu, card stack, transitions and audio design are an original, non-commercial homage.
- This is a **fan tribute / personal portfolio**. It is **not affiliated with, endorsed by, or sponsored by ATLUS or SEGA**, and contains no extracted game assets.
- All biographical content, projects, photography and media belong to their respective owners.

---

## 📬 Contact

| Channel | Value |
|---|---|
| GitHub | [`@itsmebroarif`](https://github.com/itsmebroarif) |
| Email | [aripstrike@gmail.com](mailto:aripstrike@gmail.com) |
| Instagram | [@eexxvvn](https://www.instagram.com/eexxvvn/) |
| Discord | `itsmebroarif` |

---

<div align="center">

**© 2026 Arif Permana Putrasuryana — All rights reserved.**

*Open the Door.*

</div>
