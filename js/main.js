/**
 * ==========================================================================
 * Persona 3 Reload - Portfolio Interaction & Animation Engine
 * Authentic Atlus Aesthetic (60fps, Zero-Latency Audio, Zero Bugs)
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. Data Structures & Configuration
// --------------------------------------------------------------------------
const colors = ["fill-button-1", "fill-button-2", "fill-button-3"];

const options = [
  {
    name: "PROJECT",
    description: "Pengalaman Kerja & Proyek Unggulan",
    rotation: -21,
    zIndex: 1,
    offsetX: -40,
    offsetY: 24,
    fontSize: "5.15rem",
    bannerScaleX: 1.07,
    bannerScaleY: 3.35,
    tag: "PENGALAMAN & PROYEK",
    summary: "Lebih dari 5 tahun pengalaman fullstack, training, dan freelance dari 2021 sampai sekarang",
    cards: [
      {
        title: "Fullstack Web Engineer (2025 - Present)",
        desc: "@Sintesa Persada Teknologi dan @Sadaraga: pengembangan website company, sistem registrasi marathon, serving hasil peserta, sampai BIB checking berbasis C#."
      },
      {
        title: "Vue.js Dev & Website Builder (2024)",
        desc: "@Hangang Solution (KR): situs dan forum belajar game developer. @Amie Jaya Motor: website statis dealer motor Yamaha yang terhubung ke situs resmi."
      },
      {
        title: "Trainer & Digital Speaker (2023 - 2024)",
        desc: "@Kafeinarts: mengajar HTML, CSS, JavaScript, Vue.js, dan Bootstrap. @Rumah Coding: mentor Laravel, Blade, MVC, OOP, serta CRUD. @Young On Top: edukasi periklanan digital."
      },
      {
        title: "Backend & Tech Content (2021 - 2022)",
        desc: "@PT. Spero Mahakarya Nusantara: mengelola REST API dan kolaborasi frontend. @Guepedia: aplikasi berbasis Laravel dan Vue.js. @Hallotrans: maintenance web app. @Medium: review hardware dan software."
      }
    ]
  },
  {
    name: "STORE",
    description: "Katalog Produk Digital Siap Pesan",
    rotation: -16.9,
    zIndex: 2,
    offsetX: -47.5,
    offsetY: 26.25,
    fontSize: "4.7rem",
    bannerScaleX: 1.0,
    bannerScaleY: 3.2,
    tag: "TOKO PRODUK DIGITAL",
    summary: "16 produk digital yang bisa saya buatkan untuk Anda: ERP, SIMRS, LMS, POS, HRIS, e-commerce, dan lainnya",
    cards: [
      {
        title: "Sistem Enterprise",
        desc: "ERP, SIMRS, EMS, Inventory, HRIS, CRM, dan WMS yang dirancang mengikuti alur kerja bisnis Anda."
      },
      {
        title: "Website & Landing Page",
        desc: "Company profile, landing page, CMS, LMS, undangan digital, dan toko online siap pakai."
      },
      {
        title: "Aplikasi Mobile",
        desc: "Aplikasi kehadiran berbasis GPS/QR dan aplikasi QR menu untuk restoran serta kafe."
      },
      {
        title: "Cara Pesan",
        desc: "Konsultasi kebutuhan, pilih paket, kami desain dan kembangkan, lalu serah terima beserta pelatihan."
      }
    ]
  },
  {
    name: "MINI GAMES",
    description: "Arcade 3D Berbasis Three.js",
    rotation: -12.8,
    zIndex: 3,
    offsetX: -55,
    offsetY: 28.5,
    fontSize: "4.2rem",
    bannerScaleX: 1.0,
    bannerScaleY: 3.0,
    tag: "ARCADE 3D & MINI GAMES",
    summary: "Empat mini game 3D: Shadow Dodge, Evoker Target, Block Breaker, dan Ring Rush",
    cards: [
      {
        title: "Shadow Dodge",
        desc: "Kendalikan kapal di koridor neon, hindari bayangan yang datang dan kumpulkan orbe biru."
      },
      {
        title: "Evoker Target",
        desc: "Target melayang muncul selama 30 detik — bidik dengan raycaster dan jaga combo Anda."
      },
      {
        title: "Block Breaker",
        desc: "Paddle neon memantulkan bola untuk menghancurkan balok — 3 nyawa, level makin cepat."
      },
      {
        title: "Ring Rush",
        desc: "Terbang menembus cincin yang datang, jaga tiga perisai sebelum waktu habis."
      }
    ]
  },
  {
    name: "EDUCATION",
    description: "Riwayat Pendidikan Formal",
    rotation: -8.6,
    zIndex: 4,
    offsetX: -62.5,
    offsetY: 30.75,
    fontSize: "4.3rem",
    bannerScaleX: 1.0,
    bannerScaleY: 3.0,
    tag: "PENDIDIKAN",
    summary: "Riwayat pendidikan formal dari SMP hingga bootcamp web developer di FreeCodeCamp",
    cards: [
      {
        title: "FreeCodeCamp (US)",
        desc: "2022 - 2024: bootcamp Web Developer, desain website responsif, algoritma JavaScript, dan struktur data."
      },
      {
        title: "SMK Taruna Bhakti Depok",
        desc: "2019 - 2022: jurusan Rekayasa Perangkat Lunak, fokus pengembangan website dan aplikasi dengan Laravel, Vue.js, serta PWA."
      },
      {
        title: "SMP Yapemri Depok",
        desc: "2016 - 2019: memulai belajar komputer dan jaringan secara otodidak disertai pemrograman sederhana HTML dan CSS."
      }
    ]
  },
  {
    name: "ORGANIZATION",
    description: "Organisasi & Social Link",
    rotation: -4.5,
    zIndex: 5,
    offsetX: -70,
    offsetY: 33,
    fontSize: "3.95rem",
    bannerScaleX: 0.86,
    bannerScaleY: 2.9,
    tag: "ORGANISASI & SOCIAL LINK",
    summary: "Keanggotaan organisasi dan komunitas sosial dari 2022 sampai sekarang",
    cards: [
      {
        title: "Karang Taruna (2025 - Sekarang)",
        desc: "Organisasi sosial kemasyarakatan; aktif sejak 2025 pada kegiatan kepemudaan, sosial, dan kerelawanan warga."
      },
      {
        title: "Kafeinarts Tech Organization (2022 - Sekarang)",
        desc: "Komunitas teknologi tempat saya bergabung sejak 2022, termasuk peran sebagai trainer HTML, CSS, JavaScript, Vue.js, dan Bootstrap."
      }
    ]
  },
  {
    name: "SKILLS",
    description: "Keahlian Teknis & Stack",
    rotation: -0.4,
    zIndex: 6,
    offsetX: -77.5,
    offsetY: 35.25,
    fontSize: "4.35rem",
    bannerScaleX: 0.94,
    bannerScaleY: 3.05,
    tag: "KEAHLIAN & PRODUKTIVITAS",
    summary: "Frontend, backend, database, desain grafis, dan tools yang dikuasai selama 4 tahun pengalaman",
    cards: [
      {
        title: "Frontend Web",
        desc: "HTML, CSS, JavaScript, Vue.js, React, Bootstrap, Tailwind CSS, dan Livewire untuk antarmuka responsif serta PWA."
      },
      {
        title: "Backend & Database",
        desc: "PHP, Laravel, Node.js, Go, Python, MySQL, MariaDB, REST API, dan WebSockets untuk sistem yang skalabel."
      },
      {
        title: "Design & Video",
        desc: "Figma, Adobe XD, Photoshop, Illustrator, Affinity Designer, Canva, Premiere Pro, CapCut, dan Sony Vegas Pro."
      },
      {
        title: "Tools & Environment",
        desc: "Git, GitHub, GitLab, NPM, Composer, Electron.js, Microsoft Office, serta Windows, macOS, dan Linux."
      }
    ]
  },
  {
    name: "GEAR",
    description: "Perangkat Kerja Harian",
    rotation: 3.8,
    zIndex: 7,
    offsetX: -85,
    offsetY: 37.5,
    fontSize: "4.5rem",
    bannerScaleX: 0.82,
    bannerScaleY: 3.1,
    tag: "PERANGKAT & HARDWARE",
    summary: "Monitor, laptop, dan perangkat pendukung yang saya gunakan untuk bekerja sehari-hari",
    cards: [
      {
        title: "Monitor",
        desc: "LG 19EN33S: layar utama untuk multitasking coding, desain, dan preview website."
      },
      {
        title: "Laptop",
        desc: "Lenovo Y410P: workstation utama untuk development, build project, dan kebutuhan harian."
      },
      {
        title: "Mouse",
        desc: "Rexus Q35: mouse harian untuk navigasi desain dan produktivitas kerja."
      },
      {
        title: "Keyboard",
        desc: "Leaven K550: keyboard mekanis untuk mengetik kode dalam durasi panjang."
      },
      {
        title: "Earphone",
        desc: "Hammerhead V1: audio untuk meeting, review, dan konsultasi dengan klien."
      }
    ]
  },
  {
    name: "ABOUT",
    description: "Profil & Filosofi Kerja",
    rotation: 7.9,
    zIndex: 8,
    offsetX: -92.5,
    offsetY: 39.75,
    fontSize: "4.6rem",
    bannerScaleX: 1.0,
    bannerScaleY: 3.25,
    tag: "PROFIL & PERJALANAN",
    summary: "Fullstack web developer dan UI/UX designer dari Depok, Jawa Barat",
    cards: [
      {
        title: "Latar Belakang",
        desc: "Lulusan SMK Taruna Bhakti Depok jurusan Rekayasa Perangkat Lunak (2019 - 2022) dan bootcamp Web Developer di FreeCodeCamp San Francisco (2022 - 2024)."
      },
      {
        title: "Sertifikasi",
        desc: "Javascript dan Golang Course Contributor 2025, Digital Advertising 2025, Flutter Course Contributor 2024, serta sertifikasi FreeCodeCamp JavaScript dan Responsive Web Design 2024."
      },
      {
        title: "Fokus Kerja",
        desc: "Menggabungkan sisi fungsional pengembangan web dengan sisi estetis desain antarmuka agar solusi digital tidak hanya kuat tapi juga nyaman digunakan."
      },
      {
        title: "Status",
        desc: "Ready to work, berbasis di Depok, Jawa Barat, dapat dihubungi di 085817048244 atau aripstrike@gmail.com."
      }
    ]
  },
  {
    name: "CONTACT",
    description: "Mulai Komunikasi",
    rotation: 12,
    zIndex: 9,
    offsetX: -100,
    offsetY: 42,
    fontSize: "4.4rem",
    bannerScaleX: 1.04,
    bannerScaleY: 3.2,
    tag: "KANAL KOMUNIKASI",
    summary: "Terbuka untuk kolaborasi, proyek freelance, dan peluang kerja di bidang web development",
    cards: [
      {
        title: "Email",
        desc: "aripstrike@gmail.com: Kanal utama untuk permintaan proyek, kerja sama, dan peluang kerja."
      },
      {
        title: "Discord",
        desc: "itsmebroarif: Koordinasi cepat, konsultasi, dan diskusi teknis melalui Discord."
      },
      {
        title: "Instagram",
        desc: "@eexxvvn: Portofolio visual, karya desain, dan update aktivitas terbaru."
      },
      {
        title: "Contact Person",
        desc: "085817048244: Nomor telepon dan WhatsApp untuk konsultasi serta pemesanan layanan."
      }
    ]
  }
];

const slinkData = [
  {
    numeral: "I",
    title: "SINTESA PERSADA TEKNOLOGI",
    subtitle: "2026 - Present · Fullstack Web Engineer",
    url: "#"
  },
  {
    numeral: "II",
    title: "SADARAGA",
    subtitle: "2025 · Fullstack Web Engineer · Registrasi Marathon",
    url: "#"
  },
  {
    numeral: "III",
    title: "HANGANG SOLUTION",
    subtitle: "2024 · Vue Js Dev · Situs & Forum Belajar Game Dev (KR)",
    url: "#"
  },
  {
    numeral: "IV",
    title: "AMIE JAYA MOTOR",
    subtitle: "2024 · Website Builder · Situs Statis Dealer Yamaha",
    url: "#"
  },
  {
    numeral: "V",
    title: "YOUNG ON TOP",
    subtitle: "2024 · Digital Speaker · Edukasi Periklanan Digital",
    url: "#"
  },
  {
    numeral: "VI",
    title: "KAFEINARTS STUDIO",
    subtitle: "2023 · Front-End Trainer · HTML, CSS, JS, Vue & Bootstrap",
    url: "#"
  },
  {
    numeral: "VII",
    title: "RUMAH CODING",
    subtitle: "2023 · Laravel Mentor · Blade, MVC, OOP & CRUD",
    url: "#"
  },
  {
    numeral: "VIII",
    title: "HALLotrans",
    subtitle: "2022 · Remote Laravel Dev · Maintenance Web App & Tim Remote",
    url: "#"
  },
  {
    numeral: "IX",
    title: "MEDIUM",
    subtitle: "2022 · Tech Blogger · Review Hardware & Software IT",
    url: "#"
  },
  {
    numeral: "X",
    title: "PT. SPERO MAHAKARYA NUSANTARA",
    subtitle: "2021 · Backend Dev · REST API & Kolaborasi Frontend",
    url: "#"
  },
  {
    numeral: "XI",
    title: "GUEPEDIA",
    subtitle: "2021 · Fullstack Dev · Laravel & Vue.js",
    url: "#"
  }
];

const educationData = [
  {
    numeral: "I",
    title: "FREECODECAMP",
    subtitle: "Web Developer · San Francisco, US · 2022 - 2024",
    url: "#"
  },
  {
    numeral: "II",
    title: "SMK TARUNA BHAKTI DEPOK",
    subtitle: "Rekayasa Perangkat Lunak · Depok, ID · 2019 - 2022",
    url: "#"
  },
  {
    numeral: "III",
    title: "SMP YAPEMRI DEPOK",
    subtitle: "Pendidikan Formal · Depok, ID · 2016 - 2019",
    url: "#"
  }
];

// ORGANIZATION (Social Link) — data-driven: cukup tambahkan objek baru ke array ini
// untuk menampilkan organisasi tambahan pada halaman ORGANIZATION.
const organizationData = [
  {
    numeral: "I",
    title: "KARANG TARUNA",
    subtitle: "Organisasi Sosial & Kepemudaan · Depok, ID · 2025 - Sekarang",
    url: "#"
  },
  {
    numeral: "II",
    title: "KAFEINARTS TECH ORGANIZATION",
    subtitle: "Tech Community & Training · 2022 - Sekarang",
    url: "#"
  }
];

const gearData = [
  {
    numeral: "I",
    title: "LG 19EN33S",
    subtitle: "Monitor · Layar Utama Multitasking",
    url: "#"
  },
  {
    numeral: "II",
    title: "LENOVO Y410P",
    subtitle: "Laptop · Workstation Development",
    url: "#"
  },
  {
    numeral: "III",
    title: "REXUS Q35",
    subtitle: "Mouse · Navigasi & Produktivitas",
    url: "#"
  },
  {
    numeral: "IV",
    title: "LEAVEN K550",
    subtitle: "Keyboard · Mekanis Untuk Coding",
    url: "#"
  },
  {
    numeral: "V",
    title: "HAMMERHEAD V1",
    subtitle: "Earphone · Meeting & Audio Kerja",
    url: "#"
  }
];

const skillTabsList = [
  { id: "frontend", code: "01", label: "FRONTEND" },
  { id: "backend", code: "02", label: "BACKEND" },
  { id: "design", code: "03", label: "DESIGN" },
  { id: "languages", code: "04", label: "LANGUAGES" }
];

// Each category is presented as a Persona (P3R skill-list style):
// - `persona` : Persona name shown on the group header
// - `tag`     : skill type chip (shown on every skill row)
// - `elem`    : Persona element color -> almighty | wind | ice | elec | psy | fire | phys
const skillGroupsData = [
  {
    id: "frontend",
    title: "FRONTEND & WEB ENGINEERING",
    code: "01",
    persona: "ORPHEUS",
    skills: [
      { name: "HTML5 · CSS3 · JavaScript (ES6+)", level: 95, tag: "CORE", elem: "almighty" },
      { name: "Vue.js · React", level: 90, tag: "FRAMEWORK", elem: "wind" },
      { name: "Bootstrap · Tailwind CSS · Livewire", level: 92, tag: "STYLING", elem: "ice" },
      { name: "Responsive Design · PWA", level: 88, tag: "MOBILE", elem: "elec" },
      { name: "UI/UX Design · Figma · Adobe XD", level: 86, tag: "UI / UX", elem: "psy" },
      { name: "JavaScript Algorithms & Data Structures", level: 85, tag: "ALGORITHM", elem: "fire" }
    ]
  },
  {
    id: "backend",
    title: "BACKEND, DATABASE & TOOLS",
    code: "02",
    persona: "THANATOS",
    skills: [
      { name: "PHP · Laravel · MVC & OOP", level: 95, tag: "BACKEND", elem: "fire" },
      { name: "Node.js · REST API · WebSockets", level: 88, tag: "API", elem: "elec" },
      { name: "MySQL · MariaDB", level: 92, tag: "DATABASE", elem: "ice" },
      { name: "Go (Golang) · Python", level: 84, tag: "LANGUAGE", elem: "wind" },
      { name: "Git · GitHub · GitLab", level: 90, tag: "VERSIONING", elem: "psy" },
      { name: "NPM · Composer · Electron.js", level: 86, tag: "TOOLING", elem: "almighty" }
    ]
  },
  {
    id: "design",
    title: "GRAPHIC DESIGN, VIDEO & OFFICE",
    code: "03",
    persona: "ORPHEUS TELOS",
    skills: [
      { name: "Adobe Photoshop", level: 90, tag: "IMAGE", elem: "psy" },
      { name: "Adobe Illustrator", level: 88, tag: "VECTOR", elem: "elec" },
      { name: "Affinity Designer · Canva", level: 86, tag: "DESIGN", elem: "wind" },
      { name: "Adobe Premiere Pro · CapCut · Sony Vegas", level: 84, tag: "VIDEO", elem: "ice" },
      { name: "Microsoft Office (Word · Excel · PowerPoint)", level: 92, tag: "OFFICE", elem: "almighty" },
      { name: "Windows · macOS · Linux (Ubuntu · Arch)", level: 88, tag: "SYSTEM", elem: "phys" }
    ]
  },
  {
    id: "languages",
    title: "LANGUAGE PROFICIENCY",
    code: "04",
    persona: "MESSIAH",
    skills: [
      { name: "Bahasa Indonesia — Native / Fluent", level: 100, tag: "NATIVE", elem: "fire" },
      { name: "English — Technical Reading & Documentation", level: 86, tag: "TECHNICAL", elem: "ice" },
      { name: "English — Writing & Documentation", level: 82, tag: "WRITING", elem: "wind" },
      { name: "English — Spoken & Conversational", level: 78, tag: "SPOKEN", elem: "elec" }
    ]
  }
];

// --------------------------------------------------------------------------
// STORE - Product Category Menu & Product Catalogue (16 sellable products)
// Each product carries its own inline SVG illustration (`icon`) so the grid
// stays asset-free: no extra files, no build step, no broken image links.
// cat: enterprise | web | mobile | commerce
// --------------------------------------------------------------------------
const storeTabsList = [
  { id: "all", code: "01", label: "ALL" },
  { id: "enterprise", code: "02", label: "ENTERPRISE" },
  { id: "web", code: "03", label: "WEB" },
  { id: "mobile", code: "04", label: "MOBILE" },
  { id: "commerce", code: "05", label: "COMMERCE" }
];

const storeCategoryLabels = {
  all: "ALL PRODUCTS",
  enterprise: "ENTERPRISE SYSTEM",
  web: "WEBSITE & WEB APP",
  mobile: "MOBILE APP",
  commerce: "COMMERCE & POS"
};

const storeProductsData = [
  {
    code: "01",
    name: "ERP",
    cat: "enterprise",
    desc: "Sistem terintegrasi akuntansi, pembelian, penjualan, stok, dan laporan keuangan real-time.",
    icon: '<rect x="7" y="10" width="50" height="44" rx="4"/><line x1="7" y1="23" x2="57" y2="23"/><rect class="acc-f" x="13" y="30" width="15" height="17" rx="2"/><rect x="34" y="30" width="17" height="6" rx="3"/><rect x="34" y="41" width="17" height="6" rx="3"/><circle class="acc-f" cx="13" cy="16.5" r="2.5"/><circle cx="22" cy="16.5" r="2.5"/>'
  },
  {
    code: "02",
    name: "SIMRS",
    cat: "enterprise",
    desc: "Sistem informasi rumah sakit: rawat jalan, rawat inap, kasir, dan rekam medis elektronik.",
    icon: '<rect x="6" y="10" width="52" height="34" rx="4"/><line x1="24" y1="52" x2="40" y2="52"/><line x1="32" y1="44" x2="32" y2="52"/><path class="acc-s" stroke-width="5" d="M32 16v18M23 25h18"/>'
  },
  {
    code: "03",
    name: "LMS",
    cat: "web",
    desc: "Platform belajar online: kelas, kuis, sertifikat, dan pemantauan progress siswa.",
    icon: '<path d="M32 12 6 24l26 12 26-12z"/><path d="M16 30v13c0 4 7 8 16 8s16-4 16-8V30"/><path class="acc-s" d="M56 26v16"/>'
  },
  {
    code: "04",
    name: "CMS",
    cat: "web",
    desc: "Kelola konten website tanpa sentuh kode, lengkap dengan editor dan pembagian role user.",
    icon: '<rect x="6" y="12" width="52" height="40" rx="4"/><line x1="6" y1="23" x2="58" y2="23"/><circle class="acc-f" cx="14" cy="17.5" r="2"/><circle class="acc-f" cx="22" cy="17.5" r="2"/><rect class="acc-f" x="12" y="30" width="16" height="16" rx="2"/><line x1="34" y1="32" x2="52" y2="32"/><line x1="34" y1="39" x2="52" y2="39"/><line x1="34" y1="46" x2="46" y2="46"/>'
  },
  {
    code: "05",
    name: "EMS",
    cat: "enterprise",
    desc: "Monitoring energi dan utilitas dengan dashboard konsumsi, tren, serta peringatan otomatis.",
    icon: '<line x1="8" y1="54" x2="56" y2="54"/><rect x="14" y="34" width="9" height="16"/><rect x="28" y="26" width="9" height="24"/><rect class="acc-f" x="42" y="16" width="9" height="34"/><path class="acc-s" d="M12 24l10-8 8 6 12-10"/>'
  },
  {
    code: "06",
    name: "POS",
    cat: "commerce",
    desc: "Kasir toko modern: struk belanja, manajemen stok, shift kasir, dan laporan penjualan harian.",
    icon: '<rect x="12" y="8" width="40" height="48" rx="4"/><line x1="20" y1="22" x2="44" y2="22"/><line x1="20" y1="32" x2="44" y2="32"/><path class="acc-s" d="M20 44h16"/><line x1="20" y1="48" x2="36" y2="48"/>'
  },
  {
    code: "07",
    name: "INVENTORY",
    cat: "enterprise",
    desc: "Kontrol stok multi-gudang dengan barcode, stock opname, dan notifikasi stok minimum.",
    icon: '<rect x="8" y="34" width="21" height="18"/><rect x="35" y="34" width="21" height="18"/><rect class="acc-f" x="21" y="12" width="22" height="18" rx="2"/><line x1="8" y1="43" x2="29" y2="43"/><line x1="35" y1="43" x2="56" y2="43"/>'
  },
  {
    code: "08",
    name: "HRIS",
    cat: "enterprise",
    desc: "Data karyawan, absensi, cuti, penggajian, dan struktur organisasi dalam satu panel.",
    icon: '<circle cx="24" cy="22" r="9"/><path d="M8 52c0-9 7-16 16-16s16 7 16 16"/><circle class="acc-s" cx="46" cy="26" r="7"/><path class="acc-s" d="M38 52c0-8 4-13 10-13s10 5 10 13"/>'
  },
  {
    code: "09",
    name: "CRM",
    cat: "enterprise",
    desc: "Pipeline prospek, follow-up klien, dan laporan penjualan yang mudah dibaca.",
    icon: '<path d="M32 52S11 39 11 26a10 10 0 0 1 21-4 10 10 0 0 1 21 4c0 13-21 26-21 26z"/><path class="acc-s" d="M14 30h8l4-7 6 14 4-7h13"/>'
  },
  {
    code: "10",
    name: "WMS",
    cat: "enterprise",
    desc: "Manajemen gudang: penerimaan barang, picking, shipping, dan pelacakan pengiriman.",
    icon: '<path d="M6 28 22 15l16 13v26H6z"/><line x1="16" y1="54" x2="16" y2="37"/><line x1="27" y1="54" x2="27" y2="37"/><rect class="acc-s" x="41" y="36" width="16" height="18" rx="2"/><path class="acc-s" d="M41 44h16"/>'
  },
  {
    code: "11",
    name: "COMPANY PROFILE",
    cat: "web",
    desc: "Profil perusahaan profesional: profil singkat, layanan, portofolio, dan kanal kontak.",
    icon: '<rect x="10" y="10" width="30" height="44"/><rect class="acc-f" x="46" y="26" width="10" height="28"/><rect class="acc-f" x="16" y="17" width="7" height="7"/><rect class="acc-f" x="28" y="17" width="7" height="7"/><rect class="acc-f" x="16" y="30" width="7" height="7"/><rect class="acc-f" x="28" y="30" width="7" height="7"/><rect x="20" y="43" width="11" height="11"/>'
  },
  {
    code: "12",
    name: "LANDING PAGE",
    cat: "web",
    desc: "Halaman promosi fokus konversi, ringan dibuka, dan siap dipasang untuk iklan.",
    icon: '<rect x="6" y="12" width="52" height="40" rx="4"/><line x1="6" y1="23" x2="58" y2="23"/><circle class="acc-f" cx="14" cy="17.5" r="2"/><rect class="acc-f" x="14" y="30" width="26" height="9" rx="2"/><rect class="acc-s" x="14" y="43" width="17" height="6" rx="3"/><line x1="46" y1="46" x2="52" y2="46"/>'
  },
  {
    code: "13",
    name: "UNDANGAN DIGITAL",
    cat: "web",
    desc: "Undangan pernikahan online dengan RSVP, galeri, peta lokasi, dan musik latar.",
    icon: '<rect x="6" y="18" width="52" height="34" rx="4"/><path d="M7 21l25 18 25-18"/><path class="acc-f" d="M45 16c0-4 6-6 8-2 2-4 8-2 8 2 0 5-8 10-8 10s-8-5-8-10z"/>'
  },
  {
    code: "14",
    name: "E-COMMERCE",
    cat: "commerce",
    desc: "Toko online lengkap: katalog, keranjang, pembayaran, voucher, dan notifikasi pesanan.",
    icon: '<path d="M8 12h8l7 28h26l6-20H20"/><circle cx="26" cy="50" r="4"/><circle cx="46" cy="50" r="4"/><path class="acc-f" d="M26 20h22l-4 11H26z"/>'
  },
  {
    code: "15",
    name: "APK KEHADIRAN",
    cat: "mobile",
    desc: "Aplikasi absensi karyawan berbasis GPS dan QR code beserta laporan kehadiran harian.",
    icon: '<rect x="16" y="6" width="32" height="52" rx="6"/><line x1="28" y1="13" x2="36" y2="13"/><path class="acc-s" stroke-width="4" d="M23 33l6 6 12-15"/><line x1="26" y1="49" x2="38" y2="49"/>'
  },
  {
    code: "16",
    name: "APLIKASI QR MENU",
    cat: "mobile",
    desc: "Menu digital berbasis scan QR: ganti harga dan foto menu instan tanpa cetak ulang.",
    icon: '<rect x="8" y="8" width="18" height="18"/><rect x="38" y="8" width="18" height="18"/><rect x="8" y="38" width="18" height="18"/><rect class="acc-f" x="13.5" y="13.5" width="7" height="7"/><rect class="acc-f" x="43.5" y="13.5" width="7" height="7"/><rect class="acc-f" x="13.5" y="43.5" width="7" height="7"/><path d="M38 38h8v8h-8zM52 38h4v4M38 52h4v4M48 50h8v6"/>'
  }
];

// --------------------------------------------------------------------------
// 2. Global State & DOM Element Cache
// --------------------------------------------------------------------------
let isLoaded = false;
let isStarted = false;
let selectedIndex = 0;
let isModalOpen = false;
let isProjectPageOpen = false;
let selectedSlinkIndex = 0;
let isEducationPageOpen = false;
let selectedEducationIndex = 0;
let isOrganizationPageOpen = false;
let selectedOrganizationIndex = 0;
let isGearPageOpen = false;
let selectedGearIndex = 0;
let isSkillPageOpen = false;
let currentSkillTab = "frontend";
let isStorePageOpen = false;
let currentStoreTab = "all";
let selectedStoreIndex = 0;
let isMiniGamePageOpen = false;
let selectedMiniGameIndex = 0;
let pendingMiniGameId = null;
let isAboutPageOpen = false;
let isContactPageOpen = false;
let selectedContactIndex = 0;
let isWavyTransitionRunning = false;

// DOM Elements: Main Menu & Background
const bgVideoIntro = document.getElementById("background-video-intro") || document.getElementById("background-video");
const bgVideoLoop = document.getElementById("background-video-loop");
const optionsList = document.getElementById("options-list");
const sideNumber = document.getElementById("side-number");
const wavyTransitionPortal = document.getElementById("wavy-transition-portal");

// DOM Elements: Modal
const portfolioModal = document.getElementById("portfolio-modal");
const modalTag = document.getElementById("modal-tag");
const modalTitle = document.getElementById("modal-title");
const modalSummary = document.getElementById("modal-summary");
const modalCardsContainer = document.getElementById("modal-cards-container");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalFooterCloseBtn = document.getElementById("modal-footer-close-btn");

// DOM Elements: Project Screen (S.Link)
const projectPage = document.getElementById("project-page");
const slinkBgVideo = document.getElementById("slink-bg-video");
const slinkCardsContainer = document.getElementById("slink-cards-container");
const slinkConfirmBtn = document.getElementById("slink-confirm-btn");
const slinkBackBtn = document.getElementById("slink-back-btn");

// DOM Elements: Education Screen (S.Link)
const educationPage = document.getElementById("education-page");
const educationBgVideo = document.getElementById("education-bg-video");
const educationHeaderDiv = document.getElementById("education-header-div");
const educationCardsContainer = document.getElementById("education-cards-container");
const educationConfirmBtn = document.getElementById("education-confirm-btn");
const educationBackBtn = document.getElementById("education-back-btn");

// DOM Elements: Organization Screen (S.Link / Social Link)
const organizationPage = document.getElementById("organization-page");
const organizationBgVideo = document.getElementById("organization-bg-video");
const organizationHeaderDiv = document.getElementById("organization-header-div");
const organizationCardsContainer = document.getElementById("organization-cards-container");
const organizationConfirmBtn = document.getElementById("organization-confirm-btn");
const organizationBackBtn = document.getElementById("organization-back-btn");

// DOM Elements: Gear Screen (S.Link)
const gearPage = document.getElementById("gear-page");
const gearBgVideo = document.getElementById("gear-bg-video");
const gearHeaderDiv = document.getElementById("gear-header-div");
const gearCardsContainer = document.getElementById("gear-cards-container");
const gearConfirmBtn = document.getElementById("gear-confirm-btn");
const gearBackBtn = document.getElementById("gear-back-btn");

// DOM Elements: Skill Screen
const skillPage = document.getElementById("skill-page");
const skillBgVideo = document.getElementById("skill-bg-video");
const skillHeaderDiv = document.getElementById("skill-header-div");
const skillTabsNav = document.getElementById("skill-tabs-nav");
const p3rSkillsContainer = document.getElementById("p3r-skills-container");
const skillBackBtn = document.getElementById("skill-back-btn");
const skillTabPrevBtn = document.getElementById("skill-tab-prev-btn");
const skillTabNextBtn = document.getElementById("skill-tab-next-btn");

// DOM Elements: Store Screen (Product Catalogue)
const storePage = document.getElementById("store-page");
const storeBgVideo = document.getElementById("store-bg-video");
const storeHeaderDiv = document.getElementById("store-header-div");
const storeTabsNav = document.getElementById("store-tabs-nav");
const storeGrid = document.getElementById("p3r-store-grid");
const storeCounter = document.getElementById("store-count");
const storeCategoryLabel = document.getElementById("store-category-label");
const storeBackBtn = document.getElementById("store-back-btn");
const storeTabPrevBtn = document.getElementById("store-tab-prev-btn");
const storeTabNextBtn = document.getElementById("store-tab-next-btn");

// DOM Elements: Mini Games Screen (Three.js Arcade)
const minigamePage = document.getElementById("minigame-page");
const minigameBgVideo = document.getElementById("minigame-bg-video");
const minigameHeaderDiv = document.getElementById("minigame-header-div");
const minigameTabsNav = document.getElementById("minigame-tabs-nav");
const minigamePlayBtn = document.getElementById("minigame-play-btn");
const minigameBackBtn = document.getElementById("minigame-back-btn");
const minigameTabPrevBtn = document.getElementById("minigame-tab-prev-btn");
const minigameTabNextBtn = document.getElementById("minigame-tab-next-btn");

// DOM Elements: About Screen
const aboutPage = document.getElementById("about-page");
const aboutBgVideo = document.getElementById("about-bg-video");
const aboutHeaderDiv = document.getElementById("about-header-div");
const aboutBackBtn = document.getElementById("about-back-btn");

// DOM Elements: Contact Screen
const contactPage = document.getElementById("contact-page");
const contactBgVideo = document.getElementById("contact-bg-video");
const contactBackBtn = document.getElementById("contact-back-btn");
const contactMailRows = document.querySelectorAll(".p3r-mail-row");

// DOM Elements: Loading Screen
const loadingScreen = document.getElementById("loading-screen");
const loadingBar = document.getElementById("loading-bar");
const loadingPercent = document.getElementById("loading-percent");

// --------------------------------------------------------------------------
// 3. Low-Latency Audio Engine (Web Audio API + Audio Pools + HTML5 Fallbacks)
// --------------------------------------------------------------------------
let audioCtx = null;
let sfxAudioBuffer = null;
let closeMenuAudioBuffer = null;
let menuUtamaAudioBuffer = null;

const SFX_POOL_SIZE = 4;
const sfxAudioPool = [];
const closeMenuAudioPool = [];
const menuUtamaAudioPool = [];
let sfxPoolIndex = 0;
let closeMenuPoolIndex = 0;
let menuUtamaPoolIndex = 0;

let hasMenuUtamaSFXPlayed = false;
let experienceEntryTime = 0;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass({ latencyHint: "interactive" });
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Pre-create light fallback HTMLAudioElement pools
for (let i = 0; i < 2; i++) {
  const a = new Audio("sfx/navigation.wav");
  a.preload = "auto";
  a.volume = 0.6;
  sfxAudioPool.push(a);

  const b = new Audio("sfx/close-menu.mp3");
  b.preload = "auto";
  b.volume = 0.75;
  closeMenuAudioPool.push(b);

  const c = new Audio("sfx/menu-utama.mp3");
  c.preload = "auto";
  c.volume = 0.8;
  menuUtamaAudioPool.push(c);
}

// Background buffer decoding for instantaneous hardware playback
async function loadAudioBuffers() {
  try {
    const [navRes, closeRes, menuRes] = await Promise.all([
      fetch("sfx/navigation.wav"),
      fetch("sfx/close-menu.mp3"),
      fetch("sfx/menu-utama.mp3")
    ]);
    const ctx = getAudioContext();
    if (ctx) {
      if (navRes.ok && !sfxAudioBuffer) {
        const buf = await navRes.arrayBuffer();
        sfxAudioBuffer = await ctx.decodeAudioData(buf);
      }
      if (closeRes.ok && !closeMenuAudioBuffer) {
        const buf = await closeRes.arrayBuffer();
        closeMenuAudioBuffer = await ctx.decodeAudioData(buf);
      }
      if (menuRes.ok && !menuUtamaAudioBuffer) {
        const buf = await menuRes.arrayBuffer();
        menuUtamaAudioBuffer = await ctx.decodeAudioData(buf);
      }
    }
  } catch (_) {}
}
if (window.innerWidth >= 1024) {
  loadAudioBuffers();
}

// Clean unified audio playback dispatcher
function playAudioChannel({
  buffer,
  staticElId,
  pool,
  getPoolIdx,
  setPoolIdx,
  volume = 0.6,
  onPlaySuccess
}) {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "running" && buffer) {
    try {
      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();
      gainNode.gain.value = volume;
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
      if (onPlaySuccess) onPlaySuccess();
      return true;
    } catch (_) {}
  }

  const staticEl = document.getElementById(staticElId);
  if (staticEl) {
    try {
      staticEl.currentTime = 0;
      staticEl.volume = volume;
      const p = staticEl.play();
      if (p !== undefined) {
        p.then(() => { if (onPlaySuccess) onPlaySuccess(); }).catch(() => {});
      }
      return true;
    } catch (_) {}
  }

  if (pool && pool.length > 0) {
    try {
      const idx = getPoolIdx();
      const sound = pool[idx];
      sound.currentTime = 0;
      sound.volume = volume;
      const sp = sound.play();
      if (sp !== undefined) {
        sp.then(() => { if (onPlaySuccess) onPlaySuccess(); }).catch(() => {});
      }
      setPoolIdx((idx + 1) % pool.length);
      return true;
    } catch (_) {}
  }
  return false;
}

function playSFX() {
  if (!isStarted) return;
  playAudioChannel({
    buffer: sfxAudioBuffer,
    staticElId: "sfx-navigation-el",
    pool: sfxAudioPool,
    getPoolIdx: () => sfxPoolIndex,
    setPoolIdx: (v) => { sfxPoolIndex = v; },
    volume: 0.6
  });
}

function playCloseMenuSFX() {
  playAudioChannel({
    buffer: closeMenuAudioBuffer,
    staticElId: "sfx-close-menu-el",
    pool: closeMenuAudioPool,
    getPoolIdx: () => closeMenuPoolIndex,
    setPoolIdx: (v) => { closeMenuPoolIndex = v; },
    volume: 0.75
  });
}

async function playMenuUtamaSFX() {
  if (hasMenuUtamaSFXPlayed) return true;
  const ctx = getAudioContext();
  if (ctx && ctx.state !== "running") {
    try { await ctx.resume(); } catch (_) {}
  }
  playAudioChannel({
    buffer: menuUtamaAudioBuffer,
    staticElId: "sfx-menu-utama-el",
    pool: menuUtamaAudioPool,
    getPoolIdx: () => menuUtamaPoolIndex,
    setPoolIdx: (v) => { menuUtamaPoolIndex = v; },
    volume: 0.95,
    onPlaySuccess: () => { hasMenuUtamaSFXPlayed = true; }
  });
  return true;
}

// --------------------------------------------------------------------------
// 3.5 Background Music / Backsound (music/ost.mp3, looping, fade in)
// --------------------------------------------------------------------------
// Catatan lintas browser: Chrome menolak promise play() saat autoplay diblokir
// (reject), sedangkan Firefox bisa membiarkan promise-nya pending tanpa settle.
// Karena itu jangan pernah memakai state berbasis promise sebagai flag "sudah
// jalan" — pakai kondisi elemen (bgmEl.paused) sebagai sumber kebenaran.
const bgmEl = document.getElementById("bgm-el");
const BGM_VOLUME = 0.32;
let bgmWanted = false;
let bgmHasFadedIn = false;
let bgmIsFading = false;

function fadeInBGM() {
  if (!bgmEl || bgmHasFadedIn || bgmIsFading) return;
  bgmIsFading = true;
  bgmEl.volume = 0;
  const startedAt = performance.now();

  // Pakai setTimeout (bukan requestAnimationFrame): rAF bisa berhenti saat tab
  // hidden / window minimized sehingga volume bisa tersangkut di 0.
  const step = () => {
    const t = Math.min(1, (performance.now() - startedAt) / 1400);
    bgmEl.volume = BGM_VOLUME * t;
    if (t < 1) {
      setTimeout(step, 80);
    } else {
      bgmEl.volume = BGM_VOLUME;
      bgmIsFading = false;
      bgmHasFadedIn = true;
    }
  };
  setTimeout(step, 80);

  // Safety net: kalau fade tidak selesai dalam 3 detik, paksa volume target
  setTimeout(() => {
    if (!bgmEl || bgmEl.paused || bgmEl.volume >= BGM_VOLUME) return;
    bgmEl.volume = BGM_VOLUME;
    bgmIsFading = false;
    bgmHasFadedIn = true;
  }, 3000);
}

// Idempoten: aman dipanggil berulang dari banyak gesture/event.
function startBGM() {
  if (!bgmEl) return;
  bgmWanted = true;

  if (!bgmEl.paused) {
    fadeInBGM();
    return;
  }

  if (!bgmHasFadedIn) {
    bgmEl.volume = 0; // hindari pop keras sebelum fade in
  }

  let playPromise;
  try {
    playPromise = bgmEl.play();
  } catch (_) {
    return;
  }
  if (playPromise !== undefined && typeof playPromise.then === "function") {
    playPromise.then(fadeInBGM).catch(() => {});
  }
}

// Mulai kembali saat media sudah siap (Firefox sering butuh data dulu baru play)
if (bgmEl) {
  bgmEl.addEventListener("playing", fadeInBGM);
  bgmEl.addEventListener("loadeddata", () => {
    if (bgmWanted && bgmEl.paused) startBGM();
  });
  bgmEl.addEventListener("canplay", () => {
    if (bgmWanted && bgmEl.paused) startBGM();
  });
  bgmEl.addEventListener("error", () => {
    console.warn("[BGM] Gagal memuat music/ost.mp3");
  });
}

// Retry ringan sampai musik benar-benar berjalan (menangani promise pending)
const bgmRetryHandle = setInterval(() => {
  if (!bgmEl) {
    clearInterval(bgmRetryHandle);
    return;
  }
  if (!bgmWanted || document.hidden || !bgmEl.paused) return;
  startBGM();
}, 1500);
setTimeout(() => clearInterval(bgmRetryHandle), 120000);

// Jeda backsound saat tab disembunyikan, lanjutkan saat kembali
document.addEventListener("visibilitychange", () => {
  if (!bgmEl || !bgmWanted) return;
  if (document.hidden) {
    bgmEl.pause();
  } else if (bgmEl.paused) {
    startBGM();
  }
});

// Gesture sinkron (tanpa await) — jalankan BGM duluan sebelum unlock Web Audio
function unlockBGMOnGesture() {
  if (isStarted) startBGM();
}
["pointerdown", "mousedown", "touchstart", "touchend", "click", "keydown", "focus"].forEach((evt) => {
  window.addEventListener(evt, unlockBGMOnGesture, { capture: true, passive: true });
});

// Early Audio Unlocker on First User Gesture
async function unlockAudioEngine() {
  if (isStarted) {
    startBGM();
  }

  const ctx = getAudioContext();
  if (ctx) {
    if (ctx.state !== "running") {
      try { await ctx.resume(); } catch (_) {}
    }
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (_) {}
  }

  if (isStarted && !hasMenuUtamaSFXPlayed) {
    if (Date.now() - experienceEntryTime < 2500) {
      playMenuUtamaSFX();
    } else {
      hasMenuUtamaSFXPlayed = true;
    }
  }
}

["pointerdown", "mousedown", "touchstart", "touchend", "click", "keydown", "focus"].forEach((evt) => {
  window.addEventListener(evt, unlockAudioEngine, { capture: true, passive: true });
});

// --------------------------------------------------------------------------
// 4. Main Menu SVG Dynamic Mask Inversion Engine
// --------------------------------------------------------------------------
const selectorPath = "M 24.853754, 93.31573 135.14625, 49.684266 114.14751, 97.331142 Z";
const selectorBackgroundPath = "M 12.7428765,95.50088 144.25712,47.499123 116.75625,95.465764 Z";

let cachedOptionItems = [];

function renderOptions() {
  optionsList.innerHTML = "";
  cachedOptionItems = [];

  options.forEach((opt, index) => {
    const colorClass = colors[(index + 2) % colors.length];
    const cleanName = opt.name.replace(/ /g, "");
    const bannerScaleFactorX = opt.bannerScaleX || 1.0;
    const bannerScaleY = opt.bannerScaleY || 3.2;
    const scaleX = (cleanName.length * 0.52 + 1.6) * bannerScaleFactorX;
    const selectorTransform = `translate(-60, -9) rotate(8, 0, 100) scale(${scaleX}, ${bannerScaleY})`;
    const maskId = `selector-mask-${index}`;

    const item = document.createElement("div");
    item.className = `option-item ${index === 0 ? "selected" : ""}`;
    item.id = `option-item-${index}`;
    item.style.zIndex = index === 0 ? 15 : opt.zIndex;

    item.innerHTML = `
      <button 
        class="option-hitbox" 
        data-index="${index}" 
        aria-label="${opt.name}">
      </button>

      <svg
        width="950"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
        class="option-svg"
        style="transform: translate(${opt.offsetX}px, ${opt.offsetY}px) rotate(${opt.rotation}deg);"
      >
        <defs>
          <mask
            id="${maskId}"
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="950"
            height="200"
          >
            <rect width="100%" height="100%" fill="black" />
            <g transform="${selectorTransform}" transform-origin="left center">
              <path fill="white" d="${selectorPath}" />
              <path class="pulse-anim" transform-origin="52 100" fill="white" d="${selectorBackgroundPath}" />
            </g>
          </mask>
        </defs>

        <!-- Selector banner when selected -->
        <g class="selector-group" transform="${selectorTransform}" transform-origin="left center">
          <path class="fill-pink pulse-anim" transform-origin="52 100" d="${selectorBackgroundPath}" />
          <path class="fill-fg" d="${selectorPath}" />
        </g>

        <!-- Base Text -->
        <text
          x="150"
          y="122"
          class="option-text base-text ${colorClass}"
          style="font-size: ${opt.fontSize || '4.8rem'};"
        >
          ${opt.name}
        </text>

        <!-- Masked Red Text (Over the white selector) -->
        <g class="masked-red-group" mask="url(#${maskId})">
          <text
            x="150"
            y="122"
            class="option-text fill-red"
            style="font-size: ${opt.fontSize || '4.8rem'};"
          >
            ${opt.name}
          </text>
        </g>
      </svg>
    `;

    // Interactive event triggers
    const hitbox = item.querySelector(".option-hitbox");
    hitbox.addEventListener("mouseenter", () => {
      if (selectedIndex !== index) {
        setIndex(index);
      }
    });

    hitbox.addEventListener("click", (e) => {
      setIndex(index);
      handleOptionConfirm(index, e);
    });

    optionsList.appendChild(item);
    cachedOptionItems.push(item);
  });
}

function setIndex(index) {
  if (index === selectedIndex && cachedOptionItems.length > 0) return;
  selectedIndex = index;

  playSFX();

  if (sideNumber) {
    sideNumber.textContent = (selectedIndex + 1).toString().padStart(2, "0");
  }

  // Speculatively preload the selected subpage's video just in time
  if (index === 0 && slinkBgVideo && slinkBgVideo.preload !== "auto") slinkBgVideo.preload = "auto";
  else if (index === 1 && storeBgVideo && storeBgVideo.preload !== "auto") storeBgVideo.preload = "auto";
  else if (index === 2 && minigameBgVideo && minigameBgVideo.preload !== "auto") minigameBgVideo.preload = "auto";
  else if (index === 3 && educationBgVideo && educationBgVideo.preload !== "auto") educationBgVideo.preload = "auto";
  else if (index === 4 && organizationBgVideo && organizationBgVideo.preload !== "auto") organizationBgVideo.preload = "auto";
  else if (index === 5 && skillBgVideo && skillBgVideo.preload !== "auto") skillBgVideo.preload = "auto";
  else if (index === 6 && gearBgVideo && gearBgVideo.preload !== "auto") gearBgVideo.preload = "auto";
  else if (index === 7 && aboutBgVideo && aboutBgVideo.preload !== "auto") aboutBgVideo.preload = "auto";
  else if (index === 8 && contactBgVideo && contactBgVideo.preload !== "auto") contactBgVideo.preload = "auto";

  for (let idx = 0; idx < cachedOptionItems.length; idx++) {
    const item = cachedOptionItems[idx];
    if (idx === selectedIndex) {
      item.classList.add("selected");
      item.style.zIndex = 15;
    } else {
      item.classList.remove("selected");
      item.style.zIndex = options[idx].zIndex;
    }
  }
}

// --------------------------------------------------------------------------
// 5. Wavy Ripple Geometric Math & Screen Transition Engine
// --------------------------------------------------------------------------
function generateWavyPolygon(
  cx, 
  cy, 
  r, 
  numPoints = 72, 
  waves1 = 7, 
  amp1 = 0.085, 
  waves2 = 14, 
  amp2 = 0.035, 
  phase = 0.0, 
  scaleX = 1.25, 
  scaleY = 1.05
) {
  if (r <= 0.5) {
    const pt = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
    return `polygon(${new Array(numPoints).fill(pt).join(", ")})`;
  }
  const points = [];
  const step = (2 * Math.PI) / numPoints;
  for (let i = 0; i < numPoints; i++) {
    const theta = i * step;
    const wave = 1.0 + amp1 * Math.sin(waves1 * theta + phase) + amp2 * Math.cos(waves2 * theta + phase * 1.6);
    const px = cx + r * wave * Math.cos(theta) * scaleX;
    const py = cy + r * wave * Math.sin(theta) * scaleY;
    points.push(`${px.toFixed(1)}px ${py.toFixed(1)}px`);
  }
  return `polygon(${points.join(", ")})`;
}

function calculateTargetRadius(origin) {
  const maxDist = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y)
  );
  return Math.ceil(maxDist * 1.85);
}

// Universal Origin Locators
function getOptionCenter(optionIndex, clickEvent, fallbackXRatio = 0.56, fallbackYRatio = 0.48) {
  if (clickEvent && typeof clickEvent.clientX === "number" && (clickEvent.clientX > 0 || clickEvent.clientY > 0)) {
    return { x: clickEvent.clientX, y: clickEvent.clientY };
  }

  const optionItem = document.getElementById(`option-item-${optionIndex}`) || document.querySelectorAll(".option-item")[optionIndex];
  if (optionItem) {
    const textEls = optionItem.querySelectorAll(".option-text");
    for (let i = 0; i < textEls.length; i++) {
      const tr = textEls[i].getBoundingClientRect();
      if (tr.width > 0 && tr.height > 0) {
        return {
          x: tr.left + tr.width * 0.5,
          y: tr.top + tr.height * 0.5
        };
      }
    }
    const ir = optionItem.getBoundingClientRect();
    if (ir.width > 0 && ir.height > 0) {
      return {
        x: ir.left + ir.width * 0.45,
        y: ir.top + ir.height * 0.5
      };
    }
  }

  return {
    x: window.innerWidth * fallbackXRatio,
    y: window.innerHeight * fallbackYRatio
  };
}

function getExitOrigin(buttonElOrId, fallbackX, fallbackY) {
  const btn = typeof buttonElOrId === "string" ? document.getElementById(buttonElOrId) : buttonElOrId;
  if (btn) {
    const r = btn.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      return {
        x: r.left + r.width * 0.5,
        y: r.top + r.height * 0.5
      };
    }
  }
  return {
    x: fallbackX !== undefined ? fallbackX : window.innerWidth - 120,
    y: fallbackY !== undefined ? fallbackY : window.innerHeight - 55
  };
}

// Named Aliases for Backward Compatibility & Direct Script Control (Updated for menu layout)
// Menu order: 0 PROJECT · 1 STORE · 2 MINI GAMES · 3 EDUCATION · 4 ORGANIZATION · 5 SKILLS · 6 GEAR · 7 ABOUT · 8 CONTACT
const getProjectOptionCenter     = (evt) => getOptionCenter(0, evt, 0.62, 0.32);
const getStoreOptionCenter       = (evt) => getOptionCenter(1, evt, 0.61, 0.37);
const getMiniGameOptionCenter    = (evt) => getOptionCenter(2, evt, 0.61, 0.42);
const getEducationOptionCenter   = (evt) => getOptionCenter(3, evt, 0.61, 0.47);
const getOrganizationOptionCenter = (evt) => getOptionCenter(4, evt, 0.60, 0.52);
const getSkillOptionCenter       = (evt) => getOptionCenter(5, evt, 0.60, 0.57);
const getGearOptionCenter        = (evt) => getOptionCenter(6, evt, 0.59, 0.62);
const getAboutOptionCenter       = (evt) => getOptionCenter(7, evt, 0.58, 0.68);
const getContactOptionCenter     = (evt) => getOptionCenter(8, evt, 0.57, 0.73);

const getProjectExitOrigin     = () => getExitOrigin(slinkBackBtn, window.innerWidth - 120, window.innerHeight - 55);
const getStoreExitOrigin       = () => getExitOrigin(storeBackBtn, window.innerWidth - 120, window.innerHeight - 55);
const getMiniGameExitOrigin    = () => getExitOrigin(minigameBackBtn, window.innerWidth - 120, window.innerHeight - 55);
const getEducationExitOrigin   = () => getExitOrigin(educationBackBtn, window.innerWidth - 120, window.innerHeight - 55);
const getOrganizationExitOrigin = () => getExitOrigin(organizationBackBtn, window.innerWidth - 120, window.innerHeight - 55);
const getSkillExitOrigin       = () => getExitOrigin(skillBackBtn, window.innerWidth - 120, window.innerHeight - 55);
const getGearExitOrigin        = () => getExitOrigin(gearBackBtn, window.innerWidth - 120, window.innerHeight - 55);
const getAboutExitOrigin       = () => getExitOrigin(aboutBackBtn, window.innerWidth - 120, window.innerHeight - 55);
const getContactExitOrigin     = () => getExitOrigin(contactBackBtn, 80, window.innerHeight - 60);

// Unified WAAPI Ripple Reveal & Close Transitions
function executeWavyReveal({
  pageEl,
  origin,
  bodyClass,
  videoEl,
  videoStartAt = 0,
  onStart,
  onComplete,
  duration = 520,
  easing = "cubic-bezier(0.2, 1, 0.35, 1)"
}) {
  if (!pageEl) {
    if (bodyClass) document.body.classList.add(bodyClass);
    if (onComplete) onComplete();
    return;
  }

  isWavyTransitionRunning = true;
  if (onStart) onStart();

  const targetRadius = calculateTargetRadius(origin);

  pageEl.classList.remove("active");
  pageEl.classList.add("circle-transitioning");
  pageEl.setAttribute("aria-hidden", "false");

  // Pause main menu background video while subpage is displayed to eliminate dual-video GPU decode load
  if (bgVideoLoop && !bgVideoLoop.paused) {
    bgVideoLoop.pause();
  }

  if (videoEl) {
    videoEl.currentTime = videoStartAt;
    videoEl.muted = true;
    videoEl.play().catch(() => {});
  }

  const anim = pageEl.animate([
    { 
      clipPath: generateWavyPolygon(origin.x, origin.y, 0, 72, 7, 0.085, 14, 0.035, 0.0, 1.25, 1.05) 
    },
    { 
      clipPath: generateWavyPolygon(origin.x + 22, origin.y - 12, targetRadius * 0.45, 72, 7, 0.09, 14, 0.035, 1.2, 1.25, 1.05),
      offset: 0.38
    },
    { 
      clipPath: generateWavyPolygon(origin.x + 10, origin.y - 5, targetRadius * 0.85, 72, 7, 0.075, 14, 0.025, 2.2, 1.20, 1.05),
      offset: 0.70
    },
    { 
      clipPath: generateWavyPolygon(origin.x, origin.y, targetRadius, 72, 7, 0.05, 14, 0.015, 3.4, 1.15, 1.02) 
    }
  ], {
    duration,
    easing,
    fill: "forwards"
  });

  anim.onfinish = () => {
    pageEl.classList.remove("circle-transitioning");
    pageEl.classList.add("active");
    pageEl.style.clipPath = "";
    if (bodyClass) document.body.classList.add(bodyClass);
    try { anim.cancel(); } catch (_) {}
    isWavyTransitionRunning = false;
    if (onComplete) onComplete();
  };
}

function executeWavyClose({
  pageEl,
  exitOrigin,
  bodyClass,
  videoEl,
  onComplete,
  duration = 480,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)"
}) {
  playCloseMenuSFX();

  if (!pageEl) {
    if (bodyClass) document.body.classList.remove(bodyClass);
    isWavyTransitionRunning = false;
    return;
  }

  isWavyTransitionRunning = true;
  const targetRadius = calculateTargetRadius(exitOrigin);

  if (bodyClass) document.body.classList.remove(bodyClass);

  pageEl.classList.remove("active");
  pageEl.classList.add("circle-transitioning");

  const anim = pageEl.animate([
    { 
      clipPath: generateWavyPolygon(exitOrigin.x, exitOrigin.y, targetRadius, 72, 9, 0.07, 18, 0.025, 0.0, 1.15, 1.25) 
    },
    { 
      clipPath: generateWavyPolygon(exitOrigin.x - 20, exitOrigin.y - 12, targetRadius * 0.80, 72, 9, 0.08, 18, 0.03, 1.0, 1.15, 1.25),
      offset: 0.32
    },
    { 
      clipPath: generateWavyPolygon(exitOrigin.x - 28, exitOrigin.y - 18, targetRadius * 0.42, 72, 9, 0.085, 18, 0.03, 2.0, 1.15, 1.25),
      offset: 0.65
    },
    { 
      clipPath: generateWavyPolygon(exitOrigin.x, exitOrigin.y, 0, 72, 9, 0.08, 18, 0.025, 3.0, 1.15, 1.25) 
    }
  ], {
    duration,
    easing,
    fill: "forwards"
  });

  anim.onfinish = () => {
    pageEl.classList.remove("circle-transitioning", "active");
    pageEl.style.clipPath = "";
    pageEl.setAttribute("aria-hidden", "true");
    if (videoEl) videoEl.pause();
    // Resume main menu loop video seamlessly
    if (bgVideoLoop && bgVideoLoop.paused) {
      bgVideoLoop.play().catch(() => {});
    }
    try { anim.cancel(); } catch (_) {}
    isWavyTransitionRunning = false;
    if (onComplete) onComplete();
  };
}

// --------------------------------------------------------------------------
// 6. Subpage: PROJECT (S.Link Cards Stack)
// --------------------------------------------------------------------------
function triggerProjectTitleAnimation() {
  const projectDiv = document.getElementById("slink-project-div");
  if (projectDiv) {
    projectDiv.classList.remove("animating");
    void projectDiv.offsetWidth;
    projectDiv.classList.add("animating");
  }
}

function renderSlinkCards() {
  if (!slinkCardsContainer) return;
  slinkCardsContainer.innerHTML = "";

  slinkData.forEach((item, idx) => {
    const card = document.createElement("button");
    const isActive = idx === selectedSlinkIndex;
    card.className = `slink-card ${isActive ? "active" : ""}`;
    card.id = `slink-card-${idx}`;
    card.setAttribute("role", "tab");
    card.setAttribute("aria-selected", isActive ? "true" : "false");
    card.style.setProperty("--card-idx", idx);

    card.innerHTML = `
      <div class="card-unified-row">
        <!-- Solid Sharp Box for Roman Numeral -->
        <div class="card-numeral-box">
          <span class="card-numeral-text">${item.numeral}</span>
        </div>

        <!-- Unified Main Body: Title & Caption Together -->
        <div class="card-main-body">
          <div class="card-title-text">${item.title}</div>
          <div class="card-subtitle-text">${item.subtitle}</div>
          <div class="card-red-accent" aria-hidden="true"></div>
        </div>
      </div>
    `;

    card.addEventListener("mouseenter", () => {
      if (isProjectPageOpen && !isWavyTransitionRunning && selectedSlinkIndex !== idx) {
        selectSlinkCard(idx);
      }
    });

    card.addEventListener("click", () => {
      if (isProjectPageOpen && !isWavyTransitionRunning) {
        if (selectedSlinkIndex !== idx) {
          selectSlinkCard(idx);
        } else {
          confirmSlinkSelection();
        }
      }
    });

    slinkCardsContainer.appendChild(card);
  });
}

function selectSlinkCard(index) {
  selectedSlinkIndex = index;
  const cards = slinkCardsContainer ? slinkCardsContainer.querySelectorAll(".slink-card") : [];
  cards.forEach((c, idx) => {
    if (idx === selectedSlinkIndex) {
      c.classList.add("active");
      c.setAttribute("aria-selected", "true");
      if (typeof c.scrollIntoView === "function") {
        c.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    } else {
      c.classList.remove("active");
      c.setAttribute("aria-selected", "false");
    }
  });
  playSFX();
}

function confirmSlinkSelection() {
  const item = slinkData[selectedSlinkIndex];
  if (item && item.url && item.url !== "#") {
    playSFX();
    setTimeout(() => {
      window.location.href = item.url;
    }, 200);
  } else {
    playSFX();
  }
}

function openProjectPage(clickEvent) {
  if (isProjectPageOpen || isWavyTransitionRunning) return;
  isProjectPageOpen = true;
  selectedSlinkIndex = 0;
  playSFX();

  executeWavyReveal({
    pageEl: projectPage,
    origin: getProjectOptionCenter(clickEvent),
    bodyClass: "project-screen-active",
    videoEl: slinkBgVideo,
    onStart: () => {
      renderSlinkCards();
      selectSlinkCard(0);
      triggerProjectTitleAnimation();
    }
  });
}

function closeProjectPage() {
  if (!isProjectPageOpen || isWavyTransitionRunning) return;
  isProjectPageOpen = false;

  executeWavyClose({
    pageEl: projectPage,
    exitOrigin: getProjectExitOrigin(),
    bodyClass: "project-screen-active",
    videoEl: slinkBgVideo
  });
}

const playWavyCircleTransition = (clickEvent, onComplete) => {
  openProjectPage(clickEvent);
  if (onComplete) setTimeout(onComplete, 850);
};

// --------------------------------------------------------------------------
// 6.5 Subpage: EDUCATION (Riwayat Pendidikan - Social Link Card Stack)
// --------------------------------------------------------------------------
function triggerEducationTitleAnimation() {
  const educationDiv = document.getElementById("education-header-div");
  if (educationDiv) {
    educationDiv.classList.remove("animating");
    void educationDiv.offsetWidth;
    educationDiv.classList.add("animating");
  }
}

function renderEducationCards() {
  if (!educationCardsContainer) return;
  educationCardsContainer.innerHTML = "";

  educationData.forEach((item, idx) => {
    const card = document.createElement("button");
    const isActive = idx === selectedEducationIndex;
    card.className = `slink-card ${isActive ? "active" : ""}`;
    card.id = `education-card-${idx}`;
    card.setAttribute("role", "tab");
    card.setAttribute("aria-selected", isActive ? "true" : "false");
    card.style.setProperty("--card-idx", idx);

    card.innerHTML = `
      <div class="card-unified-row">
        <div class="card-numeral-box">
          <span class="card-numeral-text">${item.numeral}</span>
        </div>

        <div class="card-main-body">
          <div class="card-title-text">${item.title}</div>
          <div class="card-subtitle-text">${item.subtitle}</div>
          <div class="card-red-accent" aria-hidden="true"></div>
        </div>
      </div>
    `;

    card.addEventListener("mouseenter", () => {
      if (isEducationPageOpen && !isWavyTransitionRunning && selectedEducationIndex !== idx) {
        selectEducationCard(idx);
      }
    });

    card.addEventListener("click", () => {
      if (isEducationPageOpen && !isWavyTransitionRunning) {
        if (selectedEducationIndex !== idx) {
          selectEducationCard(idx);
        } else {
          confirmEducationSelection();
        }
      }
    });

    educationCardsContainer.appendChild(card);
  });
}

function selectEducationCard(index) {
  selectedEducationIndex = index;
  const cards = educationCardsContainer ? educationCardsContainer.querySelectorAll(".slink-card") : [];
  cards.forEach((c, idx) => {
    if (idx === selectedEducationIndex) {
      c.classList.add("active");
      c.setAttribute("aria-selected", "true");
      if (typeof c.scrollIntoView === "function") {
        c.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    } else {
      c.classList.remove("active");
      c.setAttribute("aria-selected", "false");
    }
  });
  playSFX();
}

function confirmEducationSelection() {
  const item = educationData[selectedEducationIndex];
  if (item && item.url && item.url !== "#") {
    playSFX();
    setTimeout(() => {
      window.location.href = item.url;
    }, 200);
  } else {
    playSFX();
  }
}

function openEducationPage(clickEvent) {
  if (isEducationPageOpen || isWavyTransitionRunning) return;
  isEducationPageOpen = true;
  selectedEducationIndex = 0;
  playSFX();

  executeWavyReveal({
    pageEl: educationPage,
    origin: getEducationOptionCenter(clickEvent),
    bodyClass: "education-screen-active",
    videoEl: educationBgVideo,
    onStart: () => {
      renderEducationCards();
      selectEducationCard(0);
      triggerEducationTitleAnimation();
    }
  });
}

function closeEducationPage() {
  if (!isEducationPageOpen || isWavyTransitionRunning) return;
  isEducationPageOpen = false;

  executeWavyClose({
    pageEl: educationPage,
    exitOrigin: getEducationExitOrigin(),
    bodyClass: "education-screen-active",
    videoEl: educationBgVideo
  });
}

// --------------------------------------------------------------------------
// 6.5.1 Subpage: ORGANIZATION (Organisasi & Social Link - Card Stack)
// --------------------------------------------------------------------------
function triggerOrganizationTitleAnimation() {
  const organizationDiv = document.getElementById("organization-header-div");
  if (organizationDiv) {
    organizationDiv.classList.remove("animating");
    void organizationDiv.offsetWidth;
    organizationDiv.classList.add("animating");
  }
}

function renderOrganizationCards() {
  if (!organizationCardsContainer) return;
  organizationCardsContainer.innerHTML = "";

  organizationData.forEach((item, idx) => {
    const card = document.createElement("button");
    const isActive = idx === selectedOrganizationIndex;
    card.className = `slink-card ${isActive ? "active" : ""}`;
    card.id = `organization-card-${idx}`;
    card.setAttribute("role", "tab");
    card.setAttribute("aria-selected", isActive ? "true" : "false");
    card.style.setProperty("--card-idx", idx);

    card.innerHTML = `
      <div class="card-unified-row">
        <div class="card-numeral-box">
          <span class="card-numeral-text">${item.numeral}</span>
        </div>

        <div class="card-main-body">
          <div class="card-title-text">${item.title}</div>
          <div class="card-subtitle-text">${item.subtitle}</div>
          <div class="card-red-accent" aria-hidden="true"></div>
        </div>
      </div>
    `;

    card.addEventListener("mouseenter", () => {
      if (isOrganizationPageOpen && !isWavyTransitionRunning && selectedOrganizationIndex !== idx) {
        selectOrganizationCard(idx);
      }
    });

    card.addEventListener("click", () => {
      if (isOrganizationPageOpen && !isWavyTransitionRunning) {
        if (selectedOrganizationIndex !== idx) {
          selectOrganizationCard(idx);
        } else {
          confirmOrganizationSelection();
        }
      }
    });

    organizationCardsContainer.appendChild(card);
  });
}

function selectOrganizationCard(index) {
  selectedOrganizationIndex = index;
  const cards = organizationCardsContainer ? organizationCardsContainer.querySelectorAll(".slink-card") : [];
  cards.forEach((c, idx) => {
    if (idx === selectedOrganizationIndex) {
      c.classList.add("active");
      c.setAttribute("aria-selected", "true");
      if (typeof c.scrollIntoView === "function") {
        c.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    } else {
      c.classList.remove("active");
      c.setAttribute("aria-selected", "false");
    }
  });
  playSFX();
}

function confirmOrganizationSelection() {
  const item = organizationData[selectedOrganizationIndex];
  if (item && item.url && item.url !== "#") {
    playSFX();
    setTimeout(() => {
      window.location.href = item.url;
    }, 200);
  } else {
    playSFX();
  }
}

function openOrganizationPage(clickEvent) {
  if (isOrganizationPageOpen || isWavyTransitionRunning) return;
  isOrganizationPageOpen = true;
  selectedOrganizationIndex = 0;
  playSFX();

  executeWavyReveal({
    pageEl: organizationPage,
    origin: getOrganizationOptionCenter(clickEvent),
    bodyClass: "organization-screen-active",
    videoEl: organizationBgVideo,
    // bg-intro.mp4 opens on a white frame; start past it for a clean reveal
    videoStartAt: 2,
    onStart: () => {
      renderOrganizationCards();
      selectOrganizationCard(0);
      triggerOrganizationTitleAnimation();
    }
  });
}

function closeOrganizationPage() {
  if (!isOrganizationPageOpen || isWavyTransitionRunning) return;
  isOrganizationPageOpen = false;

  executeWavyClose({
    pageEl: organizationPage,
    exitOrigin: getOrganizationExitOrigin(),
    bodyClass: "organization-screen-active",
    videoEl: organizationBgVideo
  });
}

// --------------------------------------------------------------------------
// 6.6 Subpage: GEAR (Perangkat Kerja Harian - Social Link Card Stack)
// --------------------------------------------------------------------------
function triggerGearTitleAnimation() {
  const gearDiv = document.getElementById("gear-header-div");
  if (gearDiv) {
    gearDiv.classList.remove("animating");
    void gearDiv.offsetWidth;
    gearDiv.classList.add("animating");
  }
}

function renderGearCards() {
  if (!gearCardsContainer) return;
  gearCardsContainer.innerHTML = "";

  gearData.forEach((item, idx) => {
    const card = document.createElement("button");
    const isActive = idx === selectedGearIndex;
    card.className = `slink-card ${isActive ? "active" : ""}`;
    card.id = `gear-card-${idx}`;
    card.setAttribute("role", "tab");
    card.setAttribute("aria-selected", isActive ? "true" : "false");
    card.style.setProperty("--card-idx", idx);

    card.innerHTML = `
      <div class="card-unified-row">
        <div class="card-numeral-box">
          <span class="card-numeral-text">${item.numeral}</span>
        </div>

        <div class="card-main-body">
          <div class="card-title-text">${item.title}</div>
          <div class="card-subtitle-text">${item.subtitle}</div>
          <div class="card-red-accent" aria-hidden="true"></div>
        </div>
      </div>
    `;

    card.addEventListener("mouseenter", () => {
      if (isGearPageOpen && !isWavyTransitionRunning && selectedGearIndex !== idx) {
        selectGearCard(idx);
      }
    });

    card.addEventListener("click", () => {
      if (isGearPageOpen && !isWavyTransitionRunning) {
        if (selectedGearIndex !== idx) {
          selectGearCard(idx);
        } else {
          confirmGearSelection();
        }
      }
    });

    gearCardsContainer.appendChild(card);
  });
}

function selectGearCard(index) {
  selectedGearIndex = index;
  const cards = gearCardsContainer ? gearCardsContainer.querySelectorAll(".slink-card") : [];
  cards.forEach((c, idx) => {
    if (idx === selectedGearIndex) {
      c.classList.add("active");
      c.setAttribute("aria-selected", "true");
      if (typeof c.scrollIntoView === "function") {
        c.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    } else {
      c.classList.remove("active");
      c.setAttribute("aria-selected", "false");
    }
  });
  playSFX();
}

function confirmGearSelection() {
  const item = gearData[selectedGearIndex];
  if (item && item.url && item.url !== "#") {
    playSFX();
    setTimeout(() => {
      window.location.href = item.url;
    }, 200);
  } else {
    playSFX();
  }
}

function openGearPage(clickEvent) {
  if (isGearPageOpen || isWavyTransitionRunning) return;
  isGearPageOpen = true;
  selectedGearIndex = 0;
  playSFX();

  executeWavyReveal({
    pageEl: gearPage,
    origin: getGearOptionCenter(clickEvent),
    bodyClass: "gear-screen-active",
    videoEl: gearBgVideo,
    onStart: () => {
      renderGearCards();
      selectGearCard(0);
      triggerGearTitleAnimation();
    }
  });
}

function closeGearPage() {
  if (!isGearPageOpen || isWavyTransitionRunning) return;
  isGearPageOpen = false;

  executeWavyClose({
    pageEl: gearPage,
    exitOrigin: getGearExitOrigin(),
    bodyClass: "gear-screen-active",
    videoEl: gearBgVideo
  });
}

// --------------------------------------------------------------------------
// 7. Subpage: SKILLS (Stats & Abilities Interface)
// --------------------------------------------------------------------------
function triggerSkillTitleAnimation() {
  if (skillHeaderDiv) {
    skillHeaderDiv.classList.remove("animating");
    void skillHeaderDiv.offsetWidth;
    skillHeaderDiv.classList.add("animating");
  }
}

function renderSkillsTabs() {
  if (!skillTabsNav) return;
  skillTabsNav.innerHTML = "";

  skillTabsList.forEach((tab) => {
    const btn = document.createElement("button");
    const isActive = (tab.id === currentSkillTab);
    btn.className = `p3r-skill-tab ${isActive ? "active" : ""}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
    btn.innerHTML = `
      <span class="p3r-tab-tag">${tab.code}</span>
      <span class="p3r-tab-label">${tab.label}</span>
    `;

    btn.addEventListener("click", () => {
      if (currentSkillTab !== tab.id) {
        setSkillTab(tab.id);
      }
    });

    skillTabsNav.appendChild(btn);
  });
}

function setSkillTab(tabId) {
  currentSkillTab = tabId;
  playSFX();
  renderSkillsTabs();
  renderSkillStats(currentSkillTab);
}

function prevSkillTab() {
  const currIdx = skillTabsList.findIndex(t => t.id === currentSkillTab);
  const prevIdx = (currIdx - 1 + skillTabsList.length) % skillTabsList.length;
  setSkillTab(skillTabsList[prevIdx].id);
}

function nextSkillTab() {
  const currIdx = skillTabsList.findIndex(t => t.id === currentSkillTab);
  const nextIdx = (currIdx + 1) % skillTabsList.length;
  setSkillTab(skillTabsList[nextIdx].id);
}

function renderSkillStats(category = "frontend") {
  if (!p3rSkillsContainer) return;
  p3rSkillsContainer.innerHTML = "";

  const groupsToDisplay = skillGroupsData.filter(g => g.id === category);

  groupsToDisplay.forEach((group) => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "p3r-skill-group";
    groupDiv.id = `skill-group-${group.id}`;

    let rowsHTML = "";
    group.skills.forEach((skill, idx) => {
      const elem = skill.elem || "almighty";
      const tag = skill.tag || "";
      rowsHTML += `
        <div class="p3r-stat-row" style="animation-delay: ${idx * 0.06}s;">
          <span class="p3r-skill-chip" data-elem="${elem}">
            <span class="p3r-skill-chip-inner">${tag}</span>
          </span>
          <div class="p3r-stat-name-col">
            <span class="p3r-stat-name">${skill.name}</span>
          </div>
          <div class="p3r-stat-bar-track" role="img" aria-label="${skill.name} level ${skill.level} of 100">
            <div class="p3r-stat-bar-fill" data-v="${skill.level}" style="width: ${skill.level}%;">
              <div class="p3r-stat-bar-tip" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      `;
    });

    groupDiv.innerHTML = `
      <div class="p3r-skill-group-header">
        <span class="p3r-group-badge" aria-hidden="true"><span>${group.code}</span></span>
        <h3 class="p3r-group-title">${group.title}</h3>
        <div class="p3r-group-line"></div>
        <span class="p3r-group-persona">PERSONA · <strong>${group.persona}</strong></span>
      </div>
      <div class="p3r-skill-rows-list">
        ${rowsHTML}
      </div>
    `;

    p3rSkillsContainer.appendChild(groupDiv);
  });
}

function openSkillPage(clickEvent) {
  if (isSkillPageOpen || isWavyTransitionRunning) return;
  isSkillPageOpen = true;
  playSFX();

  executeWavyReveal({
    pageEl: skillPage,
    origin: getSkillOptionCenter(clickEvent),
    bodyClass: "skill-screen-active",
    videoEl: skillBgVideo,
    onStart: () => {
      renderSkillsTabs();
      renderSkillStats(currentSkillTab);
      triggerSkillTitleAnimation();
    }
  });
}

function closeSkillPage() {
  if (!isSkillPageOpen || isWavyTransitionRunning) return;
  isSkillPageOpen = false;

  executeWavyClose({
    pageEl: skillPage,
    exitOrigin: getSkillExitOrigin(),
    bodyClass: "skill-screen-active",
    videoEl: skillBgVideo
  });
}

// --------------------------------------------------------------------------
// 7.5. Subpage: STORE (Product Catalogue - 16 sellable digital products)
// --------------------------------------------------------------------------
function triggerStoreTitleAnimation() {
  if (storeHeaderDiv) {
    storeHeaderDiv.classList.remove("animating");
    void storeHeaderDiv.offsetWidth;
    storeHeaderDiv.classList.add("animating");
  }
}

function getStoreProducts(category = "all") {
  if (!category || category === "all") return storeProductsData;
  return storeProductsData.filter((p) => p.cat === category);
}

function renderStoreTabs() {
  if (!storeTabsNav) return;
  storeTabsNav.innerHTML = "";

  storeTabsList.forEach((tab) => {
    const btn = document.createElement("button");
    const isActive = (tab.id === currentStoreTab);
    btn.className = `p3r-skill-tab p3r-store-tab ${isActive ? "active" : ""}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
    btn.innerHTML = `
      <span class="p3r-tab-tag">${tab.code}</span>
      <span class="p3r-tab-label">${tab.label}</span>
    `;

    btn.addEventListener("click", () => {
      if (currentStoreTab !== tab.id) setStoreTab(tab.id);
    });

    storeTabsNav.appendChild(btn);
  });
}

function setStoreTab(tabId) {
  currentStoreTab = tabId;
  selectedStoreIndex = 0;
  playSFX();
  renderStoreTabs();
  renderStoreProducts(currentStoreTab);
}

function prevStoreTab() {
  const currIdx = storeTabsList.findIndex(t => t.id === currentStoreTab);
  const prevIdx = (currIdx - 1 + storeTabsList.length) % storeTabsList.length;
  setStoreTab(storeTabsList[prevIdx].id);
}

function nextStoreTab() {
  const currIdx = storeTabsList.findIndex(t => t.id === currentStoreTab);
  const nextIdx = (currIdx + 1) % storeTabsList.length;
  setStoreTab(storeTabsList[nextIdx].id);
}

function selectStoreCard(index) {
  const cards = storeGrid ? storeGrid.querySelectorAll(".p3r-product-card") : [];
  if (!cards.length) return;

  selectedStoreIndex = Math.max(0, Math.min(index, cards.length - 1));

  cards.forEach((card, idx) => {
    const isActive = idx === selectedStoreIndex;
    card.classList.toggle("active", isActive);
    card.setAttribute("aria-selected", isActive ? "true" : "false");
    if (isActive && typeof card.scrollIntoView === "function") {
      card.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
}

function renderStoreProducts(category = "all") {
  if (!storeGrid) return;

  const list = getStoreProducts(category);
  storeGrid.innerHTML = "";

  if (storeCounter) storeCounter.textContent = list.length.toString().padStart(2, "0");
  if (storeCategoryLabel) storeCategoryLabel.textContent = storeCategoryLabels[category] || storeCategoryLabels.all;

  list.forEach((product, idx) => {
    const card = document.createElement("article");
    card.className = "p3r-product-card";
    card.dataset.cat = product.cat;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-selected", "false");
    card.setAttribute("aria-label", product.name);
    card.style.animationDelay = `${(idx % 8) * 0.05}s`;

    card.innerHTML = `
      <div class="p3r-product-head">
        <span class="p3r-product-num">${product.code}</span>
        <span class="p3r-product-cat">${product.cat.toUpperCase()}</span>
      </div>
      <div class="p3r-product-art" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${product.icon}</svg>
      </div>
      <h3 class="p3r-product-name">${product.name}</h3>
      <p class="p3r-product-desc">${product.desc}</p>
      <div class="p3r-product-cta" aria-hidden="true">
        <span>PESAN CUSTOM</span>
        <span class="p3r-product-arrow">&#8594;</span>
      </div>
    `;

    card.addEventListener("mouseenter", () => {
      if (isStorePageOpen && selectedStoreIndex !== idx) selectStoreCard(idx);
    });
    card.addEventListener("click", () => {
      if (!isStorePageOpen || isWavyTransitionRunning) return;
      selectStoreCard(idx);
      playSFX();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectStoreCard(idx);
        playSFX();
      }
    });

    storeGrid.appendChild(card);
  });

  selectStoreCard(0);
}

function openStorePage(clickEvent) {
  if (isStorePageOpen || isWavyTransitionRunning) return;
  isStorePageOpen = true;
  playSFX();

  executeWavyReveal({
    pageEl: storePage,
    origin: getStoreOptionCenter(clickEvent),
    bodyClass: "store-screen-active",
    videoEl: storeBgVideo,
    onStart: () => {
      renderStoreTabs();
      renderStoreProducts(currentStoreTab);
      triggerStoreTitleAnimation();
    }
  });
}

function closeStorePage() {
  if (!isStorePageOpen || isWavyTransitionRunning) return;
  isStorePageOpen = false;

  executeWavyClose({
    pageEl: storePage,
    exitOrigin: getStoreExitOrigin(),
    bodyClass: "store-screen-active",
    videoEl: storeBgVideo
  });
}

// --------------------------------------------------------------------------
// 7.6. Subpage: MINI GAMES (Three.js 3D Arcade)
// The WebGL scene itself lives in js/minigames.js (ES module, lazily loaded).
// main.js only owns the page shell, the tab strip and the routing.
// --------------------------------------------------------------------------
function callMiniGameAPI(method, ...args) {
  const api = window.MiniGames;
  if (api && typeof api[method] === "function") {
    try {
      return api[method](...args);
    } catch (err) {
      console.warn("[MiniGames] " + method + " failed:", err);
    }
  }
  return undefined;
}

function triggerMiniGameTitleAnimation() {
  if (minigameHeaderDiv) {
    minigameHeaderDiv.classList.remove("animating");
    void minigameHeaderDiv.offsetWidth;
    minigameHeaderDiv.classList.add("animating");
  }
}

function renderMiniGameTabs() {
  if (!minigameTabsNav) return;

  const list = callMiniGameAPI("getGames");
  minigameTabsNav.innerHTML = "";

  if (!list || list.length === 0) {
    minigameTabsNav.innerHTML = '<span class="p3r-minigame-pending">MEMUAT 3D ENGINE&hellip;</span>';
    return;
  }

  list.forEach((game, idx) => {
    const btn = document.createElement("button");
    const isActive = idx === selectedMiniGameIndex;
    btn.className = `p3r-skill-tab p3r-minigame-tab ${isActive ? "active" : ""}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
    btn.innerHTML = `
      <span class="p3r-tab-tag">${game.code}</span>
      <span class="p3r-tab-label">${game.name}</span>
    `;

    btn.addEventListener("click", () => {
      if (selectedMiniGameIndex !== idx) selectMiniGame(idx);
    });

    minigameTabsNav.appendChild(btn);
  });
}

function selectMiniGame(index, silent = false) {
  const list = callMiniGameAPI("getGames") || [];
  const total = list.length || 1;
  selectedMiniGameIndex = ((index % total) + total) % total;

  if (!silent) playSFX();
  renderMiniGameTabs();
  callMiniGameAPI("select", selectedMiniGameIndex);
}

function prevMiniGame() { selectMiniGame(selectedMiniGameIndex - 1); }
function nextMiniGame() { selectMiniGame(selectedMiniGameIndex + 1); }

// Called by js/minigames.js once the ES module finished loading, so the shell
// can hand over its current selection and mount an already-open page.
function syncMiniGameSelection() {
  if (pendingMiniGameId) {
    const list = callMiniGameAPI("getGames") || [];
    const idx = list.findIndex((g) => g.id === pendingMiniGameId);
    if (idx >= 0) {
      selectedMiniGameIndex = idx;
      pendingMiniGameId = null;
    }
  }

  renderMiniGameTabs();
  callMiniGameAPI("select", selectedMiniGameIndex);
  if (isMiniGamePageOpen) callMiniGameAPI("mount");
}

function startMiniGame() {
  const result = callMiniGameAPI("toggle");
  if (result === false) return;
  playSFX();
}

function openMiniGamePage(clickEvent) {
  if (isMiniGamePageOpen || isWavyTransitionRunning) return;
  isMiniGamePageOpen = true;
  playSFX();

  executeWavyReveal({
    pageEl: minigamePage,
    origin: getMiniGameOptionCenter(clickEvent),
    bodyClass: "minigame-screen-active",
    videoEl: minigameBgVideo,
    onStart: () => {
      renderMiniGameTabs();
      triggerMiniGameTitleAnimation();
      callMiniGameAPI("mount");
      callMiniGameAPI("select", selectedMiniGameIndex);
    }
  });
}

function closeMiniGamePage() {
  if (!isMiniGamePageOpen || isWavyTransitionRunning) return;
  isMiniGamePageOpen = false;

  callMiniGameAPI("unmount");

  executeWavyClose({
    pageEl: minigamePage,
    exitOrigin: getMiniGameExitOrigin(),
    bodyClass: "minigame-screen-active",
    videoEl: minigameBgVideo
  });
}

// --------------------------------------------------------------------------
// 8. Subpage: ABOUT (Profile & Philosophy Interface)
// --------------------------------------------------------------------------
function triggerAboutTitleAnimation() {
  if (aboutHeaderDiv) {
    aboutHeaderDiv.classList.remove("animating");
    void aboutHeaderDiv.offsetWidth;
    aboutHeaderDiv.classList.add("animating");
  }
}

function openAboutPage(clickEvent) {
  if (isAboutPageOpen || isWavyTransitionRunning) return;
  isAboutPageOpen = true;
  playSFX();

  executeWavyReveal({
    pageEl: aboutPage,
    origin: getAboutOptionCenter(clickEvent),
    bodyClass: "about-screen-active",
    videoEl: aboutBgVideo,
    onStart: () => {
      triggerAboutTitleAnimation();
    }
  });
}

function closeAboutPage() {
  if (!isAboutPageOpen || isWavyTransitionRunning) return;
  isAboutPageOpen = false;

  executeWavyClose({
    pageEl: aboutPage,
    exitOrigin: getAboutExitOrigin(),
    bodyClass: "about-screen-active",
    videoEl: aboutBgVideo
  });
}

// --------------------------------------------------------------------------
// 9. Subpage: CONTACT (Mail / Phone Messaging UI)
// --------------------------------------------------------------------------
function selectContactRow(index) {
  if (!contactMailRows || contactMailRows.length === 0) return;
  selectedContactIndex = Math.max(0, Math.min(index, contactMailRows.length - 1));
  contactMailRows.forEach((row, i) => {
    if (i === selectedContactIndex) {
      row.classList.add("active");
    } else {
      row.classList.remove("active");
    }
  });
  playSFX();
}

function triggerContactPhoneAnimation() {
  const phoneWrap = document.querySelector(".p3r-mail-phone-wrap");
  if (phoneWrap) {
    phoneWrap.style.animation = "none";
    void phoneWrap.offsetWidth;
    phoneWrap.style.animation = "";
  }
}

function openContactPage(clickEvent) {
  if (isContactPageOpen || isWavyTransitionRunning) return;
  isContactPageOpen = true;
  playSFX();

  executeWavyReveal({
    pageEl: contactPage,
    origin: getContactOptionCenter(clickEvent),
    bodyClass: "contact-screen-active",
    videoEl: contactBgVideo,
    onStart: () => {
      triggerContactPhoneAnimation();
      selectContactRow(0);
    }
  });
}

function closeContactPage() {
  if (!isContactPageOpen || isWavyTransitionRunning) return;
  isContactPageOpen = false;

  executeWavyClose({
    pageEl: contactPage,
    exitOrigin: getContactExitOrigin(),
    bodyClass: "contact-screen-active",
    videoEl: contactBgVideo
  });
}

// --------------------------------------------------------------------------
// 10. Portfolio Modal System (General Fallback for ITEM, EQUIP, SYSTEM)
// --------------------------------------------------------------------------
function getModalExitOrigin() {
  if (modalCloseBtn) {
    const r = modalCloseBtn.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.5 };
    }
  }
  return { x: window.innerWidth * 0.78, y: window.innerHeight * 0.22 };
}

function openModal(index) {
  const opt = options[index];
  modalTag.textContent = opt.tag;
  modalTitle.textContent = opt.name;
  modalSummary.textContent = opt.summary;

  modalCardsContainer.innerHTML = "";
  opt.cards.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "modal-card";
    cardEl.innerHTML = `
      <div class="card-glow"></div>
      <div class="card-title">${card.title}</div>
      <div class="card-desc">${card.desc}</div>
      <div class="card-corner"></div>
    `;
    modalCardsContainer.appendChild(cardEl);
  });

  isModalOpen = true;
  portfolioModal.classList.add("active");
  portfolioModal.setAttribute("aria-hidden", "false");
  playSFX();

  const origin = getOptionCenter(index);
  const targetRadius = calculateTargetRadius(origin);

  const keyframes = [
    { clipPath: generateWavyPolygon(origin.x, origin.y, 0, 100, 6, 0.08, 12, 0.03, 0.0, 1.25, 1.05) },
    { clipPath: generateWavyPolygon(origin.x, origin.y, targetRadius * 0.45, 100, 6, 0.085, 12, 0.03, 1.0, 1.25, 1.05), offset: 0.4 },
    { clipPath: generateWavyPolygon(origin.x, origin.y, targetRadius, 100, 6, 0.05, 12, 0.015, 2.5, 1.15, 1.02) }
  ];

  portfolioModal.animate(keyframes, {
    duration: 650,
    easing: "cubic-bezier(0.2, 1, 0.35, 1)",
    fill: "forwards"
  });
}

function closeModal() {
  if (!isModalOpen) return;
  isModalOpen = false;
  playCloseMenuSFX();

  const exitOrigin = getModalExitOrigin();
  const targetRadius = calculateTargetRadius(exitOrigin);

  const closeAnim = portfolioModal.animate([
    { clipPath: generateWavyPolygon(exitOrigin.x, exitOrigin.y, targetRadius, 100, 8, 0.07, 16, 0.025, 0.0, 1.15, 1.25) },
    { clipPath: generateWavyPolygon(exitOrigin.x, exitOrigin.y, 0, 100, 8, 0.08, 16, 0.02, 2.5, 1.15, 1.25) }
  ], {
    duration: 600,
    easing: "cubic-bezier(0.2, 1, 0.35, 1)",
    fill: "forwards"
  });

  closeAnim.onfinish = () => {
    portfolioModal.classList.remove("active");
    portfolioModal.setAttribute("aria-hidden", "true");
    portfolioModal.style.clipPath = "";
  };
}

// Option Confirmation Dispatcher (Strictly 9 Options: PROJECT, STORE, MINI GAMES, EDUCATION, ORGANIZATION, SKILLS, GEAR, ABOUT, CONTACT)
function handleOptionConfirm(index, clickEvent) {
  if (index === 0) {
    openProjectPage(clickEvent);
  } else if (index === 1) {
    openStorePage(clickEvent);
  } else if (index === 2) {
    openMiniGamePage(clickEvent);
  } else if (index === 3) {
    openEducationPage(clickEvent);
  } else if (index === 4) {
    openOrganizationPage(clickEvent);
  } else if (index === 5) {
    openSkillPage(clickEvent);
  } else if (index === 6) {
    openGearPage(clickEvent);
  } else if (index === 7) {
    openAboutPage(clickEvent);
  } else if (index === 8) {
    openContactPage(clickEvent);
  }
}

// --------------------------------------------------------------------------
// 11. Background Video Flow in Menu Utama (Intro -> Loop Seamless Cut)
// --------------------------------------------------------------------------
let hasSwitchedToLoop = false;

function switchToLoopVideo() {
  if (hasSwitchedToLoop) return;
  hasSwitchedToLoop = true;

  if (bgVideoLoop) {
    if (bgVideoLoop.preload !== "auto") bgVideoLoop.preload = "auto";
    bgVideoLoop.currentTime = 0;
    const playPromise = bgVideoLoop.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (bgVideoIntro) {
            bgVideoIntro.classList.add("fade-out");
            setTimeout(() => {
              bgVideoIntro.pause();
              bgVideoIntro.style.display = "none";
            }, 300);
          }
        })
        .catch((err) => {
          console.warn("Loop video playback notice:", err);
          if (bgVideoIntro) bgVideoIntro.classList.add("fade-out");
        });
    } else {
      if (bgVideoIntro) bgVideoIntro.classList.add("fade-out");
    }
  }
}

if (bgVideoIntro) {
  bgVideoIntro.addEventListener("ended", switchToLoopVideo);
  bgVideoIntro.addEventListener("error", switchToLoopVideo);
  bgVideoIntro.addEventListener("timeupdate", () => {
    if (!hasSwitchedToLoop && bgVideoIntro.duration > 0) {
      if (bgVideoIntro.currentTime >= bgVideoIntro.duration * 0.4) {
        if (bgVideoLoop && bgVideoLoop.preload !== "auto") {
          bgVideoLoop.preload = "auto";
        }
      }
      if (bgVideoIntro.currentTime >= bgVideoIntro.duration - 0.08) {
        switchToLoopVideo();
      }
    }
  });
}

// --------------------------------------------------------------------------
// 12. Loading Screen & Experience Entry Sequence
// --------------------------------------------------------------------------
let currentProgress = 0;
let targetProgress = 15;
let progressTimer = null;

function setProgress(val) {
  targetProgress = Math.min(100, Math.max(targetProgress, Math.round(val)));
}

function updateProgressUI(val) {
  const rounded = Math.min(100, Math.max(0, Math.round(val)));
  if (loadingBar) loadingBar.style.width = `${rounded}%`;
  if (loadingPercent) loadingPercent.textContent = `${rounded}%`;
  if (loadingScreen) loadingScreen.setAttribute("aria-valuenow", rounded);
}

function runProgressTicker() {
  return new Promise((resolve) => {
    function tick() {
      if (currentProgress < targetProgress) {
        const step = Math.max(1, Math.ceil((targetProgress - currentProgress) * 0.35));
        currentProgress = Math.min(targetProgress, currentProgress + step);
        updateProgressUI(currentProgress);
      }

      if (currentProgress >= 100) {
        updateProgressUI(100);
        resolve();
      } else {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  });
}

async function startLoadingSequence() {
  const tickerPromise = runProgressTicker();

  if (bgVideoIntro) {
    bgVideoIntro.muted = true;
    bgVideoIntro.defaultMuted = true;
  }
  if (bgVideoLoop) {
    bgVideoLoop.muted = true;
    bgVideoLoop.defaultMuted = true;
  }

  // Preload audio and fonts with minimal latency
  loadAudioBuffers();
  setProgress(55);

  try {
    if (document.fonts && document.fonts.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((r) => setTimeout(r, 120))
      ]);
    }
  } catch (_) {}

  setProgress(100);
  await tickerPromise;
  updateProgressUI(100);
  isLoaded = true;

  await new Promise((r) => setTimeout(r, 60));

  const ctx = getAudioContext();
  if (ctx && ctx.state !== "running") {
    ctx.resume().catch(() => {});
  }

  enterExperience();
}

function enterExperience() {
  if (isStarted) return;
  isStarted = true;
  experienceEntryTime = Date.now();

  playMenuUtamaSFX();
  startBGM();

  if (loadingScreen) {
    loadingScreen.classList.add("dismissed");
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 450);
  }

  const menuColumn = document.getElementById("menu-column");
  if (menuColumn) menuColumn.classList.add("menu-entered");
  const menuProfileHeader = document.getElementById("menu-profile-header");
  if (menuProfileHeader) menuProfileHeader.classList.add("menu-entered");

  if (bgVideoIntro) {
    if (bgVideoIntro.preload !== "auto") bgVideoIntro.preload = "auto";
    bgVideoIntro.currentTime = 0;
    bgVideoIntro.muted = true;
    const playP = bgVideoIntro.play();
    if (playP !== undefined) {
      playP.catch((err) => {
        console.warn("Intro playback notice:", err);
        switchToLoopVideo();
      });
    }
  }
}

// --------------------------------------------------------------------------
// 13. Event Listeners & Keyboard Navigation
// --------------------------------------------------------------------------
if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
if (modalFooterCloseBtn) modalFooterCloseBtn.addEventListener("click", closeModal);
if (portfolioModal) {
  portfolioModal.addEventListener("click", (e) => {
    if (e.target === portfolioModal) closeModal();
  });
}

if (slinkConfirmBtn) slinkConfirmBtn.addEventListener("click", confirmSlinkSelection);
if (slinkBackBtn) slinkBackBtn.addEventListener("click", closeProjectPage);
if (educationConfirmBtn) educationConfirmBtn.addEventListener("click", confirmEducationSelection);
if (educationBackBtn) educationBackBtn.addEventListener("click", closeEducationPage);
if (organizationConfirmBtn) organizationConfirmBtn.addEventListener("click", confirmOrganizationSelection);
if (organizationBackBtn) organizationBackBtn.addEventListener("click", closeOrganizationPage);
if (gearConfirmBtn) gearConfirmBtn.addEventListener("click", confirmGearSelection);
if (gearBackBtn) gearBackBtn.addEventListener("click", closeGearPage);
if (skillBackBtn) skillBackBtn.addEventListener("click", closeSkillPage);
if (skillTabPrevBtn) skillTabPrevBtn.addEventListener("click", prevSkillTab);
if (skillTabNextBtn) skillTabNextBtn.addEventListener("click", nextSkillTab);
if (storeBackBtn) storeBackBtn.addEventListener("click", closeStorePage);
if (storeTabPrevBtn) storeTabPrevBtn.addEventListener("click", prevStoreTab);
if (storeTabNextBtn) storeTabNextBtn.addEventListener("click", nextStoreTab);
if (minigameBackBtn) minigameBackBtn.addEventListener("click", closeMiniGamePage);
if (minigameTabPrevBtn) minigameTabPrevBtn.addEventListener("click", prevMiniGame);
if (minigameTabNextBtn) minigameTabNextBtn.addEventListener("click", nextMiniGame);
if (minigamePlayBtn) minigamePlayBtn.addEventListener("click", startMiniGame);
if (aboutBackBtn) aboutBackBtn.addEventListener("click", closeAboutPage);
if (contactBackBtn) contactBackBtn.addEventListener("click", closeContactPage);

if (contactMailRows && contactMailRows.length > 0) {
  contactMailRows.forEach((row, idx) => {
    row.addEventListener("mouseenter", () => {
      selectContactRow(idx);
    });
  });
}

// Keyboard Router
document.addEventListener("keydown", (e) => {
  if (!isStarted) {
    if (isLoaded || e.key === "Enter" || e.key === " ") {
      enterExperience();
    }
    return;
  }

  // Active Screen: Project
  if (isProjectPageOpen) {
    if (e.key === "Escape" || e.key.toLowerCase() === "b" || e.key.toLowerCase() === "backspace") {
      e.preventDefault();
      closeProjectPage();
    } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
      e.preventDefault();
      selectSlinkCard((selectedSlinkIndex + 1) % slinkData.length);
    } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
      e.preventDefault();
      selectSlinkCard((selectedSlinkIndex - 1 + slinkData.length) % slinkData.length);
    } else if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "a") {
      e.preventDefault();
      confirmSlinkSelection();
    }
    return;
  }

  // Active Screen: Store (Product Catalogue)
  if (isStorePageOpen) {
    if (e.key === "Escape" || e.key.toLowerCase() === "b" || e.key.toLowerCase() === "backspace") {
      e.preventDefault();
      closeStorePage();
    } else if (e.key.toLowerCase() === "q" || e.key === "ArrowLeft") {
      e.preventDefault();
      prevStoreTab();
    } else if (e.key.toLowerCase() === "e" || e.key === "ArrowRight") {
      e.preventDefault();
      nextStoreTab();
    } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
      e.preventDefault();
      const total = getStoreProducts(currentStoreTab).length;
      if (total > 0) selectStoreCard((selectedStoreIndex + 1) % total);
      playSFX();
    } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
      e.preventDefault();
      const total = getStoreProducts(currentStoreTab).length;
      if (total > 0) selectStoreCard((selectedStoreIndex - 1 + total) % total);
      playSFX();
    } else if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "a") {
      e.preventDefault();
      selectStoreCard(selectedStoreIndex);
      playSFX();
    }
    return;
  }

  // Active Screen: Mini Games (Three.js Arcade)
  if (isMiniGamePageOpen) {
    let handled = false;
    try {
      handled = callMiniGameAPI("handleKey", e) === true;
    } catch (err) {
      handled = false;
    }

    if (!handled && (e.key === "Escape" || e.key.toLowerCase() === "b" || e.key.toLowerCase() === "backspace")) {
      e.preventDefault();
      callMiniGameAPI("stop");
      closeMiniGamePage();
    }
    return;
  }

  // Active Screen: Education
  if (isEducationPageOpen) {
    if (e.key === "Escape" || e.key.toLowerCase() === "b" || e.key.toLowerCase() === "backspace") {
      e.preventDefault();
      closeEducationPage();
    } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
      e.preventDefault();
      selectEducationCard((selectedEducationIndex + 1) % educationData.length);
    } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
      e.preventDefault();
      selectEducationCard((selectedEducationIndex - 1 + educationData.length) % educationData.length);
    } else if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "a") {
      e.preventDefault();
      confirmEducationSelection();
    }
    return;
  }

  // Active Screen: Organization
  if (isOrganizationPageOpen) {
    if (e.key === "Escape" || e.key.toLowerCase() === "b" || e.key.toLowerCase() === "backspace") {
      e.preventDefault();
      closeOrganizationPage();
    } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
      e.preventDefault();
      selectOrganizationCard((selectedOrganizationIndex + 1) % organizationData.length);
    } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
      e.preventDefault();
      selectOrganizationCard((selectedOrganizationIndex - 1 + organizationData.length) % organizationData.length);
    } else if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "a") {
      e.preventDefault();
      confirmOrganizationSelection();
    }
    return;
  }

  // Active Screen: Skill
  if (isSkillPageOpen) {
    if (e.key === "Escape" || e.key.toLowerCase() === "b" || e.key.toLowerCase() === "backspace") {
      e.preventDefault();
      closeSkillPage();
    } else if (e.key.toLowerCase() === "q" || e.key === "ArrowLeft") {
      e.preventDefault();
      prevSkillTab();
    } else if (e.key.toLowerCase() === "e" || e.key === "ArrowRight") {
      e.preventDefault();
      nextSkillTab();
    }
    return;
  }

  // Active Screen: Gear
  if (isGearPageOpen) {
    if (e.key === "Escape" || e.key.toLowerCase() === "b" || e.key.toLowerCase() === "backspace") {
      e.preventDefault();
      closeGearPage();
    } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
      e.preventDefault();
      selectGearCard((selectedGearIndex + 1) % gearData.length);
    } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
      e.preventDefault();
      selectGearCard((selectedGearIndex - 1 + gearData.length) % gearData.length);
    } else if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "a") {
      e.preventDefault();
      confirmGearSelection();
    }
    return;
  }

  // Active Screen: About
  if (isAboutPageOpen) {
    if (e.key === "Escape" || e.key.toLowerCase() === "b" || e.key.toLowerCase() === "backspace") {
      e.preventDefault();
      closeAboutPage();
    }
    return;
  }

  // Active Screen: Contact
  if (isContactPageOpen) {
    if (e.key === "Escape" || e.key.toLowerCase() === "b" || e.key.toLowerCase() === "backspace") {
      e.preventDefault();
      closeContactPage();
    } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
      e.preventDefault();
      selectContactRow((selectedContactIndex + 1) % contactMailRows.length);
    } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
      e.preventDefault();
      selectContactRow((selectedContactIndex - 1 + contactMailRows.length) % contactMailRows.length);
    } else if (e.key === "Enter" || e.key === " ") {
      if (contactMailRows[selectedContactIndex]) {
        contactMailRows[selectedContactIndex].click();
      }
    }
    return;
  }

  // Active Screen: Modal
  if (isModalOpen) {
    if (e.key === "Escape" || e.key.toLowerCase() === "a") {
      closeModal();
    }
    return;
  }

  // Main Menu Navigation
  if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
    e.preventDefault();
    setIndex((selectedIndex + 1) % options.length);
  } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
    e.preventDefault();
    setIndex((selectedIndex - 1 + options.length) % options.length);
  } else if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "b") {
    e.preventDefault();
    handleOptionConfirm(selectedIndex);
  } else if (e.key === "Escape" || e.key.toLowerCase() === "a") {
    playSFX();
  }
});

// --------------------------------------------------------------------------
// 14. Initialization & Window Exports
// --------------------------------------------------------------------------
renderOptions();

const urlParams = new URLSearchParams(window.location.search);
const initialSelect = parseInt(urlParams.get("select"), 10);
if (!isNaN(initialSelect) && initialSelect >= 0 && initialSelect < options.length) {
  setIndex(initialSelect);
} else {
  setIndex(0);
}

// Expose public API for debugging, URL parameters, and automated testing
window.openProjectPage = openProjectPage;
window.closeProjectPage = closeProjectPage;
window.openEducationPage = openEducationPage;
window.closeEducationPage = closeEducationPage;
window.openOrganizationPage = openOrganizationPage;
window.closeOrganizationPage = closeOrganizationPage;
window.openGearPage = openGearPage;
window.closeGearPage = closeGearPage;
window.openSkillPage = openSkillPage;
window.closeSkillPage = closeSkillPage;
window.openStorePage = openStorePage;
window.closeStorePage = closeStorePage;
window.openMiniGamePage = openMiniGamePage;
window.closeMiniGamePage = closeMiniGamePage;
window.renderMiniGameTabs = renderMiniGameTabs;
window.syncMiniGameSelection = syncMiniGameSelection;
window.selectMiniGame = selectMiniGame;
window.openAboutPage = openAboutPage;
window.closeAboutPage = closeAboutPage;
window.openContactPage = openContactPage;
window.closeContactPage = closeContactPage;
window.triggerContactPhoneAnimation = triggerContactPhoneAnimation;
window.playWavyCircleTransition = playWavyCircleTransition;

// URL Navigation Shortcuts & Responsive Init
if (window.innerWidth < 1024) {
  // Mobile / Small screen mode: cleanly dismiss loading HUD and exit immediately
  if (loadingScreen) loadingScreen.style.display = "none";
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && !isStarted) {
      loadAudioBuffers();
      startLoadingSequence();
    }
  }, { once: true });
} else if (urlParams.get("page") === "project") {
  if (loadingScreen) loadingScreen.style.display = "none";
  isStarted = true;
  isLoaded = true;
  openProjectPage();
  triggerProjectTitleAnimation();
} else if (urlParams.get("page") === "store") {
  if (loadingScreen) loadingScreen.style.display = "none";
  isStarted = true;
  isLoaded = true;
  const storeTabParam = urlParams.get("tab") || urlParams.get("cat");
  if (storeTabParam && storeTabsList.some((t) => t.id === storeTabParam)) {
    currentStoreTab = storeTabParam;
  }
  openStorePage();
  triggerStoreTitleAnimation();
} else if (urlParams.get("page") === "minigame" || urlParams.get("page") === "games") {
  if (loadingScreen) loadingScreen.style.display = "none";
  isStarted = true;
  isLoaded = true;
  const gameParam = urlParams.get("game") || urlParams.get("id");
  if (gameParam) pendingMiniGameId = gameParam;
  openMiniGamePage();
  triggerMiniGameTitleAnimation();
} else if (urlParams.get("page") === "education") {
  if (loadingScreen) loadingScreen.style.display = "none";
  isStarted = true;
  isLoaded = true;
  openEducationPage();
  triggerEducationTitleAnimation();
} else if (urlParams.get("page") === "organization" || urlParams.get("page") === "org") {
  if (loadingScreen) loadingScreen.style.display = "none";
  isStarted = true;
  isLoaded = true;
  openOrganizationPage();
  triggerOrganizationTitleAnimation();
} else if (urlParams.get("page") === "gear") {
  if (loadingScreen) loadingScreen.style.display = "none";
  isStarted = true;
  isLoaded = true;
  openGearPage();
  triggerGearTitleAnimation();
} else if (urlParams.get("page") === "skill" || urlParams.get("page") === "skills") {
  if (loadingScreen) loadingScreen.style.display = "none";
  isStarted = true;
  isLoaded = true;
  const tabParam = urlParams.get("tab") || urlParams.get("cat");
  if (tabParam && skillTabsList.some((t) => t.id === tabParam)) {
    currentSkillTab = tabParam;
  }
  openSkillPage();
  triggerSkillTitleAnimation();
} else if (urlParams.get("page") === "about") {
  if (loadingScreen) loadingScreen.style.display = "none";
  isStarted = true;
  isLoaded = true;
  openAboutPage();
  triggerAboutTitleAnimation();
} else if (urlParams.get("page") === "contact") {
  if (loadingScreen) loadingScreen.style.display = "none";
  isStarted = true;
  isLoaded = true;
  openContactPage();
} else if (urlParams.get("skip_loading") === "1") {
  if (loadingScreen) loadingScreen.style.display = "none";
  enterExperience();
  switchToLoopVideo();
} else {
  startLoadingSequence();
}
