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

// Estensioni provate in automatico quando nell'elenco "images"
// scrivi il nome senza estensione (es. "gramma-1").
const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif", "JPG", "JPEG", "PNG", "WEBP"];

// Contenuti dei progetti. Per aggiungere o modificare un progetto
// basta cambiare questo elenco. Nelle foto puoi scrivere il nome
// senza estensione ("gramma-1") oppure con ("gramma-1.png").
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
    images: ["gramma-1", "gramma-2", "gramma-3", "gramma-4"]
  },
  {
    id: "vocabolante",
    name: "Vocabolante",
    label: ["Tipo di progetto", "Ambito", "Anno"],
    description: ["Descrizione in arrivo."],
    summary: "",
    images: []
  },
  {
    id: "the-evolution-of-our-ecosystems",
    name: "The Evolution of our Ecosystems",
    label: ["Tipo di progetto", "Ambito", "Anno"],
    description: ["Descrizione in arrivo."],
    summary: "",
    images: []
  },
  {
    id: "arete",
    name: "Aretè",
    label: ["Tipo di progetto", "Ambito", "Anno"],
    description: ["Descrizione in arrivo."],
    summary: "",
    images: []
  },
  {
    id: "legami-del-futuro",
    name: "Legami del futuro",
    label: ["Tipo di progetto", "Ambito", "Anno"],
    description: ["Descrizione in arrivo."],
    summary: "",
    images: []
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

  // Trova il file giusto provando le estensioni una dopo l'altra
  async function resolveImage(name) {
    const hasExtension = /\.[a-z0-9]+$/i.test(name);
    const candidates = hasExtension
      ? [`${IMG_FOLDER}/${name}`]
      : EXTENSIONS.map((ext) => `${IMG_FOLDER}/${name}.${ext}`);

    for (const src of candidates) {
      if (await tryLoad(src)) return src;
    }
    console.warn(`Immagine non trovata: ${IMG_FOLDER}/${name} (controlla nome ed estensione)`);
    return null;
  }

  function buildStack(project) {
    const myToken = ++token;
    stackEl.replaceChildren();
    stackEl.hidden = true;
    order = [];
    animating = false;

    Promise.all(project.images.map(resolveImage)).then((results) => {
      if (myToken !== token) return;             // nel frattempo è cambiato progetto

      const found = results.filter(Boolean);
      if (!found.length) return;                 // nessuna foto: la pila resta nascosta

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
