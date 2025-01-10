"use client";

import { useForm } from "@/hooks/use-form";
import { gradeSchema } from "@/lib/validations/lesson";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface GradeFormProps {
  initialValues?: {
    name: string;
    description?: string;
  };
  onSubmit: (values: { name: string; description?: string }) => Promise<void>;
  submitLabel?: string;
}

export function GradeForm({
  initialValues = { name: "", description: "" },
  onSubmit,
  submitLabel = "Save Grade",
}: GradeFormProps) {
  const {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    validateField,
    handleSubmit,
  } = useForm({
    schema: gradeSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        toast.success("Grade saved successfully");
      } catch (error) {
        toast.error("Failed to save grade");
        throw error;
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Grade Name
        </label>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => setFieldValue("name", e.target.value)}
          onBlur={() => validateField("name", values.name)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder="Enter grade name"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Description (Optional)
        </label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => setFieldValue("description", e.target.value)}
          onBlur={() => validateField("description", values.description)}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
          placeholder="Enter grade description"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p id="description-error" className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
} 