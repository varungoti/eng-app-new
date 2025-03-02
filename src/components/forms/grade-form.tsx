"use client";

import { useForm } from "@mantine/form";
import { gradeSchema, GradeFormValues } from "@/lib/validations/grade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface GradeFormProps {
  initialValues?: {
    name: string;
    description?: string;
  };
  onSubmit: (values: GradeFormValues) => Promise<void>;
  submitLabel?: string;
}

export function GradeForm({
  initialValues = { name: "", description: "" },
  onSubmit,
  submitLabel = "Save Grade",
}: GradeFormProps) {
  const form = useForm({
    initialValues,
    validate: {
      name: (value) => (value.length < 2 ? 'Grade name must be at least 2 characters' : null),
    },
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await onSubmit(values);
      toast.success("Grade saved successfully");
    } catch (error) {
      toast.error("Failed to save grade");
      throw error;
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Grade Name
        </label>
        <Input
          id="name"
          {...form.getInputProps('name')}
          placeholder="Enter grade name"
        />
        {form.errors.name && (
          <p id="name-error" className="text-sm text-red-500">{form.errors.name}</p>
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
          {...form.getInputProps('description')}
          placeholder="Enter grade description"
        />
        {form.errors.description && (
          <p id="description-error" className="text-sm text-red-500">{form.errors.description}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={form.submitting}
        className="w-full"
      >
        {form.submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
} 