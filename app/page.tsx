import { getHomePageData } from "@/data/loaders/home";
import { HeroSection } from "@/components/custom/hero-section";
import { FeatureSection } from "@/components/custom/features-section";

// The Home component is an async function that serves as the main entry point for the homepage.
export default async function Home() {
  // Fetches the homepage data from Strapi CMS using a custom data loader function.
  const strapiData = await getHomePageData();

  // Destructures the blocks array from the fetched data, or defaults to an empty array if unavailable.
  const { blocks } = strapiData?.data || [];

  // Renders each block using the blockRenderer helper, mapping CMS content to React components.
  return <main>{blocks.map(blockRenderer)}</main>;
}

// Maps Strapi component types to their corresponding React components.
const blockComponents = {
  "layout.hero-section": HeroSection,
  "layout.features-section": FeatureSection,
};

// Helper function that takes a block object and returns the appropriate component with its data.
// It checks the block type and dynamically renders the associated React component.
// If the block type isn't recognized, it returns null to skip rendering.
function blockRenderer(block: any) {
  const Component =
    blockComponents[block.__component as keyof typeof blockComponents];
  return Component ? <Component key={block.id} data={block} /> : null;
}
