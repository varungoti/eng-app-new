"use client";

import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar, Globe, Award, FileText, Building, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface BasicInfoStepProps {
  schoolId: string;
  onComplete: () => void;
}

export function BasicInfoStep({ schoolId, onComplete }: BasicInfoStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    website: "",
    establishedYear: new Date().getFullYear(),
    accreditationStatus: "",
    taxId: "",
    licenseNumber: ""
  });

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate form data
      if (!formData.accreditationStatus || !formData.taxId || !formData.licenseNumber) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Update school with basic information
      const { error: updateError } = await supabase
        .from('schools')
        .update({
          website: formData.website,
          established_year: formData.establishedYear,
          accreditation_status: formData.accreditationStatus,
          tax_id: formData.taxId,
          license_number: formData.licenseNumber
        })
        .eq('id', schoolId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Basic information saved successfully",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Basic Information
        </h2>
        <p className="text-muted-foreground">
          Let's start with your school's essential details
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Website */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2 text-primary">
                <Globe className="h-4 w-4" />
                School Website
              </FormLabel>
              <div className="relative">
                <Input
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://www.school.com"
                  className="pl-8 transition-all hover:border-primary focus:border-primary"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  🌐
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Optional: Enter your school's website URL</p>
            </div>

            {/* Established Year */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2 text-primary">
                <Calendar className="h-4 w-4" />
                Established Year
              </FormLabel>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => handleChange('establishedYear', parseInt(e.target.value))}
                  min={1800}
                  max={new Date().getFullYear()}
                  className="pl-8 transition-all hover:border-primary focus:border-primary"
                />
                <Building className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Year when the school was established</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="space-y-6">
            {/* Accreditation Status */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2 text-secondary">
                <Award className="h-4 w-4" />
                Accreditation Status
              </FormLabel>
              <div className="relative">
                <Input
                  value={formData.accreditationStatus}
                  onChange={(e) => handleChange('accreditationStatus', e.target.value)}
                  placeholder="e.g., Fully Accredited"
                  className="pl-8 transition-all hover:border-secondary focus:border-secondary"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  🏆
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Current accreditation status of your school</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Tax ID */}
              <div className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-secondary">
                  <FileText className="h-4 w-4" />
                  Tax ID
                </FormLabel>
                <div className="relative">
                  <Input
                    value={formData.taxId}
                    onChange={(e) => handleChange('taxId', e.target.value)}
                    placeholder="Tax ID Number"
                    className="pl-8 transition-all hover:border-secondary focus:border-secondary"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    📋
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">School's tax identification number</p>
              </div>

              {/* License Number */}
              <div className="space-y-2">
                <FormLabel className="flex items-center gap-2 text-secondary">
                  <ScrollText className="h-4 w-4" />
                  License Number
                </FormLabel>
                <div className="relative">
                  <Input
                    value={formData.licenseNumber}
                    onChange={(e) => handleChange('licenseNumber', e.target.value)}
                    placeholder="School License Number"
                    className="pl-8 transition-all hover:border-secondary focus:border-secondary"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    📜
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Official school license number</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Complete Basic Setup'
          )}
        </Button>
      </div>
    </div>
  );
} 