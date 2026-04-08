"use client";

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
