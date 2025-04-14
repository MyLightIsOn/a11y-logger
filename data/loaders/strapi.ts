import axios from "axios";

/**
 * Generic function to fetch data from a given URL using Axios.
 * Optionally includes an Authorization header if an auth token is provided.
 */
export async function fetchStrapiData(url: string, authToken?: string) {
  const headers = authToken
    ? {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    : {};

  try {
    const response = await axios.get(url, headers);
    return response.data;
  } catch (error) {
    throw error;
  }
}
