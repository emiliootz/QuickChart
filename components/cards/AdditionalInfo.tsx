"use client";

// AdditionalInfo — text area at the bottom of the form.
// Lets the ems crew include anything not captured by the fields
// (e.g. family present at bedside, scene details).
// The content is appended verbatim to the AI prompt in the narrative builder.

import { UseFormRegister } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/ui/FormPrimitives";

interface Props {
  register: UseFormRegister<StructuredFormData>;
}

export default function AdditionalInfo({ register }: Props) {
  return (
    <Card title="Additional Information">
      <Field label="Anything else to include?">
        <textarea
          {...register("additionalInfo")}
          rows={4}
          className={inputCls}
        />
      </Field>
    </Card>
  );
}
