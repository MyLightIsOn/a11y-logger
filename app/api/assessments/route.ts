import { NextResponse } from "next/server";
import axios from "axios";
import { API_AUTH_TOKEN, API_URL } from "@/static/const";

export async function GET() {
  try {
    const req = await axios.get(API_URL + "/assessments", {
      headers: API_AUTH_TOKEN,
    });

    return NextResponse.json(req.data.data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
