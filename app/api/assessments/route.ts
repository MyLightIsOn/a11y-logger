import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { API_AUTH_TOKEN, API_URL } from "@/static/const";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";

export async function GET(request: NextRequest) {
  const user = await getUserMeLoader();
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams?.get("documentId");
  const url = query
    ? `${API_URL}/assessments/${query}`
    : `${API_URL}/assessments`;

  try {
    if (query) {
      const req = await axios.get(url, {
        headers: API_AUTH_TOKEN,
        params: {
          populate: ["issues.screenshots", "tags"],
        },
      });

      return NextResponse.json(req.data.data);
    }
    return NextResponse.json(user.data.assessments);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Type assertion
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
