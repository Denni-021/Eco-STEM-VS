const APP_STORAGE_KEY = 'ecostem_app_state_v2';
const ANALYSIS_LIMIT_FREE = Infinity;
const MAX_ANALYSIS_IMAGES = 3;
const CONTACT_WHATSAPP_NUMBER = '50664098842';
const AI_TIMEOUT_MS = 12000;
const AUTH_TOKEN_KEY = 'ecostem_auth_token';
const COOKIE_CONSENT_VERSION = '2026-04-04';

const appConfig = {
  aiVisionEndpoint: window.ECOSTEM_CONFIG?.aiVisionEndpoint || '',
  aiChatEndpoint: window.ECOSTEM_CONFIG?.aiChatEndpoint || '',
  recommendationEndpoint: window.ECOSTEM_CONFIG?.recommendationEndpoint || '',
  paymentEndpoint: window.ECOSTEM_CONFIG?.paymentEndpoint || '',
  authEndpoint: window.ECOSTEM_CONFIG?.authEndpoint || '',
  contactEndpoint: window.ECOSTEM_CONFIG?.contactEndpoint || '',
  iotEndpoint: window.ECOSTEM_CONFIG?.iotEndpoint || '',
  statusEndpoint: window.ECOSTEM_CONFIG?.statusEndpoint || '',
  preferencesEndpoint: window.ECOSTEM_CONFIG?.preferencesEndpoint || '',
  companyEmail: window.ECOSTEM_CONFIG?.companyEmail || 'ecostem.cr@gmail.com',
  apiKey: window.ECOSTEM_CONFIG?.apiKey || ''
};

const state = {
  authMode: 'login',
  usePhone: false,
  analyzing: false,
  selectedImages: [],
  selectedPlan: null,
  selectedPaymentMethod: 'visa',
  location: {
    status: 'idle',
    coords: null,
    place: null,
    terrain: null,
    elevation: null,
    forecast: null,
    permissionRequested: false
  },
  sensors: {
    moisture: 62,
    temp: 24,
    light: 71,
    soilPh: 6.5,
    humidity: 64,
    lastUpdate: null,
    history: [
      { time: '08:00', moisture: 55 },
      { time: '10:00', moisture: 60 },
      { time: '12:00', moisture: 58 },
      { time: '14:00', moisture: 52 },
      { time: '16:00', moisture: 62 }
    ]
  }
};

const chatKnowledge = [
  {
    keywords: ['regar', 'riego', 'agua', 'humedad'],
    answer:
      'No riegues por calendario fijo. Revisa el sustrato: si esta humedo, espera; si esta seco a 2 o 4 cm, riega a profundidad.'
  },
  {
    keywords: ['amarillas', 'amarilla', 'hojas amarillas'],
    answer:
      'Las hojas amarillas pueden indicar exceso de agua, poco drenaje, falta de luz o carencia nutricional. Primero revisa humedad real y luz.'
  },
  {
    keywords: ['plaga', 'plagas', 'acaros', 'cochinilla', 'pulgones'],
    answer:
      'Revisa el enves de las hojas y tallos. Si ves plaga, limpia primero y usa jabon potasico o neem de forma repetida.'
  },
  {
    keywords: ['hongos', 'hongo', 'manchas'],
    answer:
      'Si observas manchas, polvo blanco o zonas blandas, mejora ventilacion, evita mojar hojas y aísla la planta mientras confirmas la causa.'
  },
  {
    keywords: ['luz', 'sol', 'sombra'],
    answer:
      'La luz depende de la especie. Muchas tropicales quieren luz brillante indirecta; cactus y suculentas toleran mucho mas sol directo.'
  }
];

const planCatalog = {
  'Plan Mensual': { code: 'monthly', price: 1.99 },
  'Plan Semestral': { code: 'semiannual', price: 3.99 },
  'Plan Anual': { code: 'annual', price: 5.99 }
};

const plantRecommendationCatalog = [
  {
    id: 'lechuga',
    name: 'Lechuga',
    goal: ['edible'],
    spaces: ['balcony', 'patio', 'garden'],
    light: ['bright', 'direct'],
    care: 'easy',
    experience: ['beginner', 'intermediate', 'advanced'],
    climate: ['cool', 'balanced'],
    humidityAffinity: 'medium',
    tempRange: [12, 25],
    summary: 'Crece rápido, es útil para huertas pequeñas y responde bien a manejo básico.',
    carePlan: ['Usa sustrato suelto con buen drenaje.', 'Riega sin encharcar y evita calor extremo al mediodía.', 'Cosecha hojas externas primero para prolongar la producción.'],
    evidence: 'Suele rendir mejor en climas templados o frescos y con humedad moderada.'
  },
  {
    id: 'culantro',
    name: 'Culantro / cilantro tropical',
    goal: ['edible', 'aromatic'],
    spaces: ['balcony', 'patio', 'garden'],
    light: ['bright', 'medium'],
    care: 'moderate',
    experience: ['beginner', 'intermediate', 'advanced'],
    climate: ['rain', 'balanced'],
    humidityAffinity: 'high',
    tempRange: [18, 30],
    summary: 'Aromática útil para cocina, con buena adaptación a zonas húmedas y manejo frecuente.',
    carePlan: ['Mantén humedad constante pero con drenaje.', 'Prefiere luz intensa sin exceso de sequedad.', 'Corta hojas con regularidad para estimular rebrote.'],
    evidence: 'Tolera mejor humedad ambiental alta que muchas aromáticas mediterráneas.'
  },
  {
    id: 'albahaca',
    name: 'Albahaca',
    goal: ['edible', 'aromatic'],
    spaces: ['indoor', 'balcony', 'patio'],
    light: ['bright', 'direct'],
    care: 'easy',
    experience: ['beginner', 'intermediate', 'advanced'],
    climate: ['heat', 'balanced'],
    humidityAffinity: 'medium',
    tempRange: [18, 32],
    summary: 'Excelente para cocina y fácil de manejar si recibe luz y riego equilibrado.',
    carePlan: ['Dale al menos varias horas de buena luz.', 'Poda puntas para que se vuelva más frondosa.', 'Evita corrientes frías y encharcamientos.'],
    evidence: 'Rinde bien en ambientes cálidos con luz alta y buen drenaje.'
  },
  {
    id: 'menta',
    name: 'Menta',
    goal: ['aromatic', 'medicinal', 'edible'],
    spaces: ['indoor', 'balcony', 'patio'],
    light: ['medium', 'bright'],
    care: 'easy',
    experience: ['beginner', 'intermediate', 'advanced'],
    climate: ['rain', 'balanced', 'cool'],
    humidityAffinity: 'high',
    tempRange: [14, 28],
    summary: 'Aromática versátil y noble, ideal para principiantes con riego relativamente estable.',
    carePlan: ['Mejor en maceta porque se expande bastante.', 'Mantén el sustrato ligeramente húmedo.', 'Renueva tallos viejos para sostener crecimiento nuevo.'],
    evidence: 'Suele adaptarse bien a humedad moderada-alta y semisombra luminosa.'
  },
  {
    id: 'tomate',
    name: 'Tomate cherry',
    goal: ['edible'],
    spaces: ['patio', 'garden'],
    light: ['direct'],
    care: 'detailed',
    experience: ['intermediate', 'advanced'],
    climate: ['heat', 'balanced'],
    humidityAffinity: 'medium',
    tempRange: [18, 32],
    summary: 'Muy atractivo para huerta doméstica, pero requiere luz alta, seguimiento y tutorado.',
    carePlan: ['Necesita sol abundante y recipiente amplio.', 'Tutora los tallos y revisa plagas con frecuencia.', 'Fertiliza de forma balanceada al iniciar floración.'],
    evidence: 'Produce mejor con radiación alta, calor moderado y manejo activo.'
  },
  {
    id: 'fresa',
    name: 'Fresa',
    goal: ['edible'],
    spaces: ['balcony', 'patio', 'garden'],
    light: ['bright', 'direct'],
    care: 'moderate',
    experience: ['intermediate', 'advanced'],
    climate: ['cool', 'balanced'],
    humidityAffinity: 'medium',
    tempRange: [10, 26],
    summary: 'Buena opción si quieres algo comestible en macetas con clima más fresco o templado.',
    carePlan: ['Evita mojar flores y frutos al regar.', 'Usa recipientes con excelente drenaje.', 'Vigila hongos si el ambiente es muy húmedo.'],
    evidence: 'Prefiere temperaturas moderadas y manejo cuidadoso de humedad foliar.'
  },
  {
    id: 'calendula',
    name: 'Caléndula',
    goal: ['flower', 'ornamental', 'medicinal'],
    spaces: ['balcony', 'patio', 'garden'],
    light: ['bright', 'direct'],
    care: 'easy',
    experience: ['beginner', 'intermediate', 'advanced'],
    climate: ['cool', 'balanced'],
    humidityAffinity: 'medium',
    tempRange: [12, 28],
    summary: 'Flor útil y vistosa, buena para iniciar en ornamental con mantenimiento sencillo.',
    carePlan: ['Retira flores secas para prolongar floración.', 'Evita exceso de humedad permanente en raíces.', 'Agradece varias horas de sol.'],
    evidence: 'Tolera bien climas templados y mejora con buena radiación.'
  },
  {
    id: 'lavanda',
    name: 'Lavanda',
    goal: ['ornamental', 'aromatic', 'medicinal'],
    spaces: ['balcony', 'patio', 'garden'],
    light: ['direct'],
    care: 'moderate',
    experience: ['intermediate', 'advanced'],
    climate: ['heat', 'balanced'],
    humidityAffinity: 'low',
    tempRange: [14, 32],
    summary: 'Muy ornamental y aromática, pero necesita más sol, drenaje y menos exceso de humedad.',
    carePlan: ['Usa sustrato aireado y maceta con drenaje fuerte.', 'Riega solo cuando el sustrato se seque parcialmente.', 'Evita ambientes cerrados y muy húmedos.'],
    evidence: 'Se comporta mejor en escenarios secos o de humedad baja a media.'
  },
  {
    id: 'anturio',
    name: 'Anturio',
    goal: ['ornamental', 'flower'],
    spaces: ['indoor', 'balcony'],
    light: ['medium', 'bright'],
    care: 'moderate',
    experience: ['intermediate', 'advanced'],
    climate: ['rain', 'balanced'],
    humidityAffinity: 'high',
    tempRange: [18, 30],
    summary: 'Opción ornamental tropical muy fuerte para interiores luminosos y humedad ambiental media-alta.',
    carePlan: ['Evita sol directo fuerte sobre las hojas.', 'Mantén humedad ambiental moderada.', 'Usa mezcla aireada tipo tropical.'],
    evidence: 'Responde bien a contextos tropicales húmedos con luz filtrada.'
  },
  {
    id: 'lengua_suegra',
    name: 'Lengua de suegra',
    goal: ['ornamental'],
    spaces: ['indoor', 'balcony'],
    light: ['low', 'medium', 'bright'],
    care: 'easy',
    experience: ['beginner', 'intermediate', 'advanced'],
    climate: ['heat', 'balanced'],
    humidityAffinity: 'low',
    tempRange: [16, 34],
    summary: 'Muy resistente para interiores y personas que buscan bajo mantenimiento.',
    carePlan: ['Riega solo cuando el sustrato esté realmente seco.', 'Tolera poca luz, aunque crece mejor con luz media.', 'Evita exceso de agua.'],
    evidence: 'Ideal para vivienda interior con poco tiempo de cuidado.'
  },
  {
    id: 'helecho',
    name: 'Helecho de Boston',
    goal: ['ornamental'],
    spaces: ['indoor', 'balcony'],
    light: ['medium', 'bright'],
    care: 'moderate',
    experience: ['intermediate', 'advanced'],
    climate: ['rain', 'cool', 'balanced'],
    humidityAffinity: 'high',
    tempRange: [14, 27],
    summary: 'Muy decorativo si la vivienda mantiene humedad ambiental y buena luz indirecta.',
    carePlan: ['No dejes secar completamente el sustrato.', 'Favorece ambientes con humedad ambiental estable.', 'Evita sol directo fuerte.'],
    evidence: 'Se adapta bien a interiores frescos o húmedos con luz filtrada.'
  },
  {
    id: 'romero',
    name: 'Romero',
    goal: ['aromatic', 'edible', 'medicinal'],
    spaces: ['balcony', 'patio', 'garden'],
    light: ['direct'],
    care: 'easy',
    experience: ['beginner', 'intermediate', 'advanced'],
    climate: ['heat', 'balanced'],
    humidityAffinity: 'low',
    tempRange: [12, 32],
    summary: 'Aromática fuerte para exteriores soleados, con muy buen potencial culinario.',
    carePlan: ['Necesita sol directo y drenaje alto.', 'No tolera encharcamientos frecuentes.', 'Poda ligera para sostener forma compacta.'],
    evidence: 'Encaja mejor en microclimas ventilados y relativamente secos.'
  }
];

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function sanitizeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

function validEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

function validPhone(value) {
  return /^[+\d][\d\s-]{7,20}$/.test(value);
}

function formatCardNumber(input) {
  const digits = input.value.replace(/\D/g, '').slice(0, 19);
  input.value = digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
  let digits = input.value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
  input.value = digits;
}

function luhnCheck(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let doubleDigit = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return digits.length >= 13 && sum % 10 === 0;
}

function getAppState() {
  const raw = localStorage.getItem(APP_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn('No se pudo leer el estado local.', error);
    }
  }

  return {
    currentUserId: null,
    cookieConsent: null,
    users: [],
    sessions: [],
    subscriptions: [],
    payments: [],
    analyses: [],
    messages: [],
    newsletterSubscriptions: [],
    notifications: []
  };
}

function saveAppState(data) {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data));
}

function updateAppState(mutator) {
  const db = getAppState();
  mutator(db);
  saveAppState(db);
  return db;
}

function hashPassword(value) {
  return btoa(unescape(encodeURIComponent(value))).slice(0, 120);
}

function getCurrentUser() {
  const db = getAppState();
  return db.users.find(user => user.id === db.currentUserId) || null;
}

function setCurrentUser(userId) {
  updateAppState(db => {
    db.currentUserId = userId || null;
    if (userId) {
      db.sessions.push({
        id: generateId('session'),
        userId,
        createdAt: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    }
  });
}

function getAnalysisUsageForCurrentUser() {
  return {
    remaining: Infinity,
    usedCount: 0,
    unlimited: true
  };
}

function incrementGuestAnalysisUsage() {
  return;
}

function updateCounterDisplay() {
  const badge = document.getElementById('analysisCounter');
  const text = document.getElementById('remainingText');
  if (!badge || !text) return;
  const usage = getAnalysisUsageForCurrentUser();
  badge.className = 'counter-badge green-badge';
  text.textContent = 'Analisis ilimitados disponibles';
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) section.scrollIntoView({ behavior: 'smooth' });
  closeMobileMenu();
}

function toggleMenu() {
  const links = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (!links) return;
  const isOpen = links.classList.toggle('open');
  hamburger?.setAttribute('aria-expanded', String(isOpen));
}

function closeMobileMenu() {
  const links = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  links?.classList.remove('open');
  hamburger?.setAttribute('aria-expanded', 'false');
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  for (let i = 0; i < 60; i += 1) {
    particles.push({
      x: Math.random() * 600,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,176,${particle.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();

(function initTypewriter() {
  const words = ['Mas Saludables', 'Mas Inteligentes', 'Mas Verdes', 'Mejor Cuidadas'];
  const target = document.getElementById('typewriter');
  if (!target) return;
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = words[wordIndex];
    if (!deleting) {
      charIndex += 1;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex -= 1;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(tick, deleting ? 50 : 90);
  }

  tick();
})();

(function initReveal() {
  document.querySelectorAll('.reveal').forEach((node, index) => {
    node.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
    node.classList.add('visible');
  });
  if (typeof IntersectionObserver === 'undefined') return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
})();

function renderSelectedImages() {
  const img = document.getElementById('uploadedImage');
  const placeholder = document.getElementById('uploadPlaceholder');
  const overlay = document.getElementById('imageOverlay');
  const gallery = document.getElementById('selectedImagesGallery');
  const readyText = document.getElementById('imageReadyText');
  const analyzeBtn = document.getElementById('analyzeBtn');
  if (!img || !placeholder || !overlay || !gallery || !readyText || !analyzeBtn) return;

  if (!state.selectedImages.length) {
    img.classList.add('hidden');
    img.removeAttribute('src');
    placeholder.classList.remove('hidden');
    overlay.classList.add('hidden');
    gallery.innerHTML = '';
    gallery.classList.add('hidden');
    analyzeBtn.disabled = true;
    return;
  }

  img.src = state.selectedImages[0].dataUrl;
  img.classList.remove('hidden');
  placeholder.classList.add('hidden');
  overlay.classList.remove('hidden');
  gallery.classList.remove('hidden');
  analyzeBtn.disabled = false;
  readyText.textContent = state.selectedImages.length === 1
    ? '1 imagen cargada - lista para analizar'
    : `${state.selectedImages.length} imagenes cargadas - listas para analizar`;

  gallery.innerHTML = state.selectedImages.map(item => `
    <div class="thumb-card">
      <img src="${item.dataUrl}" alt="${sanitizeHtml(item.name)}" class="thumb-img" />
      <button class="thumb-remove" onclick="removeSelectedImage('${item.id}')">x</button>
      <p class="thumb-label">${sanitizeHtml(item.name)}</p>
    </div>
  `).join('');
}

function resetResults() {
  document.getElementById('resultsPlaceholder')?.classList.remove('hidden');
  document.getElementById('analysisResult')?.classList.add('hidden');
  document.getElementById('progressBar')?.classList.add('hidden');
  document.getElementById('limitWarning')?.classList.add('hidden');
}

function triggerUpload() {
  const usage = getAnalysisUsageForCurrentUser();
  if (!usage.unlimited && usage.remaining <= 0) {
    document.getElementById('limitWarning')?.classList.remove('hidden');
    return;
  }
  document.getElementById('fileInput')?.click();
}

function handleDrop(event) {
  event.preventDefault();
  handleFiles(event.dataTransfer?.files);
}

function handleFileSelect(event) {
  handleFiles(event.target.files);
}

async function handleFiles(fileList) {
  const usage = getAnalysisUsageForCurrentUser();
  if (!usage.unlimited && usage.remaining <= 0) {
    document.getElementById('limitWarning')?.classList.remove('hidden');
    return;
  }

  const files = Array.from(fileList || []).filter(file => file.type.startsWith('image/'));
  if (!files.length) return;

  const availableSlots = MAX_ANALYSIS_IMAGES - state.selectedImages.length;
  const selected = files.slice(0, availableSlots);
  const mapped = await Promise.all(selected.map(fileToData));
  state.selectedImages = [...state.selectedImages, ...mapped].slice(0, MAX_ANALYSIS_IMAGES);
  document.getElementById('fileInput').value = '';
  document.getElementById('limitWarning')?.classList.add('hidden');
  resetResults();
  renderSelectedImages();
}

function fileToData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      id: generateId('img'),
      name: file.name,
      size: file.size,
      type: file.type,
      dataUrl: reader.result
    });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function removeSelectedImage(id) {
  state.selectedImages = state.selectedImages.filter(item => item.id !== id);
  renderSelectedImages();
  resetResults();
}

function resetAnalyzer(event) {
  if (event) event.stopPropagation();
  state.selectedImages = [];
  document.getElementById('fileInput').value = '';
  renderSelectedImages();
  resetResults();
}

function updateProgress(value) {
  document.getElementById('progressBar')?.classList.remove('hidden');
  const fill = document.getElementById('progressFill');
  const text = document.getElementById('progressText');
  if (fill) fill.style.width = `${value}%`;
  if (text) text.textContent = `${Math.round(value)}%`;
}
function loadImageElement(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function extractImageSignals(imageSet) {
  const stats = [];
  for (const item of imageSet) {
    const image = await loadImageElement(item.dataUrl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const sampleWidth = 96;
    const sampleHeight = Math.max(48, Math.round((image.height / image.width) * sampleWidth));
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    ctx.drawImage(image, 0, 0, sampleWidth, sampleHeight);
    const { data } = ctx.getImageData(0, 0, sampleWidth, sampleHeight);

    let red = 0;
    let green = 0;
    let blue = 0;
    let brightness = 0;
    let greenDominant = 0;
    let yellowDominant = 0;
    let brownDominant = 0;
    let darkPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      red += r;
      green += g;
      blue += b;
      brightness += (r + g + b) / 3;
      if (g > r + 10 && g > b + 10) greenDominant += 1;
      if (r > 120 && g > 110 && b < 100) yellowDominant += 1;
      if (r > 85 && g > 55 && g < 140 && b < 100) brownDominant += 1;
      if ((r + g + b) / 3 < 60) darkPixels += 1;
    }

    const pixels = data.length / 4;
    const fileName = item.name.toLowerCase();
    stats.push({
      fileName,
      avgRed: red / pixels,
      avgGreen: green / pixels,
      avgBlue: blue / pixels,
      brightness: brightness / pixels,
      greenRatio: greenDominant / pixels,
      yellowRatio: yellowDominant / pixels,
      brownRatio: brownDominant / pixels,
      darkRatio: darkPixels / pixels
    });
  }
  return stats;
}

function summarizeVisualHealth(signals) {
  const aggregate = signals.reduce((acc, item) => {
    acc.greenRatio += item.greenRatio;
    acc.yellowRatio += item.yellowRatio;
    acc.brownRatio += item.brownRatio;
    acc.darkRatio += item.darkRatio;
    acc.brightness += item.brightness;
    return acc;
  }, { greenRatio: 0, yellowRatio: 0, brownRatio: 0, darkRatio: 0, brightness: 0 });

  const total = signals.length || 1;
  const greenRatio = aggregate.greenRatio / total;
  const yellowRatio = aggregate.yellowRatio / total;
  const brownRatio = aggregate.brownRatio / total;
  const darkRatio = aggregate.darkRatio / total;
  const brightness = aggregate.brightness / total;
  const joinedNames = signals.map(item => item.fileName).join(' ');

  const tags = [];
  if (joinedNames.includes('fung') || joinedNames.includes('spot') || joinedNames.includes('mildiu')) tags.push('fungus');
  if (joinedNames.includes('plaga') || joinedNames.includes('pest') || joinedNames.includes('mite')) tags.push('pest');
  if (joinedNames.includes('dry') || joinedNames.includes('seca') || joinedNames.includes('wilt')) tags.push('dryness');
  if (joinedNames.includes('yellow') || joinedNames.includes('amarill')) tags.push('yellowing');

  let severity = 'healthy';
  let title = 'Salud vegetal visual estable';
  let summary = 'La planta presenta una proporcion de verde aceptable y no se observan senales fuertes de dano severo en la muestra.';
  let recs = [
    'Manten el riego segun humedad real del sustrato y no por rutina fija.',
    'Observa la evolucion durante varios dias antes de corregir drasticamente.',
    'Sube fotos de hojas, tallos y sustrato para un mejor criterio.'
  ];
  let confidence = 64;
  const details = [
    { label: 'Verdor foliar', value: `${Math.round(greenRatio * 100)}%`, color: '#00e5b0' },
    { label: 'Amarillamiento', value: `${Math.round(yellowRatio * 100)}%`, color: '#facc15' },
    { label: 'Necrosis o marron', value: `${Math.round(brownRatio * 100)}%`, color: '#f97316' },
    { label: 'Oscurecimiento', value: `${Math.round(darkRatio * 100)}%`, color: '#60a5fa' }
  ];

  if (brownRatio > 0.14 || darkRatio > 0.2 || tags.includes('fungus') || tags.includes('pest')) {
    severity = 'critical';
    title = 'Riesgo visual alto de dano o enfermedad';
    summary = 'Las imagenes muestran zonas oscuras o marrones mas extensas de lo normal. Esto puede asociarse a lesion, hongo, plaga o estres severo.';
    recs = [
      'Aisla la planta mientras confirmas si hay plaga u hongo.',
      'Revisa el enves de hojas, tallos y base del sustrato.',
      'No aumentes el riego automaticamente solo por el aspecto visual.'
    ];
    confidence = 74;
  } else if (yellowRatio > 0.12 || brightness < 95 || tags.includes('yellowing') || tags.includes('dryness')) {
    severity = 'warning';
    title = 'La planta requiere atencion';
    summary = 'Se observan senales compatibles con clorosis, estres por luz, drenaje insuficiente o riego inestable. No es correcto concluir solo que le falta agua.';
    recs = [
      'Revisa drenaje, frecuencia de riego y exposicion a luz.',
      'Verifica si el dano esta en hojas nuevas o viejas.',
      'Si el sustrato esta compacto, considera airearlo o trasplantar.'
    ];
    confidence = 69;
  }

  return {
    source: 'local-vision',
    severity,
    title,
    summary,
    recs,
    confidence,
    details
  };
}

async function authApiRequest(mode, payload) {
  if (!appConfig.authEndpoint) return null;
  try {
    return await callJsonApi(`${appConfig.authEndpoint}/${mode}`, payload);
  } catch (error) {
    console.warn('Fallo auth remoto, se usara modo local.', error);
    return null;
  }
}

function getApiHeaders() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  }
  return {
    'Content-Type': 'application/json',
    ...(appConfig.apiKey ? { Authorization: `Bearer ${appConfig.apiKey}` } : {})
  };
}

function upsertLocalUser(user) {
  let savedUser = null;
  updateAppState(data => {
    const existingIndex = data.users.findIndex(item => item.id === user.id || (user.email && item.email === user.email) || (user.phone && item.phone === user.phone));
    const normalized = {
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      passwordHash: user.passwordHash || data.users[existingIndex]?.passwordHash || '',
      createdAt: user.createdAt || new Date().toISOString(),
      planStatus: user.planStatus || 'free'
    };
    if (existingIndex >= 0) data.users[existingIndex] = { ...data.users[existingIndex], ...normalized };
    else data.users.push(normalized);
    data.currentUserId = normalized.id;
    savedUser = normalized;
  });
  return savedUser;
}

async function callJsonApi(url, payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`API ${url} devolvio ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function analyzeWithExternalAI() {
  if (!appConfig.aiVisionEndpoint) return null;
  try {
    return await callJsonApi(appConfig.aiVisionEndpoint, {
      images: state.selectedImages.map(item => ({ name: item.name, mimeType: item.type, dataUrl: item.dataUrl })),
      context: { location: state.location, sensors: state.sensors }
    });
  } catch (error) {
    console.warn('Fallo el analisis externo.', error);
    return null;
  }
}

function normalizeAnalysisResult(result) {
  const palette = {
    healthy: { headerBg: 'rgba(0,229,176,0.1)', borderColor: 'rgba(0,229,176,0.25)', icon: 'OK', iconColor: '#00e5b0' },
    warning: { headerBg: 'rgba(250,204,21,0.1)', borderColor: 'rgba(250,204,21,0.25)', icon: '!', iconColor: '#facc15' },
    critical: { headerBg: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.25)', icon: 'AL', iconColor: '#f87171' }
  };
  return { ...result, ...palette[result.severity || 'healthy'] };
}

async function persistAnalysis(result) {
  const user = getCurrentUser();
  const analysisRecord = {
    id: generateId('analysis'),
    userId: user?.id || null,
    createdAt: new Date().toISOString(),
    source: result.source,
    severity: result.severity,
    confidence: result.confidence,
    summary: result.summary,
    imageCount: state.selectedImages.length,
    location: state.location.coords,
    sensors: {
      moisture: state.sensors.moisture,
      temp: state.sensors.temp,
      light: state.sensors.light,
      soilPh: state.sensors.soilPh,
      humidity: state.sensors.humidity
    }
  };

  updateAppState(db => {
    db.analyses.push(analysisRecord);
  });

  if (!user || !localStorage.getItem(AUTH_TOKEN_KEY) || !appConfig.aiVisionEndpoint) return;

  try {
    const baseUrl = appConfig.aiVisionEndpoint.replace(/\/vision$/, '');
    await callJsonApi(`${baseUrl}/save`, {
      sourceType: result.source,
      severity: result.severity,
      confidence: result.confidence,
      summary: result.summary,
      location: state.location.coords,
      sensors: state.sensors,
      terrainDescription: state.location.terrain || state.location.place || ''
    });
  } catch (error) {
    console.warn('No se pudo guardar el analisis en el backend.', error);
  }
}

async function analyzeImage() {
  if (state.analyzing || !state.selectedImages.length) return;
  const usage = getAnalysisUsageForCurrentUser();
  if (!usage.unlimited && usage.remaining <= 0) {
    document.getElementById('limitWarning')?.classList.remove('hidden');
    return;
  }

  state.analyzing = true;
  resetResults();
  const button = document.getElementById('analyzeBtn');
  button.disabled = true;
  button.textContent = 'Analizando...';

  let progress = 0;
  updateProgress(progress);
  const interval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 18, 92);
    updateProgress(progress);
  }, 180);

  try {
    const external = await analyzeWithExternalAI();
    let result;
    if (external && external.severity && external.summary) {
      result = normalizeAnalysisResult({
        source: 'external-ai',
        severity: external.severity,
        title: external.title || 'Diagnostico IA',
        summary: external.summary,
        recs: external.recommendations || [],
        confidence: Number(external.confidence || 84),
        details: external.details || []
      });
    } else {
      const signals = await extractImageSignals(state.selectedImages);
      result = normalizeAnalysisResult(summarizeVisualHealth(signals));
    }

    updateProgress(100);
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!usage.unlimited) incrementGuestAnalysisUsage();
    updateCounterDisplay();
    await persistAnalysis(result);
    showResult(result);
    if (!getAnalysisUsageForCurrentUser().unlimited && getAnalysisUsageForCurrentUser().remaining <= 0) {
      document.getElementById('limitWarning')?.classList.remove('hidden');
    }
  } catch (error) {
    console.error(error);
    showResult(normalizeAnalysisResult({
      source: 'system',
      severity: 'warning',
      title: 'No fue posible completar el analisis',
      summary: 'Hubo un problema al procesar las imagenes. Intenta otra vez con fotos enfocadas de hojas, tallos y sustrato.',
      recs: [
        'Usa luz natural y evita sombras fuertes.',
        'Sube de 1 a 3 fotos nitidas de distintas zonas de la planta.',
        'Si el problema persiste, reinicia la carga de imagenes.'
      ],
      confidence: 0,
      details: []
    }));
  } finally {
    clearInterval(interval);
    document.getElementById('progressBar')?.classList.add('hidden');
    button.disabled = false;
    button.textContent = 'Analizar Planta';
    state.analyzing = false;
  }
}

function showResult(result) {
  document.getElementById('resultsPlaceholder')?.classList.add('hidden');
  const panel = document.getElementById('analysisResult');
  if (!panel) return;

  const locationText = state.location.coords
    ? `Lat ${state.location.coords.lat.toFixed(5)}, Lon ${state.location.coords.lon.toFixed(5)}`
    : 'Ubicacion no compartida';

  panel.classList.remove('hidden');
  panel.style.borderColor = result.borderColor;
  panel.innerHTML = `
    <div class="result-header" style="background:${result.headerBg};border-bottom:1px solid ${result.borderColor}">
      <span class="result-icon-badge" style="border-color:${result.borderColor};color:${result.iconColor}">${sanitizeHtml(result.icon)}</span>
      <div>
        <div class="result-title">${sanitizeHtml(result.title)}</div>
        <div class="result-confidence">Confianza: ${Math.round(result.confidence)}% | Fuente: ${result.source === 'external-ai' ? 'IA externa' : 'analisis visual local'}</div>
      </div>
    </div>
    <div class="result-body">
      <p class="result-summary">${sanitizeHtml(result.summary)}</p>
      <div class="result-details">${(result.details || []).map(item => `
        <div class="detail-item">
          <div class="detail-label">${sanitizeHtml(item.label)}</div>
          <div class="detail-value" style="color:${item.color || '#00e5b0'}">${sanitizeHtml(String(item.value))}</div>
        </div>
      `).join('')}</div>
      <div class="result-meta-grid">
        <div class="meta-chip"><strong>Imagenes:</strong> ${state.selectedImages.length}</div>
        <div class="meta-chip"><strong>Ubicacion:</strong> ${sanitizeHtml(locationText)}</div>
        <div class="meta-chip"><strong>Terreno:</strong> ${sanitizeHtml(state.location.terrain || 'No estimado')}</div>
        <div class="meta-chip"><strong>pH:</strong> ${state.sensors.soilPh}</div>
      </div>
      <div class="result-recs">
        <h4>Recomendaciones</h4>
        <ul>${(result.recs || []).map(item => `<li>${sanitizeHtml(item)}</li>`).join('')}</ul>
      </div>
      ${result.source !== 'external-ai' ? '<p class="result-disclaimer">Modo local: esta version ya no responde automaticamente que falta agua. Para precision real debes conectar un endpoint de IA visual.</p>' : ''}
    </div>
  `;
}

function getMoistureStatus(value) {
  if (value < 25) return { label: 'Seco', color: '#f87171' };
  if (value < 45) return { label: 'Bajo', color: '#facc15' };
  if (value <= 75) return { label: 'Optimo', color: '#00e5b0' };
  return { label: 'Exceso', color: '#60a5fa' };
}

function getTempStatus(value) {
  if (value < 15) return { label: 'Frio', color: '#60a5fa' };
  if (value < 22) return { label: 'Fresco', color: '#38bdf8' };
  if (value <= 30) return { label: 'Ideal', color: '#00e5b0' };
  return { label: 'Caliente', color: '#f97316' };
}

function getLightStatus(value) {
  if (value < 25) return { label: 'Muy baja', color: '#94a3b8' };
  if (value < 50) return { label: 'Sombra', color: '#ca8a04' };
  if (value <= 75) return { label: 'Parcial', color: '#fb923c' };
  return { label: 'Alta', color: '#facc15' };
}

function renderBarChart() {
  const chart = document.getElementById('barChart');
  if (!chart) return;
  const history = state.sensors.history.slice(-6);
  if (!history.length) {
    chart.innerHTML = '';
    return;
  }

  const width = 720;
  const height = 220;
  const padding = { top: 18, right: 18, bottom: 42, left: 18 };
  const values = history.map(item => item.moisture);
  const minValue = Math.max(0, Math.min(...values) - 12);
  const maxValue = Math.min(100, Math.max(...values) + 10);
  const range = Math.max(maxValue - minValue, 10);
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const points = history.map((item, index) => {
    const x = padding.left + (innerWidth * index) / Math.max(history.length - 1, 1);
    const y = padding.top + innerHeight - ((item.moisture - minValue) / range) * innerHeight;
    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${(height - padding.bottom).toFixed(2)} L ${points[0].x.toFixed(2)} ${(height - padding.bottom).toFixed(2)} Z`;

  const guides = 4;
  const guideMarkup = Array.from({ length: guides + 1 }, (_, index) => {
    const y = padding.top + (innerHeight / guides) * index;
    return `<line x1="${padding.left}" y1="${y.toFixed(2)}" x2="${width - padding.right}" y2="${y.toFixed(2)}" class="chart-grid-line" />`;
  }).join('');

  const pointsMarkup = points.map(point => `
    <div class="chart-point-card" style="left:${((point.x / width) * 100).toFixed(2)}%; top:${((point.y / height) * 100).toFixed(2)}%;">
      <span class="chart-point-dot"></span>
      <div class="chart-tooltip">
        <strong>${point.moisture}%</strong>
        <span>${sanitizeHtml(point.time)}</span>
      </div>
    </div>
  `).join('');

  const labelsMarkup = points.map(point => `
    <div class="chart-x-label" style="left:${((point.x / width) * 100).toFixed(2)}%;">
      <span>${sanitizeHtml(point.time)}</span>
    </div>
  `).join('');

  chart.innerHTML = `
    <div class="chart-shell">
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="moistureAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(76,201,240,0.35)" />
            <stop offset="100%" stop-color="rgba(17,214,143,0.02)" />
          </linearGradient>
          <linearGradient id="moistureLineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#4cc9f0" />
            <stop offset="50%" stop-color="#27d4c5" />
            <stop offset="100%" stop-color="#11d68f" />
          </linearGradient>
        </defs>
        ${guideMarkup}
        <path d="${areaPath}" fill="url(#moistureAreaGradient)" class="chart-area-path"></path>
        <path d="${linePath}" class="chart-line-path" stroke="url(#moistureLineGradient)"></path>
      </svg>
      <div class="chart-overlay">${pointsMarkup}</div>
      <div class="chart-x-axis">${labelsMarkup}</div>
    </div>
  `;
}

function updateRecommendations() {
  const target = document.getElementById('sensorRecommendations');
  if (!target) return;
  const items = [];
  if (state.sensors.moisture < 30) items.push('La humedad esta baja. Revisa sustrato antes de regar.');
  if (state.sensors.moisture > 80) items.push('La humedad esta alta. Evita sumar agua hasta confirmar drenaje.');
  if (state.sensors.temp > 30) items.push('La temperatura esta elevada. Busca ventilacion o sombra parcial.');
  if (state.sensors.temp < 15) items.push('La temperatura es baja. Protege la planta del frio.');
  if (state.sensors.light < 30) items.push('La luz es limitada. Considera moverla a un punto mas luminoso.');
  if (state.location.terrain) items.push(`Terreno estimado: ${state.location.terrain}.`);
  if (!items.length) items.push('Las condiciones actuales lucen equilibradas para la planta monitoreada.');
  target.innerHTML = `<h4>Sistema de recomendaciones</h4><ul>${items.map(item => `<li>${sanitizeHtml(item)}</li>`).join('')}</ul>`;
}

function updateSensorUI() {
  const moistureStatus = getMoistureStatus(state.sensors.moisture);
  const tempStatus = getTempStatus(state.sensors.temp);
  const lightStatus = getLightStatus(state.sensors.light);
  document.getElementById('moistureValue').textContent = state.sensors.moisture;
  document.getElementById('moistureBar').style.width = `${state.sensors.moisture}%`;
  document.getElementById('moistureStatus').textContent = moistureStatus.label;
  document.getElementById('moistureStatus').style.color = moistureStatus.color;
  document.getElementById('tempValue').textContent = state.sensors.temp;
  document.getElementById('tempBar').style.width = `${(state.sensors.temp / 50) * 100}%`;
  document.getElementById('tempStatus').textContent = tempStatus.label;
  document.getElementById('tempStatus').style.color = tempStatus.color;
  document.getElementById('lightValue').textContent = state.sensors.light;
  document.getElementById('lightBar').style.width = `${state.sensors.light}%`;
  document.getElementById('lightStatus').textContent = lightStatus.label;
  document.getElementById('lightStatus').style.color = lightStatus.color;
  document.getElementById('lastUpdate').textContent = state.sensors.lastUpdate || new Date().toLocaleTimeString('es-CR');
  document.getElementById('locationStatus').textContent = state.location.place || 'Ubicacion general no compartida';
  document.getElementById('terrainStatus').textContent = state.location.terrain || 'Terreno no determinado';
  document.getElementById('coordsStatus').textContent = state.location.coords
    ? `${state.location.coords.lat.toFixed(5)}, ${state.location.coords.lon.toFixed(5)}`
    : 'Sin coordenadas';
  updateRecommendations();
  renderBarChart();
  renderPlannerForecast(state.location.forecast);
}

function inferTerrain({ elevation, lat }) {
  const absoluteLat = Math.abs(lat);
  if (elevation >= 1200) return 'Zona alta con drenaje rapido y enfriamiento nocturno';
  if (elevation >= 600) return 'Terreno intermedio con drenaje moderado';
  if (absoluteLat < 24 && elevation < 150) return 'Zona baja humeda o tropical; vigila hongos y exceso de humedad';
  return 'Terreno mixto; ajusta riego segun sustrato real';
}

async function loadWeatherForecast(coords) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&forecast_days=3&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`forecast ${response.status}`);
    const data = await response.json();
    if (!data?.daily?.time?.length) return null;
    return data.daily.time.map((date, index) => ({
      date,
      max: Number(data.daily.temperature_2m_max?.[index] ?? 0),
      min: Number(data.daily.temperature_2m_min?.[index] ?? 0),
      rainProbability: Number(data.daily.precipitation_probability_max?.[index] ?? 0),
      weatherCode: Number(data.daily.weathercode?.[index] ?? 0)
    }));
  } catch (error) {
    console.warn('No se pudo cargar el pronostico.', error);
    return null;
  }
}

function getForecastDescriptor(forecast) {
  if (!Array.isArray(forecast) || !forecast.length) return 'Sin pronóstico cargado';
  const hottest = Math.max(...forecast.map(day => day.max));
  const wettest = Math.max(...forecast.map(day => day.rainProbability));
  if (wettest >= 70) return 'Se esperan días lluviosos o muy húmedos';
  if (hottest >= 31) return 'Se esperan días cálidos';
  if (hottest <= 22) return 'Se esperan días frescos';
  return 'Pronóstico relativamente estable';
}

function inferClimateBias() {
  const forecast = state.location.forecast || [];
  const hottest = forecast.length ? Math.max(...forecast.map(day => day.max)) : state.sensors.temp;
  const wettest = forecast.length ? Math.max(...forecast.map(day => day.rainProbability)) : state.sensors.humidity;
  if (wettest >= 70 || state.sensors.humidity >= 75) return 'rain';
  if (hottest >= 31 || state.sensors.temp >= 29) return 'heat';
  if (hottest <= 22 || state.sensors.temp <= 19) return 'cool';
  return 'balanced';
}

function careRank(value) {
  return { easy: 1, moderate: 2, detailed: 3 }[value] || 2;
}

function experienceRank(value) {
  return { beginner: 1, intermediate: 2, advanced: 3 }[value] || 1;
}

function getPlannerFilters() {
  return {
    goal: document.getElementById('plannerGoal')?.value || 'any',
    space: document.getElementById('plannerSpace')?.value || 'indoor',
    light: document.getElementById('plannerLight')?.value || 'medium',
    care: document.getElementById('plannerCare')?.value || 'easy',
    experience: document.getElementById('plannerExperience')?.value || 'beginner',
    forecastBias: document.getElementById('plannerForecastBias')?.value || 'balanced'
  };
}

function buildPlannerContext(filters) {
  const climateBias = filters.forecastBias === 'balanced' ? inferClimateBias() : filters.forecastBias;
  return {
    ...filters,
    climateBias,
    terrain: state.location.terrain || 'Sin terreno estimado',
    place: state.location.place || 'Sin ubicación aplicada',
    forecastDescriptor: getForecastDescriptor(state.location.forecast),
    avgTemp: Array.isArray(state.location.forecast) && state.location.forecast.length
      ? Math.round(state.location.forecast.reduce((sum, item) => sum + ((item.max + item.min) / 2), 0) / state.location.forecast.length)
      : state.sensors.temp
  };
}

function scorePlantRecommendation(plant, context) {
  const goalMatches = context.goal === 'any' || plant.goal.includes(context.goal);
  const spaceMatches = plant.spaces.includes(context.space);
  const lightMatches = plant.light.includes(context.light);

  if (!goalMatches) return null;

  let score = 48;
  const reasons = [];

  if (goalMatches) {
    score += 18;
    reasons.push(`Coincide con tu objetivo: ${context.goal === 'any' ? 'uso flexible' : context.goal}.`);
  }
  if (spaceMatches) {
    score += 16;
    reasons.push(`Se adapta bien a un espacio tipo ${context.space}.`);
  } else {
    score -= 12;
  }
  if (lightMatches) {
    score += 16;
    reasons.push(`Tolera o aprovecha la luz ${context.light}.`);
  } else {
    score -= 12;
  }
  if (plant.climate.includes(context.climateBias)) {
    score += 14;
    reasons.push(`Encaja con el perfil climático actual: ${context.forecastDescriptor.toLowerCase()}.`);
  }

  const avgTemp = context.avgTemp;
  if (avgTemp >= plant.tempRange[0] && avgTemp <= plant.tempRange[1]) {
    score += 10;
    reasons.push(`La temperatura estimada (${avgTemp}°C) cae dentro de su rango favorable.`);
  } else {
    score -= 14;
  }

  if (careRank(context.care) >= careRank(plant.care)) {
    score += 8;
  } else {
    score -= 6;
    reasons.push('Requiere más constancia de cuidado que la seleccionada.');
  }

  if (experienceRank(context.experience) >= Math.min(...plant.experience.map(experienceRank))) {
    score += 6;
  }

  if (context.terrain !== 'Sin terreno estimado') {
    if (context.terrain.toLowerCase().includes('humeda') && plant.humidityAffinity === 'high') score += 6;
    if (context.terrain.toLowerCase().includes('drenaje rapido') && plant.humidityAffinity === 'low') score += 6;
  }

  return {
    ...plant,
    score: Math.max(38, Math.min(97, Math.round(score))),
    reasons: reasons.slice(0, 3)
  };
}

function renderPlannerContext(context) {
  const chips = document.getElementById('plannerContextChips');
  const title = document.getElementById('plannerSummaryTitle');
  if (title) title.textContent = `Sugerencias para ${context.place}`;
  if (!chips) return;
  chips.innerHTML = `
    <span class="planner-chip">Objetivo: ${sanitizeHtml(context.goal === 'any' ? 'flexible' : context.goal)}</span>
    <span class="planner-chip">Espacio: ${sanitizeHtml(context.space)}</span>
    <span class="planner-chip">Luz: ${sanitizeHtml(context.light)}</span>
    <span class="planner-chip">Terreno: ${sanitizeHtml(context.terrain)}</span>
    <span class="planner-chip">Pronóstico: ${sanitizeHtml(context.forecastDescriptor)}</span>
  `;
}

function renderPlannerForecast(forecast) {
  const strip = document.getElementById('plannerForecastStrip');
  if (!strip) return;
  if (!Array.isArray(forecast) || !forecast.length) {
    strip.innerHTML = '<div class="forecast-card"><strong>Pronóstico</strong><span>Activa ubicación para incorporar el clima proyectado.</span></div>';
    return;
  }
  strip.innerHTML = forecast.map(day => `
    <div class="forecast-card">
      <strong>${sanitizeHtml(new Date(day.date).toLocaleDateString('es-CR', { weekday: 'short' }))}</strong>
      <span>${Math.round(day.min)}°C - ${Math.round(day.max)}°C</span>
      <small>Lluvia: ${Math.round(day.rainProbability)}%</small>
    </div>
  `).join('');
}

function renderPlantRecommendations(context, items, source = 'local') {
  renderPlannerContext(context);
  renderPlannerForecast(state.location.forecast);
  const target = document.getElementById('plannerResults');
  if (!target) return;
  if (!items.length) {
    target.innerHTML = `
      <div class="planner-empty">
        <h4>No encontré coincidencias fuertes con esos filtros</h4>
        <p>Prueba ampliar el tipo de luz, subir el nivel de cuidado permitido o usar tu ubicación para sumar clima y terreno reales.</p>
      </div>
    `;
    return;
  }

  const [primary, ...alternatives] = items;

  target.innerHTML = `
    <article class="plant-card plant-card-featured card-hover">
      <div class="plant-card-top">
        <div>
          <p class="plant-card-kicker">Recomendación principal · ${sanitizeHtml(primary.goal.join(' · '))}</p>
          <h4>${sanitizeHtml(primary.name)}</h4>
        </div>
        <div class="plant-score">${primary.score}%</div>
      </div>
      <p class="plant-summary">${sanitizeHtml(primary.summary)}</p>
      <div class="plant-evidence">${sanitizeHtml(primary.evidence)}</div>
      <div class="plant-reasons">
        ${primary.reasons.map(reason => `<span>${sanitizeHtml(reason)}</span>`).join('')}
      </div>
      <div class="plant-care-block">
        <strong>Inicio de cuidado</strong>
        <ul>${primary.carePlan.slice(0, 2).map(step => `<li>${sanitizeHtml(step)}</li>`).join('')}</ul>
      </div>
      <div class="plant-source">${source === 'remote-ai' ? 'Reforzado con IA del backend' : 'Motor local de recomendación contextual'}</div>
    </article>
    <div class="plant-alternatives">
      ${alternatives.map(item => `
        <article class="plant-card plant-card-compact card-hover">
          <div class="plant-card-top">
            <div>
              <p class="plant-card-kicker">${sanitizeHtml(item.goal.join(' · '))}</p>
              <h4>${sanitizeHtml(item.name)}</h4>
            </div>
            <div class="plant-score">${item.score}%</div>
          </div>
          <p class="plant-summary">${sanitizeHtml(item.summary)}</p>
          <div class="plant-reasons">
            ${item.reasons.slice(0, 2).map(reason => `<span>${sanitizeHtml(reason)}</span>`).join('')}
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

async function requestRemoteRecommendations(context) {
  if (!appConfig.recommendationEndpoint) return null;
  try {
    const response = await callJsonApi(appConfig.recommendationEndpoint, {
      filters: context,
      location: state.location,
      sensors: state.sensors
    });
    return Array.isArray(response?.recommendations) ? response : null;
  } catch (error) {
    console.warn('No se pudo obtener recomendación remota.', error);
    return null;
  }
}

function getLocalRecommendations(context) {
  return plantRecommendationCatalog
    .map(plant => scorePlantRecommendation(plant, context))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

async function generatePlantRecommendations() {
  const button = document.getElementById('plannerBtn');
  const loader = document.getElementById('plannerLoader');
  const helper = document.getElementById('plannerHelperText');
  const filters = getPlannerFilters();
  const context = buildPlannerContext(filters);

  if (button) {
    button.disabled = true;
    button.textContent = 'Analizando entorno...';
  }
  if (loader) loader.classList.remove('hidden');
  if (helper) helper.textContent = 'Combinando filtros, clima estimado, pronóstico y condiciones del terreno.';

  const remote = await requestRemoteRecommendations(context);
  if (remote?.recommendations?.length) {
    renderPlantRecommendations(context, remote.recommendations, 'remote-ai');
  } else {
    renderPlantRecommendations(context, getLocalRecommendations(context), 'local');
  }

  if (loader) loader.classList.add('hidden');
  if (button) {
    button.disabled = false;
    button.textContent = 'Generar recomendaciones';
  }
  if (helper) {
    helper.textContent = state.location.coords
      ? 'Se usaron ubicación, terreno y pronóstico para afinar la recomendación.'
      : 'Puedes activar ubicación exacta para recomendaciones todavía más precisas.';
  }
}

function applyLocationToPlanner() {
  if (state.location.coords) {
    generatePlantRecommendations();
    scrollToSection('planner');
    return;
  }
  requestExactLocation();
  const helper = document.getElementById('plannerHelperText');
  if (helper) helper.textContent = 'Primero autoriza la ubicación exacta y luego volveremos a recomendar con ese contexto.';
}

async function enrichLocation(coords) {
  const result = { coords, place: null, elevation: null, terrain: null, forecast: null };
  try {
    const [geoResponse, elevResponse, forecastResponse] = await Promise.allSettled([
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lon}`),
      fetch(`https://api.open-meteo.com/v1/elevation?latitude=${coords.lat}&longitude=${coords.lon}`),
      loadWeatherForecast(coords)
    ]);
    if (geoResponse.status === 'fulfilled' && geoResponse.value.ok) {
      const geo = await geoResponse.value.json();
      result.place = geo.display_name || null;
    }
    if (elevResponse.status === 'fulfilled' && elevResponse.value.ok) {
      const elevationData = await elevResponse.value.json();
      result.elevation = elevationData.elevation?.[0] ?? null;
    }
    if (forecastResponse.status === 'fulfilled') {
      result.forecast = forecastResponse.value;
    }
  } catch (error) {
    console.warn('No se pudo enriquecer la ubicacion.', error);
  }
  result.terrain = inferTerrain({ elevation: result.elevation || 0, lat: coords.lat });
  return result;
}

async function requestExactLocation() {
  openLocationConsentModal();
}

function openLocationConsentModal() {
  const modal = document.getElementById('locationConsentModal');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLocationConsentModal(markAsDismissed = false) {
  const modal = document.getElementById('locationConsentModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  const shouldKeepLocked = document.body.classList.contains('consent-lock');
  document.body.style.overflow = shouldKeepLocked || document.getElementById('paymentModal')?.classList.contains('open') ? 'hidden' : '';
  if (markAsDismissed) {
    const label = document.getElementById('locationPermissionLabel');
    if (label) {
      label.textContent = 'No compartiste la ubicacion exacta. Puedes activarla despues si deseas recomendaciones mas detalladas.';
    }
  }
}

function confirmExactLocation() {
  const button = document.getElementById('locationBtn');
  const label = document.getElementById('locationPermissionLabel');
  const modalAction = document.querySelector('#locationConsentModal .btn-primary');
  const isSecure = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  state.location.permissionRequested = true;
  if (button) { button.disabled = true; button.textContent = 'Solicitando permiso...'; }
  if (label) label.textContent = 'Esperando permiso del navegador...';
  if (modalAction) {
    modalAction.disabled = true;
    modalAction.textContent = 'Abriendo permiso...';
  }

  if (!isSecure) {
    closeLocationConsentModal();
    state.location.status = 'blocked';
    if (label) label.textContent = 'La ubicacion requiere un contexto seguro. Usa localhost o https para permitirla.';
    if (button) { button.disabled = false; button.textContent = 'Activar ubicacion exacta'; }
    if (modalAction) {
      modalAction.disabled = false;
      modalAction.textContent = 'Permitir ubicacion exacta';
    }
    updateSensorUI();
    return;
  }

  if (!navigator.geolocation) {
    closeLocationConsentModal();
    state.location.status = 'unsupported';
    if (label) label.textContent = 'Tu navegador no soporta geolocalizacion.';
    if (button) { button.disabled = false; button.textContent = 'Activar ubicacion exacta'; }
    if (modalAction) {
      modalAction.disabled = false;
      modalAction.textContent = 'Permitir ubicacion exacta';
    }
    updateSensorUI();
    return;
  }

  const requestPosition = () => navigator.geolocation.getCurrentPosition(position => {
    const coords = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      accuracy: position.coords.accuracy
    };
    closeLocationConsentModal();
    state.location.status = 'granted';
    state.location.coords = coords;
    if (label) label.textContent = `Permiso concedido. Precision aprox: ${Math.round(coords.accuracy)} m`;
    Promise.resolve(enrichLocation(coords))
      .then(enriched => {
        state.location = { ...state.location, ...enriched };
        updateSensorUI();
        generatePlantRecommendations();
        scrollToSection('iot');
      })
      .catch(error => {
        console.warn('No se pudo enriquecer la ubicacion exacta.', error);
        updateSensorUI();
      })
      .finally(() => {
        if (button) { button.disabled = false; button.textContent = 'Actualizar ubicacion'; }
        if (modalAction) {
          modalAction.disabled = false;
          modalAction.textContent = 'Permitir ubicacion exacta';
        }
      });
  }, error => {
    closeLocationConsentModal();
    state.location.status = error.code === 1 ? 'denied' : 'error';
    if (error.code === 1) {
      if (label) label.textContent = 'El navegador bloqueo la ubicacion. Permítela desde el candado de la barra de direcciones y vuelve a intentar.';
    } else if (error.code === 2) {
      if (label) label.textContent = 'No se pudo determinar tu ubicacion actual. Revisa GPS, red o señal e intenta otra vez.';
    } else if (error.code === 3) {
      if (label) label.textContent = 'La solicitud de ubicacion tardó demasiado. Intenta de nuevo.';
    } else {
      if (label) label.textContent = `No se pudo obtener la ubicacion: ${error.message}`;
    }
    if (button) { button.disabled = false; button.textContent = 'Activar ubicacion exacta'; }
    if (modalAction) {
      modalAction.disabled = false;
      modalAction.textContent = 'Permitir ubicacion exacta';
    }
    updateSensorUI();
  }, {
    enableHighAccuracy: true,
    timeout: 12000,
    maximumAge: 300000
  });

  if (navigator.permissions?.query) {
    navigator.permissions.query({ name: 'geolocation' }).then(permission => {
      if (permission.state === 'denied') {
        closeLocationConsentModal();
        state.location.status = 'denied';
        if (label) label.textContent = 'La ubicacion esta bloqueada en el navegador. Haz clic en el candado de la URL y cambia Ubicacion a Permitir.';
        if (button) { button.disabled = false; button.textContent = 'Activar ubicacion exacta'; }
        if (modalAction) {
          modalAction.disabled = false;
          modalAction.textContent = 'Permitir ubicacion exacta';
        }
        updateSensorUI();
        return;
      }
      requestPosition();
    }).catch(() => requestPosition());
    return;
  }

  requestPosition();
}

async function loadRemoteIotData() {
  if (!appConfig.iotEndpoint) return false;
  try {
    const payload = await callJsonApi(appConfig.iotEndpoint, {
      userId: getCurrentUser()?.id || null,
      location: state.location
    });
    state.sensors.moisture = Number(payload.moisture ?? state.sensors.moisture);
    state.sensors.temp = Number(payload.temp ?? state.sensors.temp);
    state.sensors.light = Number(payload.light ?? state.sensors.light);
    state.sensors.soilPh = Number(payload.soilPh ?? state.sensors.soilPh);
    state.sensors.humidity = Number(payload.humidity ?? state.sensors.humidity);
    state.sensors.lastUpdate = new Date().toLocaleTimeString('es-CR');
    return true;
  } catch (error) {
    console.warn('No se pudo cargar IoT remoto.', error);
    return false;
  }
}

async function simulateSensors() {
  const button = document.querySelector('.btn-outline-sm');
  const icon = document.getElementById('refreshIcon');
  const loader = document.getElementById('iotInlineLoader');
  if (button) button.disabled = true;
  if (icon) {
    icon.style.animation = 'spin 0.8s linear infinite';
    icon.style.display = 'inline-block';
  }
  if (loader) loader.classList.remove('hidden');

  await new Promise(resolve => setTimeout(resolve, 900));

  const usedRemote = await loadRemoteIotData();
  if (!usedRemote) {
    const latFactor = state.location.coords ? Math.abs(state.location.coords.lat) / 90 : 0.25;
    const elevationFactor = state.location.elevation ? Math.min(state.location.elevation / 1800, 1) : 0.2;
    state.sensors.moisture = Math.max(18, Math.min(92, Math.round(55 + (0.5 - Math.random()) * 28 - latFactor * 6)));
    state.sensors.temp = Math.max(12, Math.min(35, Math.round(27 - elevationFactor * 7 + (0.5 - Math.random()) * 8)));
    state.sensors.light = Math.max(15, Math.min(100, Math.round(62 + (0.5 - Math.random()) * 34)));
    state.sensors.soilPh = Math.max(4.8, Math.min(7.8, Number((6.4 + (0.5 - Math.random()) * 0.9).toFixed(1))));
    state.sensors.humidity = Math.max(35, Math.min(95, Math.round(68 + (0.5 - Math.random()) * 24)));
    state.sensors.lastUpdate = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  state.sensors.history = [
    ...state.sensors.history.slice(-4),
    {
      time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
      moisture: state.sensors.moisture
    }
  ];

  updateSensorUI();
  if (icon) icon.style.animation = '';
  if (loader) loader.classList.add('hidden');
  if (button) button.disabled = false;
}
function closePaymentModal() {
  document.getElementById('paymentModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

function selectPaymentMethod(method) {
  state.selectedPaymentMethod = method;
  document.querySelectorAll('[data-payment-method]').forEach(node => {
    node.classList.toggle('selected', node.dataset.paymentMethod === method);
  });
}

function openPaymentModal(planName, planPrice, planIcon) {
  state.selectedPlan = { name: planName, priceLabel: planPrice, icon: planIcon, ...planCatalog[planName] };
  document.getElementById('modalPlanName').textContent = planName;
  document.getElementById('modalPlanPrice').textContent = planPrice;
  document.getElementById('modalPlanIcon').textContent = planIcon;
  document.getElementById('paymentFormView').classList.remove('hidden');
  document.getElementById('paymentSuccessView').classList.add('hidden');
  document.getElementById('paymentError').classList.add('hidden');
  document.getElementById('paymentModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  ['payName','payLastname','payEmail','payPassword','payCard','payExpiry','payCVV','payCardName'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });
  selectPaymentMethod('visa');
}

function buildNotificationRecord(user, subscription, payment) {
  return [
    {
      id: generateId('notification'),
      channel: 'email',
      target: appConfig.companyEmail,
      subject: `Nueva compra ${subscription.planName}`,
      body: `Se registro una nueva suscripcion para ${user.email}. Pago ${payment.status}.`,
      createdAt: new Date().toISOString()
    },
    {
      id: generateId('notification'),
      channel: 'email',
      target: user.email,
      subject: `Tu plan ${subscription.planName} fue activado`,
      body: `Tu suscripcion quedo registrada con vigencia ${subscription.endDate}.`,
      createdAt: new Date().toISOString()
    }
  ];
}

async function processPayment() {
  const name = document.getElementById('payName').value.trim();
  const lastname = document.getElementById('payLastname').value.trim();
  const email = document.getElementById('payEmail').value.trim().toLowerCase();
  const password = document.getElementById('payPassword').value;
  const card = document.getElementById('payCard').value.replace(/\s/g, '');
  const expiry = document.getElementById('payExpiry').value.trim();
  const cvv = document.getElementById('payCVV').value.trim();
  const cardName = document.getElementById('payCardName').value.trim();
  const errorBox = document.getElementById('paymentError');
  const button = document.querySelector('#paymentFormView .btn-primary');

  if (!state.selectedPlan) {
    errorBox.textContent = 'Selecciona un plan antes de continuar.';
    errorBox.classList.remove('hidden');
    return;
  }
  if (!name || !lastname || !email || !password || !card || !expiry || !cvv || !cardName) {
    errorBox.textContent = 'Completa todos los campos del pago.';
    errorBox.classList.remove('hidden');
    return;
  }
  if (!validEmail(email)) {
    errorBox.textContent = 'Ingresa un correo valido.';
    errorBox.classList.remove('hidden');
    return;
  }
  if (password.length < 6) {
    errorBox.textContent = 'La contrasena debe tener al menos 6 caracteres.';
    errorBox.classList.remove('hidden');
    return;
  }
  if (!luhnCheck(card)) {
    errorBox.textContent = 'El numero de tarjeta no es valido.';
    errorBox.classList.remove('hidden');
    return;
  }
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    errorBox.textContent = 'El vencimiento debe ir en formato MM/AA.';
    errorBox.classList.remove('hidden');
    return;
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    errorBox.textContent = 'El CVV no es valido.';
    errorBox.classList.remove('hidden');
    return;
  }

  errorBox.classList.add('hidden');
  button.disabled = true;
  button.textContent = 'Procesando compra...';

  let externalPayment = null;
  if (appConfig.paymentEndpoint) {
    try {
      externalPayment = await callJsonApi(appConfig.paymentEndpoint, {
        userId: getCurrentUser()?.id || null,
        user: { name, lastname, email, password },
        password,
        email,
        planCode: state.selectedPlan.code,
        planName: state.selectedPlan.name,
        amount: state.selectedPlan.price,
        currency: 'USD',
        paymentMethod: state.selectedPaymentMethod,
        plan: state.selectedPlan,
        card: { brand: state.selectedPaymentMethod, last4: card.slice(-4), expiry, holder: cardName }
      });
    } catch (error) {
      console.warn('Pago remoto no disponible.', error);
    }
  }

  const db = updateAppState(data => {
    let user = data.users.find(item => item.email === email || item.id === externalPayment?.user?.userId);
    if (!user) {
      user = {
        id: externalPayment?.user?.userId || generateId('user'),
        firstName: externalPayment?.user?.firstName || name,
        lastName: externalPayment?.user?.lastName || lastname,
        email: externalPayment?.user?.email || email,
        phone: externalPayment?.user?.phone || '',
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
        planStatus: externalPayment?.user?.planStatus || 'active'
      };
      data.users.push(user);
    } else {
      user.id = externalPayment?.user?.userId || user.id;
      user.firstName = externalPayment?.user?.firstName || name;
      user.lastName = externalPayment?.user?.lastName || lastname;
      user.email = externalPayment?.user?.email || email;
      user.phone = externalPayment?.user?.phone || user.phone || '';
      user.passwordHash = hashPassword(password);
      user.planStatus = externalPayment?.user?.planStatus || 'active';
    }

    const startDate = externalPayment?.subscription?.startDate ? new Date(externalPayment.subscription.startDate) : new Date();
    const endDate = externalPayment?.subscription?.endDate ? new Date(externalPayment.subscription.endDate) : new Date(startDate);
    if (!externalPayment?.subscription?.endDate) {
      if (state.selectedPlan.code === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
      if (state.selectedPlan.code === 'semiannual') endDate.setMonth(endDate.getMonth() + 6);
      if (state.selectedPlan.code === 'annual') endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = {
      id: externalPayment?.subscription?.subscriptionId || generateId('subscription'),
      userId: user.id,
      planCode: externalPayment?.subscription?.planCode || state.selectedPlan.code,
      planName: externalPayment?.subscription?.planName || state.selectedPlan.name,
      status: externalPayment?.subscription?.status || 'active',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      createdAt: new Date().toISOString()
    };
    data.subscriptions.push(subscription);

    const payment = {
      id: generateId('payment'),
      userId: user.id,
      subscriptionId: subscription.id,
      amount: state.selectedPlan.price,
      currency: 'USD',
      method: state.selectedPaymentMethod,
      maskedCard: `**** **** **** ${card.slice(-4)}`,
      status: externalPayment?.payment?.status || externalPayment?.status || 'approved_demo',
      providerReference: externalPayment?.payment?.reference || externalPayment?.reference || null,
      createdAt: new Date().toISOString()
    };
    data.payments.push(payment);
    buildNotificationRecord(user, subscription, payment).forEach(item => data.notifications.push(item));
    data.currentUserId = user.id;
  });

  const currentUser = db.users.find(user => user.id === db.currentUserId);
  setCurrentUser(currentUser.id);
  updateCounterDisplay();
  showLoggedIn(currentUser);
  document.getElementById('paymentFormView').classList.add('hidden');
  document.getElementById('paymentSuccessView').classList.remove('hidden');
  document.getElementById('paymentSuccessMsg').textContent = externalPayment
    ? `Tu plan ${state.selectedPlan.name} fue activado y el pago quedo procesado con referencia ${externalPayment?.payment?.reference || externalPayment?.reference}.`
    : `Tu plan ${state.selectedPlan.name} fue activado en modo demo local. La compra, la suscripcion y las notificaciones quedaron registradas localmente.`;
  button.disabled = false;
  button.textContent = 'Completar Compra';
}

function switchTab(mode) {
  state.authMode = mode;
  document.getElementById('tabLogin').classList.toggle('active', mode === 'login');
  document.getElementById('tabRegister').classList.toggle('active', mode === 'register');
  document.getElementById('typeSelectorWrap').classList.toggle('hidden', mode === 'login');
  document.getElementById('confirmWrap').classList.toggle('hidden', mode === 'login');
  document.getElementById('authSubmitBtn').textContent = mode === 'login' ? 'Iniciar Sesion' : 'Crear Cuenta';
  document.getElementById('authSwitch').style.display = mode === 'login' ? 'block' : 'none';
  clearAuthMessages();
}

function switchIdentifier(type) {
  state.usePhone = type === 'phone';
  document.getElementById('btnEmail').classList.toggle('active', !state.usePhone);
  document.getElementById('btnPhone').classList.toggle('active', state.usePhone);
  const input = document.getElementById('identifierInput');
  input.type = state.usePhone ? 'tel' : 'email';
  input.placeholder = state.usePhone ? 'Numero de telefono' : 'Correo electronico';
  document.getElementById('identifierIcon').textContent = state.usePhone ? 'TEL' : 'MAIL';
}

function clearAuthMessages() {
  document.getElementById('authError').classList.add('hidden');
  document.getElementById('authSuccess').classList.add('hidden');
}

function showAuthError(message) {
  const box = document.getElementById('authError');
  box.textContent = message;
  box.classList.remove('hidden');
}

function togglePassword(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

async function handleAuth() {
  clearAuthMessages();
  const identifier = document.getElementById('identifierInput').value.trim();
  const password = document.getElementById('passwordInput').value;
  const confirm = document.getElementById('confirmInput').value;
  const button = document.getElementById('authSubmitBtn');

  if (!identifier || !password) {
    showAuthError('Completa los campos obligatorios.');
    return;
  }
  if (state.usePhone && !validPhone(identifier)) {
    showAuthError('Ingresa un telefono valido.');
    return;
  }
  if (!state.usePhone && !validEmail(identifier)) {
    showAuthError('Ingresa un correo valido.');
    return;
  }
  if (password.length < 6) {
    showAuthError('La contrasena debe tener al menos 6 caracteres.');
    return;
  }

  button.disabled = true;
  button.textContent = 'Procesando...';
  const db = getAppState();

  if (state.authMode === 'register') {
    if (password !== confirm) {
      button.disabled = false;
      button.textContent = 'Crear Cuenta';
      showAuthError('Las contrasenas no coinciden.');
      return;
    }

    const remoteRegister = await authApiRequest('register', {
      firstName: state.usePhone ? identifier.slice(0, 24) : identifier.split('@')[0].slice(0, 24),
      lastName: '',
      email: state.usePhone ? '' : identifier.toLowerCase(),
      phone: state.usePhone ? identifier : '',
      password
    });

    if (remoteRegister?.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, remoteRegister.token);
      const savedUser = upsertLocalUser({
        id: remoteRegister.user?.userId || remoteRegister.userId,
        firstName: remoteRegister.user?.firstName || (state.usePhone ? identifier.slice(0, 24) : identifier.split('@')[0].slice(0, 24)),
        lastName: remoteRegister.user?.lastName || '',
        email: remoteRegister.user?.email || (state.usePhone ? '' : identifier.toLowerCase()),
        phone: remoteRegister.user?.phone || (state.usePhone ? identifier : ''),
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
        planStatus: remoteRegister.user?.planStatus || 'free'
      });
      setCurrentUser(savedUser.id);
      showLoggedIn(savedUser);
      button.disabled = false;
      button.textContent = 'Crear Cuenta';
      return;
    }

    const exists = db.users.find(user => state.usePhone ? user.phone === identifier : user.email === identifier.toLowerCase());
    if (exists) {
      button.disabled = false;
      button.textContent = 'Crear Cuenta';
      showAuthError('Ese usuario ya existe.');
      return;
    }
    const user = {
      id: generateId('user'),
      firstName: state.usePhone ? identifier.slice(0, 24) : identifier.split('@')[0].slice(0, 24),
      lastName: '',
      email: state.usePhone ? '' : identifier.toLowerCase(),
      phone: state.usePhone ? identifier : '',
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      planStatus: 'free'
    };
    updateAppState(data => {
      data.users.push(user);
      data.currentUserId = user.id;
    });
    setCurrentUser(user.id);
    showLoggedIn(user);
  } else {
    const remoteLogin = await authApiRequest('login', {
      email: state.usePhone ? '' : identifier.toLowerCase(),
      phone: state.usePhone ? identifier : '',
      password
    });

    if (remoteLogin?.token && remoteLogin?.user) {
      localStorage.setItem(AUTH_TOKEN_KEY, remoteLogin.token);
      const savedUser = upsertLocalUser({
        id: remoteLogin.user.userId,
        firstName: remoteLogin.user.firstName,
        lastName: remoteLogin.user.lastName,
        email: remoteLogin.user.email,
        phone: remoteLogin.user.phone,
        planStatus: remoteLogin.user.planStatus
      });
      setCurrentUser(savedUser.id);
      showLoggedIn(savedUser);
      button.disabled = false;
      button.textContent = 'Iniciar Sesion';
      return;
    }

    const user = db.users.find(item => state.usePhone ? item.phone === identifier : item.email === identifier.toLowerCase());
    if (!user || user.passwordHash !== hashPassword(password)) {
      button.disabled = false;
      button.textContent = 'Iniciar Sesion';
      showAuthError('Credenciales incorrectas.');
      return;
    }
    setCurrentUser(user.id);
    showLoggedIn(user);
  }

  button.disabled = false;
  button.textContent = state.authMode === 'login' ? 'Iniciar Sesion' : 'Crear Cuenta';
}

function showLoggedIn(user = getCurrentUser()) {
  if (!user) return;
  document.getElementById('authForm').classList.add('hidden');
  document.getElementById('loggedInView').classList.remove('hidden');
  document.getElementById('loggedUserName').textContent = user.email || user.phone || user.firstName;
  document.getElementById('loggedAvatar').textContent = (user.firstName || user.email || 'U').slice(0, 1).toUpperCase();
  document.getElementById('loggedPlanStatus').textContent = user.planStatus === 'active' ? 'Plan premium activo' : 'Plan gratuito';
  updateCounterDisplay();
}

function logout() {
  updateAppState(data => { data.currentUserId = null; });
  document.getElementById('loggedInView').classList.add('hidden');
  document.getElementById('authForm').classList.remove('hidden');
  document.getElementById('identifierInput').value = '';
  document.getElementById('passwordInput').value = '';
  document.getElementById('confirmInput').value = '';
  switchTab('login');
  updateCounterDisplay();
}

function buildSmartChatReply(message) {
  const lower = message.toLowerCase();
  const matched = chatKnowledge.find(item => item.keywords.some(keyword => lower.includes(keyword)));
  const intro = matched
    ? matched.answer
    : 'Puedo ayudarte mejor si me dices sintomas concretos: hojas amarillas, manchas, plagas, exceso de agua, falta de luz o tipo de planta.';
  const sensorContext = ` Sensor actual: humedad ${state.sensors.moisture}%, temperatura ${state.sensors.temp}C y luz ${state.sensors.light}%.`;
  const locationContext = state.location.terrain ? ` Contexto del terreno: ${state.location.terrain}.` : '';
  return `${intro}${sensorContext}${locationContext}`;
}

async function getAssistantReply(message) {
  if (appConfig.aiChatEndpoint) {
    try {
      const response = await callJsonApi(appConfig.aiChatEndpoint, {
        message,
        context: { user: getCurrentUser(), sensors: state.sensors, location: state.location }
      });
      if (response?.answer) return response.answer;
    } catch (error) {
      console.warn('Fallo el chat externo.', error);
    }
  }
  return buildSmartChatReply(message);
}

function addMessage(role, text) {
  const container = document.getElementById('chatMessages');
  const time = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
  const node = document.createElement('div');
  node.className = `msg ${role === 'user' ? 'user-msg' : 'ai-msg'} fade-in`;
  node.innerHTML = `
    <div class="msg-avatar ${role === 'user' ? 'user-avatar-icon' : 'ai-avatar'}">${role === 'user' ? 'TU' : 'AI'}</div>
    <div class="msg-bubble ${role === 'user' ? 'user-bubble' : 'ai-bubble'}">
      <p>${sanitizeHtml(text)}</p>
      <span class="msg-time">${time}</span>
    </div>
  `;
  container.appendChild(node);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  const node = document.createElement('div');
  node.id = 'typingIndicator';
  node.className = 'msg fade-in';
  node.innerHTML = '<div class="msg-avatar ai-avatar">AI</div><div class="msg-bubble ai-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
  container.appendChild(node);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  document.getElementById('typingIndicator')?.remove();
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const value = input.value.trim();
  if (!value) return;
  input.value = '';
  document.getElementById('chatSuggestions').style.display = 'none';
  addMessage('user', value);
  showTyping();
  const reply = await getAssistantReply(value);
  removeTyping();
  addMessage('ai', reply);
}

function sendSuggestion(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

async function sendContactForm() {
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim().toLowerCase();
  const subject = document.getElementById('contactSubject').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  const success = document.getElementById('contactSuccess');
  if (!name || !email || !subject || !message) {
    alert('Completa todos los campos del formulario.');
    return;
  }
  if (!validEmail(email)) {
    alert('Ingresa un correo valido.');
    return;
  }

  const record = {
    id: generateId('message'),
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
    whatsappPrepared: true
  };

  updateAppState(data => {
    data.messages.push(record);
    data.notifications.push({
      id: generateId('notification'),
      channel: 'email',
      target: appConfig.companyEmail,
      subject: `Nuevo mensaje: ${subject}`,
      body: `${name} (${email}) escribio: ${message}`,
      createdAt: new Date().toISOString()
    });
  });

  if (appConfig.contactEndpoint) {
    try {
      await callJsonApi(appConfig.contactEndpoint, {
        userId: getCurrentUser()?.id || null,
        fullName: name,
        email,
        subject,
        message
      });
    } catch (error) {
      console.warn('No se pudo enviar el mensaje al backend.', error);
    }
  }

  const whatsappText = encodeURIComponent(`Hola Eco-STEM, soy ${name}. Asunto: ${subject}. Mensaje: ${message}. Mi correo es ${email}.`);
  window.open(`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${whatsappText}`, '_blank', 'noopener');
  const mailto = `mailto:${encodeURIComponent(appConfig.companyEmail)}?subject=${encodeURIComponent(`Contacto Eco-STEM - ${subject}`)}&body=${encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`)}`;
  window.location.href = mailto;

  success.classList.remove('hidden');
  document.getElementById('contactName').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactSubject').value = '';
  document.getElementById('contactMessage').value = '';
  setTimeout(() => success.classList.add('hidden'), 5000);
}
async function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  const status = document.getElementById('newsletterStatus');
  const button = document.getElementById('newsletterBtn');
  const email = input.value.trim().toLowerCase();
  const db = getAppState();

  status.classList.add('hidden');
  status.style.color = 'var(--green)';

  if (!validEmail(email)) {
    status.textContent = 'Ingresa un correo valido.';
    status.style.color = '#f59e0b';
    status.classList.remove('hidden');
    return;
  }

  const alreadySubscribed = Array.isArray(db.newsletterSubscriptions)
    && db.newsletterSubscriptions.some(item => item.email === email && item.status === 'active');

  if (alreadySubscribed) {
    status.textContent = 'Ese correo ya está suscrito.';
    status.style.color = '#38bdf8';
    status.classList.remove('hidden');
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = 'Suscribiendo...';
  }

  let remoteExisting = false;

  if (appConfig.preferencesEndpoint) {
    try {
      const response = await callJsonApi(`${appConfig.preferencesEndpoint}/newsletter`, {
        userId: getCurrentUser()?.id || null,
        email
      });
      remoteExisting = Boolean(response?.existing);
    } catch (error) {
      console.warn('No se pudo registrar el newsletter en el backend.', error);
    }
  }

  if (remoteExisting) {
    updateAppState(data => {
      data.newsletterSubscriptions = Array.isArray(data.newsletterSubscriptions) ? data.newsletterSubscriptions : [];
      if (!data.newsletterSubscriptions.some(item => item.email === email)) {
        data.newsletterSubscriptions.push({
          id: generateId('newsletter_local'),
          userId: getCurrentUser()?.id || null,
          email,
          status: 'active',
          source: 'backend',
          createdAt: new Date().toISOString()
        });
      }
    });
    input.value = '';
    status.textContent = 'Ese correo ya estaba suscrito.';
    status.style.color = '#38bdf8';
    status.classList.remove('hidden');
    if (button) {
      button.disabled = false;
      button.textContent = 'Suscribirse';
    }
    return;
  }

  updateAppState(data => {
    data.newsletterSubscriptions = Array.isArray(data.newsletterSubscriptions) ? data.newsletterSubscriptions : [];
    data.newsletterSubscriptions.push({
      id: generateId('newsletter_local'),
      userId: getCurrentUser()?.id || null,
      email,
      status: 'active',
      source: appConfig.preferencesEndpoint ? 'hybrid' : 'local',
      createdAt: new Date().toISOString()
    });
    data.notifications.push({
      id: generateId('newsletter'),
      channel: 'newsletter',
      target: email,
      subject: 'Suscripcion newsletter',
      body: 'Alta local registrada.',
      createdAt: new Date().toISOString()
    });
  });

  input.value = '';
  status.textContent = 'Suscripción registrada correctamente.';
  status.classList.remove('hidden');
  if (button) {
    button.disabled = false;
    button.textContent = 'Suscribirse';
  }
}

async function setCookieConsent(value) {
  const button = document.getElementById('cookieAcceptBtn');
  const buttonText = document.getElementById('cookieAcceptText');
  const loader = document.getElementById('cookieAcceptLoader');

  if (button) button.disabled = true;
  if (loader) loader.classList.remove('hidden');
  if (buttonText) buttonText.textContent = 'Aceptando...';

  await new Promise(resolve => setTimeout(resolve, 700));

  updateAppState(data => {
    data.cookieConsent = { value, updatedAt: new Date().toISOString(), version: COOKIE_CONSENT_VERSION };
  });

  if (appConfig.preferencesEndpoint) {
    try {
      await callJsonApi(`${appConfig.preferencesEndpoint}/cookies`, {
        userId: getCurrentUser()?.id || null,
        consentType: 'cookies',
        consentValue: value
      });
    } catch (error) {
      console.warn('No se pudo guardar la preferencia de cookies en el backend.', error);
    }
  }

  closeCookieConsentModal();
  document.getElementById('cookieStatus').textContent = 'Cookies y terminos aceptados';
  if (loader) loader.classList.add('hidden');
  if (buttonText) buttonText.textContent = 'Aceptar y continuar';
}

function updateCookieAcceptState() {
  const checkbox = document.getElementById('cookieTermsCheck');
  const button = document.getElementById('cookieAcceptBtn');
  if (!checkbox || !button) return;
  button.disabled = !checkbox.checked;
}

function rejectCookieConsent() {
  const checkbox = document.getElementById('cookieTermsCheck');
  const warning = document.querySelector('.cookie-warning');
  if (checkbox) checkbox.checked = false;
  updateCookieAcceptState();
  if (warning) {
    warning.textContent = 'Debes aceptar los términos, la privacidad y las cookies para continuar en Eco-STEM.';
  }
}

function openCookieConsentModal() {
  const overlay = document.getElementById('cookieOverlay');
  const banner = document.getElementById('cookieBanner');
  const checkbox = document.getElementById('cookieTermsCheck');
  if (!overlay || !banner) return;
  overlay.classList.remove('hidden');
  banner.classList.remove('hidden');
  document.body.classList.add('consent-lock');
  document.body.style.overflow = 'hidden';
  if (checkbox) checkbox.checked = false;
  updateCookieAcceptState();
}

function closeCookieConsentModal() {
  const overlay = document.getElementById('cookieOverlay');
  const banner = document.getElementById('cookieBanner');
  if (overlay) overlay.classList.add('hidden');
  if (banner) banner.classList.add('hidden');
  document.body.classList.remove('consent-lock');
  document.body.style.overflow = document.getElementById('paymentModal')?.classList.contains('open') ? 'hidden' : '';
}

function restoreSessionUI() {
  const db = getAppState();
  if (db.currentUserId) {
    const user = db.users.find(item => item.id === db.currentUserId);
    if (user) showLoggedIn(user);
  }
  openCookieConsentModal();
  document.getElementById('cookieStatus').textContent = db.cookieConsent?.version === COOKIE_CONSENT_VERSION
    ? 'Cookies y terminos aceptados'
    : 'Cookies y terminos pendientes';
}

document.addEventListener('DOMContentLoaded', () => {
  const initTime = document.getElementById('initTime');
  if (initTime) {
    initTime.textContent = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
  }

  document.getElementById('paymentModal')?.addEventListener('click', event => {
    if (event.target.id === 'paymentModal') closePaymentModal();
  });
  document.getElementById('locationConsentModal')?.addEventListener('click', event => {
    if (event.target.id === 'locationConsentModal') closeLocationConsentModal(true);
  });

  document.querySelectorAll('[data-payment-method]').forEach(node => {
    node.addEventListener('click', () => selectPaymentMethod(node.dataset.paymentMethod));
  });

  updateCookieAcceptState();
  document.getElementById('locationBtn')?.addEventListener('click', requestExactLocation);
  updateCounterDisplay();
  restoreSessionUI();
  renderSelectedImages();
  updateSensorUI();
  renderBarChart();
  renderPlannerForecast(state.location.forecast);
  generatePlantRecommendations();
});

const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(dynamicStyle);


















