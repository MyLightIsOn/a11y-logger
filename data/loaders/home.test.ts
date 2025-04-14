// data/home.test.ts
import { getHomePageData } from "./home";
import { fetchStrapiData } from "@/data/loaders/strapi";
import { getStrapiURL } from "@/lib/utils";
import qs from "qs";

// Mock fetchStrapiData
jest.mock("./strapi", () => ({
  fetchStrapiData: jest.fn(),
}));

const mockedFetch = fetchStrapiData as jest.Mock;

describe("getHomePageData", () => {
  const baseUrl = getStrapiURL();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls fetchStrapiData with the correct populated URL", async () => {
    const mockResponse = { data: "mocked" };
    mockedFetch.mockResolvedValueOnce(mockResponse);

    const expectedQuery = qs.stringify({
      populate: {
        blocks: {
          on: {
            "layout.hero-section": {
              populate: {
                image: {
                  fields: ["url", "alternativeText"],
                },
                link: {
                  populate: true,
                },
              },
            },
            "layout.features-section": {
              populate: {
                feature: {
                  populate: true,
                },
              },
            },
          },
        },
      },
    });

    const expectedUrl = `${baseUrl}/api/home-page?${expectedQuery}`;

    const result = await getHomePageData();

    expect(mockedFetch).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(mockResponse);
  });

  it("returns response even if blocks are missing or empty", async () => {
    const mockResponse = {
      data: {
        id: 1,
        attributes: {
          blocks: null, // Simulate missing blocks
        },
      },
    };

    mockedFetch.mockResolvedValueOnce(mockResponse);

    const result = await getHomePageData();

    expect(result).toEqual(mockResponse);
    expect(mockedFetch).toHaveBeenCalled();
  });
});
