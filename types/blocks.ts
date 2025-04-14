// types/blocks.ts

export interface HeroSectionBlock {
  __component: "layout.hero-section";
  id: number;
  title: string;
  subtitle: string;
  heading: string;
  subheading: string;
  image: {
    url: string;
    alternativeText?: string;
  };
  link: {
    url: string;
    text: string;
  };
}

export interface FeaturesSectionBlock {
  __component: "layout.features-section";
  id: number;
  title: string;
  feature: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    heading: string;
    subHeading: string;
  }>;
}

export type Block = HeroSectionBlock | FeaturesSectionBlock;
