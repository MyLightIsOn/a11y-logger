import axios from "axios";
import { fetchStrapiData } from "./strapi";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchStrapiData", () => {
  const testUrl = "http://localhost/api/example";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls axios.get without headers if no authToken is provided", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { hello: "world" } });

    const result = await fetchStrapiData(testUrl);

    expect(mockedAxios.get).toHaveBeenCalledWith(testUrl, {});
    expect(result).toEqual({ hello: "world" });
  });

  it("calls axios.get with Authorization header if authToken is provided", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { secured: true } });

    const result = await fetchStrapiData(testUrl, "fake-token");

    expect(mockedAxios.get).toHaveBeenCalledWith(testUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer fake-token",
      },
    });

    expect(result).toEqual({ secured: true });
  });

  it("throws an error when axios.get fails", async () => {
    const mockError = new Error("Network error");
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(fetchStrapiData(testUrl)).rejects.toThrow("Network error");
  });
});
