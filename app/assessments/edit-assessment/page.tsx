"use client";

import template from "@/lib/template.json";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ComboBox } from "@/components/custom/combo-box";

const FormField = ({ field }: any) => {
  //console.log(field);

  if (field.fieldType === "text") {
    return (
      <div>
        <Label htmlFor={field.fieldName}>{field.fieldName}</Label>
        <Input
          id={field.fieldName}
          name={field.fieldName}
          type={field.fieldType}
        />
      </div>
    );
  }

  if (field.fieldType === "option") {
    return (
      <div>
        <Label htmlFor={field.fieldName}>{field.fieldName}</Label>
        <div className={"w-full"}>
          <ComboBox />
        </div>
      </div>
    );
  }

  return <p>Not Text</p>;
};

function Page() {
  const data = template.data;
  //console.log(data);

  return (
    <form id={"a11y-bug-form"} className={"w-full max-w-[75%] my-14 mx-auto"}>
      {data.map((field) => {
        return <FormField key={field.fieldName} field={field} />;
      })}
    </form>
  );
}

export default Page;
