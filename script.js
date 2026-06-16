gsap.registerPlugin(ScrollTrigger);

// ── LENIS SMOOTH SCROLL ──
const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

ScrollTrigger.create({
  trigger: "#hWrap",
  start: "top top",
  end: "bottom bottom",
  onEnter: () => lenis.stop(),
  onLeave: () => lenis.start(),
  onEnterBack: () => lenis.stop(),
  onLeaveBack: () => lenis.start(),
});

// ── NAV ──
window.addEventListener("scroll", () => {
  document
    .getElementById("nav")
    .classList.toggle("scrolled", window.scrollY > 60);
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
  .fromTo("#phase1", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.25 }, 0)
  .to("#phase1", { opacity: 0, y: -50, duration: 0.25 }, 0.3)
  .fromTo("#phase2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.25 }, 0.4)
  .to("#phase2", { opacity: 0, y: -50, duration: 0.25 }, 0.6)
  .fromTo("#phase3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.25 }, 0.7)
  .to("#phase3", { opacity: 0, y: -50, duration: 0.2 }, 0.9);

// ── HORIZONTAL SCROLL (5 PANELS) ──
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

// ── WERDEGANG TIMELINE ──
const orbitSteps = [
  {
    year: "1998",
    period: "1998 – 2009",
    label: "Schulbildung",
    desc: "Schulbildung in Teheran (Grundschule bis Realschule, Schwerpunkt Mathematik)",
  },
  {
    year: "2009",
    period: "2009 – 2012",
    label: "Druckvorstufe",
    desc: "Druckvorstufe – 5star Print and Design Complex, Teheran",
  },
  {
    year: "2012",
    period: "2012 – 2013",
    label: "Kunststudium",
    desc: "Tehran University of Art – Practical Art (nicht abgeschlossen)",
  },
  {
    year: "2013",
    period: "2013 – 2014",
    label: "Militärdienst",
    desc: "Militärdienst & selbstständige Tätigkeit als Grafikdesigner und Fitnesstrainer",
  },
  {
    year: "2015",
    period: "2015 – 2018",
    label: "Grafikdesigner",
    desc: "Grafikdesigner – Didgah Sima Print & Designs Complex, Teheran",
  },
  {
    year: "2019",
    period: "2019 – 2022",
    label: "Ausbildung",
    desc: "Ausbildung Mediengestalter Digital & Print · Augustin Print und Medien GmbH · XDC Media GmbH · Berufskolleg für Technik und Gestaltung",
  },
  {
    year: "2022",
    period: "2022 – 2026",
    label: "Design & Marketing",
    desc: "Design & Marketing – Marketingkampagnen, Print- und Digitalmaterialien, Social Media Content sowie interaktive Web-Tools (HTML, CSS, JavaScript, KI-gestützt)",
  },
];

const tlYearEl = document.getElementById("tlYear");
const tlLabelEl = document.getElementById("tlLabel");
const tlBarEl = document.getElementById("tlBar");
const periodEl = document.getElementById("orbitPeriod");
const descEl = document.getElementById("orbitDesc");
const tlDots = document.querySelectorAll(".tl-dot");
let tlCurrentIdx = -1;

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
      descEl.style.opacity = "0";
      setTimeout(() => {
        tlYearEl.textContent = step.year;
        tlLabelEl.textContent = step.label;
        periodEl.textContent = step.period;
        descEl.textContent = step.desc;
        tlYearEl.style.opacity = "1";
        periodEl.style.opacity = "1";
        descEl.style.opacity = "1";
      }, 120);
      tlDots.forEach((d, i) => {
        d.classList.toggle("filled", i <= idx);
        d.classList.toggle("current", i === idx);
      });
    }
  },
});

// ── CARD GLOW ──
document.querySelectorAll(".portfolio-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.querySelector(".card-glow").style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
    card.querySelector(".card-glow").style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
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
const API = "https://api.countapi.xyz";
const NS = "amirmehrasebi-cv";
const KEY = "smile";
const OFFSET = 1000;

const smileBtn = document.getElementById("smileBtn");
const smileCount = document.getElementById("smileCount");

function showCount(n) {
  smileCount.textContent = n.toLocaleString("de-DE");
  localStorage.setItem("smileCount", n);
}

const cached = parseInt(localStorage.getItem("smileCount"));
if (cached) showCount(cached);

fetch(`${API}/get/${NS}/${KEY}`)
  .then((r) => r.json())
  .then((d) => { if (d.value != null) showCount(d.value + OFFSET); })
  .catch(() => {});

smileBtn.addEventListener("click", () => {
  smileBtn.disabled = true;
  fetch(`${API}/hit/${NS}/${KEY}`)
    .then((r) => r.json())
    .then((d) => { showCount(d.value + OFFSET); })
    .catch(() => {
      const n = (parseInt(localStorage.getItem("smileCount")) || OFFSET) + 1;
      showCount(n);
    })
    .finally(() => { smileBtn.disabled = false; });
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
    el.style.left = rect.left + rect.width / 2 + (Math.random() - 0.5) * 50 + "px";
    el.style.top = rect.top + rect.height / 2 + "px";
    el.style.animationDelay = i * 0.08 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }
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
