"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { School } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationSearch from '../LocationSearch';
import GradeSelector from '../GradeSelector';
import { useSchools } from '@/hooks/useSchools';
import { LoadingSpinner } from '../LoadingSpinner';
import { useFormError } from '@/hooks/useFormError';
import { schoolSchema } from '@/lib/validations/school';
import { SuccessNotification } from '@/components/ui/success-notification';
import { toast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

// Define the form schema
const formSchema = z.object({
  name: z.string()
    .min(3, "School name must be at least 3 characters")
    .max(100, "School name cannot exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s\-'.]+$/, "School name can only contain letters, numbers, spaces, hyphens, and periods"),
  
  type: z.enum(["main", "branch"], {
    required_error: "Please select a school type"
  }),
  
  status: z.enum(["active", "inactive"]).default("active"),
  
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters"),
  
  latitude: z.number({
    required_error: "Please select a location on the map",
    invalid_type_error: "Latitude must be a number"
  })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  
  longitude: z.number({
    required_error: "Please select a location on the map",
    invalid_type_error: "Longitude must be a number"
  })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  
  contactNumber: z.string()
    .regex(
      /^\+?[1-9]\d{1,14}$/, 
      "Please enter a valid phone number in international format (e.g., +911234567890)"
    ),
  
  email: z.string()
    .email("Please enter a valid email address")
    .max(100, "Email cannot exceed 100 characters")
    .refine(email => email.toLowerCase() === email, "Email must be in lowercase"),
  
  capacity: z.object({
    total: z.number({
      required_error: "Total capacity is required",
      invalid_type_error: "Total capacity must be a number"
    })
      .min(1, "Total capacity must be at least 1")
      .max(10000, "Total capacity cannot exceed 10,000"),
    
    current: z.number({
      required_error: "Current students count is required",
      invalid_type_error: "Current students must be a number"
    })
      .min(0, "Current students cannot be negative")
  }).refine(data => data.current <= data.total, {
    message: "Current students cannot exceed total capacity",
    path: ["current"]
  }),
  
  grades: z.array(z.string().uuid("Invalid grade ID"))
    .min(1, "Please select at least one grade")
    .max(15, "Cannot select more than 15 grades"),
  
  curriculumType: z.array(z.string())
    .min(1, "Please select at least one curriculum type")
    .max(5, "Cannot select more than 5 curriculum types"),
  
  languagesOffered: z.array(z.string())
    .min(1, "Please select at least one language")
    .max(10, "Cannot select more than 10 languages"),
  
  principalName: z.string()
    .min(3, "Principal name must be at least 3 characters")
    .max(100, "Principal name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s.]+$/, "Principal name can only contain letters, spaces, and periods"),
  
  schoolLeadership: z.array(
    z.object({
      name: z.string()
        .min(3, "Leader name must be at least 3 characters")
        .max(100, "Leader name cannot exceed 100 characters")
        .regex(/^[a-zA-Z\s.]+$/, "Leader name can only contain letters, spaces, and periods"),
      
      role: z.enum(["owner", "director", "trustee", "board_member"], {
        required_error: "Please select a role"
      }),
      
      email: z.string()
        .email("Please enter a valid email address")
        .max(100, "Email cannot exceed 100 characters")
        .refine(email => email.toLowerCase() === email, "Email must be in lowercase"),
      
      phone: z.string()
        .regex(
          /^\+?[1-9]\d{1,14}$/, 
          "Please enter a valid phone number in international format (e.g., +911234567890)"
        ),
      
      designation: z.string()
        .min(2, "Designation must be at least 2 characters")
        .max(50, "Designation cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s\-]+$/, "Designation can only contain letters, spaces, and hyphens"),
      
      bio: z.string()
        .max(500, "Bio cannot exceed 500 characters")
        .optional()
    })
  )
    .min(1, "Please add at least one school leader")
    .max(10, "Cannot add more than 10 school leaders")
    .refine(
      leaders => {
        const emails = leaders.map(l => l.email);
        return new Set(emails).size === emails.length;
      },
      "Each school leader must have a unique email address"
    ),
  
  website: z.string()
    .url("Please enter a valid URL")
    .max(200, "Website URL cannot exceed 200 characters")
    .optional(),
  
  establishedYear: z.number()
    .min(1800, "Year must be 1800 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional(),
  
  accreditationStatus: z.string()
    .max(50, "Accreditation status cannot exceed 50 characters")
    .optional(),
  
  facilities: z.array(z.string())
    .min(1, "Please select at least one facility")
    .max(20, "Cannot select more than 20 facilities"),
  
  operatingHours: z.record(
    z.object({
      open: z.string()
        .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/, "Invalid time format. Use HH:MM AM/PM"),
      close: z.string()
        .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/, "Invalid time format. Use HH:MM AM/PM"),
      isHoliday: z.boolean().optional()
    })
  ).optional(),
  
  socialMedia: z.object({
    facebook: z.string()
      .url("Please enter a valid Facebook URL")
      .max(200, "URL cannot exceed 200 characters")
      .optional(),
    twitter: z.string()
      .url("Please enter a valid Twitter URL")
      .max(200, "URL cannot exceed 200 characters")
      .optional(),
    instagram: z.string()
      .url("Please enter a valid Instagram URL")
      .max(200, "URL cannot exceed 200 characters")
      .optional(),
    linkedin: z.string()
      .url("Please enter a valid LinkedIn URL")
      .max(200, "URL cannot exceed 200 characters")
      .optional()
  }).optional(),
  
  emergencyContact: z.string()
    .regex(
      /^\+?[1-9]\d{1,14}$/, 
      "Please enter a valid emergency contact number in international format"
    )
    .optional(),
  
  taxId: z.string()
    .max(50, "Tax ID cannot exceed 50 characters")
    .optional(),
  
  licenseNumber: z.string()
    .max(50, "License number cannot exceed 50 characters")
    .optional(),
  
  lastInspectionDate: z.string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/, 
      "Invalid date format. Use YYYY-MM-DD"
    )
    .refine(
      date => !isNaN(Date.parse(date)) && new Date(date) <= new Date(),
      "Inspection date cannot be in the future"
    )
    .optional(),
  
  studentCount: z.number()
    .min(0, "Student count cannot be negative")
    .max(10000, "Student count cannot exceed 10,000")
    .default(0),
  
  staffCount: z.number()
    .min(0, "Staff count cannot be negative")
    .max(1000, "Staff count cannot exceed 1,000")
    .default(0),
  
  classroomCount: z.number()
    .min(0, "Classroom count cannot be negative")
    .max(500, "Classroom count cannot exceed 500")
    .default(0),
  
  isBoarding: z.boolean().default(false),
  
  transportationProvided: z.boolean().default(false),
  
  parentId: z.string()
    .uuid("Invalid parent school ID")
    .optional()
    .refine(
      async (id) => {
        if (!id) return true;
        const { data } = await supabase
          .from('schools')
          .select('id')
          .eq('id', id)
          .single();
        return !!data;
      },
      "Parent school does not exist"
    )
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  {
    title: 'Basic Information',
    description: 'Enter the basic details of the school'
  },
  {
    title: 'Location & Contact',
    description: 'Set the school location and contact information'
  },
  {
    title: 'School Leadership',
    description: 'Add school leader and principal details'
  },
  {
    title: 'Academic Setup',
    description: 'Configure grades and academic information'
  },
  {
    title: 'Additional Details',
    description: 'Add facilities and other school features'
  }
];

interface Props {
  onSuccess?: (school: any) => void;
  onError?: (error: any) => void;
}

export function CreateSchoolForm({ onSuccess, onError }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const { addSchool } = useSchools();
  const { error, handleError, clearError } = useFormError();
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "main",
      status: "active",
      address: "",
      latitude: 0,
      longitude: 0,
      contactNumber: "",
      email: "",
      capacity: {
        total: 0,
        current: 0
      },
      grades: [],
      curriculumType: [],
      languagesOffered: [],
      principalName: "",
      schoolLeadership: [],
      studentCount: 0,
      staffCount: 0,
      classroomCount: 0,
      isBoarding: false,
      transportationProvided: false,
      facilities: [],
      operatingHours: {
        monday: { open: "8:00 AM", close: "3:00 PM" },
        tuesday: { open: "8:00 AM", close: "3:00 PM" },
        wednesday: { open: "8:00 AM", close: "3:00 PM" },
        thursday: { open: "8:00 AM", close: "3:00 PM" },
        friday: { open: "8:00 AM", close: "3:00 PM" },
        saturday: { open: "8:00 AM", close: "12:00 PM" },
        sunday: { open: "Closed", close: "Closed", isHoliday: true }
      }
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Transform form data to match database schema
      const schoolData = {
        name: data.name,
        type: data.type,
        parent_id: data.parentId,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        contact_number: data.contactNumber,
        email: data.email,
        status: data.status,
        capacity: data.capacity.total,
        principal_name: data.principalName,
        website: data.website,
        established_year: data.establishedYear,
        accreditation_status: data.accreditationStatus,
        facilities: data.facilities,
        operating_hours: data.operatingHours,
        social_media: data.socialMedia,
        emergency_contact: data.emergencyContact,
        tax_id: data.taxId,
        license_number: data.licenseNumber,
        last_inspection_date: data.lastInspectionDate,
        student_count: data.studentCount,
        staff_count: data.staffCount,
        classroom_count: data.classroomCount,
        is_boarding: data.isBoarding,
        transportation_provided: data.transportationProvided,
        curriculum_type: data.curriculumType,
        languages_offered: data.languagesOffered,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Create school
      const { data: newSchool, error: schoolError } = await supabase
        .from('schools')
        .insert([schoolData])
        .select()
        .single();

      if (schoolError) throw schoolError;

      // Create school-grade relationships
      if (data.grades.length > 0) {
        const { error: gradesError } = await supabase
          .from('school_grades')
          .insert(
            data.grades.map(gradeId => ({
              school_id: newSchool.id,
              grade_id: gradeId
            }))
          );

        if (gradesError) throw gradesError;
      }

      // Create school leaders
      if (data.schoolLeadership.length > 0) {
        const { error: leadersError } = await supabase
          .from('school_leaders')
          .insert(
            data.schoolLeadership.map(leader => ({
              school_id: newSchool.id,
              name: leader.name,
              role: leader.role,
              email: leader.email,
              phone: leader.phone,
              designation: leader.designation,
              bio: leader.bio
            }))
          );

        if (leadersError) throw leadersError;
      }

      onSuccess?.(newSchool);
      form.reset();
      
      toast({
        title: 'Success',
        description: 'School created successfully',
        variant: 'default'
      });

      // Redirect to onboarding after 2 seconds
      setTimeout(() => {
        router.push(`/schools/${newSchool.id}/onboarding`);
      }, 2000);
    } catch (error) {
      console.error('Error creating school:', error);
      onError?.(error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter school name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>School Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full p-2 border rounded"
                      value={value}
                      onChange={(e) => onChange(e.target.value as "main" | "branch")}
                    >
                      <option value="main">Main School</option>
                      <option value="branch">Branch School</option>
                    </select>
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
                    <Input {...field} placeholder="Enter principal's name" />
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
                  <FormLabel>School Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter school email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter contact number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter school address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="number"
                        step="any"
                        value={value}
                        onChange={e => onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="number"
                        step="any"
                        value={value}
                        onChange={e => onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-card border rounded-lg shadow-sm">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">School Leadership</h3>
                    <p className="text-sm text-muted-foreground">Add school owners and leaders</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const currentLeaders = form.getValues("schoolLeadership");
                      form.setValue("schoolLeadership", [
                        ...currentLeaders,
                        {
                          name: "",
                          role: "owner",
                          email: "",
                          phone: "",
                          designation: "",
                          bio: ""
                        }
                      ]);
                    }}
                  >
                    Add Leader
                  </Button>
                </div>

                {form.watch("schoolLeadership").map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">School Leader {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => {
                            const currentLeaders = form.getValues("schoolLeadership");
                            form.setValue(
                              "schoolLeadership",
                              currentLeaders.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`schoolLeadership.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter full name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`schoolLeadership.${index}.role`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full p-2 border rounded"
                              >
                                <option value="owner">Owner</option>
                                <option value="director">Director</option>
                                <option value="trustee">Trustee</option>
                                <option value="board_member">Board Member</option>
                              </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                        name={`schoolLeadership.${index}.email`}
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

                      <FormField
                        control={form.control}
                        name={`schoolLeadership.${index}.phone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                        name={`schoolLeadership.${index}.designation`}
                render={({ field }) => (
                  <FormItem>
                            <FormLabel>Designation</FormLabel>
                    <FormControl>
                              <Input {...field} placeholder="Enter designation" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                        name={`schoolLeadership.${index}.bio`}
                render={({ field }) => (
                  <FormItem>
                            <FormLabel>Bio</FormLabel>
                    <FormControl>
                              <Input {...field} placeholder="Enter brief bio (optional)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
              <FormField
                control={form.control}
                name="grades"
              render={({ field: { value, onChange } }) => (
                  <FormItem>
                  <FormLabel>Grades</FormLabel>
                    <FormControl>
                      <GradeSelector
                      selectedGrades={value}
                      onChange={(newGrades) => {
                        onChange(newGrades);
                        form.clearErrors('grades');
                      }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity.total"
                render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Total Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                        min="0"
                        value={value}
                        onChange={e => onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity.current"
                render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Current Students</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                        min="0"
                        value={value}
                        onChange={e => onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

              <FormField
                control={form.control}
                name="curriculumType"
              render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Curriculum Types</FormLabel>
                    <FormControl>
                    <select
                      multiple
                      className="w-full p-2 border rounded"
                      onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions, option => option.value);
                        onChange(options);
                      }}
                      value={value}
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State">State Board</option>
                      <option value="IB">IB</option>
                      <option value="Cambridge">Cambridge</option>
                    </select>
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languagesOffered"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Languages Offered</FormLabel>
                  <FormControl>
                    <select
                      multiple
                      className="w-full p-2 border rounded"
                      onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions, option => option.value);
                        onChange(options);
                      }}
                      value={value}
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="sanskrit">Sanskrit</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="spanish">Spanish</option>
                    </select>
                  </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-900">Facilities</h3>
              <FormField
                control={form.control}
                name="facilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Facilities</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => field.onChange([...field.value, value])}
                        value=""
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add facility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="library">Library</SelectItem>
                          <SelectItem value="laboratory">Science Lab</SelectItem>
                          <SelectItem value="computer_lab">Computer Lab</SelectItem>
                          <SelectItem value="playground">Playground</SelectItem>
                          <SelectItem value="cafeteria">Cafeteria</SelectItem>
                          <SelectItem value="auditorium">Auditorium</SelectItem>
                          <SelectItem value="sports_complex">Sports Complex</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((facility) => (
                        <div
                          key={facility}
                          className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          {facility}
                          <button
                            type="button"
                            onClick={() => field.onChange(field.value.filter(f => f !== facility))}
                            className="hover:text-primary/80"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <SuccessNotification
            title="School Created Successfully"
            message="Redirecting to onboarding process..."
          />
        )}

        <div className="flex items-center space-x-4 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex-1 ${
                index <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg border">
          <div className="p-6">
        {renderStep()}
          </div>

          <div className="flex items-center justify-between p-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
            >
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
                disabled={addSchool.isPending}
              className="relative"
            >
                {addSchool.isPending && (
                  <div className="absolute left-2">
                    <LoadingSpinner />
                  </div>
              )}
              Create School
            </Button>
          )}
          </div>
        </div>
      </form>
    </Form>
  );
} 