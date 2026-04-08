"use client";

import { UseFormRegister } from "react-hook-form";
import { StructuredFormData } from "@/lib/types";
import { Card, Field, inputCls } from "@/components/forms/formHelpers";

interface Props {
  register: UseFormRegister<StructuredFormData>;
}

export default function AdditionalInfo({ register }: Props) {
  return (
    <Card title="Additional Information">
      <Field label="Anything else to include">
        <textarea
          {...register("additionalInfo")}
          rows={4}
          placeholder="Vital signs, medications, oxygen use, IV access, patient complaints en route, receiving nurse name, etc."
          className={inputCls}
        />
      </Field>
    </Card>
  );
}
