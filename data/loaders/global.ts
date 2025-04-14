import { fetchStrapiData } from "@/data/loaders/strapi";
import { getStrapiURL } from "@/lib/utils"; // Utility function to get the base URL of the Strapi backend
import qs from "qs"; // Used to stringify query objects for URLs (especially Strapi's complex queries)
const baseUrl = getStrapiURL(); // Define base URL of the Strapi backend

/**
 * Fetches global layout data (e.g. header and footer) from Strapi.
 * This is used for persistent UI components across all pages.
 */
export async function getGlobalData() {
  const url = new URL("/api/global", baseUrl);

  // Populate header and footer fields needed for layout
  url.search = qs.stringify({
    populate: [
      "header.logoText",
      "header.ctaButton",
      "footer.logoText",
      "footer.socialLink",
    ],
  });

  return await fetchStrapiData(url.href);
}

/**
 * Fetches global metadata fields like title and description.
 * Used for setting SEO-related information (head tags, etc.).
 */
export async function getGlobalPageMetadata() {
  const url = new URL("/api/global", baseUrl);

  // Only retrieve specific top-level fields from the global API
  url.search = qs.stringify({
    fields: ["title", "description"],
  });

  return await fetchStrapiData(url.href);
}
