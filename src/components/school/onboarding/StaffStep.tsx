"use client";

import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Users, Plus, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Department {
  name: string;
  head: string;
  staffCount: number;
}

export function StaffStep({ form }: { form: any }) {
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [newDepartment, setNewDepartment] = useState<Department>({
    name: '',
    head: '',
    staffCount: 0
  });

  const addDepartment = () => {
    const currentDepartments = form.getValues('departments') || [];
    form.setValue('departments', [...currentDepartments, newDepartment]);
    setNewDepartment({ name: '', head: '', staffCount: 0 });
    setIsAddingDepartment(false);
  };

  const removeDepartment = (index: number) => {
    const currentDepartments = form.getValues('departments') || [];
    form.setValue('departments', currentDepartments.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Staff Overview</h3>
              <p className="text-sm text-gray-500">Manage your school's staff information</p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>

          <FormField
            control={form.control}
            name="staffCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Staff Members</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    min="1"
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Departments</h3>
              <p className="text-sm text-gray-500">Manage school departments and their heads</p>
            </div>
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>

          <div className="space-y-4">
            <Dialog open={isAddingDepartment} onOpenChange={setIsAddingDepartment}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <FormLabel>Department Name</FormLabel>
                    <Input
                      value={newDepartment.name}
                      onChange={e => setNewDepartment({ ...newDepartment, name: e.target.value })}
                      placeholder="e.g., Science Department"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Department Head</FormLabel>
                    <Input
                      value={newDepartment.head}
                      onChange={e => setNewDepartment({ ...newDepartment, head: e.target.value })}
                      placeholder="Head of Department"
                    />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Staff Count</FormLabel>
                    <Input
                      type="number"
                      min="1"
                      value={newDepartment.staffCount}
                      onChange={e => setNewDepartment({ 
                        ...newDepartment, 
                        staffCount: parseInt(e.target.value) 
                      })}
                      placeholder="Number of staff"
                    />
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={addDepartment}
                    disabled={!newDepartment.name || !newDepartment.head || !newDepartment.staffCount}
                  >
                    Add Department
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <FormField
              control={form.control}
              name="departments"
              render={({ field }) => (
                <FormItem>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead>Head</TableHead>
                        <TableHead>Staff Count</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {field.value?.map((dept: Department, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{dept.name}</TableCell>
                          <TableCell>{dept.head}</TableCell>
                          <TableCell>{dept.staffCount}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDepartment(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </Card>
    </div>
  );
} 