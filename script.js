const root = document.documentElement;
const sky = document.querySelector("#night-sky");
const ctx = sky.getContext("2d");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let stars = [];
let width = 0;
let height = 0;
let frame = 0;

function resizeSky() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  sky.width = width * ratio;
  sky.height = height * ratio;
  sky.style.width = `${width}px`;
  sky.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: Math.min(110, Math.floor(width / 10)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.2 + .2,
    speed: Math.random() * .16 + .03,
    alpha: Math.random() * .65 + .15
  }));
}

function drawSky() {
  ctx.clearRect(0, 0, width, height);
  for (const star of stars) {
    star.y += star.speed;
    if (star.y > height + 2) star.y = -2;
    ctx.beginPath();
    ctx.fillStyle = `rgba(216,255,62,${star.alpha})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!reducedMotion) frame = requestAnimationFrame(drawSky);
}

resizeSky();
drawSky();
window.addEventListener("resize", resizeSky, { passive: true });

window.addEventListener("pointermove", (event) => {
  root.style.setProperty("--mx", `${event.clientX}px`);
  root.style.setProperty("--my", `${event.clientY}px`);
}, { passive: true });

const city = document.querySelector(".hero__city");
window.addEventListener("scroll", () => {
  if (!reducedMotion && window.scrollY < window.innerHeight) {
    city.style.transform = `scale(1.04) translateY(${window.scrollY * .08}px)`;
  }
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: .14 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  observer.observe(element);
});

document.querySelectorAll("[data-tilt]").forEach((tilt) => {
  const frameElement = tilt.querySelector(".identity__frame");
  tilt.addEventListener("pointermove", (event) => {
    if (reducedMotion) return;
    const rect = tilt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    frameElement.style.transform = `rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateZ(8px)`;
  });
  tilt.addEventListener("pointerleave", () => {
    frameElement.style.transform = "rotateY(0) rotateX(0)";
  });
});

const toast = document.querySelector(".toast");
let toastTimer;

async function copyDiscord() {
  const value = "skeleton_c";
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
    } else {
      const field = document.createElement("textarea");
      field.value = value;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2300);
  } catch {
    toast.querySelector("strong").textContent = "copy failed — username below";
    toast.classList.add("is-visible");
  }
}

document.querySelectorAll("[data-copy-discord]").forEach((button) => {
  button.addEventListener("click", copyDiscord);
});

const clock = document.querySelector("#local-time");
function updateClock() {
  clock.textContent = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}
updateClock();
setInterval(updateClock, 1000);
document.querySelector("#year").textContent = new Date().getFullYear();

const lights = document.querySelector(".lights");
lights.addEventListener("click", () => {
  const active = document.body.classList.toggle("dimmed");
  lights.setAttribute("aria-pressed", String(active));
  lights.textContent = active ? "raise lights" : "dim lights";
});

window.addEventListener("pagehide", () => cancelAnimationFrame(frame));
