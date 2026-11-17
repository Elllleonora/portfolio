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
// Se la tua cartella si chiama diversamente (es. "omg"), cambialo qui.
const IMG_FOLDER = "img";

// Contenuti dei progetti. Per aggiungere o modificare un progetto
// basta cambiare questo elenco. Le foto vanno scritte come nome file
// (es. "gramma-1.jpg") e devono essere dentro la cartella IMG_FOLDER.
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
    images: ["gramma-1.jpg", "gramma-2.jpg", "gramma-3.jpg", "gramma-4.jpg"]
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

function initProjects(page) {
  const listEl = page.querySelector(".project-list");
  const titleEl = page.querySelector(".project-title");
  const descEl = page.querySelector(".project-description");
  const summaryEl = page.querySelector(".project-summary");
  const stackEl = page.querySelector(".stack");

  let order = [];   // carte della pila, dalla prima (davanti) all'ultima
  let token = 0;    // evita che un progetto vecchio sovrascriva quello nuovo

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
      card.dataset.depth = depth < 4 ? String(depth) : "hidden";
    });
  }

  function next() {
    if (order.length < 2) return;
    order.push(order.shift());   // la foto davanti va in fondo
    layout();
  }

  function prev() {
    if (order.length < 2) return;
    order.unshift(order.pop());  // l'ultima foto torna davanti
    layout();
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

  function imageExists(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  function buildStack(project) {
    const myToken = ++token;
    stackEl.replaceChildren();
    stackEl.hidden = true;
    order = [];

    const sources = project.images.map((file) => `${IMG_FOLDER}/${file}`);

    Promise.all(sources.map(imageExists)).then((results) => {
      if (myToken !== token) return;            // nel frattempo è cambiato progetto

      const found = sources.filter((_, k) => results[k]);
      if (!found.length) return;                // nessuna foto: la pila resta nascosta

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
