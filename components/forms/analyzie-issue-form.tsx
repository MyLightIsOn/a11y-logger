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

const INITIAL_STATE = {
  assessment_id: null,
  data: null,
  strapiErrors: null,
  message: null,
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
      router.push(`${editIssuePath}/edit-issue?${query}`);
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
