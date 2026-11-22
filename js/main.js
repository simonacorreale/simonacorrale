// ---------- Selettore lingua ----------
const linguaBtn = document.querySelector('.lingua__attuale');
const linguaMenu = document.getElementById('menu-lingue');

function apriMenu(apri) {
  linguaBtn.setAttribute('aria-expanded', apri);
  linguaMenu.hidden = !apri;
}

linguaBtn.addEventListener('click', () => apriMenu(linguaMenu.hidden));
document.addEventListener('click', (e) => {
  if (!e.target.closest('.lingua')) apriMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') apriMenu(false);
});

// ---------- Traduzioni italiano / inglese ----------
// Per aggiungere un testo: data-i18n="chiave" nell'HTML + la chiave qui in entrambe le lingue.
const TESTI = {
  it: {
    lingua: 'Italiano',
    linguaSigla: 'IT',
    linguaAria: 'Lingua: Italiano',
    suDiMe: 'Su di me',
    saluto: 'Ciao, sono <strong>Simona</strong>',
    domanda: 'Di che mi occupo?',
    cardTest: 'Test',
    nav: 'Principale',
    ruota: 'Di che mi occupo',
    chiudi: 'Chiudi',
    magia: 'Scorri e lancia la magia',
    magiaDesktop: 'Agita la bacchetta o scorri per lanciare la magia',
    lancia: 'Lancia la magia',
    lavori: 'I miei lavori',
    lavoriTesto: 'Presto qui i miei progetti.',
    chiSono: 'Chi sono',
    chiSonoTitolo: 'Titolo della sezione',
    chiSonoTesto1: 'Primo paragrafo della tua storia.',
    chiSonoTesto2: 'Secondo paragrafo della tua storia.',
    fotoAlt: 'Ritratto di Simona Correale',
    descDesignSystem: 'Librerie di componenti, token e regole condivise: un linguaggio unico per progettare interfacce coerenti e scalabili.',
    descUx: 'Ricerca, flussi e architettura dell’informazione per esperienze chiare, che partono dai bisogni reali delle persone.',
    descTest: 'Test di usabilità e validazione con gli utenti: ogni scelta di design viene verificata prima di andare avanti.',
    descVisual: 'Tipografia, colore e composizione per interfacce riconoscibili, curate in ogni dettaglio.',
    descAi: 'Progettare con e per l’intelligenza artificiale: strumenti, prototipi e interfacce che la rendono utile e comprensibile.',
    descFelting: 'La mia passione manuale: piccoli personaggi in lana infeltrita con l’ago, un punto alla volta.',
    scrivimi: 'Scrivimi',
    seguimi: 'Seguimi',
    mioLavoro: 'Il mio lavoro',
    copiaEmail: 'Copia l’email',
    emailCopiata: 'Copiata!',
    lavoriamo: 'Lavoriamo insieme',
    cv: 'CV (PDF)',
  },
  en: {
    lingua: 'English',
    linguaSigla: 'EN',
    linguaAria: 'Language: English',
    suDiMe: 'About me',
    saluto: 'Hi, I’m <strong>Simona</strong>',
    domanda: 'What do I do?',
    cardTest: 'Testing',
    nav: 'Main',
    ruota: 'What I do',
    chiudi: 'Close',
    magia: 'Scroll to cast the spell',
    magiaDesktop: 'Shake the wand or scroll to cast the spell',
    lancia: 'Cast the spell',
    lavori: 'My work',
    lavoriTesto: 'My projects are coming soon.',
    chiSono: 'About me',
    chiSonoTitolo: 'Section title',
    chiSonoTesto1: 'First paragraph of your story.',
    chiSonoTesto2: 'Second paragraph of your story.',
    fotoAlt: 'Portrait of Simona Correale',
    descDesignSystem: 'Component libraries, tokens and shared rules: one language to design consistent, scalable interfaces.',
    descUx: 'Research, flows and information architecture for clear experiences built on people’s real needs.',
    descTest: 'Usability testing and validation: every design choice is checked with users before moving on.',
    descVisual: 'Typography, colour and composition for distinctive interfaces, crafted in every detail.',
    descAi: 'Designing with and for AI: tools, prototypes and interfaces that make it useful and understandable.',
    descFelting: 'My hands-on passion: little characters made of needle-felted wool, one stitch at a time.',
    scrivimi: 'Write to me',
    seguimi: 'Follow me',
    mioLavoro: 'My work',
    copiaEmail: 'Copy email',
    emailCopiata: 'Copied!',
    lavoriamo: 'Let’s work together',
    cv: 'CV (PDF)',
  },
};

// localStorage può non essere disponibile (es. navigazione privata): in quel caso non si ricorda la scelta
const leggiLingua = () => { try { return localStorage.getItem('lingua'); } catch { return null; } };
const salvaLingua = (l) => { try { localStorage.setItem('lingua', l); } catch { /* niente */ } };

function impostaLingua(lingua) {
  const testi = TESTI[lingua];
  document.documentElement.lang = lingua;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.innerHTML = testi[el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', testi[el.dataset.i18nAria]));
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => { el.alt = testi[el.dataset.i18nAlt]; });
  document.querySelectorAll('[data-lingua]').forEach((voce) => {
    const attiva = voce.dataset.lingua === lingua;
    voce.classList.toggle('lingua__voce--selezionata', attiva);
    voce.setAttribute('aria-current', attiva);
  });
  salvaLingua(lingua);
}

document.querySelectorAll('[data-lingua]').forEach((voce) => {
  voce.addEventListener('click', (e) => {
    e.preventDefault();
    impostaLingua(voce.dataset.lingua);
    apriMenu(false);
    linguaBtn.focus();
  });
});

// Lingua iniziale: quella scelta l'ultima volta, altrimenti quella del browser (italiano se è italiano, se no inglese)
const linguaSalvata = leggiLingua();
const linguaIniziale = TESTI[linguaSalvata] ? linguaSalvata
  : (navigator.language || 'it').toLowerCase().startsWith('it') ? 'it' : 'en';
if (linguaIniziale !== 'it') impostaLingua(linguaIniziale);

// ---------- Footer: copia l'email negli appunti ----------
const copia = document.querySelector('.footer__copia');
copia.addEventListener('click', async () => {
  const testi = TESTI[document.documentElement.lang] || TESTI.it;
  try {
    await navigator.clipboard.writeText(copia.dataset.email);
    copia.textContent = testi.emailCopiata;
    setTimeout(() => { copia.textContent = testi.copiaEmail; }, 2000);
  } catch {
    location.href = 'mailto:' + copia.dataset.email; // appunti non disponibili: apre la mail
  }
});

// ---------- Titolo diviso in lettere (per l'animazione "magica" in css/style.css) ----------
const titolo = document.querySelector('.intro__titolo');
const frase = titolo.textContent.trim();
titolo.setAttribute('aria-label', frase); // i lettori di schermo leggono la frase intera
titolo.textContent = '';
let indice = 0;
frase.split(' ').forEach((parola, n) => {
  if (n > 0) titolo.append(' ');
  const contenitore = document.createElement('span');
  contenitore.className = 'parola';
  contenitore.setAttribute('aria-hidden', 'true');
  for (const carattere of parola) {
    const lettera = document.createElement('span');
    lettera.className = 'lettera';
    lettera.textContent = carattere;
    lettera.style.setProperty('--i', indice++);
    contenitore.append(lettera);
  }
  titolo.append(contenitore);
});

// ---------- Occhio che segue il mouse ----------
const occhio = document.querySelector('.occhio');
const MAX_X = 11; // px: quanto si sposta l'iride a destra/sinistra
const MAX_Y = 3;  // px: quanto si sposta in alto/in basso
let timerOcchio;

document.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse') return;
  const r = occhio.getBoundingClientRect();
  const limita = (v) => Math.max(-1, Math.min(1, v));
  // Distanza del mouse dal centro dell'occhio, in proporzione allo schermo
  const x = limita((e.clientX - (r.left + r.width / 2)) / (innerWidth / 2));
  const y = limita((e.clientY - (r.top + r.height / 2)) / (innerHeight / 2));
  occhio.style.setProperty('--ox', `${x * MAX_X}px`);
  occhio.style.setProperty('--oy', `${y * MAX_Y}px`);
  occhio.classList.add('occhio--segue');
  // Mouse fermo per 3 secondi: torna il movimento automatico
  clearTimeout(timerOcchio);
  timerOcchio = setTimeout(() => occhio.classList.remove('occhio--segue'), 3000);
});

// ---------- Ruota di card ----------
const area = document.querySelector('.ruota-area');
const carte = [...document.querySelectorAll('.card')];
const N = carte.length;
const VISIBILI = 2; // card visibili per lato
let attiva = 0;

// Distanza della card i dalla card attiva, nel verso più breve (-N/2 < d <= N/2)
function distanza(i) {
  const d = (((i - attiva) % N) + N) % N;
  return d > N / 2 ? d - N : d;
}

// Sposta la card senza animazione
function teletrasporta(c, d) {
  c.classList.add('card--salto');
  c.style.setProperty('--d', d);
  c.offsetWidth; // applica subito la nuova posizione
  c.classList.remove('card--salto');
}

function disponi() {
  carte.forEach((c, i) => {
    const d = distanza(i);
    const prima = Number(c.style.getPropertyValue('--d') || d);
    clearTimeout(c.timerSalto);
    if (Math.abs(d - prima) <= 1) {
      c.style.setProperty('--d', d);
    } else if (Math.abs(prima) <= VISIBILI) {
      // Era visibile: scivola fuori dal suo lato, poi passa (nascosta) dall'altra parte
      c.style.setProperty('--d', prima + Math.sign(prima));
      c.timerSalto = setTimeout(() => teletrasporta(c, d), 400);
    } else {
      // Era nascosta: parte da fuori dall'arco, dal lato giusto, ed entra scivolando
      teletrasporta(c, d + Math.sign(d));
      c.style.setProperty('--d', d);
    }
    c.classList.toggle('card--fuori', Math.abs(d) > VISIBILI);
    c.classList.toggle('card--attiva', d === 0);
    c.style.zIndex = 10 - Math.abs(d); // le card più vicine al centro stanno sopra, uguale sui due lati
    c.setAttribute('aria-current', d === 0);
  });
}

// Avanza un passo alla volta, così ogni card scorre lungo l'arco
let coda = Promise.resolve();
function sposta(passi) {
  const verso = Math.sign(passi);
  for (let k = 0; k < Math.abs(passi); k++) {
    coda = coda.then(() => {
      attiva = (attiva + verso + N) % N;
      disponi();
      return new Promise((fine) => setTimeout(fine, 180));
    });
  }
}

// ---------- Modale con la card in dettaglio ----------
const modale = document.querySelector('.modale');
const modaleTitolo = document.getElementById('modale-titolo');
const modaleDescrizione = document.getElementById('modale-descrizione');
let cardAperta = null;

function apriModale(card) {
  if (modale.open) return;
  cardAperta = card;
  modaleTitolo.textContent = card.querySelector('.card__titolo').textContent;
  modaleDescrizione.textContent = card.querySelector('.card__descrizione').textContent;
  modale.showModal();
  clearInterval(timer);
}

modale.addEventListener('close', () => {
  cardAperta.classList.remove('card--girata'); // la card si rigira sul fronte
  cardAperta.focus({ preventScroll: true });
  riavviaAuto();
});
modale.querySelector('.modale__chiudi').addEventListener('click', () => modale.close());
// Click sullo sfondo sfocato (fuori dalla card) = chiudi
modale.addEventListener('click', (e) => { if (e.target === modale) modale.close(); });

// Click/tap su una card: ruota al centro, poi si apre la modale
const FINE_ROTAZIONE = 450; // ms: attesa perché l'ultima card finisca di scorrere

// Hover: la card si inclina in 3D verso il mouse
const MAX_GRADI = 14;

carte.forEach((card, i) => {
  card.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || menoMovimento) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; // da -0.5 a 0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty('--ry', `${x * MAX_GRADI * 2}deg`);
    card.style.setProperty('--rx', `${-y * MAX_GRADI * 2}deg`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });

  card.addEventListener('click', () => {
    if (modale.open || card.classList.contains('card--girata')) return;
    clearInterval(timer);
    const passi = distanza(i);
    if (passi === 0) return giraEApri(card);
    sposta(passi);
    coda.then(() => setTimeout(() => giraEApri(card), FINE_ROTAZIONE));
  });
});

// La card si gira (mostra il retro), poi si apre la modale
const DURATA_GIRO = 600; // ms, uguale alla transizione di .card--girata in css/style.css
function giraEApri(card) {
  card.classList.add('card--girata');
  setTimeout(() => apriModale(card), menoMovimento ? 0 : DURATA_GIRO);
}

area.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { sposta(1); riavviaAuto(); }
  if (e.key === 'ArrowLeft') { sposta(-1); riavviaAuto(); }
});

// Rotazione automatica lenta: si ferma con il mouse sopra, e non parte se l'utente preferisce meno animazioni
const menoMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (menoMovimento) occhio.pauseAnimations(); // l'occhio resta aperto, senza sbattere

let timer;
function riavviaAuto() {
  clearInterval(timer);
  if (!menoMovimento && !modale.open && area.classList.contains('visibile') && !area.classList.contains('ruota-area--chiusa')) timer = setInterval(() => sposta(1), 4000);
}
area.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') clearInterval(timer); });
area.addEventListener('pointerleave', riavviaAuto);

// Scorrendo oltre la hero il mazzo si chiude; tornando su si riapre a ventaglio
let chiusa = false;
addEventListener('scroll', () => {
  const ora = scrollY > innerHeight * 0.15;
  if (ora === chiusa) return;
  chiusa = ora;
  area.classList.toggle('ruota-area--chiusa', chiusa);
  riavviaAuto();
}, { passive: true });

// ---------- Schermata d'apertura: bacchetta da prestigiatore con scia ----------
// Agitando la bacchetta, scorrendo (rotella, swipe, frecce/spazio) o cliccandola si entra nel sito, poi parte `poi`.
const magia = document.querySelector('.magia');

// Il sito parte sempre dall'alto (il browser non ripristina la posizione di scroll precedente)
history.scrollRestoration = 'manual';

function avviaMagia(poi) {
  const contenuto = [document.querySelector('.header'), document.querySelector('.intro')];
  document.documentElement.classList.add('intro-attiva');
  scrollTo({ top: 0, behavior: 'instant' });

  // Lo scroll usato per lanciare la magia può continuare per inerzia (trackpad):
  // la pagina si sblocca solo quando la rotella è ferma da un po'
  const QUIETE = 400; // ms senza eventi di scroll
  let ultimoScroll = 0;
  const registraScroll = () => { ultimoScroll = performance.now(); };
  addEventListener('wheel', registraScroll, { passive: true });
  addEventListener('touchmove', registraScroll, { passive: true });

  function sblocca() {
    if (performance.now() - ultimoScroll < QUIETE) {
      setTimeout(sblocca, 100);
      return;
    }
    removeEventListener('wheel', registraScroll);
    removeEventListener('touchmove', registraScroll);
    scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.classList.remove('intro-attiva');
    contenuto.forEach((el) => { el.inert = false; });
    poi();
  }
  contenuto.forEach((el) => { el.inert = true; }); // il sito sotto non si può usare finché c'è la schermata

  const bacchetta = magia.querySelector('.magia__bacchetta');
  const punta = magia.querySelector('.magia__punta');

  // ----- Scia (canvas) -----
  // Un tratto pieno parte dalla punta della bacchetta e si assottiglia verso la coda. Nient'altro intorno.
  const canvas = magia.querySelector('.magia__scia');
  const ctx = canvas.getContext('2d');
  const scia = []; // ultime posizioni: {x, y, t}
  const DURATA_SCIA = 350; // ms: lunghezza della scia
  const SPESSORE_SCIA = 4;  // px in testa
  const COLORE_SCIA = '#D9D5FF';

  function ridimensiona() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  ridimensiona();
  addEventListener('resize', ridimensiona);

  function posizionePunta() {
    const r = punta.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  // ----- Bacchetta che segue il mouse (desktop): è la punta ad agganciarsi al cursore -----
  let mouse = null;     // ultima posizione del mouse
  let base = null;      // centro della bacchetta nella sua posizione originale
  let aggancio = null;  // distanza tra punta e centro della bacchetta
  let tx = 0, ty = 0, rot = 0;

  // Ricalcolato a ogni fotogramma: resta giusto anche se la finestra cambia o il font sposta il layout
  function calcolaBase() {
    const r = bacchetta.getBoundingClientRect();
    base = { x: r.left + r.width / 2 - tx, y: r.top + r.height / 2 - ty };
  }

  // Agitare = almeno 4 cambi di direzione rapidi in meno di un secondo
  let ultimaX = null, ultimaDirezione = 0;
  let inversioni = [];

  function suPuntatore(e) {
    if (e.pointerType !== 'mouse') return;
    if (!mouse) {
      magia.classList.add('magia--segue');
      calcolaBase();
      const p = posizionePunta();
      aggancio = { x: p.x - base.x, y: p.y - base.y };
    }
    mouse = { x: e.clientX, y: e.clientY };

    if (ultimaX !== null) {
      const dx = e.clientX - ultimaX;
      if (Math.abs(dx) > 10) {
        const direzione = Math.sign(dx);
        const ora = performance.now();
        if (ultimaDirezione && direzione !== ultimaDirezione) inversioni.push(ora);
        ultimaDirezione = direzione;
        inversioni = inversioni.filter((t) => ora - t < 900);
        if (inversioni.length >= 4) lancia();
      }
    }
    ultimaX = e.clientX;
  }
  addEventListener('pointermove', suPuntatore);

  // ----- Ciclo di animazione: muove la bacchetta e disegna la scia -----
  let precedente = performance.now();

  // La scia parte solo a font caricati: quando arriva il font ARP il testo cambia altezza e la bacchetta si sposta,
  // e senza questa attesa comparirebbe una riga dritta all'apertura
  let fontPronti = false;
  document.fonts.ready.then(() => requestAnimationFrame(() => { fontPronti = true; }));

  function fotogramma(ora) {
    if (!magia.isConnected) return; // schermata rimossa: fine
    const f = Math.min(ora - precedente, 50) / 16.7; // 1 = un fotogramma a 60fps
    precedente = ora;

    // La punta insegue il mouse con un po' di ritardo, il bastoncino si inclina nel verso del movimento
    if (mouse && !lanciata) {
      calcolaBase();
      const prima = tx;
      tx += (mouse.x - aggancio.x - base.x - tx) * Math.min(0.25 * f, 1);
      ty += (mouse.y - aggancio.y - base.y - ty) * Math.min(0.25 * f, 1);
      const inclinazione = Math.max(-35, Math.min(35, (tx - prima) * 1.6));
      rot += (inclinazione - rot) * Math.min(0.15 * f, 1);
      bacchetta.style.setProperty('--tx', `${tx}px`);
      bacchetta.style.setProperty('--ty', `${ty}px`);
      bacchetta.style.setProperty('--rot', `${rot}deg`);
    }

    const p = posizionePunta();
    // Un salto enorme in un solo fotogramma (es. finestra ridimensionata) non è un movimento: riparti da capo
    const ultimo = scia[scia.length - 1];
    if (ultimo && Math.hypot(p.x - ultimo.x, p.y - ultimo.y) > 150) scia.length = 0;
    if (fontPronti) scia.push({ x: p.x, y: p.y, t: ora });
    while (scia.length && ora - scia[0].t > DURATA_SCIA) scia.shift();

    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.lineCap = 'round';
    ctx.strokeStyle = COLORE_SCIA;
    for (let k = 1; k < scia.length; k++) {
      const a = scia[k - 1], b = scia[k];
      ctx.lineWidth = SPESSORE_SCIA * (1 - (ora - b.t) / DURATA_SCIA);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    requestAnimationFrame(fotogramma);
  }
  requestAnimationFrame(fotogramma);

  // ----- Lancio della magia -----
  let lanciata = false;
  let inizioTocco = null;

  function lancia() {
    if (lanciata) return;
    lanciata = true;
    removeEventListener('wheel', suRotella);
    removeEventListener('touchstart', suInizioTocco);
    removeEventListener('touchmove', suTocco);
    removeEventListener('keydown', suTasto);
    removeEventListener('pointermove', suPuntatore);

    magia.classList.add('magia--lancio');                             // colpo di bacchetta
    setTimeout(() => magia.classList.add('magia--chiusura'), 500);    // poi la schermata svanisce
    setTimeout(() => {
      magia.remove();
      removeEventListener('resize', ridimensiona);
      sblocca();
    }, 1300);
  }

  const suRotella = (e) => { if (e.deltaY > 0) lancia(); };
  const suInizioTocco = (e) => { inizioTocco = e.touches[0].clientY; };
  const suTocco = (e) => { if (inizioTocco !== null && inizioTocco - e.touches[0].clientY > 30) lancia(); };
  const suTasto = (e) => {
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); lancia(); }
  };

  addEventListener('wheel', suRotella, { passive: true });
  addEventListener('touchstart', suInizioTocco, { passive: true });
  addEventListener('touchmove', suTocco, { passive: true });
  addEventListener('keydown', suTasto);
  bacchetta.addEventListener('click', lancia);
}

// ---------- Animazioni d'ingresso ----------
// Le card partono impilate al centro e si aprono a ventaglio quando la ruota compare
const DURATA_VENTAGLIO = 1100; // ms, uguale a .ruota-area--ventaglio in css/style.css

function apriVentaglio() {
  area.classList.add('ruota-area--ventaglio');
  disponi();
  setTimeout(() => area.classList.remove('ruota-area--ventaglio'), DURATA_VENTAGLIO);
  riavviaAuto();
}

if (menoMovimento) {
  magia.remove(); // chi preferisce meno animazioni va direttamente al sito
  document.querySelectorAll('.rivela').forEach((el) => el.classList.add('visibile'));
  apriVentaglio();
} else {
  carte[0].classList.add('card--attiva'); // la prima card sta sopra la pila

  // Sequenza dopo il titolo: "Di che mi occupo?" → occhio magico → card
  const DOPO_DOMANDA = 300;    // ms tra la domanda e l'occhio
  const DURATA_OCCHIO = 800;   // ms, uguale a occhio-magia in css/style.css
  const domanda = document.querySelector('.intro__domanda');

  // Le card compaiono solo quando: 1) l'intro è finita  2) la loro area è nello schermo
  let introFinita = false;
  let areaInVista = false;
  function mostraCarte() {
    if (!introFinita || !areaInVista || area.classList.contains('visibile')) return;
    area.classList.add('visibile');
    setTimeout(apriVentaglio, 300);
  }

  // Il resto della pagina (sotto la hero) aspetta la fine della hero, poi compare un elemento alla volta
  const PASSO_RESTO = 150; // ms tra un elemento e il successivo
  let restoPronto = false;
  const restoInAttesa = [];
  function liberaResto() {
    if (restoPronto) return;
    restoPronto = true;
    restoInAttesa.forEach((el, i) => {
      el.style.setProperty('--ritardo', `${(i * PASSO_RESTO) / 1000}s`);
      el.classList.add('visibile');
    });
  }

  let titoloFinito = false;
  function fineTitolo() {
    if (titoloFinito) return; // può arrivare due volte (fine animazione + timer di sicurezza)
    titoloFinito = true;
    domanda.classList.add('visibile');
    setTimeout(() => {
      occhio.classList.add('visibile');
      setTimeout(() => {
        introFinita = true;
        mostraCarte();
        setTimeout(liberaResto, 300 + DURATA_VENTAGLIO); // dopo che le card si sono aperte
      }, DURATA_OCCHIO);
    }, DOPO_DOMANDA);
  }
  // Aspetta la fine del riempimento dell'ultima lettera
  function aspettaTitolo() {
    const lettere = titolo.querySelectorAll('.lettera');
    const riempi = lettere[lettere.length - 1].getAnimations()
      .find((a) => a.animationName === 'lettera-riempi');
    if (riempi) riempi.finished.then(fineTitolo);
    else fineTitolo();
  }

  // Avvia le animazioni d'ingresso (dopo che è stata lanciata la magia)
  function entra(el) {
    if (el === area) {
      areaInVista = true;
      mostraCarte();
      return;
    }
    if (!restoPronto && !el.closest('.intro, .header')) {
      restoInAttesa.push(el);
      return;
    }
    el.classList.add('visibile');
    // Sicurezza: se l'animazione del titolo non arriva alla fine (es. scheda in background), le card compaiono comunque
    if (el === titolo) {
      aspettaTitolo();
      setTimeout(fineTitolo, 6000);
    }
  }

  function avviaIngresso() {
    const osservatore = new IntersectionObserver((voci) => {
      voci.forEach((voce) => {
        if (!voce.isIntersecting) return;
        osservatore.unobserve(voce.target);
        entra(voce.target);
      });
    }, { threshold: 0.15 });
    // Ciò che è già nello schermo parte subito; il resto quando ci si arriva scorrendo
    document.querySelectorAll('.rivela:not([data-dopo-titolo])').forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.9) entra(el);
      else osservatore.observe(el);
    });
  }

  avviaMagia(avviaIngresso);
}
