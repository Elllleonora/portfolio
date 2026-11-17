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
const EXTENSIONS = ["jpg", "png", "jpeg", "webp", "avif", "JPG", "PNG", "JPEG", "WEBP"];

// Numero massimo di foto cercate per progetto.
const MAX_PHOTOS = 40;

// Quante foto restano visibili nella pila
const VISIBLE_CARDS = 5;

// Contenuti dei progetti, nell'ordine in cui compaiono nella pagina.
// "imagePrefix": le foto vengono cercate come prefisso-1, prefisso-2, ...
// (es. gramma-1.jpg, gramma-2.png, gramma-3.jpg ...) nella cartella IMG_FOLDER.
const PROJECTS = [
  {
    id: "gramma",
    name: "Gramma",
    label: ["Tesi di laurea magistrale", "Service e Graphic design", "2026"],
    description: [
      "Gramma mira a sviluppare un sistema di monitoraggio acustico per studiare e proteggere le specie aviarie urbane minacciate, come rondoni, rondini e balestrucci, nella città pilota di Rimini.",
      "Il mio ruolo, in qualità di designer, si articola su più livelli: dalla costruzione di una rete di stakeholder, alla ricerca di fondi, facilitando l’avvio e la sostenibilità del progetto.",
      "È stato progettato un sito web accessibile e inclusivo per la visualizzazione e la condivisione dei dati raccolti, con l’obiettivo di ampliare l’engagement del pubblico. Gramma, inoltre, propone laboratori di citizen science sotto forma di camminate sonore informative per la scoperta e mappatura dei nidi delle specie aviarie target."
    ],
    summary:
      "Gramma ingaggia i cittadini riminesi attraverso il suono e i partner del progetto, che li invitano a prendere parte ad una cura collettiva, alimentata dal cammino e dall’ascolto attivo, delle specie a rischio che vivono nelle nostre città.",
    imagePrefix: "gramma"
  },
  {
    id: "vocabolante",
    name: "Vocabolante",
    label: ["Tipo di progetto", "Ambito", "Anno"],
    description: ["Descrizione in arrivo."],
    summary: "",
    imagePrefix: "vocabolante"
  },
  {
    id: "the-evolution-of-our-ecosystems",
    name: "The Evolution of our Ecosystems",
    label: ["Tipo di progetto", "Ambito", "Anno"],
    description: ["Descrizione in arrivo."],
    summary: "",
    imagePrefix: "ecosystems"
  },
  {
    id: "arete",
    name: "Aretè",
    label: ["Tipo di progetto", "Ambito", "Anno"],
    description: ["Descrizione in arrivo."],
    summary: "",
    imagePrefix: "arete"
  },
  {
    id: "legami-del-futuro",
    name: "Legami del futuro",
    label: ["Tipo di progetto", "Ambito", "Anno"],
    description: ["Descrizione in arrivo."],
    summary: "",
    imagePrefix: "legami"
  }
];

/* ---------- Ricerca delle foto ---------- */

// Prova a caricare un'immagine; restituisce true/false
function tryLoad(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

// Cerca la foto "prefisso-numero" provando tutte le estensioni insieme.
async function findPhoto(prefix, number) {
  const sources = EXTENSIONS.map((ext) => `${IMG_FOLDER}/${prefix}-${number}.${ext}`);
  const results = await Promise.all(sources.map(tryLoad));
  const index = results.indexOf(true);
  return index >= 0 ? sources[index] : null;
}

// Trova tutte le foto di un progetto: prefisso-1, prefisso-2, ...
// Si ferma dopo 2 numeri consecutivi mancanti.
async function findAllPhotos(prefix) {
  const found = [];
  let misses = 0;

  for (let n = 1; n <= MAX_PHOTOS && misses < 2; n++) {
    const src = await findPhoto(prefix, n);
    if (src) {
      found.push(src);
      misses = 0;
    } else {
      misses++;
    }
  }
  return found;
}

/* ---------- Pila di foto (una per progetto) ---------- */

function createStack(stackEl, project) {
  let order = [];        // carte della pila, dalla prima (davanti) all'ultima
  let animating = false; // blocca i clic durante l'animazione
  let started = false;   // le foto si cercano una sola volta

  function layout() {
    order.forEach((card, depth) => {
      card.dataset.depth = depth < VISIBLE_CARDS ? String(depth) : "hidden";
    });
  }

  function next() {
    if (order.length < 2 || animating) return;
    animating = true;

    const front = order[0];
    front.classList.add("is-leaving");           // la foto davanti scivola di lato

    setTimeout(() => {
      front.classList.remove("is-leaving");
      order.push(order.shift());                 // poi va sotto tutte le altre
      layout();
      setTimeout(() => { animating = false; }, 450);
    }, 260);
  }

  function prev() {
    if (order.length < 2 || animating) return;
    animating = true;
    order.unshift(order.pop());                  // l'ultima foto torna davanti
    layout();
    setTimeout(() => { animating = false; }, 450);
  }

  stackEl.addEventListener("click", next);
  stackEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  });

  // Cerca e mostra le foto (chiamata quando il progetto sta per entrare nello schermo)
  function load() {
    if (started || !project.imagePrefix) return;
    started = true;

    findAllPhotos(project.imagePrefix).then((found) => {
      if (!found.length) return;

      order = found.map((src, k) => {
        const card = document.createElement("div");
        card.className = "stack__card";
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${project.name} – immagine ${k + 1}`;
        img.draggable = false;
        card.appendChild(img);
        stackEl.appendChild(card);
        return card;
      });

      stackEl.classList.toggle("is-single", order.length < 2);
      layout();
      stackEl.hidden = false;
    });
  }

  return { load };
}

/* ---------- Costruzione di un progetto ---------- */

function buildProject(project) {
  const section = document.createElement("section");
  section.className = "project";
  section.id = project.id;

  // Testata: titolo + descrizione
  const head = document.createElement("div");
  head.className = "project-head";

  const title = document.createElement("h2");
  title.className = "project-title";

  const hiddenName = document.createElement("span");   // per screen reader
  hiddenName.className = "visually-hidden";
  hiddenName.textContent = `${project.name} – `;
  title.appendChild(hiddenName);

  project.label.filter(Boolean).forEach((line, k) => {
    if (k) title.appendChild(document.createElement("br"));
    title.appendChild(document.createTextNode(line));
  });

  const description = document.createElement("div");
  description.className = "project-description";
  project.description.forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    description.appendChild(p);
  });

  head.append(title, description);
  section.appendChild(head);

  // Testo grigio sotto la descrizione
  if (project.summary) {
    const summary = document.createElement("p");
    summary.className = "project-summary";
    summary.textContent = project.summary;
    section.appendChild(summary);
  }

  // Foto impilate (nascoste finché non vengono trovate)
  const stackEl = document.createElement("div");
  stackEl.className = "stack";
  stackEl.setAttribute("role", "button");
  stackEl.tabIndex = 0;
  stackEl.setAttribute("aria-label", `Sfoglia le immagini di ${project.name}`);
  stackEl.hidden = true;
  section.appendChild(stackEl);

  return { section, stack: createStack(stackEl, project) };
}

/* ---------- Pagina Progetti ---------- */

function initProjects(page) {
  const listEl = page.querySelector(".project-list");
  const feedEl = page.querySelector(".project-feed");

  const built = PROJECTS.map(buildProject);
  const sections = built.map((b) => b.section);
  built.forEach((b) => feedEl.appendChild(b.section));

  let activeIndex = -1;
  let locked = false;    // durante lo scroll avviato da un clic sul menu
  let lockTimer = null;

  // --- Menu ---
  const buttons = PROJECTS.map((project, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = project.name;

    btn.addEventListener("click", () => {
      locked = true;
      setActive(i, true);
      sections[i].scrollIntoView({ behavior: "smooth", block: "start" });

      clearTimeout(lockTimer);
      lockTimer = setTimeout(() => {
        locked = false;
        updateFromScroll();
      }, 900);
    });

    li.appendChild(btn);
    listEl.appendChild(li);
    return btn;
  });

  // Evidenzia nel menu il progetto che si sta guardando
  function setActive(index, updateHash) {
    if (index === activeIndex) return;
    activeIndex = index;

    buttons.forEach((btn, i) => {
      const active = i === index;
      btn.classList.toggle("is-active", active);
      if (active) btn.setAttribute("aria-current", "true");
      else btn.removeAttribute("aria-current");
    });

    if (updateHash) {
      history.replaceState(null, "", `#${PROJECTS[index].id}`);
    }
  }

  // Il progetto "attivo" è l'ultimo il cui inizio ha superato il 40% dello schermo
  function updateFromScroll() {
    if (locked) return;
    const line = window.innerHeight * 0.4;
    let index = 0;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= line) index = i;
    });
    setActive(index, true);
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateFromScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", updateFromScroll);

  // --- Le foto si cercano solo quando il progetto sta per entrare nello schermo ---
  if ("IntersectionObserver" in window) {
    const loader = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = sections.indexOf(entry.target);
            built[i].stack.load();
            loader.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "400px 0px" }
    );
    sections.forEach((section) => loader.observe(section));
  } else {
    built.forEach((b) => b.stack.load());
  }

  // --- Posizione iniziale: se l'indirizzo contiene #progetto, vai lì ---
  const fromHash = PROJECTS.findIndex((p) => `#${p.id}` === location.hash);
  if (fromHash >= 0) {
    sections[fromHash].scrollIntoView({ behavior: "auto", block: "start" });
    setActive(fromHash, false);
  } else {
    setActive(0, false);
  }
}

const projectPage = document.querySelector(".project-page");
if (projectPage) initProjects(projectPage);
