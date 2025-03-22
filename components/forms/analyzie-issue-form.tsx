"use client";
import React, { useEffect } from "react";
import { SubmitButton } from "@/components/custom/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { StrapiErrors } from "@/components/custom/strapi-errors";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { analyzeIssueAction } from "@/data/actions/analyze-issue-action";
import { useActionState } from "react";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import qs from "qs";
import { addIssueAction } from "@/data/actions/issue-actions";
import { toast } from "sonner";

const INITIAL_STATE = {
  assessment_id: null,
  data: null,
  strapiErrors: null,
  message: null,
};

const test = {
  success: true,
  data: '{"title":"Insufficient Color Contrast in Footer Text","severity":"severity2","original_description":"Footer Text does not meet color contrast minimum.","updated_description":"The text in the footer does not have enough contrast with the background, making it difficult for users to read.","url":"","impact":"Insufficient color contrast makes it difficult for users with visual impairments, such as color blindness or low vision, to read the footer text. This can hinder their ability to access important information or links in that section, potentially causing them to miss out on crucial content.","suggested_fix":"Adjust the color of the footer text or the background to ensure that the contrast ratio meets the minimum requirement of 4.5:1 for normal text or 3:1 for large text. Use tools like WebAIM\'s contrast checker to verify compliance.","criteria_reference":"[\'WCAG 1.4.3\']"}',
  assessment_id: "xujh4oeucmebzurdf6sx5miv",
};

export function AnalyzieIssueForm({
  className,
}: {
  readonly className?: string;
}) {
  const pathname = usePathname();
  const editIssuePath = pathname.replace("/add-issue", "");
  const assessment_id = editIssuePath.replace("/assessments/", "");

  const [formState, setFormState] = useActionState(
    analyzeIssueAction,
    INITIAL_STATE,
  );

  const router = useRouter();

  useEffect(() => {
    if (formState?.data?.success) {
      formState.data.assessment_id = assessment_id;
      const query = qs.stringify(formState.data);
      addIssueAction(test).then((res) => {
        if (res.error) {
          return toast.error(res.error);
        }

        if (res.success) {
          router.push(`${editIssuePath}/edit-issue?${query}`);
        }
      });
    }
  }, [formState]);

  return (
    <form
      className={cn(
        "space-y-4 w-[80%] max-w-[1440px] mx-auto mt-14",
        className,
      )}
      action={setFormState}
    >
      <Card className={"bg-gray-100/40 dark:bg-gray-800/30"}>
        <CardHeader>
          <CardTitle>Issue Description Guide</CardTitle>
          <CardDescription>
            For best results, describe the issue using this approach:
          </CardDescription>
        </CardHeader>
        <CardContent className={"text-sm"}>
          <ul className={"mb-5"}>
            <li>
              <span className={"font-bold"}>Component</span> – What element is
              affected? (e.g., “Search button”)
            </li>
            <li>
              <span className={"font-bold"}>Location</span> – Where does the
              issue occur? (e.g., “Homepage”)
            </li>
            <li>
              <span className={"font-bold"}>What’s Happening?</span> – What is
              wrong? (e.g., “Not focusable via keyboard”)
            </li>
            <li>
              <span className={"font-bold"}>Expected Behavoir (Optional)</span>{" "}
              – What is the expected behavoir?
            </li>
          </ul>
          <p>
            Example: &#34;The search button on the homepage is not operable via
            keyboard. It should be focusable and activated using the Enter
            key.&#34;
          </p>
        </CardContent>
        <CardFooter>
          <CardDescription className={"text-sm italic"}>
            No need to mention severity or compliance. The AI will determine
            that automatically. You can edit this infomration before saving.
          </CardDescription>
        </CardFooter>
      </Card>

      <Textarea
        id="description"
        name="description"
        placeholder="Write issue description here..."
        className="resize-none border rounded-md w-full h-[224px] p-2"
        defaultValue={""}
        required
      />
      <div className="flex justify-end">
        <SubmitButton text="Analyze Issue" loadingText="Analyzing Issue" />
      </div>
      <StrapiErrors error={formState?.strapiErrors} />
    </form>
  );
}
