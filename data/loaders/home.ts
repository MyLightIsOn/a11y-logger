import { fetchStrapiData } from "@/data/loaders/strapi";
import qs from "qs"; // Used to stringify query objects for URLs (especially Strapi's complex queries)
import { getStrapiURL } from "@/lib/utils"; // Utility function to get the base URL of the Strapi backend

// Define base URL of the Strapi backend
const baseUrl = getStrapiURL();

/**
 * Fetches data for the Home Page from Strapi CMS.
 * Uses Strapi's `populate` to load deeply nested components and relations.
 */
export async function getHomePageData() {
  const url = new URL("/api/home-page", baseUrl);

  // Strapi query: fetch specific component blocks with nested population
  url.search = qs.stringify({
    populate: {
      blocks: {
        on: {
          "layout.hero-section": {
            populate: {
              image: {
                fields: ["url", "alternativeText"], // Only include these fields from image
              },
              link: {
                populate: true, // Fully populate link relationship
              },
            },
          },
          "layout.features-section": {
            populate: {
              feature: {
                populate: true, // Populate all feature relationships
              },
            },
          },
        },
      },
    },
  });

  return await fetchStrapiData(url.href); // Call generic fetcher with constructed URL
}
