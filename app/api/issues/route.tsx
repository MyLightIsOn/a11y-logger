import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { API_AUTH_TOKEN, API_URL } from "@/static/const";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import systemMessage from "@/lib/systemMessage";

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

export async function POST(request) {
  const { userInput } = await request.json(); // Parse input from the client

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const AccessibilityIssueResponse = z.object({
    issueTitle: z.string(),
    originalDescription: z.string(),
    updatedDescription: z.string(),
    comments: z.string(),
    url: z.string(),
    whyItsImportant: z.string(),
    howToFix: z.string(),
    wcagSpecs: z.string(),
    description: z.string(),
    impact: z.enum(["Critical", "Major", "Minor", "Enhancement"]),
  });

  try {
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        { role: "user", content: userInput },
      ],
      response_format: zodResponseFormat(
        AccessibilityIssueResponse,
        "accessibility_issue_response",
      ),
    });

    // Return the response to the client
    return NextResponse.json({
      success: true,
      data: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
