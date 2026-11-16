/* ---------- Variabili ---------- */
:root {
  --bg: #a98f70;
  --ink: #1c1c1b;

  --font-display: "Instrument Serif", "Times New Roman", serif;
  --font-text: "Plus Jakarta Sans", system-ui, sans-serif;

  --margin: 26px;                      /* distanza dai bordi della navigazione */
  --headline-size: clamp(2.4rem, 7.9vw, 9rem);
  --small-size: clamp(0.68rem, 0.82vw, 0.85rem);
}

/* ---------- Reset ---------- */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-text);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

a {
  color: inherit;
  text-decoration: none;
}

/* ---------- Navigazione (fissa, ai quattro lati) ---------- */
.nav__link {
  position: fixed;
  z-index: 10;
  font-size: var(--small-size);
  line-height: 1;
  transition: opacity 0.2s ease;
}

.nav__link:hover {
  opacity: 0.55;
}

.nav__link--tl { top: var(--margin);  left: var(--margin); }
.nav__link--tr { top: var(--margin);  right: var(--margin); }
.nav__link--ml { top: 50%; left: var(--margin);  transform: translateY(-50%); }
.nav__link--mr { top: 50%; right: var(--margin); transform: translateY(-50%); }

/* ---------- Hero ---------- */
.hero {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 7rem 1rem 5rem;
  text-align: center;
  text-transform: uppercase;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: var(--headline-size);
  line-height: 0.88;
  letter-spacing: -0.005em;
}

.hero__title {
  font: inherit;
  margin-bottom: 0.9em;
}

.hero__services {
  font: inherit;
}

/* ---------- Info (tre colonne) ---------- */
.info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 1rem;
  padding: 3rem 22vw 6rem;
  font-size: var(--small-size);
  line-height: 1.3;
}

.info__block {
  margin-bottom: 2.2em;
}

.info__block h2 {
  font-size: inherit;
  font-weight: 600;
}

.info__block p + p {
  margin-top: 1.1em;
}

.info__block a[href="#"],
.info__block p a:not([href^="tel"]):not([href^="mailto"]) {
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 1px;
}

.info__block a:hover {
  opacity: 0.55;
}

/* Animazione di comparsa (attivata da script.js) */
.js .info__col {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.js .info__col.is-visible {
  opacity: 1;
  transform: none;
}

/* ---------- Tablet ---------- */
@media (max-width: 900px) {
  .info {
    padding-inline: 10vw;
  }
}

/* ---------- Mobile ---------- */
@media (max-width: 640px) {
  :root {
    --margin: 18px;
    --headline-size: clamp(2.1rem, 11vw, 3.4rem);
    --small-size: 0.78rem;
  }

  .hero {
    padding-top: 6rem;
  }

  .info {
    grid-template-columns: 1fr;
    padding: 2rem var(--margin) 5rem;
    row-gap: 0;
  }
}

/* ---------- Accessibilità ---------- */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .js .info__col { transition: none; opacity: 1; transform: none; }
}
