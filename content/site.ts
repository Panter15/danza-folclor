// All site content lives here, shaped like the documents Sanity will hold later.
// Facts come from the group's CV (hv ancestros.pdf). Contact details given by the student on 2026-10-21.

export type Lang = "es" | "en";
export type Localized = Record<Lang, string>;

export type Performance = {
  name: string;
  region?: Localized;
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
  foundedYear: "2014",
  whatsappNumber: "573045396858", // +57 304 5396858: country code + number, digits only
  instagram: "https://www.instagram.com/fundacion_ancestros/",
  facebook: "https://www.facebook.com/share/1BA8FsTCdG/",
};

export const ui: Record<Lang, Record<string, string>> = {
  es: {
    navHome: "Inicio",
    navAbout: "Quiénes somos",
    aboutHeadline1: "Desde 2014",
    aboutHeadline2: "salvaguardando",
    aboutHeadline3: "nuestro folclor",
    navPerformances: "Nuestro folclor",
    navTours: "Giras",
    navContact: "Contacto",
    heroLine1: "Bailamos",
    heroLine2: "la memoria",
    heroLine3: "de Colombia",
    aboutTitle: "¿Quiénes somos?",
    aboutBody:
      "La Fundación Cultural y Social Ancestros, con domicilio en Ciénaga, Magdalena, fue creada el 26 de agosto de 2014. Es una entidad sin ánimo de lucro cuyo objeto social es la formación, práctica, circulación y desarrollo de las artes y la cultura, salvaguardando los saberes vernáculos del territorio.",
    missionTitle: "Misión",
    missionBody:
      "Desarrollar, ejecutar e implementar programas, diseño y formulación de proyectos de naturaleza cultural y social, incidiendo en jóvenes y comunidad en general del territorio, fortaleciendo el talento humano local con habilidades artísticas, generando espacios de emprendimiento y empleabilidad y promoviendo artistas económicamente autosostenibles.",
    visionTitle: "Visión",
    visionBody:
      "La Fundación Ancestros se perfila como una de las industrias culturales más sólidas del territorio, con capacidad de operar todo tipo de proyectos culturales y sociales, creando una escuela de formadores en arte y cultura y produciendo contenidos investigativos de folclor que se conviertan en material de consulta.",
    objectiveTitle: "Objetivo",
    objectiveBody:
      "Fomentar la enseñanza, práctica, capacitación, divulgación, conservación, circulación y preservación de las artes como herramienta de desarrollo, potenciando saberes y habilidades en diferentes oficios que permitan a los artistas lograr una estabilidad económica, a través de las artes, las cocinas tradicionales y los espectáculos públicos.",
    valuesTitle: "Valores",
    folclorBody:
      "Las puestas en escena de Ancestros están inspiradas en los contenidos folclóricos tradicionales del territorio, en aras de rescatar y mantener vivos los conocimientos ancestrales, primando el carácter sociocultural sobre los contenidos técnicos foráneos (clásico y contemporáneo).",
    otherDancesTitle: "Entre otras como",
    navExperience: "Trayectoria",
    experienceTitle: "Trayectoria y experiencia",
    projectsIntro: "Contratos, proyectos y convenios legalmente soportados que hemos ejecutado:",
    festivalsIntro: "Eventos nacionales e internacionales en los que hemos ocupado lugares honoríficos:",
    otherYears: "Otros",
    showAll: "Ver todos",
    showLess: "Ver menos",
    performancesTitle: "Nuestro folclor",
    toursTitle: "Giras",
    toursSubtitle: "Festivales donde hemos bailado",
    contactTitle: "¿Bailamos juntos?",
    contactBody:
      "Festivales, eventos culturales, colaboraciones o contrataciones: escríbenos y conversemos.",
    contactCta: "Escríbenos por WhatsApp",
    whatsappMessage: "Hola, quisiera información sobre una presentación del grupo.",
    footerRights: "Todos los derechos reservados.",
    loading: "Cargando",
  },
  en: {
    navHome: "Home",
    navAbout: "About us",
    aboutHeadline1: "Since 2014",
    aboutHeadline2: "safeguarding",
    aboutHeadline3: "our folklore",
    navPerformances: "Our folklore",
    navTours: "Tours",
    navContact: "Contact",
    heroLine1: "We dance",
    heroLine2: "the memory",
    heroLine3: "of Colombia",
    aboutTitle: "About us",
    aboutBody:
      "The Ancestros Cultural and Social Foundation, based in Ciénaga, Magdalena, was founded on 26 August 2014. It is a non-profit organisation whose purpose is the training, practice, circulation and development of the arts and culture, safeguarding the vernacular knowledge of the region.",
    missionTitle: "Mission",
    missionBody:
      "To develop, carry out and implement programmes, and to design and formulate cultural and social projects that reach young people and the wider community of the region, strengthening local talent with artistic skills, creating opportunities for entrepreneurship and employment, and promoting economically self-sustaining artists.",
    visionTitle: "Vision",
    visionBody:
      "The Ancestros Foundation aims to be one of the strongest cultural organisations in the region, able to run all kinds of cultural and social projects, creating a school for arts and culture trainers and producing folklore research that becomes reference material.",
    objectiveTitle: "Objective",
    objectiveBody:
      "To promote the teaching, practice, training, dissemination, conservation, circulation and preservation of the arts as a tool for development, strengthening knowledge and skills in different trades so that artists can achieve economic stability through the arts, traditional cooking and public performances.",
    valuesTitle: "Values",
    folclorBody:
      "Ancestros' productions are inspired by the traditional folklore of the region, to rescue and keep ancestral knowledge alive, putting the sociocultural character ahead of foreign technical content (classical and contemporary).",
    otherDancesTitle: "Among others, such as",
    navExperience: "Experience",
    experienceTitle: "Track record and experience",
    projectsIntro: "Legally supported contracts, projects and agreements we have carried out:",
    festivalsIntro: "National and international events where we have earned places of honour:",
    otherYears: "Other",
    showAll: "Show all",
    showLess: "Show less",
    performancesTitle: "Our folklore",
    toursTitle: "Tours",
    toursSubtitle: "Festivals we have danced at",
    contactTitle: "Shall we dance together?",
    contactBody:
      "Festivals, cultural events, collaborations or bookings: write to us and let's talk.",
    contactCta: "Message us on WhatsApp",
    whatsappMessage: "Hello, I would like information about booking the group.",
    footerRights: "All rights reserved.",
    loading: "Loading",
  },
};

// Sections listed in the side navigation, in page order.
export const sections = [
  { id: "top", labelKey: "navHome" },
  { id: "historia", labelKey: "navAbout" },
  { id: "presentaciones", labelKey: "navPerformances" },
  { id: "giras", labelKey: "navTours" },
  { id: "trayectoria", labelKey: "navExperience" },
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
  { palette: ["#FCD116", "#CE1126"], photo: "/photos/14.jpeg" },
  { palette: ["#2E7D5B", "#F4E3B2"], photo: "/photos/20.jpeg" },
  { palette: ["#CE1126", "#F7D6E0"], photo: "/photos/pdf/quienes-somos.jpg" },
  { palette: ["#E2733B", "#5A1E0E"], photo: "/photos/18.jpeg" },
  { palette: ["#003893", "#7FC8D8"], photo: "/photos/25.jpeg" },
  { palette: ["#B5651D", "#FCD116"], photo: "/photos/04.jpeg" },
];

// Repertoire, descriptions and photos from hv ancestros.pdf.
export const performances: Performance[] = [
  {
    name: "Caimán Cienaguero",
    region: { es: "Ciénaga, Magdalena", en: "Ciénaga, Magdalena" },
    description: {
      es: "Inspirada en una leyenda popular de Ciénaga, esta danza narra, entre ritmo y teatralidad, la historia del caimán que se llevó a una niña del pueblo.",
      en: "Inspired by a popular legend from Ciénaga, this dance tells, through rhythm and theatre, the story of the caiman that carried off a girl from the town.",
    },
    palette: ["#2E7D5B", "#F2C230"],
    photo: "/photos/pdf/caiman.jpg",
  },
  {
    name: "Cumbia",
    region: { es: "Caribe colombiano", en: "Colombian Caribbean" },
    description: {
      es: "Una danza emblemática del Caribe colombiano que fusiona herencias indígenas, africanas y españolas. Con su cadencioso ritmo y el coqueteo entre pareja, la cumbia transmite el alma del folclor costeño.",
      en: "An emblematic dance of the Colombian Caribbean that blends Indigenous, African and Spanish heritage. With its swaying rhythm and the flirtation between partners, cumbia carries the soul of coastal folklore.",
    },
    palette: ["#F2C230", "#C8102E"],
    photo: "/photos/pdf/cumbia.jpg",
  },
  {
    name: "Pilanderas",
    region: { es: "Región Caribe", en: "Caribbean region" },
    description: {
      es: "Danza de laboreo donde se interpreta el oficio de pilar maíz o arroz en la región Caribe, haciendo la labor de forma tradicional con un pilón, balays y manos de pilar.",
      en: "A work dance that portrays pounding maize or rice in the Caribbean region, done the traditional way with a mortar, balay baskets and pestles.",
    },
    palette: ["#FF4F8B", "#F2C230"],
    photo: "/photos/pdf/pilanderas.jpg",
  },
  {
    name: "Tambora",
    description: {
      es: "Es un baile de carácter amoroso y social. Con sus tambores vibrantes, cantos ancestrales y pasos vigorosos, evoca la conexión espiritual de los pueblos ribereños con el agua, la tierra y la vida misma.",
      en: "A courtship and social dance. With its vibrant drums, ancestral songs and vigorous steps, it evokes the spiritual bond of riverside peoples with water, land and life itself.",
    },
    palette: ["#E2733B", "#5A1E0E"],
    photo: "/photos/pdf/tambora.jpg",
  },
  {
    name: "Torbellino",
    description: {
      es: "Su baile desciende de la forma de trotar de los ancestros indígenas al trasladarse de un lado a otro. Sus giros veloces y ritmos sincopados simbolizan el vaivén de la vida campesina y el vínculo profundo con la tierra.",
      en: "Its steps come from the way Indigenous ancestors trotted when travelling from place to place. Its quick turns and syncopated rhythms symbolise the ebb and flow of rural life and a deep bond with the land.",
    },
    palette: ["#1F3A93", "#F4F1EC"],
    photo: "/photos/pdf/torbellino.jpg",
  },
  {
    name: "Joropo",
    region: { es: "Los Llanos", en: "The Plains" },
    description: {
      es: "Esta danza celebra la libertad, el orgullo llanero y la conexión con la naturaleza. Sus zapateos enérgicos, giros vertiginosos y elegancia en pareja reflejan la fuerza, pasión y tradición de un pueblo que canta y baila su historia al ritmo del llano.",
      en: "This dance celebrates freedom, the pride of the plains and the bond with nature. Its energetic footwork, dizzying turns and elegance in pairs reflect the strength, passion and tradition of a people who sing and dance their history to the rhythm of the plains.",
    },
    palette: ["#C8102E", "#F7D6E0"],
    photo: "/photos/pdf/joropo.jpg",
  },
  {
    name: "Puya",
    region: { es: "Norte del Magdalena", en: "Northern Magdalena" },
    description: {
      es: "Es un género acelerado de la zona norte del departamento del Magdalena. Se caracteriza por sus movimientos alegres y rápidos, donde los bailarines simulan «puyar» o pinchar a quienes tienen al frente, dando origen al nombre de la danza.",
      en: "A fast-paced genre from the north of the Magdalena department. It is known for its joyful, quick movements, in which dancers pretend to «puyar», or prod, whoever is in front of them, which gives the dance its name.",
    },
    palette: ["#7FC8D8", "#1F3A93"],
    photo: "/photos/pdf/puya.jpg",
  },
  {
    name: "Pava",
    description: {
      es: "Es una danza pantomímica que nace del juego en el cual se imita el apareamiento del pavo y la pava.",
      en: "A pantomime dance born from a game that imitates the courtship of the turkey and the hen.",
    },
    palette: ["#F2C230", "#2E7D5B"],
    photo: "/photos/pdf/pava.jpg",
  },
  {
    name: "Chicote",
    region: { es: "Sierra Nevada de Santa Marta", en: "Sierra Nevada de Santa Marta" },
    description: {
      es: "Es una transmisión de saberes ancestrales, creencias y espiritualidad de los nativos de la Sierra Nevada de Santa Marta, donde también se establece una sinergia y un vínculo respetuoso entre el hombre y la madre tierra.",
      en: "A passing-on of the ancestral knowledge, beliefs and spirituality of the native peoples of the Sierra Nevada de Santa Marta, which also builds a respectful bond between people and Mother Earth.",
    },
    palette: ["#B5651D", "#F4E3B2"],
    photo: "/photos/pdf/chicote.jpg",
  },
  {
    name: "Garabato",
    description: {
      es: "Es una danza carnavalesca de origen macabro, donde se representa una disputa entre la vida y la muerte: la vida es interpretada por un personaje principal y los bailarines, y la muerte por un personaje con disfraz calavérico.",
      en: "A carnival dance with macabre origins that stages a struggle between life and death: life is played by a lead character and the dancers, and death by a character in a skeleton costume.",
    },
    palette: ["#E2733B", "#2E7D5B"],
    photo: "/photos/pdf/garabato.jpg",
  },
  {
    name: "Guacherna samaria",
    region: { es: "Santa Marta", en: "Santa Marta" },
    description: {
      es: "También conocida como la tambora samaria, es un ritmo jocoso y callejero que tuvo su origen con los hombres braceros del barrio El Alcón y lo que hoy se conoce como Pescaíto. Es un baile alegre de carácter social que integra al pueblo samario.",
      en: "Also known as the tambora samaria, it is a playful street rhythm that began with the dockworkers of the El Alcón neighbourhood and what is now known as Pescaíto. It is a joyful social dance that brings the people of Santa Marta together.",
    },
    palette: ["#C8102E", "#F2C230"],
    photo: "/photos/pdf/guacherna.jpg",
  },
  {
    name: "El teatro",
    description: {
      es: "Otra de nuestras disciplinas artísticas, en la que los niños y jóvenes encuentran un lugar para explorar sus habilidades artísticas.",
      en: "Another of our artistic disciplines, where children and young people find a place to explore their artistic skills.",
    },
    palette: ["#1F3A93", "#7FC8D8"],
    photo: "/photos/pdf/teatro.jpg",
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

// The PDF's "Entre otras como" list. Names are proper nouns, so one list serves both languages.
export const otherDances = [
  "Merengue de Gaita de Guacamayal",
  "Ritmos de banda de San Pelayo",
  "La Maya de la ribera del río",
  "Danza de los pájaros de Ciénaga",
  "Danza del ciempiés",
];

export const values: Localized[] = [
  { es: "Creatividad", en: "Creativity" },
  { es: "Respeto", en: "Respect" },
  { es: "Tradicionalidad", en: "Tradition" },
  { es: "Funcionalidad", en: "Functionality" },
  { es: "Planificación estratégica", en: "Strategic planning" },
  { es: "Investigación", en: "Research" },
  { es: "Formación", en: "Training" },
  { es: "Autenticidad", en: "Authenticity" },
  { es: "Responsabilidad", en: "Responsibility" },
];

// "Trayectoria y experiencia" (hv ancestros.pdf, page 13).
export const projects: Localized[] = [
  { es: "Dotación de vestuarios tradicionales — Universidad Santo Tomás", en: "Supply of traditional costumes — Universidad Santo Tomás" },
  { es: "Dotación de instrumentos tradicionales del Caribe — Universidad Santo Tomás", en: "Supply of traditional Caribbean instruments — Universidad Santo Tomás" },
  { es: "Confección y diseño de vestuarios — Caja de Compensación de Córdoba", en: "Costume design and making — Caja de Compensación de Córdoba" },
  { es: "Servicio de creación artística y alquiler de vestuario — Uniaguas, Cereté", en: "Artistic creation and costume rental — Uniaguas, Cereté" },
  { es: "Mercado Cultural del Magdalena — convenio MinCultura / apoyo logístico Alcaldía de Ciénaga", en: "Magdalena Cultural Market — MinCultura agreement / logistics support for the Ciénaga mayor's office" },
  { es: "Apoyo logístico del Festival de Música con Guitarra Guillermo de Jesús Buitrago", en: "Logistics support for the Guillermo de Jesús Buitrago Guitar Music Festival" },
  { es: "Semana de la Juventud del municipio de Ciénaga", en: "Ciénaga Youth Week" },
  { es: "Circulación de productos turísticos y culturales del patrimonio inmaterial de Ciénaga", en: "Promotion of tourism and cultural products from Ciénaga's intangible heritage" },
  { es: "Semana Diverso Cultural del municipio de Ciénaga", en: "Ciénaga Cultural Diversity Week" },
  { es: "Apoyo a las actividades del Consejo de Planeación Territorial de Ciénaga", en: "Support for the activities of Ciénaga's Territorial Planning Council" },
  { es: "Plan estratégico de la política pública de juventud de Ciénaga, Magdalena", en: "Strategic plan for the youth public policy of Ciénaga, Magdalena" },
  { es: "Producción de espectáculos públicos y escenografía del Festival Nacional del Caimán Cienaguero", en: "Show production and set design for the Caimán Cienaguero National Festival" },
  { es: "El Magdalena Celebra la Danza 2024 — Gobernación del Magdalena", en: "El Magdalena Celebra la Danza 2024 — Magdalena Governor's Office" },
  { es: "Festival de Teatro Macondiano a la Calle «El realismo mágico vive en su capital» — Ministerio de las Culturas, las Artes y los Saberes", en: "Macondian Street Theatre Festival «Magical realism lives in its capital» — Ministry of Cultures, Arts and Knowledge" },
  { es: "Festival de Danzas Costumbrista", en: "Costumbrista Dance Festival" },
  { es: "Escuela de Danza Costa Verde", en: "Costa Verde Dance School" },
];

// Festival names are proper nouns, so one list serves both languages (hv ancestros.pdf, page 14).
// Grouped by year, newest first. A festival spanning several years sits under its latest
// one and keeps its range in the name. year: null = the CV gives no year.
export const festivalsByYear: { year: string | null; items: string[] }[] = [
  {
    year: "2024",
    items: [
      "Festival Nacional de Danzas — El Copey, Cesar",
      "Festival Nacional de Danzas Flor María Gonzales — Corozal, Sucre",
      "Festival Internacional de Danza Ruta Transístmica — Panamá",
      "Celebración del Día Internacional de la Danza — Magdalena",
      "Carnaval de Barranquilla · 2023 – 2024",
      "Festival Nacional del Caimán Cienaguero · 2015 – 2024",
    ],
  },
  {
    year: "2023",
    items: [
      "Festival Nacional de Danza Luis Eduardo Rozo — Facatativá, Cundinamarca",
      "Festival Nacional Labrando Danza — Tenjo, Cundinamarca",
      "Festival Nacional de la Colombianidad — Tocancipá, Cundinamarca",
      "Fiestas del Mar — Santa Marta · 2022, 2023",
      "Día Nacional de la Cumbia — Santa Marta, Magdalena",
      "Festival Internacional Al Compás de la Ruta del Dorado «El mundo danza»",
      "Festival Internacional de Danzas Trietnia",
    ],
  },
  {
    year: "2022",
    items: [
      "Festival Nacional de la Cumbia José Benito Barros Palomino",
      "Festival de la Cumbia Cienaguera — Ciénaga, Magdalena",
    ],
  },
  { year: "2021", items: ["Festival Nacional de la Tambora Tradicional — Gamarra · 2020 – 2021"] },
  { year: "2020", items: ["Festival Nacional Danzando con el Sol — Anapoima, Cundinamarca · 2016, 2020"] },
  { year: "2017", items: ["Feria de la Ganadería — Montería, Córdoba · 2016 – 2017"] },
  {
    year: "2016",
    items: [
      "Festival Folclórico Colombiano — Ibagué, Tolima",
      "Festival Nacional del Porro — San Pelayo, Córdoba",
      "Festival Nacional de la Cumbiamba — Cereté, Córdoba",
      "Festival Nacional del Porro Pablo Flórez Camargo — Ciénaga de Oro, Córdoba",
      "Festival Nacional de la Tambora — Tamalameque, Cesar",
      "Festival Golondrina de Plata — Montería, Córdoba",
    ],
  },
  {
    year: null,
    items: [
      "Festival Nacional de Olleros y Sembradores — Tocancipá, Cundinamarca",
      "Festival Nacional de la Rumba Criolla — Fresno, Tolima",
    ],
  },
];
