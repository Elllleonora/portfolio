// Segna che JavaScript è attivo (serve per le animazioni in CSS)
document.documentElement.classList.add("js");

/* =========================================================
   HOME: le colonne informative compaiono con una dissolvenza
   ========================================================= */
const cols = document.querySelectorAll(".info__col");

if (cols.length) {
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
}

/* =========================================================
   PROGETTI
   ========================================================= */

// Nome della cartella su GitHub dove carichi le foto.
const IMG_FOLDER = "img";

// Estensioni provate in automatico per ogni foto.
const EXTENSIONS = ["jpg", "JPG", "jpeg", "png", "webp"];

// Numero massimo di foto cercate per progetto.
const MAX_PHOTOS = 40;

// Quante foto restano visibili nella pila
const VISIBLE_CARDS = 5;

// Contenuti dei progetti, nell'ordine in cui compaiono nella pagina.
// label: tipologia, ambito e anno (una riga ciascuno).
// description: paragrafi del testo nero.
// summary: testo grigio sotto la descrizione.
// imagePrefix: nome delle foto prima del numero, esattamente come si chiamano i file
//   (es. "legami del futuro" cerca "legami del futuro-1.jpg", "legami del futuro-2.jpg", ...).
//   Se scrivi più
