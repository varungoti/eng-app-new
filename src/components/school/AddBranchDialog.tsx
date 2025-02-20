"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { School } from "@/types";
import { schoolSchema } from "@/lib/validations/school";
import LocationSearch from "../LocationSearch";
import GradeSelector from "../GradeSelector";
import { useError } from "@/hooks/useError";
import { useToast } from "@/hooks/useToast";

interface AddBranchDialogProps {
  parentSchool: School;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function AddBranchDialog({ parentSchool, open, onClose, onSubmit }: AddBranchDialogProps) {
  const { setError } = useError();
  const { showToast } = useToast();
  const [selectedGrades, setSelectedGrades] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: '',
      type: 'branch' as const,
      parentId: parentSchool.id,
      address: '',
      latitude: 0,
      longitude: 0,
      contactNumber: '',
      email: '',
      status: 'active' as const,
      capacity: {
        total: 0,
        current: 0
      },
      principalName: '',
      schoolType: parentSchool.schoolType,
      schoolLevel: parentSchool.schoolLevel,
      schoolLeader: '',
      schoolLeaderTitle: 'Principal',
      schoolLeaderEmail: '',
      schoolLeaderPhone: '',
      operatingHours: {
        monday: { open: '8:00 AM', close: '3:00 PM' },
        tuesday: { open: '8:00 AM', close: '3:00 PM' },
        wednesday: { open: '8:00 AM', close: '3:00 PM' },
        thursday: { open: '8:00 AM', close: '3:00 PM' },
        friday: { open: '8:00 AM', close: '3:00 PM' },
        saturday: { open: '8:00 AM', close: '12:00 PM' },
        sunday: { open: 'Closed', close: 'Closed', isHoliday: true }
      },
      facilities: ['classroom', 'library'],
      curriculumType: ['standard'],
      languagesOffered: ['english'],
      transportationProvided: false,
      extracurricularActivities: [],
      classes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      studentCount: 0,
      staffCount: 0,
      classroomCount: 0,
      isBoarding: false
    }
  });

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      data.grades = selectedGrades;
      await onSubmit(data);
      showToast('Branch added successfully', { type: 'success' });
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add branch');
      showToast('Failed to add branch', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Branch for {parentSchool.name}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter branch name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="principalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter principal name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <Label>Location</Label>
              <LocationSearch
                onLocationSelect={({ lat, lng, address }) => {
                  form.setValue('latitude', lat);
                  form.setValue('longitude', lng);
                  form.setValue('address', address);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="Enter contact number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Enter email address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity.total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Capacity</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Label>Grades Offered</Label>
              <GradeSelector
                selectedGrades={selectedGrades}
                onChange={setSelectedGrades}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding Branch...' : 'Add Branch'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 