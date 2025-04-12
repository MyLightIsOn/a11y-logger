import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { fetchData } from "@/data/loaders"; // Update this import path with the actual location of fetchData

describe("fetchData", () => {
  let httpMock: AxiosMockAdapter;

  beforeAll(() => {
    // This sets the mock adapter on the default instance
    httpMock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    // cleaning up the remaining mocks after each test
    httpMock.reset();
  });

  afterAll(() => {
    // removing the mock adapter after tests are done
    httpMock.restore();
  });

  it("fetches data with success", async () => {
    const url = "http://test/sample";
    const responseData = { sample: "data" };
    httpMock.onGet(url).reply(200, responseData);

    const data = await fetchData(url);

    expect(data).toEqual(responseData);
  });

  it("handles error", async () => {
    const url = "http://test/sample";
    httpMock.onGet(url).reply(500);

    let error;
    try {
      await fetchData(url);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });
});
