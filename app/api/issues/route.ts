import { NextResponse, NextRequest } from "next/server";
import { API_AUTH_TOKEN, API_URL } from "@/static/const";
import axios from "axios";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams?.get("issue_id");
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

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    const res = await fetch(`${API_URL}/issues`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: API_AUTH_TOKEN.Authorization,
      },
    });

    const responseData = await res.json();
    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
