import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import systemMessage from "@/utils/systemMessage";

export const gptTest = async () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const AccessibilityIssueResponse = z.object({
    description: z.string().nonempty("Description is required."),
    impact: z.enum(["High", "Medium", "Low"]),
    location: z.string().nonempty("Location is required."),
    guidelineReference: z.string().optional(),
  });

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      { role: "user", content: "..." },
    ],
    response_format: zodResponseFormat(
      AccessibilityIssueResponse,
      "accessibility_issue_response",
    ),
  });

  const issue = completion.choices[0].message.parsed;
  return issue;
};
