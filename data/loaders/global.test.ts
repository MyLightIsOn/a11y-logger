import { getGlobalData, getGlobalPageMetadata } from "@/data/loaders/global";
import { fetchStrapiData } from "@/data/loaders/strapi";
import { getStrapiURL } from "@/lib/utils";
import qs from "qs";

// Mock fetchStrapiData
jest.mock("./strapi", () => ({
  fetchStrapiData: jest.fn(),
}));

const mockedFetch = fetchStrapiData as jest.Mock;

describe("global API functions", () => {
  const baseUrl = getStrapiURL();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getGlobalData calls fetchStrapiData with correct URL", async () => {
    const mockResponse = { some: "data" };
    mockedFetch.mockResolvedValueOnce(mockResponse);

    const expectedQuery = qs.stringify({
      populate: [
        "header.logoText",
        "header.ctaButton",
        "footer.logoText",
        "footer.socialLink",
      ],
    });

    const expectedUrl = `${baseUrl}/api/global?${expectedQuery}`;

    const result = await getGlobalData();

    expect(mockedFetch).toHaveBeenCalledWith(expectedUrl);
    expect(result).toBe(mockResponse);
  });

  test("getGlobalPageMetadata calls fetchStrapiData with correct URL", async () => {
    const mockMetadata = { title: "Site Title", description: "Description" };
    mockedFetch.mockResolvedValueOnce(mockMetadata);

    const expectedQuery = qs.stringify({
      fields: ["title", "description"],
    });

    const expectedUrl = `${baseUrl}/api/global?${expectedQuery}`;

    const result = await getGlobalPageMetadata();

    expect(mockedFetch).toHaveBeenCalledWith(expectedUrl);
    expect(result).toBe(mockMetadata);
  });
});
