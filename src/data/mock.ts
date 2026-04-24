import type { NewsItem, NavItem, FooterLinks } from "../types";

export const navItems: NavItem[] = [
  { label: "Portada", href: "#" },
  { label: "Nacional", href: "#" },
  { label: "Internacional", href: "#" },
  { label: "Economia", href: "#" },
  { label: "Tecnologia", href: "#" },
  { label: "Deportes", href: "#" },
  { label: "Opinion", href: "#" },
];

export const categories = [
  "Politica",
  "Economia",
  "Tecnologia",
  "Deportes",
  "Cultura",
  "Ciencia",
];

export const footerLinks: FooterLinks = {
  secciones: [
    "Portada",
    "Nacional",
    "Internacional",
    "Economia",
    "Deportes",
    "Opinion",
  ],
  servicios: ["Suscripciones", "Newsletter", "App Movil", "RSS"],
  legal: ["Aviso Legal", "Privacidad", "Cookies", "Contacto"],
};

export const typeStyles = {
  urgent: "bg-destructive text-destructive-foreground",
  opinion: "bg-opinion text-white",
  feature: "bg-primary text-primary-foreground",
  normal: "bg-muted text-muted-foreground",
} as const;

export const typeLabels = {
  urgent: "Urgente",
  opinion: "Opinion",
  feature: "Destacado",
  normal: "",
} as const;

export const mockNewsData: NewsItem[] = [
  {
    id: "1",
    title:
      "Avances revolucionarios en inteligencia artificial transforman la industria tecnologica global",
    source: "TechNews",
    date: "22 Abr 2026",
    excerpt:
      "Las ultimas innovaciones en IA estan cambiando fundamentalmente como las empresas operan y toman decisiones.",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    type: "feature",
    relevance: 95,
    url: "#",
  },
  {
    id: "2",
    title:
      "Mercados globales experimentan volatilidad ante nuevas politicas economicas",
    source: "Economia Hoy",
    date: "22 Abr 2026",
    excerpt:
      "Los principales indices bursatiles muestran fluctuaciones significativas.",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    type: "urgent",
    relevance: 92,
    url: "#",
  },
  {
    id: "3",
    title: "Analisis: El futuro del trabajo remoto tras la pandemia",
    source: "Opinion Editorial",
    date: "21 Abr 2026",
    excerpt:
      "Un analisis profundo sobre como las nuevas dinamicas laborales estan redefiniendo el concepto de oficina.",
    imageUrl:
      "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&q=80",
    type: "opinion",
    relevance: 78,
    url: "#",
  },
  {
    id: "4",
    title: "Descubrimiento cientifico podria revolucionar la medicina moderna",
    source: "Ciencia Global",
    date: "21 Abr 2026",
    excerpt:
      "Investigadores anuncian un avance significativo en el tratamiento de enfermedades neurodegenerativas.",
    imageUrl:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
    type: "normal",
    relevance: 88,
    url: "#",
  },
  {
    id: "5",
    title:
      "Nueva era del transporte sostenible llega a las principales ciudades",
    source: "Medio Ambiente",
    date: "20 Abr 2026",
    excerpt:
      "Las iniciativas de movilidad verde estan transformando el panorama urbano.",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    type: "normal",
    relevance: 75,
    url: "#",
  },
  {
    id: "6",
    title: "El arte digital conquista los museos mas prestigiosos del mundo",
    source: "Cultura",
    date: "20 Abr 2026",
    excerpt:
      "Las instituciones culturales mas importantes abrazan las nuevas formas de expresion artistica.",
    imageUrl:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
    type: "normal",
    relevance: 70,
    url: "#",
  },
];
