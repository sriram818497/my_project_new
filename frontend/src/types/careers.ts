export interface CareersRegion {
  id: string;
  name: string;
  content: string;
}

export interface CareersCard {
  title: string;
  desc: string;
  img: string;
  link: string;
}

export interface CareersValueTab {
  id: string;
  name: string;
  title: string;
  content: string;
  img: string;
}

export interface CareersHero {
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  ctaLabel: string;
  ctaPath: string;
  backgroundImage: string;
}

export interface CareersContent {
  hero: CareersHero;
  regions: CareersRegion[];
  cultureCards: CareersCard[];
  valueTabs: CareersValueTab[];
  benefits: string[];
  testimonials: Array<{
    name: string;
    role: string;
    quote: string;
    image: string;
  }>;
  cultureSpotlight: {
    title: string;
    description: string;
    image: string;
  };
}
