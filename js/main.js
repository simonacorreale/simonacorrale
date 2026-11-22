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
    lancia: 'Lancia la magia',
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
    lancia: 'Cast the spell',
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
let cardAperta = null;

function apriModale(card) {
  if (modale.open) return;
  cardAperta = card;
  modaleTitolo.textContent = card.textContent;
  modale.showModal();
  clearInterval(timer);
}

modale.addEventListener('close', () => {
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
    clearInterval(timer);
    const passi = distanza(i);
    if (passi === 0) return apriModale(card);
    sposta(passi);
    coda.then(() => setTimeout(() => apriModale(card), FINE_ROTAZIONE));
  });
});

area.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { sposta(1); riavviaAuto(); }
  if (e.key === 'ArrowLeft') { sposta(-1); riavviaAuto(); }
});

// Rotazione automatica lenta: si ferma con il mouse sopra, e non parte se l'utente preferisce meno animazioni
const menoMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
let timer;
function riavviaAuto() {
  clearInterval(timer);
  if (!menoMovimento && !modale.open && area.classList.contains('visibile')) timer = setInterval(() => sposta(1), 4000);
}
area.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') clearInterval(timer); });
area.addEventListener('pointerleave', riavviaAuto);

// ---------- Schermata d'apertura: bacchetta magica ----------
// Scorrendo (rotella, swipe, frecce/spazio) o cliccando la bacchetta si lancia la magia, poi parte `poi`.
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
  contenuto.forEach((el) => { el.inert = true; }); // il sito sotto non si può usare finché c'è la bacchetta

  let lanciata = false;
  let inizioTocco = null;

  function lancia() {
    if (lanciata) return;
    lanciata = true;
    removeEventListener('wheel', suRotella);
    removeEventListener('touchstart', suInizioTocco);
    removeEventListener('touchmove', suTocco);
    removeEventListener('keydown', suTasto);

    magia.classList.add('magia--lancio');
    setTimeout(esplodiScintille, 250);
    setTimeout(() => magia.classList.add('magia--chiusura'), 700);
    setTimeout(() => {
      magia.remove();
      sblocca();
    }, 1500);
  }

  // Scintille che partono dalla stella in tutte le direzioni
  function esplodiScintille() {
    const r = magia.querySelector('.magia__stella').getBoundingClientRect();
    const colori = ['#AA9AFF', '#D9D5FF', '#5E44FF', '#F3F2F8'];
    for (let k = 0; k < 16; k++) {
      const s = document.createElement('span');
      s.className = 'magia__scintilla';
      s.textContent = '✦';
      s.setAttribute('aria-hidden', 'true');
      const angolo = (k / 16) * Math.PI * 2 + Math.random() * 0.4;
      const distanza = 80 + Math.random() * 120;
      s.style.cssText = `--x:${r.left + r.width / 2}px; --y:${r.top + r.height / 2}px;
        --dx:${Math.cos(angolo) * distanza}px; --dy:${Math.sin(angolo) * distanza}px;
        --dim:${12 + Math.random() * 18}px; --colore:${colori[k % colori.length]}`;
      document.body.append(s);
      s.addEventListener('animationend', () => s.remove());
      setTimeout(() => s.remove(), 1500); // nel caso animationend non arrivi
    }
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
  magia.querySelector('.magia__bacchetta').addEventListener('click', lancia);
}

// ---------- Animazioni d'ingresso ----------
// Le card partono impilate al centro e si aprono a ventaglio quando la ruota compare
const DURATA_VENTAGLIO = 1800; // ms, uguale a .ruota-area--ventaglio in css/style.css

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
  const DOPO_DOMANDA = 700;    // ms tra la domanda e l'occhio
  const DURATA_OCCHIO = 1200;  // ms, uguale a occhio-magia in css/style.css
  const domanda = document.querySelector('.intro__domanda');

  // Le card compaiono solo quando: 1) l'intro è finita  2) la loro area è nello schermo
  let introFinita = false;
  let areaInVista = false;
  function mostraCarte() {
    if (!introFinita || !areaInVista || area.classList.contains('visibile')) return;
    area.classList.add('visibile');
    setTimeout(apriVentaglio, 700);
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
