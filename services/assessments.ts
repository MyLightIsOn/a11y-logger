import axios from "axios";
import { API_AUTH_TOKEN, API_URL } from "@/static/const";

function useAssessmentServices() {
  const getAssessments = async () => {
    const req = await axios.get(API_URL + "/assessments", {
      headers: API_AUTH_TOKEN,
    });

    return "true";
    //return req.data.data;
  };

  return { getAssessments };
}

export default useAssessmentServices;
