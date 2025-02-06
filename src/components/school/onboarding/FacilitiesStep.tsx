"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Building, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FacilitiesStep({ form }: { form: any }) {
  const facilityTypes = [
    { id: 'library', label: 'Library', icon: '📚' },
    { id: 'laboratory', label: 'Science Lab', icon: '🧪' },
    { id: 'computer_lab', label: 'Computer Lab', icon: '💻' },
    { id: 'playground', label: 'Playground', icon: '⚽' },
    { id: 'cafeteria', label: 'Cafeteria', icon: '🍽️' },
    { id: 'auditorium', label: 'Auditorium', icon: '🎭' },
    { id: 'sports_complex', label: 'Sports Complex', icon: '🏃' },
    { id: 'medical_room', label: 'Medical Room', icon: '🏥' },
    { id: 'music_room', label: 'Music Room', icon: '🎵' },
    { id: 'art_studio', label: 'Art Studio', icon: '🎨' }
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="classroomCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Classrooms</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field} 
                    type="number" 
                    min="1"
                    placeholder="Enter number of classrooms"
                    className="pl-10"
                  />
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxCapacityPerClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Students per Classroom</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field} 
                    type="number" 
                    min="1"
                    placeholder="Enter max capacity"
                    className="pl-10"
                  />
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormLabel>Available Facilities</FormLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {facilityTypes.map((facility) => (
            <FormField
              key={facility.id}
              control={form.control}
              name="facilities"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${field.value?.includes(facility.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => {
                        const current = field.value || [];
                        field.onChange(
                          current.includes(facility.id)
                            ? current.filter(id => id !== facility.id)
                            : [...current, facility.id]
                        );
                      }}
                    >
                      <div className="text-center space-y-2">
                        <span className="text-2xl">{facility.icon}</span>
                        <p className="text-sm font-medium">{facility.label}</p>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="isBoarding"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel>Boarding Facility</FormLabel>
                  <p className="text-sm text-gray-500">Does the school provide boarding facilities?</p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('isBoarding') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="boardingCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boarding Capacity</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min="1"
                      placeholder="Enter boarding capacity"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Facilities</h4>
        <div className="flex flex-wrap gap-2">
          {form.watch('facilities')?.map((facilityId: string) => {
            const facility = facilityTypes.find(f => f.id === facilityId);
            return (
              <Badge key={facilityId} variant="secondary">
                {facility?.icon} {facility?.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </Card>
  );
} 