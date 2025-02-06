"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSchools } from '@/hooks/useSchools';
import { Card } from "@/components/ui/card";
import { AcademicStep } from "./onboarding/AcademicStep";
import { StaffManagementStep } from "./onboarding/StaffManagementStep";
import DocumentUploadStep from "./onboarding/DocumentUploadStep";

const steps = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Complete school profile',
    schema: z.object({
      website: z.string().url().optional(),
      establishedYear: z.number().min(1800).max(new Date().getFullYear()),
      accreditationStatus: z.string(),
      taxId: z.string(),
      licenseNumber: z.string()
    })
  },
  {
    id: 'operations',
    title: 'Operations',
    description: 'Set up operational details',
    schema: z.object({
      operatingHours: z.object({
        monday: z.object({
          open: z.string(),
          close: z.string(),
          isHoliday: z.boolean()
        }),
        // ... repeat for other days
      }),
      emergencyContact: z.string(),
      transportationProvided: z.boolean()
    })
  },
  {
    id: 'facilities',
    title: 'Facilities',
    description: 'Configure facilities and resources',
    schema: z.object({
      classroomCount: z.number().min(1),
      facilities: z.array(z.string()).min(1),
      isBoarding: z.boolean()
    })
  },
  {
    id: 'academic',
    title: 'Academic Setup',
    description: 'Set up academic structure',
    schema: z.object({
      curriculumType: z.array(z.string()).min(1),
      languagesOffered: z.array(z.string()).min(1),
      extracurricularActivities: z.array(z.string())
    })
  },
  {
    id: 'documents',
    title: 'Document Upload',
    description: 'Upload required school documents and certificates',
  },
  {
    id: 'staff',
    title: 'Staff Management',
    description: 'Add key staff members',
    schema: z.object({
      staffCount: z.number().min(1),
      departments: z.array(z.object({
        name: z.string(),
        head: z.string(),
        staffCount: z.number()
      }))
    })
  }
];

interface OnboardingStepsProps {
  schoolId: string;
  onComplete: () => void;
}

const STEPS = [
  {
    id: "academic",
    title: "Academic Setup",
    description: "Configure grades, sections, and academic settings",
    icon: "📚"
  },
  {
    id: "documents",
    title: "Document Upload",
    description: "Upload required school documents and certificates",
    icon: "📄"
  },
  {
    id: "staff",
    title: "Staff Management",
    description: "Add school staff and assign roles",
    icon: "👥"
  }
];

export default function OnboardingSteps({ schoolId, onComplete }: OnboardingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepComplete = () => {
    if (currentStep === STEPS.length - 1) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case "academic":
        return <AcademicStep schoolId={schoolId} onComplete={handleStepComplete} />;
      case "documents":
        return <DocumentUploadStep schoolId={schoolId} onComplete={handleStepComplete} />;
      case "staff":
        return <StaffManagementStep schoolId={schoolId} onComplete={handleStepComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">School Onboarding</h1>
        <p className="text-muted-foreground">
          Complete the following steps to set up your school
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {STEPS.map((step, index) => (
          <Card
            key={step.id}
            className={`p-4 ${
              index === currentStep
                ? "border-primary"
                : index < currentStep
                ? "border-green-500 bg-green-50/50"
                : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : index < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-muted"
                }`}
              >
                {index < currentStep ? "✓" : step.icon}
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-card rounded-lg border p-6">
        {renderStep()}
      </div>
    </div>
  );
} 