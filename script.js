gsap.registerPlugin(ScrollTrigger);

// ── LENIS SMOOTH SCROLL ──
const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ── NAV ──
window.addEventListener("scroll", () => {
  document
    .getElementById("nav")
    .classList.toggle("scrolled", window.scrollY > 60);
});

// ── HAMBURGER MENU ──
const burger = document.getElementById("burger");
const navEl = document.getElementById("nav");
burger.addEventListener("click", () => navEl.classList.toggle("nav-open"));
document.querySelectorAll(".nav-links a").forEach((a) => {
  a.addEventListener("click", () => navEl.classList.remove("nav-open"));
});

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

// ── HERO CONTENT FADE ──
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

// ── STORYTELLING (3 PHASES) ──
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

// ── SMILE COUNTER ──
const smileBtn = document.getElementById("smileBtn");
const smileCount = document.getElementById("smileCount");
let smileVal = 0;

function showCount(n) {
  smileCount.textContent = n.toLocaleString("de-DE");
}

smileBtn.addEventListener("click", () => {
  showCount(++smileVal);
});

// ── ROTATING SMILE TEXT ──
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

// ── FLY EMOJI ON CLICK ──
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
