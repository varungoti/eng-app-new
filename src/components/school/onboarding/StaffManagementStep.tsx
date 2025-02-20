"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, GraduationCap, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const staffRoles = [
  { value: 'principal', label: 'Principal', icon: '👨‍💼' },
  { value: 'vice_principal', label: 'Vice Principal', icon: '👩‍💼' },
  { value: 'head_teacher', label: 'Head Teacher', icon: '👨‍🏫' },
  { value: 'teacher', label: 'Teacher', icon: '👩‍🏫' },
  { value: 'counselor', label: 'Counselor', icon: '🧑‍⚕️' },
  { value: 'librarian', label: 'Librarian', icon: '📚' },
  { value: 'admin_staff', label: 'Administrative Staff', icon: '👨‍💻' }
];

const departments = [
  { value: 'administration', label: 'Administration', icon: '🏢' },
  { value: 'academics', label: 'Academics', icon: '📚' },
  { value: 'science', label: 'Science', icon: '🔬' },
  { value: 'mathematics', label: 'Mathematics', icon: '📐' },
  { value: 'languages', label: 'Languages', icon: '🗣️' },
  { value: 'arts', label: 'Arts', icon: '🎨' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'support_services', label: 'Support Services', icon: '🤝' }
];

interface SelectableOption {
  value: string;
  label: string;
  icon: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
}

function MultiSelectBadges({
  options,
  selected,
  onSelect,
  onRemove,
  placeholder
}: {
  options: SelectableOption[];
  selected: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value) => {
          if (!selected.includes(value)) {
            onSelect(value);
          }
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map(option => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={selected.includes(option.value)}
            >
              <span className="flex items-center gap-2">
                <span>{option.icon}</span>
                {option.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        {selected.map((value) => {
          const option = options.find(opt => opt.value === value);
          return (
            <Badge
              key={value}
              variant="secondary"
              className="py-2 px-3 flex items-center gap-2"
            >
              <span>{option?.icon}</span>
              {option?.label}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onRemove(value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

interface StaffManagementStepProps {
  schoolId: string;
  onComplete: () => void;
}

export function StaffManagementStep({ schoolId, onComplete }: StaffManagementStepProps) {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleAddStaff = (data: StaffMember) => {
    setStaffMembers([...staffMembers, { ...data, id: crypto.randomUUID() }]);
    setIsAddingStaff(false);
  };

  const handleRemoveStaff = (id: string) => {
    setStaffMembers(staffMembers.filter(staff => staff.id !== id));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Save staff members to the database
      const { error } = await supabase
        .from('staff')
        .insert(
          staffMembers.map(staff => ({
            ...staff,
            school_id: schoolId,
            status: 'active'
          }))
        );

      if (error) throw error;

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Staff Management</h3>
              <p className="text-sm text-gray-500">Add and manage school staff members</p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>

          <div className="space-y-4">
            {staffMembers.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{staff.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Badge variant="outline">{staff.role}</Badge>
                    <span>•</span>
                    <span>{staff.department}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {staff.email} • {staff.phone}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveStaff(staff.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {isAddingStaff ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddStaff({
                    id: '',
                    name: formData.get('name') as string,
                    role: formData.get('role') as string,
                    department: formData.get('department') as string,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string,
                  });
                }}
                className="space-y-4 p-4 border rounded-lg"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Name</FormLabel>
                    <Input name="name" required placeholder="Staff member name" />
                  </div>
                  <div>
                    <FormLabel>Role</FormLabel>
                    <Select name="role" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffRoles.map(role => (
                          <SelectItem key={role.value} value={role.value}>
                            <span className="flex items-center gap-2">
                              <span>{role.icon}</span>
                              {role.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <FormLabel>Department</FormLabel>
                    <Select name="department" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.value} value={dept.value}>
                            <span className="flex items-center gap-2">
                              <span>{dept.icon}</span>
                              {dept.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      name="phone"
                      type="tel"
                      required
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingStaff(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Staff Member</Button>
                </div>
              </form>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsAddingStaff(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            )}
          </div>
        </div>
      </Card>

      <FormField
        control={form.control}
        name="staffMembers"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <input
                type="hidden"
                {...field}
                value={JSON.stringify(staffMembers)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || staffMembers.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Complete Staff Setup'
          )}
        </Button>
      </div>
    </div>
  );
} 