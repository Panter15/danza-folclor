// All site content lives here, shaped like the documents Sanity will hold later.
// Everything below is PLACEHOLDER content — replace with the group's real data.

export type Lang = "es" | "en";
export type Localized = Record<Lang, string>;

export type Performance = {
  name: string;
  region: Localized;
  description: Localized;
  // Placeholder "photo" colours until real images arrive.
  palette: [string, string];
};

export type Tour = {
  year: string;
  city: string;
  country: Localized;
  event: Localized;
  palette: [string, string];
};

export const group = {
  name: "Fundacion Ancestros ONG",
  foundedYear: "19XX",
  whatsappNumber: "570000000000", // country code + number, digits only
  instagram: "https://instagram.com/",
};

export const ui: Record<Lang, Record<string, string>> = {
  es: {
    navHome: "Inicio",
    navAbout: "Historia",
    aboutHeadline1: "Treinta años",
    aboutHeadline2: "llevando Colombia",
    aboutHeadline3: "al mundo",
    performancesIntro: "Seis danzas, seis regiones, un solo país.",
    navPerformances: "Presentaciones",
    navTours: "Giras",
    navContact: "Contacto",
    heroKicker: "Danza folclórica colombiana",
    heroLine1: "Bailamos",
    heroLine2: "la memoria",
    heroLine3: "de Colombia",
    aboutTitle: "Nuestra historia",
    aboutBody:
      "Desde nuestra fundación llevamos los ritmos del Caribe, los Andes, los Llanos y el Pacífico a escenarios de Colombia y del mundo. Cada presentación es un viaje por la identidad, el color y la alegría de nuestro país.",
    statYears: "años en escena",
    statCountries: "países visitados",
    statShows: "presentaciones",
    performancesTitle: "Presentaciones",
    toursTitle: "Giras",
    toursSubtitle: "Nuestro recorrido por el mundo",
    contactTitle: "¿Bailamos juntos?",
    contactBody:
      "Festivales, eventos culturales, colaboraciones o contrataciones: escríbenos y conversemos.",
    contactCta: "Escríbenos por WhatsApp",
    whatsappMessage: "Hola, quisiera información sobre una presentación del grupo.",
    footerRights: "Todos los derechos reservados.",
  },
  en: {
    navHome: "Home",
    navAbout: "History",
    aboutHeadline1: "Thirty years",
    aboutHeadline2: "taking Colombia",
    aboutHeadline3: "to the world",
    performancesIntro: "Six dances, six regions, one country.",
    navPerformances: "Performances",
    navTours: "Tours",
    navContact: "Contact",
    heroKicker: "Colombian folk dance",
    heroLine1: "We dance",
    heroLine2: "the memory",
    heroLine3: "of Colombia",
    aboutTitle: "Our story",
    aboutBody:
      "Since our founding we have carried the rhythms of the Caribbean, the Andes, the Plains and the Pacific to stages across Colombia and around the world. Every performance is a journey through the identity, colour and joy of our country.",
    statYears: "years on stage",
    statCountries: "countries visited",
    statShows: "performances",
    performancesTitle: "Performances",
    toursTitle: "Tours",
    toursSubtitle: "Our journey around the world",
    contactTitle: "Shall we dance together?",
    contactBody:
      "Festivals, cultural events, collaborations or bookings: write to us and let's talk.",
    contactCta: "Message us on WhatsApp",
    whatsappMessage: "Hello, I would like information about booking the group.",
    footerRights: "All rights reserved.",
  },
};

export const stats = { years: 30, countries: 12, shows: 500 };

// Sections listed in the side navigation, in page order.
export const sections = [
  { id: "top", labelKey: "navHome" },
  { id: "historia", labelKey: "navAbout" },
  { id: "presentaciones", labelKey: "navPerformances" },
  { id: "giras", labelKey: "navTours" },
  { id: "contacto", labelKey: "navContact" },
] as const;

// Hero scroll sequence. Export a performance video to numbered frames
// (e.g. `ffmpeg -i spin.mp4 -vf fps=30 public/sequence/%04d.webp`) and list
// them here; while it is empty, the hero draws an animated pollera instead.
export const heroSequence: string[] = [];

// Placeholder "photos" that fly past the history headline. Swap for real images.
export const flyingImages: { palette: [string, string] }[] = [
  { palette: ["#FCD116", "#CE1126"] },
  { palette: ["#003893", "#7FC8D8"] },
  { palette: ["#2E7D5B", "#F4E3B2"] },
  { palette: ["#E2733B", "#5A1E0E"] },
  { palette: ["#CE1126", "#F7D6E0"] },
  { palette: ["#B5651D", "#FCD116"] },
];

export const performances: Performance[] = [
  {
    name: "Cumbia",
    region: { es: "Región Caribe", en: "Caribbean region" },
    description: {
      es: "Velas encendidas y polleras que giran al ritmo del tambor.",
      en: "Lit candles and swirling skirts to the beat of the drum.",
    },
    palette: ["#F2C230", "#C8102E"],
  },
  {
    name: "Mapalé",
    region: { es: "Región Caribe", en: "Caribbean region" },
    description: {
      es: "Energía afrocolombiana pura, rápida y explosiva.",
      en: "Pure Afro-Colombian energy, fast and explosive.",
    },
    palette: ["#E2733B", "#5A1E0E"],
  },
  {
    name: "Bambuco",
    region: { es: "Región Andina", en: "Andean region" },
    description: {
      es: "Un cortejo elegante entre pañuelos y sombreros.",
      en: "An elegant courtship of handkerchiefs and hats.",
    },
    palette: ["#2E7D5B", "#F4E3B2"],
  },
  {
    name: "Joropo",
    region: { es: "Los Llanos", en: "The Plains" },
    description: {
      es: "Zapateo veloz al son del arpa, el cuatro y las maracas.",
      en: "Rapid footwork to the harp, cuatro and maracas.",
    },
    palette: ["#B5651D", "#F2C230"],
  },
  {
    name: "Currulao",
    region: { es: "Región Pacífica", en: "Pacific region" },
    description: {
      es: "La marimba de chonta y el canto que vienen del mar.",
      en: "The chonta marimba and songs that come from the sea.",
    },
    palette: ["#1F3A93", "#7FC8D8"],
  },
  {
    name: "Sanjuanero",
    region: { es: "Huila y Tolima", en: "Huila and Tolima" },
    description: {
      es: "Coqueteo, alegría y el espíritu de las fiestas de San Juan.",
      en: "Flirtation, joy and the spirit of the San Juan festivities.",
    },
    palette: ["#C8102E", "#F7D6E0"],
  },
];

export const tours: Tour[] = [
  {
    year: "20XX",
    city: "Barranquilla",
    country: { es: "Colombia", en: "Colombia" },
    event: { es: "Carnaval de Barranquilla", en: "Barranquilla Carnival" },
    palette: ["#F2C230", "#C8102E"],
  },
  {
    year: "20XX",
    city: "Ciudad de México",
    country: { es: "México", en: "Mexico" },
    event: { es: "Festival internacional de folclor", en: "International folk festival" },
    palette: ["#2E7D5B", "#C8102E"],
  },
  {
    year: "20XX",
    city: "Madrid",
    country: { es: "España", en: "Spain" },
    event: { es: "Semana cultural colombiana", en: "Colombian cultural week" },
    palette: ["#C8102E", "#F2C230"],
  },
  {
    year: "20XX",
    city: "París",
    country: { es: "Francia", en: "France" },
    event: { es: "Encuentro de culturas del mundo", en: "World cultures gathering" },
    palette: ["#1F3A93", "#F4F1EC"],
  },
  {
    year: "20XX",
    city: "Buenos Aires",
    country: { es: "Argentina", en: "Argentina" },
    event: { es: "Festival latinoamericano de danza", en: "Latin American dance festival" },
    palette: ["#7FC8D8", "#1F3A93"],
  },
  {
    year: "20XX",
    city: "Cali",
    country: { es: "Colombia", en: "Colombia" },
    event: { es: "Festival Petronio Álvarez", en: "Petronio Álvarez Festival" },
    palette: ["#E2733B", "#2E7D5B"],
  },
];
