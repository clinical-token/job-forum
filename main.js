const rail = document.querySelector("[data-rail]");
const prev = document.querySelector("[data-prev]");
const next = document.querySelector("[data-next]");
const pause = document.querySelector("[data-pause]");

if (rail && prev && next && pause) {
  const step = () => {
    const plate = rail.querySelector(".plate");
    if (!plate) return rail.clientWidth * 0.8;
    const styles = getComputedStyle(rail);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return plate.getBoundingClientRect().width + gap;
  };

  const go = (direction) => {
    const width = step();
    const max = rail.scrollWidth - rail.clientWidth - 2;
    if (direction > 0 && rail.scrollLeft >= max) {
      rail.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (direction < 0 && rail.scrollLeft <= 2) {
      rail.scrollTo({ left: max, behavior: "smooth" });
      return;
    }
    rail.scrollBy({ left: direction * width, behavior: "smooth" });
  };

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let held = false;
  let timer = 0;

  const stop = () => window.clearInterval(timer);

  const start = () => {
    stop();
    if (reduce || held || pause.getAttribute("aria-pressed") === "true") return;
    timer = window.setInterval(() => go(1), 4200);
  };

  pause.addEventListener("click", () => {
    const pressed = pause.getAttribute("aria-pressed") === "true";
    pause.setAttribute("aria-pressed", pressed ? "false" : "true");
    pause.textContent = pressed ? "Pause" : "Play";
    start();
  });

  rail.addEventListener("mouseenter", () => {
    held = true;
    stop();
  });
  rail.addEventListener("mouseleave", () => {
    held = false;
    start();
  });
  rail.addEventListener("focusin", () => {
    held = true;
    stop();
  });
  rail.addEventListener("focusout", () => {
    held = false;
    start();
  });

  start();
}
