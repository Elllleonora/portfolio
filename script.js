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

// Contenuti dei progetti. Per aggiungere o modificare un progetto
// basta cambiare questo elenco.
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

// Quante foto restano visibili nella pila
const VISIBLE_CARDS = 5;

function initProjects(page) {
  const listEl = page.querySelector(".project-list");
  const titleEl = page.querySelector(".project-title");
  const descEl = page.querySelector(".project-description");
  const summaryEl = page.querySelector(".project-summary");
  const stackEl = page.querySelector(".stack");

  let order = [];        // carte della pila, dalla prima (davanti) all'ultima
  let token = 0;         // evita che un progetto vecchio sovrascriva quello nuovo
  let animating = false; // blocca i clic durante l'animazione

  // --- Elenco progetti ---
  const buttons = PROJECTS.map((project, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = project.name;
    btn.addEventListener("click", () => show(i));
    li.appendChild(btn);
    listEl.appendChild(li);
    return btn;
  });

  // --- Pila di foto ---
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
  // Restituisce il percorso del file trovato, oppure null.
  async function findPhoto(prefix, number) {
    const sources = EXTENSIONS.map((ext) => `${IMG_FOLDER}/${prefix}-${number}.${ext}`);
    const results = await Promise.all(sources.map(tryLoad));
    const index = results.indexOf(true);
    return index >= 0 ? sources[index] : null;
  }

  // Trova tutte le foto di un progetto: prefisso-1, prefisso-2, ...
  // Si ferma dopo 2 numeri consecutivi mancanti.
  async function findAllPhotos(prefix, myToken) {
    const found = [];
    let misses = 0;

    for (let n = 1; n <= MAX_PHOTOS && misses < 2; n++) {
      const src = await findPhoto(prefix, n);
      if (myToken !== token) return [];          // nel frattempo è cambiato progetto
      if (src) {
        found.push(src);
        misses = 0;
      } else {
        misses++;
      }
    }
    return found;
  }

  function buildStack(project) {
    const myToken = ++token;
    stackEl.replaceChildren();
    stackEl.hidden = true;
    order = [];
    animating = false;

    if (!project.imagePrefix) return;

    findAllPhotos(project.imagePrefix, myToken).then((found) => {
      if (myToken !== token || !found.length) return;

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

  // --- Mostra un progetto ---
  function show(index, updateHash = true) {
    const project = PROJECTS[index];

    buttons.forEach((btn, i) => {
      const active = i === index;
      btn.classList.toggle("is-active", active);
      if (active) btn.setAttribute("aria-current", "true");
      else btn.removeAttribute("aria-current");
    });

    // Titolo (una riga per voce)
    titleEl.replaceChildren();
    project.label.filter(Boolean).forEach((line, k) => {
      if (k) titleEl.appendChild(document.createElement("br"));
      titleEl.appendChild(document.createTextNode(line));
    });

    // Descrizione
    descEl.replaceChildren(
      ...project.description.map((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        return p;
      })
    );

    // Testo grigio sotto la descrizione
    summaryEl.textContent = project.summary;
    summaryEl.hidden = !project.summary;

    document.title = `${project.name} – Eleonora Olivieri`;
    if (updateHash) history.replaceState(null, "", `#${project.id}`);

    buildStack(project);
  }

  // Progetto iniziale: quello indicato nell'indirizzo (#id), altrimenti il primo
  const fromHash = PROJECTS.findIndex((p) => `#${p.id}` === location.hash);
  show(fromHash >= 0 ? fromHash : 0, false);
}

const projectPage = document.querySelector(".project-page");
if (projectPage) initProjects(projectPage);
