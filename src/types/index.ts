export type NewsType = "urgent" | "opinion" | "feature" | "normal";

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  excerpt: string;
  imageUrl?: string;
  type: NewsType;
  relevance: number;
  url?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterLinks {
  secciones: string[];
  servicios: string[];
  legal: string[];
}
