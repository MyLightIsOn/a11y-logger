"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { useActionState } from "react";

import { SubmitButton } from "@/components/custom/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { addIssueAction } from "@/data/actions/issue-actions";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import qs from "qs";

const INITIAL_STATE = {
  data: null,
  strapiErrors: null,
  message: null,
};

interface AddIssueFormProps {
  id: string;
  description: string;
}

export function EditIssueForm({
  data,
  className,
}: {
  readonly data: AddIssueFormProps;
  readonly className?: string;
}) {
  const searchParams = useSearchParams();

  // Get a specific query parameter
  const query = JSON.parse(searchParams.get("data"));

  console.log(query);

  return <form className={cn("space-y-4", className)}>Edit Issues</form>;
}
