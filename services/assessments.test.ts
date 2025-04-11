import axios from "axios";
import useAssessmentServices from "./assessments"; // replace with the correct path

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
      expect(get).toHaveBeenCalledWith("undefined/assessments", {
        headers: {
          Authorization: "Bearer undefined",
        },
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
