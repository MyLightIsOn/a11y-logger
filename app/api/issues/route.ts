import { NextResponse, NextRequest } from "next/server";
import { API_AUTH_TOKEN, API_URL } from "@/static/const";
import axios from "axios";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams?.get("documentId");
  const url = `${API_URL}/issues/${query}`;

  try {
    const req = await axios.get(url, {
      headers: API_AUTH_TOKEN,
      params: {
        populate: ["screenshots", "tags"],
      },
    });

    return NextResponse.json(req.data.data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
