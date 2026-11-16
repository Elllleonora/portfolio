// Segna che JavaScript è attivo (serve per l'animazione in CSS)
document.documentElement.classList.add("js");

// Le colonne informative compaiono con una leggera dissolvenza quando entrano nello schermo
const cols = document.querySelectorAll(".info__col");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  cols.forEach((col, i) => {
    col.style.transitionDelay = `${i * 120}ms`;
    observer.observe(col);
  });
} else {
  cols.forEach((col) => col.classList.add("is-visible"));
}
