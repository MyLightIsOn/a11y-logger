import axios from "axios";
import useAssessmentServices from "./assessments"; // replace with the correct path
import { API_AUTH_TOKEN, API_URL } from "@/static/const";

jest.mock("axios");

describe("useAssessmentServices", () => {
  const get = jest.fn();

  axios.get = get;

  describe("getAssessments", () => {
    it("fetches successfully data from an API", async () => {
      const data = "true";
      get.mockImplementationOnce(() => Promise.resolve(data));
      const { getAssessments } = useAssessmentServices();
      const actualValue = await getAssessments();
      expect(get).toHaveBeenCalledWith(`${API_URL}/assessments`, {
        headers: API_AUTH_TOKEN,
      });
      expect(actualValue).toEqual(data);

      get.mockClear();
    });

    it("fetches erroneously data from an API", async () => {
      const errorMessage = "Network Error";
      const { getAssessments } = useAssessmentServices();
      get.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

      await expect(getAssessments()).rejects.toThrow(errorMessage);

      get.mockClear();
    });
  });
});
