import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { API_AUTH_TOKEN, API_URL } from "@/static/const";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams?.get("documentId");
  const url = query
    ? `${API_URL}/assessments/${query}`
    : `${API_URL}/assessments`;

  try {
    const req = await axios.get(url, {
      headers: API_AUTH_TOKEN,
      params: {
        populate: ["issues.screenshots"],
      },
    });

    return NextResponse.json(req.data.data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
