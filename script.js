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

// Estensioni provate in automatico per ogni foto (le GIF restano animate).
const EXTENSIONS = ["jpg", "JPG", "jpeg", "png", "webp", "gif", "GIF"];

// Numero massimo di foto cercate per progetto.
const MAX_PHOTOS = 40;

// Quanti numeri mancanti di fila sono ammessi prima di smettere di cercare.
const MAX_MISSES = 3;

// Quante foto restano visibili nella pila
const VISIBLE_CARDS = 5;

// Contenuti dei progetti, nell'ordine in cui compaiono nella pagina.
// label: tipologia, ambito e anno (una riga ciascuno).
// description: paragrafi del testo nero.
// summary: testo grigio sotto la descrizione.
// imagePrefix: nome delle foto prima del numero, esattamente come si chiamano i file
//   (es. "legami del futuro" cerca "legami del futuro-1.jpg", "legami del futuro-2.jpg", ...).
//   Se scrivi più nomi, lo script usa il primo che trova.
// video: numero del video su Vimeo (quello dopo /video/ nell'indirizzo). Facoltativo.
// videoTitle: titolo del video (per l'accessibilità). Facoltativo.
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
    imagePrefix: ["gramma"],
    video: "1249798203",
    videoTitle: "gramma-video"
  },
  {
    id: "vocabolante",
    name: "Vocabolante",
    label: ["Workshop", "Graphic Design", "2025"],
    description: [
      "“Vocabolante 2025” è un ciclo di workshop che ha coinvolto, su invito, quattro partecipanti: gli stessi per tutti e quattro gli incontri. Il fulcro di ogni appuntamento era la riscoperta di una parola caduta in disuso. Per questo primo esperimento è stato scelto il termine “erubescenza”.",
      "A partire da questa parola, il secondo obiettivo era quello di non rivelarne il significato reale ai partecipanti, in modo da stimolarli a crearne di nuovi, capaci di rappresentarla in modo originale e personale. Le tecniche artistiche e gli spazi messi a disposizione da Checkpoint Charly ci hanno permesso di esplorare una manualità sempre più rara, accompagnata dalla riscoperta di un nuovo senso per una parola antica, riletta in chiave contemporanea. Ne sono nate interpretazioni condivise, frutto di mani e sguardi che hanno lavorato insieme."
    ],
    summary:
      "Vocabolante si è composto di 4 incontri principali, ognuno relativo a discipline differenti, ma tutti incentrati sulla parola ‘Erubescenza’. Ogni incontro integrava attività di interpretazione e rielaborazione della parola scelta, per riuscire a far emergere nuovi significati provenienti dall’inconsapevolezza del suo vero significato.",
    imagePrefix: ["vocabolante"]
  },
  {
    id: "the-evolution-of-our-ecosystems",
    name: "The Evolution of our Ecosystems",
    label: ["Talk sperimentale", "Service e Graphic Design", "2025"],
    description: [
      "“The Evolution of Our Ecosystem” è una talk di confronto tra diversi progetti di ricerca LIFE su temi ambientali, presentata durante il Po River Blue Fest: un festival fuori dagli schemi, una piattaforma attiva di confronto, sperimentazione e sensibilizzazione sui temi dell’adattamento ai cambiamenti climatici, svoltosi a Ravenna e Bologna nel 2025. La talk propone un’esperienza immersiva nel cuore del Delta del Po. La scoperta degli ecosistemi ravennati segreti e le specie aliene che abitano questi territori unici. Grazie ad attività interattive e al racconto coinvolgente di esperti e ricercatori, i partecipanti diventano i protagonisti di un’esplorazione che unisce conoscenza, creatività e consapevolezza ambientale."
    ],
    summary:
      "La talk prevedeva manifesti informativi sulla biodiversità locale e le sue minacce, accompagnate da una prima attività iniziale: la cianotipia. Il brief progettato prevedeva 4 atti, all’inizio dei quali si coinvolgeva il pubblico con dei brevi e semplici quiz, le cui risposte erano visualizzabili in tempo reale. L’attività finale prevedeva la distribuzione di fogli appartenenti ad una zine, su cui i partecipanti potevano esprimere la loro idea di futuro legata agli ecosistemi terrestri.",
    imagePrefix: ["the evolution of our ecosystems"],
    video: "1249798202",
    videoTitle: "the evolution of our ecosystems-video"
  },
  {
    id: "arete",
    name: "Aretè",
    label: ["Servizio", "Service, Graphic, Web Design", "2025"],
    description: [
      "Aretè è una startup che propone una piattaforma digitale per i festival di arti performative, permettendo agli organizzatori di monitorare i flussi di partecipanti in tempo reale. Facilita la gestione degli spazi cittadini, previene sovraffollamenti e migliora l’esperienza dei visitatori. Al termine dell’evento, elabora analisi e previsioni utili per ottimizzare l’organizzazione delle future edizioni."
    ],
    summary:
      "La piattaforma si suddivide in due modalità: quella per la progettazione, utilizzata dalle organizzazioni prima del festival. Quella dedicata al monitoraggio, invece, sfruttata durante lo svolgimento delle giornate di eventi. Ad ogni partecipante viene distribuito un braccialetto con tecnologia RFID, che raccoglie dati tramite sensori all’interno dei luoghi del festival e li trasmette al database della piattaforma.",
    imagePrefix: ["aretè", "arete"],
    video: "1249798204",
    videoTitle: "aretè-video"
  },
  {
    id: "legami-del-futuro",
    name: "Legami del futuro",
    label: ["Tesi di laurea triennale", "Graphic, Web e Editorial Design", "2023"],
    description: [
      "Partendo dalla sovrappopolazione, la mia tesi si concentra su un microproblema ad esso collegato, quello dei legami moderni.",
      "Le relazioni, come le intendiamo oggi, sono in parte, la causa della devastazione in atto. Esse creano un collegamento inconscio fra relazione e sesso; sesso e riproduzione. Non dobbiamo pensare ad una sola tipologia di famiglia, quella moderna, al servizio del capitale, quella occidentale. Nella cultura contemporanea è abitudine considerare la famiglia ‘completa’ solo quando vi sono dei bambini. “Create kin (legami), non bambini”. (Donna Haraway)",
      "Lo slogan della biologa e filosofa, Donna Haraway, vuole incitarci verso una nuova concezione di relazione. Kin è un termine inglese che si riferisce alle parentele di sangue, ai familiari, alle stirpi. L’obiettivo, però, è quello di trasformare il significato della parola ‘kin’. Kin inteso, non più in senso genealogico, ma come legame con la Terra, con umani e inumani. Kin significa essere-con, tenere assieme."
    ],
    summary:
      "Gli elaborati finali sono due: una vera e propria enciclopedia dei legami, un editoriale che presenta un’accurata ricerca sull’evoluzione passata e futura dei rapporti umani e non, e un sito web dedicato alla data visualization dei dati raccolti riguardanti l’argomento.",
    imagePrefix: ["legami del futuro"],
    video: "1249798205",
    videoTitle: "legami del futuro-video"
  }
];

/* ---------- Ricerca delle foto ---------- */

// Prova a caricare un'immagine; restituisce { src, w, h } oppure null
function tryLoad(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ src, w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Restituisce la prima immagine che si carica (senza aspettare le altre), oppure null.
function firstLoaded(sources) {
  return new Promise((resolve) => {
    let pending = sources.length;
    sources.forEach((src) => {
      tryLoad(src).then((result) => {
        if (result) resolve(result);
        else if (--pending === 0) resolve(null);
      });
    });
  });
}

// Cerca la foto "prefisso-numero". Gestisce spazi e lettere accentate
// (sui Mac i nomi con accento possono essere salvati in due forme diverse: le proviamo entrambe).
async function findPhoto(prefix, number) {
  const names = [...new Set([prefix.normalize("NFC"), prefix.normalize("NFD")])];
  const sources = [];

  names.forEach((name) => {
    EXTENSIONS.forEach((ext) => {
      sources.push(`${IMG_FOLDER}/${encodeURIComponent(`${name}-${number}.${ext}`)}`);
    });
  });

  return firstLoaded(sources);
}

// Trova le foto di un prefisso: prefisso-1, prefisso-2, ...
// Si ferma dopo MAX_MISSES numeri consecutivi mancanti.
async function collectPhotos(prefix) {
  const found = [];
  let misses = 0;

  for (let n = 1; n <= MAX_PHOTOS && misses < MAX_MISSES; n++) {
    const photo = await findPhoto(prefix, n);
    if (photo) {
      found.push(photo);
      misses = 0;
    } else {
      misses++;
    }
  }
  return found;
}

// Prova i nomi del progetto e usa il primo che trova delle foto.
async function findAllPhotos(prefixes) {
  for (const prefix of prefixes) {
    const found = await collectPhotos(prefix);
    if (found.length) return found;
  }
  return [];
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

    const prefixes = [].concat(project.imagePrefix);

    findAllPhotos(prefixes).then((found) => {
      if (!found.length) return;

      order = found.map((photo, k) => {
        const card = document.createElement("div");
        card.className = "stack__card";

        // Ogni foto mantiene il proprio formato:
        // l'altezza è la stessa per tutte, la larghezza dipende dalle proporzioni.
        const ratio = photo.w / photo.h;
        card.style.aspectRatio = `${photo.w} / ${photo.h}`;
        card.style.width = `${Math.min(40 * ratio, 66)}%`;
        card.classList.add(ratio < 1 ? "is-portrait" : "is-landscape");

        const img = document.createElement("img");
        img.src = photo.src;
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

/* ---------- Video Vimeo (uno per progetto, sotto le foto) ---------- */

// Carica una sola volta la libreria di Vimeo, che permette di far partire
// e fermare il video e di gestire l'audio.
let vimeoApiPromise = null;
function loadVimeoApi() {
  if (window.Vimeo && window.Vimeo.Player) return Promise.resolve();
  if (!vimeoApiPromise) {
    vimeoApiPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://player.vimeo.com/api/player.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return vimeoApiPromise;
}

// Video partiti senza audio perché il browser lo ha bloccato.
// Al primo clic o tasto premuto sulla pagina, l'audio viene attivato.
const mutedVideos = new Set();

function unlockAudio() {
  mutedVideos.forEach((video) => video.unmute());
}
["pointerdown", "keydown", "touchend"].forEach((type) => {
  window.addEventListener(type, unlockAudio, { passive: true });
});

function createVideo(wrapEl, project) {
  let player = null;
  let started = false;
  let button = null;

  const api = {
    unmute() {
      if (!player) return;
      player.setMuted(false)
        .then(() => player.setVolume(1))
        .then(() => {
          mutedVideos.delete(api);
          if (button) button.hidden = true;
        })
        .catch(() => {});
    }
  };

  function showUnmuteButton() {
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "video-unmute";
      button.textContent = "Attiva audio";
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        api.unmute();
      });
      wrapEl.appendChild(button);
    }
    button.hidden = false;
  }

  // Parte con l'audio. Se il browser lo blocca, parte comunque senza audio
  // e compare il tasto "Attiva audio".
  async function play() {
    if (!player) return;
    try {
      await player.setMuted(false);
      await player.setVolume(1);
      await player.play();
      mutedVideos.delete(api);
      if (button) button.hidden = true;
    } catch (err) {
      try {
        await player.setMuted(true);
        await player.play();
        mutedVideos.add(api);
        showUnmuteButton();
      } catch (err2) {
        /* il browser non permette l'avvio automatico: resta il pulsante play di Vimeo */
      }
    }
  }

  function pause() {
    if (player) player.pause().catch(() => {});
  }

  // Crea il video (chiamata quando il progetto sta per entrare nello schermo)
  function load() {
    if (started || !project.video) return;
    started = true;

    const iframe = document.createElement("iframe");
    iframe.src =
      `https://player.vimeo.com/video/${project.video}` +
      "?title=0&byline=0&portrait=0&autopause=0&app_id=58479";
    iframe.title = project.videoTitle || `${project.name} – video`;
    iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("frameborder", "0");
    wrapEl.appendChild(iframe);

    loadVimeoApi()
      .then(() => {
        player = new Vimeo.Player(iframe);
        return player.ready();
      })
      .then(() => Promise.all([player.getVideoWidth(), player.getVideoHeight()]))
      .then(([w, h]) => {
        // Il riquadro prende le proporzioni reali del video
        if (w && h) wrapEl.style.aspectRatio = `${w} / ${h}`;

        // Parte quando è ben visibile, si ferma quando esce dallo schermo
        if ("IntersectionObserver" in window) {
          const watcher = new IntersectionObserver(
            (entries) => {
              const ratio = entries[0].intersectionRatio;
              if (ratio >= 0.6) play();
              else if (ratio < 0.25) pause();
            },
            { threshold: [0, 0.25, 0.6] }
          );
          watcher.observe(wrapEl);
        } else {
          play();
        }
      })
      .catch(() => {
        /* se la libreria non si carica, il video resta comunque avviabile a mano */
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

  // Video, nella riga sotto le foto (solo per i progetti che ce l'hanno)
  let video = { load() {} };
  if (project.video) {
    const videoEl = document.createElement("div");
    videoEl.className = "project-video";
    section.appendChild(videoEl);
    video = createVideo(videoEl, project);
  }

  return { section, stack: createStack(stackEl, project), video };
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

  // --- Foto e video si preparano solo quando il progetto sta per entrare nello schermo ---
  if ("IntersectionObserver" in window) {
    const loader = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = sections.indexOf(entry.target);
            built[i].stack.load();
            built[i].video.load();
            loader.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "400px 0px" }
    );
    sections.forEach((section) => loader.observe(section));
  } else {
    built.forEach((b) => {
      b.stack.load();
      b.video.load();
    });
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

/* =========================================================
   SU DI ME: foto me-1, me-2, ... nella colonna a sinistra
   ========================================================= */

// Nome delle foto prima del numero (me-1.jpg, me-2.jpg, ...).
const ABOUT_PHOTO_PREFIX = "me";

function initAboutPhotos(container) {
  collectPhotos(ABOUT_PHOTO_PREFIX).then((found) => {
    found.forEach((photo, k) => {
      const figure = document.createElement("figure");
      figure.className = "about-photo";

      // Ogni foto mantiene il proprio formato, orizzontale o verticale
      const ratio = photo.w / photo.h;
      figure.style.aspectRatio = `${photo.w} / ${photo.h}`;
      figure.classList.add(ratio < 1 ? "is-portrait" : "is-landscape");

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = `Eleonora – foto ${k + 1}`;
      img.loading = "lazy";
      img.draggable = false;

      figure.appendChild(img);
      container.appendChild(figure);
    });
  });
}

const aboutPhotos = document.querySelector(".about-photos");
if (aboutPhotos) initAboutPhotos(aboutPhotos);
