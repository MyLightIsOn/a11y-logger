"use client";

import template from "@/lib/template.json";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ComboBox } from "@/components/custom/combo-box";

const FormField = ({ field }: any) => {
  //console.log(field);

  if (field.fieldType === "text") {
    return (
      <>
        <Label htmlFor={field.fieldName}>{field.fieldName}</Label>
        <Input
          id={field.fieldName}
          name={field.fieldName}
          type={field.fieldType}
        />
      </>
    );
  }

  if (field.fieldType === "option") {
    return (
      <>
        <Label htmlFor={field.fieldName}>{field.fieldName}</Label>
        <ComboBox />
      </>
    );
  }

  return <p>Not Text</p>;
};

function Page() {
  const data = template.data;
  //console.log(data);

  return (
    <form>
      {data.map((field) => {
        return <FormField key={field.fieldName} field={field} />;
      })}
    </form>
  );
}

export default Page;
