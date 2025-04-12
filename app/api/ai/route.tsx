import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import systemMessage from "@/lib/systemMessage";

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
    impact: z.enum(["severity1", "severity2", "severity3", "severity4"]),
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
