// All site content lives here, shaped like the documents Sanity will hold later.
// Everything below is PLACEHOLDER content — replace with the group's real data.

export type Lang = "es" | "en";
export type Localized = Record<Lang, string>;

export type Performance = {
  name: string;
  region: Localized;
  description: Localized;
  // Gradient shown behind the photo while it loads.
  palette: [string, string];
  photo?: string;
};

export type Tour = {
  year: string;
  city: string;
  country: Localized;
  event: Localized;
  palette: [string, string];
  photo?: string;
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
    performancesIntro: "Cuatro danzas, un mismo Caribe.",
    navPerformances: "Presentaciones",
    navTours: "Giras",
    navContact: "Contacto",
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
    performancesIntro: "Four dances, one Caribbean.",
    navPerformances: "Performances",
    navTours: "Tours",
    navContact: "Contact",
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

// Hero scroll sequence: 100 frames (5 s) of a cumbia performance, exported from
// a WhatsApp video to public/sequence/0001-0100.webp. Empty it to fall back to
// the animated pollera drawing.
export const heroSequence: string[] = Array.from(
  { length: 100 },
  (_, i) => `/sequence/${String(i + 1).padStart(4, "0")}.webp`,
);

// Photos that fly past the history headline.
export const flyingImages: { palette: [string, string]; photo?: string }[] = [
  { palette: ["#FCD116", "#CE1126"], photo: "/photos/15.jpeg" },
  { palette: ["#003893", "#7FC8D8"], photo: "/photos/12.jpeg" },
  { palette: ["#2E7D5B", "#F4E3B2"], photo: "/photos/05.jpeg" },
  { palette: ["#E2733B", "#5A1E0E"], photo: "/photos/24.jpeg" },
  { palette: ["#CE1126", "#F7D6E0"], photo: "/photos/03.jpeg" },
  { palette: ["#B5651D", "#FCD116"], photo: "/photos/13.jpeg" },
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
    photo: "/photos/08.jpeg",
  },
  {
    name: "Danza del Caimán",
    region: { es: "Ciénaga, Magdalena", en: "Ciénaga, Magdalena" },
    description: {
      es: "La leyenda del caimán que se llevó a un niño, contada con humor y color.",
      en: "The legend of the caiman that carried off a child, told with humour and colour.",
    },
    palette: ["#2E7D5B", "#F2C230"],
    photo: "/photos/09.jpeg",
  },
  {
    name: "Danza del Pilón",
    region: { es: "Valledupar, Cesar", en: "Valledupar, Cesar" },
    description: {
      es: "El pilón y la batea: el trabajo de pilar el maíz convertido en fiesta.",
      en: "Pestle and basket: the work of pounding maize turned into a celebration.",
    },
    palette: ["#FF4F8B", "#F2C230"],
    photo: "/photos/06.jpeg",
  },
  {
    name: "Mapalé",
    region: { es: "Región Caribe", en: "Caribbean region" },
    description: {
      es: "Energía afrocolombiana pura, rápida y explosiva.",
      en: "Pure Afro-Colombian energy, fast and explosive.",
    },
    palette: ["#E2733B", "#5A1E0E"],
    photo: "/photos/22.jpeg",
  },
];

export const tours: Tour[] = [
  {
    year: "20XX",
    city: "Barranquilla",
    country: { es: "Colombia", en: "Colombia" },
    event: { es: "Carnaval de Barranquilla", en: "Barranquilla Carnival" },
    palette: ["#F2C230", "#C8102E"],
    photo: "/photos/19.jpeg",
  },
  {
    year: "20XX",
    city: "Ciudad de México",
    country: { es: "México", en: "Mexico" },
    event: { es: "Festival internacional de folclor", en: "International folk festival" },
    palette: ["#2E7D5B", "#C8102E"],
    photo: "/photos/21.jpeg",
  },
  {
    year: "20XX",
    city: "Madrid",
    country: { es: "España", en: "Spain" },
    event: { es: "Semana cultural colombiana", en: "Colombian cultural week" },
    palette: ["#C8102E", "#F2C230"],
    photo: "/photos/23.jpeg",
  },
  {
    year: "20XX",
    city: "París",
    country: { es: "Francia", en: "France" },
    event: { es: "Encuentro de culturas del mundo", en: "World cultures gathering" },
    palette: ["#1F3A93", "#F4F1EC"],
    photo: "/photos/02.jpeg",
  },
  {
    year: "20XX",
    city: "Buenos Aires",
    country: { es: "Argentina", en: "Argentina" },
    event: { es: "Festival latinoamericano de danza", en: "Latin American dance festival" },
    palette: ["#7FC8D8", "#1F3A93"],
    photo: "/photos/11.jpeg",
  },
  {
    year: "20XX",
    city: "Cali",
    country: { es: "Colombia", en: "Colombia" },
    event: { es: "Festival Petronio Álvarez", en: "Petronio Álvarez Festival" },
    palette: ["#E2733B", "#2E7D5B"],
    photo: "/photos/26.jpeg",
  },
];
