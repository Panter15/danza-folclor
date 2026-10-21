// All site content lives here, shaped like the documents Sanity will hold later.
// Facts come from the group's CV (hv ancestros.pdf). WhatsApp number and Instagram are still placeholders.

export type Lang = "es" | "en";
export type Localized = Record<Lang, string>;

export type Performance = {
  name: string;
  region: Localized;
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
  foundedYear: "2014",
  whatsappNumber: "570000000000", // country code + number, digits only
  instagram: "https://instagram.com/",
};

export const ui: Record<Lang, Record<string, string>> = {
  es: {
    navHome: "Inicio",
    navAbout: "Historia",
    aboutHeadline1: "Desde 2014",
    aboutHeadline2: "salvaguardando",
    aboutHeadline3: "nuestro folclor",
    performancesIntro: "Algunas danzas de nuestro repertorio.",
    navPerformances: "Presentaciones",
    navTours: "Giras",
    navContact: "Contacto",
    heroLine1: "Bailamos",
    heroLine2: "la memoria",
    heroLine3: "de Colombia",
    aboutTitle: "Nuestra historia",
    aboutBody:
      "Somos una fundación cultural y social sin ánimo de lucro de Ciénaga, Magdalena, creada en 2014. Formamos a niños y jóvenes en la danza, la música y el teatro, y llevamos a escena el folclor tradicional de nuestro territorio para mantener vivos los saberes ancestrales.",
    performancesTitle: "Presentaciones",
    toursTitle: "Giras",
    toursSubtitle: "Festivales donde hemos bailado",
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
    aboutHeadline1: "Since 2014",
    aboutHeadline2: "safeguarding",
    aboutHeadline3: "our folklore",
    performancesIntro: "Some dances from our repertoire.",
    navPerformances: "Performances",
    navTours: "Tours",
    navContact: "Contact",
    heroLine1: "We dance",
    heroLine2: "the memory",
    heroLine3: "of Colombia",
    aboutTitle: "Our story",
    aboutBody:
      "We are a non-profit cultural and social foundation from Ciénaga, Magdalena, founded in 2014. We train children and young people in dance, music and theatre, and bring the traditional folklore of our region to the stage to keep ancestral knowledge alive.",
    performancesTitle: "Performances",
    toursTitle: "Tours",
    toursSubtitle: "Festivals we have danced at",
    contactTitle: "Shall we dance together?",
    contactBody:
      "Festivals, cultural events, collaborations or bookings: write to us and let's talk.",
    contactCta: "Message us on WhatsApp",
    whatsappMessage: "Hello, I would like information about booking the group.",
    footerRights: "All rights reserved.",
  },
};

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
    region: { es: "Caribe colombiano", en: "Colombian Caribbean" },
    palette: ["#F2C230", "#C8102E"],
    photo: "/photos/08.jpeg",
  },
  {
    name: "Caimán Cienaguero",
    region: { es: "Ciénaga, Magdalena", en: "Ciénaga, Magdalena" },
    palette: ["#2E7D5B", "#F2C230"],
    photo: "/photos/09.jpeg",
  },
  {
    name: "Pilanderas",
    region: { es: "Región Caribe", en: "Caribbean region" },
    palette: ["#FF4F8B", "#F2C230"],
    photo: "/photos/06.jpeg",
  },
];

// From the CV's festival list. Only Barranquilla has a photo known to be from that event.
export const tours: Tour[] = [
  {
    year: "2023 – 2024",
    city: "Barranquilla",
    country: { es: "Colombia", en: "Colombia" },
    event: { es: "Carnaval de Barranquilla", en: "Barranquilla Carnival" },
    palette: ["#F2C230", "#C8102E"],
    photo: "/photos/19.jpeg",
  },
  {
    year: "2024",
    city: "Panamá",
    country: { es: "Panamá", en: "Panama" },
    event: { es: "Festival Internacional de Danza Ruta Transístmica", en: "Ruta Transístmica International Dance Festival" },
    palette: ["#1F3A93", "#C8102E"],
  },
  {
    year: "2015 – 2024",
    city: "Ciénaga",
    country: { es: "Magdalena, Colombia", en: "Magdalena, Colombia" },
    event: { es: "Festival Nacional del Caimán Cienaguero", en: "Caimán Cienaguero National Festival" },
    palette: ["#2E7D5B", "#F2C230"],
  },
  {
    year: "2022 – 2023",
    city: "Santa Marta",
    country: { es: "Magdalena, Colombia", en: "Magdalena, Colombia" },
    event: { es: "Fiestas del Mar", en: "Fiestas del Mar (Sea Festival)" },
    palette: ["#7FC8D8", "#1F3A93"],
  },
  {
    year: "2024",
    city: "El Copey",
    country: { es: "Cesar, Colombia", en: "Cesar, Colombia" },
    event: { es: "Festival Nacional de Danzas", en: "National Dance Festival" },
    palette: ["#E2733B", "#5A1E0E"],
  },
  {
    year: "2023",
    city: "Tocancipá",
    country: { es: "Cundinamarca, Colombia", en: "Cundinamarca, Colombia" },
    event: { es: "Festival Nacional de la Colombianidad", en: "National Festival of Colombianness" },
    palette: ["#C8102E", "#F7D6E0"],
  },
];
