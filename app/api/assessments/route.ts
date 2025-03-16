import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { API_AUTH_TOKEN, API_URL } from "@/static/const";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { getAuthToken } from "@/data/services/get-token";

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

export async function POST(request: NextRequest) {
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No auth token found");

  const api_url = `${API_URL}/assessments`;

  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  const data = await request.json();
  try {
    const res = await axios.post(api_url, data, config);
    return NextResponse.json(res.data.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      // Type assertion
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function PUT(request: NextRequest) {
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No auth token found");
  const data = await request.json();

  const api_url = `${API_URL}/assessments/${data.data.documentId}`;
  const dataWithoutId = {
    data: {
      title: data.data.title,
      description: data.data.description,
      platform: data.data.platform,
      standard: data.data.standard,
    },
  };

  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const res = await axios.put(api_url, dataWithoutId, config);
    return NextResponse.json(res.data.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Type assertion
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
