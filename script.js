gsap.registerPlugin(ScrollTrigger);

// ── LENIS SMOOTH SCROLL ──
const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);


// ── NAV ──
const navProgressEl = document.getElementById("navProgress");
const scrollTopBtn = document.getElementById("scrollTop");
window.addEventListener("scroll", () => {
  document
    .getElementById("nav")
    .classList.toggle("scrolled", window.scrollY > 60);
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  navProgressEl.style.width = (scrollTop / docHeight) * 100 + "%";
  scrollTopBtn.classList.toggle("visible", scrollTop > 400);
});
scrollTopBtn.addEventListener("click", () => {
  lenis.scrollTo(0, { duration: 1.5 });
});

// ── HAMBURGER MENU ──
const burger = document.getElementById("burger");
const navEl = document.getElementById("nav");
burger.addEventListener("click", () => navEl.classList.toggle("nav-open"));
document.querySelectorAll(".nav-links a").forEach((a) => {
  a.addEventListener("click", () => navEl.classList.remove("nav-open"));
});

// ── HERO FLOW LINES ──
(() => {
  const cv = document.getElementById("heroDots");
  const ctx = cv.getContext("2d");
  const hero = document.getElementById("hero");

  const LINE_COUNT = 8;
  const POINTS_PER_LINE = 80;
  const GRAVITY_R = 250;
  const GRAVITY_MAX = 40;

  let W, H, lines;
  let running = true;
  const mouse = { x: -9999, y: -9999, on: false };

  function resize() {
    const rect = hero.getBoundingClientRect();
    W = cv.width = rect.width;
    H = cv.height = rect.height;
    buildLines();
  }

  function buildLines() {
    lines = [];
    const gap = H / (LINE_COUNT + 1);
    for (let i = 0; i < LINE_COUNT; i++) {
      const baseY = gap * (i + 1);
      const pts = [];
      const amp = 15 + Math.random() * 25;
      const freq = 0.003 + Math.random() * 0.004;
      const phase = Math.random() * Math.PI * 2;
      const speed = 0.0003 + Math.random() * 0.0004;
      for (let j = 0; j < POINTS_PER_LINE; j++) {
        const bx = (j / (POINTS_PER_LINE - 1)) * W;
        pts.push({ bx, by: baseY, x: bx, y: baseY, vy: 0 });
      }
      lines.push({ pts, amp, freq, phase, speed, baseY });
    }
  }

  function tick() {
    const now = performance.now();
    for (const line of lines) {
      for (const p of line.pts) {
        let ty = line.baseY +
          Math.sin(p.bx * line.freq + now * line.speed + line.phase) * line.amp +
          Math.sin(p.bx * line.freq * 2.3 + now * line.speed * 0.7) * line.amp * 0.3;

        if (mouse.on) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < GRAVITY_R && dist > 1) {
            const pull = (1 - dist / GRAVITY_R) ** 2;
            ty += (dy > 0 ? 1 : -1) * pull * GRAVITY_MAX;
          }
        }

        p.vy += (ty - p.y) * 0.06;
        p.vy *= 0.85;
        p.y += p.vy;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(20, 184, 166, 1)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    for (const line of lines) {
      ctx.beginPath();
      ctx.moveTo(line.pts[0].x, line.pts[0].y);
      for (let i = 1; i < line.pts.length - 1; i++) {
        const xc = (line.pts[i].x + line.pts[i + 1].x) / 2;
        const yc = (line.pts[i].y + line.pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(line.pts[i].x, line.pts[i].y, xc, yc);
      }
      const last = line.pts[line.pts.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    }
  }

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.on = true;
  });
  hero.addEventListener("mouseleave", () => { mouse.on = false; });

  window.addEventListener("resize", resize);
  resize();

  const observer = new IntersectionObserver(
    ([entry]) => { running = entry.isIntersecting; },
    { threshold: 0 }
  );
  observer.observe(hero);

  (function loop() {
    if (running) { tick(); draw(); }
    requestAnimationFrame(loop);
  })();
})();

// ── HERO BG ZOOM ──
gsap.to("#heroBg", {
  scale: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});

// ── HERO CONTENT FADE — nur Desktop ──
gsap.matchMedia().add("(min-width: 501px)", () => {
  gsap.to(".hero-content", {
    opacity: 0,
    y: -60,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "60% top",
      scrub: true,
    },
  });
});

// ── STORYTELLING (3 PHASES) — nur Desktop ──
gsap.matchMedia().add("(min-width: 501px)", () => {
  const storyTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#story",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
    },
  });
  storyTl
    .fromTo(
      "#phase1",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.25 },
      0,
    )
    .to("#phase1", { opacity: 0, y: -50, duration: 0.25 }, 0.3)
    .fromTo(
      "#phase2",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.25 },
      0.4,
    )
    .to("#phase2", { opacity: 0, y: -50, duration: 0.25 }, 0.6)
    .fromTo(
      "#phase3",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.25 },
      0.7,
    )
    .to("#phase3", { opacity: 0, y: -50, duration: 0.2 }, 0.9);
});

// ── HORIZONTAL SCROLL (5 PANELS) — nur auf Desktop ──
gsap.matchMedia().add("(min-width: 501px)", () => {
  ScrollTrigger.create({
    trigger: "#hWrap",
    start: "top top",
    end: "bottom bottom",
    onEnter: () => lenis.stop(),
    onLeave: () => lenis.start(),
    onEnterBack: () => lenis.stop(),
    onLeaveBack: () => lenis.start(),
  });

  const panels = gsap.utils.toArray(".h-panel");
  const hintEl = document.getElementById("hScrollHint");

  gsap.to("#hTrack", {
    x: () => -(window.innerWidth * (panels.length - 1)),
    ease: "none",
    scrollTrigger: {
      trigger: "#hWrap",
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      end: () => "+=" + window.innerWidth * (panels.length - 1),
      snap: {
        snapTo: 1 / (panels.length - 1),
        duration: { min: 0.3, max: 0.6 },
        delay: 0.05,
        ease: "power2.inOut",
      },
      onUpdate: (self) => {
        if (!hintEl) return;
        const arrowSvg = hintEl.querySelector(".h-hint-arrow");
        const lastSnap = (panels.length - 1.5) / (panels.length - 1);
        if (self.progress >= lastSnap) {
          arrowSvg.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';
          hintEl.classList.add("down");
        } else {
          arrowSvg.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
          hintEl.classList.remove("down");
        }
      },
    },
  });
});

// ── WERDEGANG TIMELINE ──
const orbitSteps = [
  {
    year: "2026",
    period: "08.2022 – 08.2026",
    label: "Mediengestalter",
    title: "Werksarztzentrum Deutschland GmbH",
    desc: [
      "Corporate Identity & Corporate Design",
      "Marketingmaterialien & Präsentationen",
      "Logo- und Produktdesign",
      "Druckvorstufe & Reinzeichnung",
      "Konzeption und Erstellung digitaler Inhalte für digitale Kanäle und Social Media",
      "Animierte Info- und Unterweisungsvideos (Vyond)",
      "Konzeption und Umsetzung interaktiver Webtools für Marketingzwecke und direkte Leadgenerierung",
      "CMS Contao – Pflege, Weiterentwicklung und technische Umsetzung von Marketingkampagnen in Zusammenarbeit mit SEO- und SEA-Experten",
      "Digitalisierung analoger Prozesse in browserbasierte Lösungen",
    ],
  },
  {
    year: "2022",
    period: "09.2019 – 06.2022",
    label: "Ausbildung",
    title: "Ausbildung zum Mediengestalter Digital & Print",
    desc: [
      "Augustin Print und Medien GmbH • Digitaldruckerei",
      "XDC Media GmbH • Werbeagentur",
      "Berufskolleg für Technik und Gestaltung",
    ],
  },
  {
    year: "2018",
    period: "Oktober 2018",
    label: "Neustart in Deutschland",
    title: "Auswanderung nach Deutschland",
    desc: ["Spracherwerb und Vorbereitung auf die Ausbildung"],
  },
];

const tlYearEl = document.getElementById("tlYear");
const tlLabelEl = document.getElementById("tlLabel");
const tlBarEl = document.getElementById("tlBar");
const periodEl = document.getElementById("orbitPeriod");
const orbitTitleEl = document.getElementById("orbitTitle");
const descEl = document.getElementById("orbitDesc");
const tlDots = document.querySelectorAll(".tl-dot");
let tlCurrentIdx = -1;

gsap.matchMedia().add("(min-width: 501px)", () => {
  ScrollTrigger.create({
    trigger: "#werdegang",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const idx = Math.min(
        Math.floor(self.progress * orbitSteps.length),
        orbitSteps.length - 1,
      );
      tlBarEl.style.width = self.progress * 100 + "%";
      if (idx !== tlCurrentIdx) {
        tlCurrentIdx = idx;
        const step = orbitSteps[idx];
        tlYearEl.style.opacity = "0";
        periodEl.style.opacity = "0";
        orbitTitleEl.style.opacity = "0";
        descEl.style.opacity = "0";
        setTimeout(() => {
          tlYearEl.textContent = step.year;
          tlLabelEl.textContent = step.label;
          periodEl.textContent = step.period;
          orbitTitleEl.textContent = step.title;
          descEl.innerHTML = step.desc
            .map(
              (line) =>
                `<div class="orbit-line"><span class="orbit-bullet">▸</span><span>${line}</span></div>`,
            )
            .join("");
          tlYearEl.style.opacity = "1";
          periodEl.style.opacity = "1";
          orbitTitleEl.style.opacity = "1";
          descEl.style.opacity = "1";
        }, 120);
        tlDots.forEach((d, i) => {
          d.classList.toggle("filled", i <= idx);
          d.classList.toggle("current", i === idx);
        });
      }
    },
  });
});

// ── WERDEGANG — klickbare Dots (Mobile) ──
function showOrbitStep(idx) {
  const step = orbitSteps[idx];
  if (!step) return;
  tlCurrentIdx = idx;
  tlYearEl.textContent = step.year;
  tlLabelEl.textContent = step.label;
  tlBarEl.style.width = ((idx + 1) / orbitSteps.length) * 100 + "%";
  periodEl.textContent = step.period;
  orbitTitleEl.textContent = step.title;
  descEl.innerHTML = step.desc
    .map(
      (line) =>
        `<div class="orbit-line"><span class="orbit-bullet">▸</span><span>${line}</span></div>`,
    )
    .join("");
  tlDots.forEach((d, i) => {
    d.classList.toggle("filled", i <= idx);
    d.classList.toggle("current", i === idx);
  });
}

tlDots.forEach((dot, i) => {
  dot.addEventListener("click", () => showOrbitStep(i));
});

// ── CARD GLOW ──
document.querySelectorAll(".portfolio-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card
      .querySelector(".card-glow")
      .style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
    card
      .querySelector(".card-glow")
      .style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
  });
});

// ── SCROLL REVEAL ──
document.querySelectorAll(".reveal").forEach((el, i) => {
  ScrollTrigger.create({
    trigger: el,
    start: "top 88%",
    onEnter: () => setTimeout(() => el.classList.add("visible"), (i % 4) * 80),
  });
});

// ── SMILE COUNTER (auskommentiert — nav-left deaktiviert) ──
/*
const smileBtn = document.getElementById("smileBtn");
const smileCount = document.getElementById("smileCount");
let smileVal = 0;

function showCount(n) {
  smileCount.textContent = n.toLocaleString("de-DE");
}

smileBtn.addEventListener("click", () => {
  showCount(++smileVal);
});

const smileTexts = document.querySelectorAll(".smile-text");
const smileIndicator = document.getElementById("smileIndicator");
let smileIdx = 0;

setInterval(() => {
  smileTexts[smileIdx].classList.remove("active");
  smileIdx = (smileIdx + 1) % smileTexts.length;
  smileTexts[smileIdx].classList.add("active");
  smileIndicator.textContent = smileIdx + 1;
  smileIndicator.classList.add("pop");
  setTimeout(() => smileIndicator.classList.remove("pop"), 300);
}, 4500);

smileBtn.addEventListener("click", () => {
  const rect = smileBtn.getBoundingClientRect();
  for (let i = 0; i < 4; i++) {
    const el = document.createElement("span");
    el.className = "fly-emoji";
    el.textContent = "😍";
    el.style.left =
      rect.left + rect.width / 2 + (Math.random() - 0.5) * 50 + "px";
    el.style.top = rect.top + rect.height / 2 + "px";
    el.style.animationDelay = i * 0.08 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }
});
*/

// ── THEME TOGGLE (gesteuert über Toolbar-Pipette) ──
const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  if (next === "dark") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", next);
  }
  localStorage.setItem("theme", next);
}

// ── SEARCH ──
const searchOverlay = document.getElementById("searchOverlay");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

const searchSections = [
  { label: "Profil", tag: "01 / Profil", href: "#story" },
  { label: "Über mich", tag: "02 / Über mich", href: "#story" },
  { label: "Erfahrung", tag: "03 / Erfahrung", href: "#story" },
  { label: "Design & Kreativ", tag: "Kompetenzen", href: "#hWrap" },
  { label: "Marketing & Digital", tag: "Kompetenzen", href: "#hWrap" },
  { label: "Video & Animation", tag: "Kompetenzen", href: "#hWrap" },
  { label: "Tools", tag: "Kompetenzen", href: "#hWrap" },
  { label: "Sprachen", tag: "Kompetenzen", href: "#hWrap" },
  { label: "Werdegang", tag: "04 / Werdegang", href: "#werdegang" },
  { label: "Arbeitsproben", tag: "05 / Arbeitsproben", href: "#arbeitsproben" },
  { label: "Kontakt", tag: "06 / Kontakt", href: "#kontakt" },
];

document.addEventListener("click", (e) => {
  if (searchOverlay.classList.contains("open") && !searchOverlay.contains(e.target) && !e.target.closest('[data-tool="search"]')) {
    searchOverlay.classList.remove("open");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") searchOverlay.classList.remove("open");
});

searchInput.addEventListener("input", () => {
  renderResults(searchInput.value.trim().toLowerCase());
});

function renderResults(query) {
  if (!query) {
    searchResults.innerHTML = searchSections
      .map((s) => `<div class="search-result-item" data-href="${s.href}"><div class="sr-tag">${s.tag}</div>${s.label}</div>`)
      .join("");
  } else {
    const filtered = searchSections.filter((s) => s.label.toLowerCase().includes(query) || s.tag.toLowerCase().includes(query));
    searchResults.innerHTML = filtered
      .map((s) => `<div class="search-result-item" data-href="${s.href}"><div class="sr-tag">${s.tag}</div>${s.label}</div>`)
      .join("");
  }
  searchResults.querySelectorAll(".search-result-item").forEach((item) => {
    item.addEventListener("click", () => {
      const target = document.querySelector(item.dataset.href);
      if (target) lenis.scrollTo(target, { duration: 1.2 });
      searchOverlay.classList.remove("open");
      navEl.classList.remove("nav-open");
    });
  });
}

// ── PDF VIEWER ──
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

document.querySelectorAll(".pdf-card").forEach((card) => {
  const url = card.dataset.pdf;
  const canvas = card.querySelector(".pdf-canvas");
  const ctx = canvas.getContext("2d");
  const prevBtn = card.querySelector(".pdf-prev");
  const nextBtn = card.querySelector(".pdf-next");
  const info = card.querySelector(".pdf-info");
  let pdfDoc = null;
  let currentPage = 1;
  let rendering = false;

  function renderPage(num) {
    if (rendering) return;
    rendering = true;
    pdfDoc.getPage(num).then((page) => {
      const scale = canvas.offsetWidth / page.getViewport({ scale: 1 }).width;
      const viewport = page.getViewport({ scale: scale || 1 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      page.render({ canvasContext: ctx, viewport }).promise.then(() => {
        rendering = false;
        info.textContent = `${num} / ${pdfDoc.numPages}`;
        prevBtn.disabled = num <= 1;
        nextBtn.disabled = num >= pdfDoc.numPages;
      });
    });
  }

  pdfjsLib
    .getDocument(url)
    .promise.then((pdf) => {
      pdfDoc = pdf;
      info.textContent = `1 / ${pdf.numPages}`;
      renderPage(1);
    })
    .catch(() => {
      info.textContent = "PDF nicht geladen";
    });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentPage > 1) renderPage(--currentPage);
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (pdfDoc && currentPage < pdfDoc.numPages) renderPage(++currentPage);
  });
});

// ── IMAGE MODAL ──
const imgModal = document.getElementById("imgModal");
const imgModalImg = document.getElementById("imgModalImg");
const imgModalClose = document.getElementById("imgModalClose");

document.querySelectorAll(".float-card").forEach((card) => {
  card.addEventListener("click", () => {
    imgModalImg.src = card.querySelector("img").src;
    imgModalImg.alt = card.querySelector("img").alt;
    imgModal.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

document.querySelectorAll(".portfolio-card").forEach((card) => {
  const img = card.querySelector(".card-img img");
  if (img) {
    card.addEventListener("click", () => {
      imgModalImg.src = img.src;
      imgModalImg.alt = img.alt;
      imgModal.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  }
});

function closeModal() {
  imgModal.classList.remove("open");
  document.body.style.overflow = "";
}

imgModalClose.addEventListener("click", closeModal);
imgModal.addEventListener("click", (e) => {
  if (e.target === imgModal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ── TOOLBAR DRAG ──
const toolbarEl = document.getElementById("toolbar");
const tbDrag = document.getElementById("tbDrag");
const savedSide = localStorage.getItem("toolbarSide");
if (savedSide === "right") toolbarEl.classList.add("right");

let tbDragging = false;
let tbGhost = null;

tbDrag.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  tbDragging = true;
  toolbarEl.classList.add("dragging");
  tbGhost = toolbarEl.cloneNode(true);
  tbGhost.style.position = "fixed";
  tbGhost.style.pointerEvents = "none";
  tbGhost.style.opacity = "0.4";
  tbGhost.style.zIndex = "9999";
  tbGhost.style.transition = "none";
  document.body.appendChild(tbGhost);
});

window.addEventListener("pointermove", (e) => {
  if (!tbDragging || !tbGhost) return;
  tbGhost.style.left = e.clientX - 20 + "px";
  tbGhost.style.top = e.clientY - 20 + "px";
  tbGhost.style.transform = "none";
});

window.addEventListener("pointerup", (e) => {
  if (!tbDragging) return;
  tbDragging = false;
  toolbarEl.classList.remove("dragging");
  if (tbGhost) { tbGhost.remove(); tbGhost = null; }
  const side = e.clientX > window.innerWidth / 2 ? "right" : "left";
  toolbarEl.classList.toggle("right", side === "right");
  localStorage.setItem("toolbarSide", side);
});

// ── TOOLBAR ──
const drawCanvas = document.getElementById("drawCanvas");
const drawCtx = drawCanvas.getContext("2d");
const tbBtns = document.querySelectorAll(".tb-btn");
const tbColorPicker = document.getElementById("tbColorPicker");
const tbColorDot = document.getElementById("tbColorDot");
const tbSizePicker = document.getElementById("tbSizePicker");
const tbSizeRange = document.getElementById("tbSizeRange");
const tbSizeVal = document.getElementById("tbSizeVal");
const tbSizePreview = document.getElementById("tbSizePreview");
const terminalOverlay = document.getElementById("terminalOverlay");
const terminalInput = document.getElementById("terminalInput");
const terminalBody = document.getElementById("terminalBody");
const terminalClose = document.getElementById("terminalClose");

let currentTool = "brush";
let brushColor = "#14b8a6";
let brushSize = 3;
let isDrawing = false;
let undoStack = [];
let rectStart = null;

function saveState() {
  undoStack.push(drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height));
  if (undoStack.length > 30) undoStack.shift();
}

function undo() {
  if (undoStack.length === 0) return;
  const state = undoStack.pop();
  drawCtx.putImageData(state, 0, 0);
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  let imgData = null;
  if (drawCanvas.width > 0 && drawCanvas.height > 0) {
    imgData = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
  }
  drawCanvas.width = window.innerWidth * dpr;
  drawCanvas.height = window.innerHeight * dpr;
  drawCanvas.style.width = window.innerWidth + "px";
  drawCanvas.style.height = window.innerHeight + "px";
  drawCtx.scale(dpr, dpr);
  if (imgData) drawCtx.putImageData(imgData, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function closePickers() {
  tbColorPicker.classList.remove("open");
  tbSizePicker.classList.remove("open");
}

function setTool(tool) {
  if (tool === "clear") {
    saveState();
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    return;
  }
  if (tool === "undo") { undo(); return; }
  if (tool === "color") {
    tbSizePicker.classList.remove("open");
    tbColorPicker.classList.toggle("open");
    return;
  }
  if (tool === "size") {
    tbColorPicker.classList.remove("open");
    tbSizePicker.classList.toggle("open");
    return;
  }
  if (tool === "pipette") { toggleTheme(); return; }
  if (tool === "search") {
    searchOverlay.classList.toggle("open");
    if (searchOverlay.classList.contains("open")) {
      const isRight = toolbarEl.classList.contains("right");
      searchOverlay.style.left = isRight ? "auto" : "52px";
      searchOverlay.style.right = isRight ? "52px" : "auto";
      searchInput.value = "";
      searchInput.focus();
      renderResults("");
    }
    return;
  }
  if (tool === "terminal") {
    terminalOverlay.classList.add("open");
    terminalInput.focus();
    return;
  }

  closePickers();

  if (currentTool === tool) {
    currentTool = null;
    tbBtns.forEach((b) => b.classList.remove("active"));
    drawCanvas.classList.remove("drawing", "erasing", "texting", "recting");
    return;
  }

  currentTool = tool;
  tbBtns.forEach((b) => {
    const t = b.dataset.tool;
    b.classList.toggle("active", t === tool);
  });

  drawCanvas.classList.remove("drawing", "erasing", "texting", "recting");
  if (tool === "brush") drawCanvas.classList.add("drawing");
  if (tool === "eraser") drawCanvas.classList.add("erasing");
  if (tool === "text") drawCanvas.classList.add("texting");
  if (tool === "rect") drawCanvas.classList.add("recting");
}

tbBtns.forEach((btn) => {
  btn.addEventListener("click", () => setTool(btn.dataset.tool));
});

document.querySelectorAll(".tb-cp-swatch").forEach((s) => {
  s.addEventListener("click", () => {
    brushColor = s.dataset.color;
    tbColorDot.style.background = brushColor;
    document.querySelectorAll(".tb-cp-swatch").forEach((sw) => sw.classList.remove("selected"));
    s.classList.add("selected");
    tbColorPicker.classList.remove("open");
  });
});

tbSizeRange.addEventListener("input", () => {
  brushSize = parseInt(tbSizeRange.value);
  tbSizeVal.textContent = brushSize + "px";
  const s = Math.max(4, brushSize);
  tbSizePreview.style.width = s + "px";
  tbSizePreview.style.height = s + "px";
});

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "z") {
    e.preventDefault();
    undo();
  }
});

// ── CANVAS DRAWING ──
drawCanvas.addEventListener("pointerdown", (e) => {
  if (currentTool === "text") {
    saveState();
    const text = prompt("Text eingeben:");
    if (text) {
      drawCtx.globalCompositeOperation = "source-over";
      drawCtx.font = `${Math.max(brushSize * 5, 16)}px Poppins, sans-serif`;
      drawCtx.fillStyle = brushColor;
      drawCtx.fillText(text, e.clientX, e.clientY);
    }
    return;
  }

  if (currentTool === "rect") {
    saveState();
    rectStart = { x: e.clientX, y: e.clientY };
    return;
  }

  if (currentTool !== "brush" && currentTool !== "eraser") return;
  saveState();
  isDrawing = true;
  drawCtx.beginPath();
  drawCtx.moveTo(e.clientX, e.clientY);
});

drawCanvas.addEventListener("pointermove", (e) => {
  if (!isDrawing) return;
  if (currentTool === "eraser") {
    drawCtx.globalCompositeOperation = "destination-out";
    drawCtx.lineWidth = brushSize * 4;
  } else {
    drawCtx.globalCompositeOperation = "source-over";
    drawCtx.strokeStyle = brushColor;
    drawCtx.lineWidth = brushSize;
  }
  drawCtx.lineCap = "round";
  drawCtx.lineJoin = "round";
  drawCtx.lineTo(e.clientX, e.clientY);
  drawCtx.stroke();
  drawCtx.beginPath();
  drawCtx.moveTo(e.clientX, e.clientY);
});

drawCanvas.addEventListener("pointerup", (e) => {
  isDrawing = false;
  if (currentTool === "rect" && rectStart) {
    drawCtx.globalCompositeOperation = "source-over";
    drawCtx.strokeStyle = brushColor;
    drawCtx.lineWidth = brushSize;
    drawCtx.strokeRect(
      rectStart.x,
      rectStart.y,
      e.clientX - rectStart.x,
      e.clientY - rectStart.y
    );
    rectStart = null;
  }
});
drawCanvas.addEventListener("pointerleave", () => { isDrawing = false; });

// ── TERMINAL COMMANDS ──
const terminalCmds = {
  help: "Verfügbare Befehle: <span style='color:var(--accent)'>about</span>, <span style='color:var(--accent)'>skills</span>, <span style='color:var(--accent)'>contact</span>, <span style='color:var(--accent)'>experience</span>, <span style='color:var(--accent)'>clear</span>",
  about: "Amir Mehrasebi — Mediengestalter Digital & Print.<br>33 Jahre alt, seit 2018 in Deutschland.<br>Kreativ, neugierig, immer auf der Suche nach der nächsten Idee.",
  skills: "→ Adobe CC (InDesign, Photoshop, Illustrator, Acrobat)<br>→ Figma, Canva, CorelDraw<br>→ HTML, CSS, JS (Grundkenntnisse)<br>→ Vyond, CapCut<br>→ CMS Contao<br>→ Deutsch (fließend), Englisch (fließend), Persisch (Muttersprache)",
  contact: "📞 0157 70 04 44 41<br>✉ mehrasebi.amir@gmail.com<br>🔗 linkedin.com/in/amir-mehrasebi",
  experience: "2022–2026 — Werksarztzentrum Deutschland GmbH (Mediengestalter)<br>2019–2022 — Ausbildung Mediengestalter Digital & Print<br>2018 — Auswanderung nach Deutschland",
  clear: "__CLEAR__",
};

function terminalExec(cmd) {
  const trimmed = cmd.trim().toLowerCase();
  const out = terminalCmds[trimmed];
  if (trimmed === "") return;

  terminalBody.innerHTML += `<div class="terminal-line"><span style="color:var(--accent)">$</span> ${cmd}</div>`;

  if (out === "__CLEAR__") {
    terminalBody.innerHTML = '<div class="terminal-line">Terminal gelöscht.</div>';
  } else if (out) {
    terminalBody.innerHTML += `<div class="terminal-line">${out}</div>`;
  } else {
    terminalBody.innerHTML += `<div class="terminal-line" style="color:#ef4444">Befehl nicht gefunden: ${cmd}. Tippe <span style="color:var(--accent)">help</span>.</div>`;
  }
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

terminalInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    terminalExec(terminalInput.value);
    terminalInput.value = "";
  }
});

terminalClose.addEventListener("click", () => {
  terminalOverlay.classList.remove("open");
});
terminalOverlay.addEventListener("click", (e) => {
  if (e.target === terminalOverlay) terminalOverlay.classList.remove("open");
});

// ── DEEP LINK (Hash oder ?to=) ──
(function handleDeepLink() {
  const target =
    window.location.hash.slice(1) ||
    new URLSearchParams(window.location.search).get("to");
  if (!target) return;
  history.replaceState(null, "", window.location.pathname);
  window.addEventListener("load", () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
      const el = document.getElementById(target);
      if (el) window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
    }, 1000);
  });
})();
