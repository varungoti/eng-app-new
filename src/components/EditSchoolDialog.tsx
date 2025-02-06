"use client";

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import LocationSearch from './LocationSearch';
import GradeSelector from './GradeSelector';
import AutoSaveInput from './AutoSaveInput';
import { useSchools } from '../hooks/useSchools';
import type { School } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface EditSchoolDialogProps {
  school: School;
  selectedGrades: string[];
  onGradesChange: (grades: string[]) => void;
  onSave: (school: School) => void;
  onCancel: () => void;
  open: boolean;
}

const EditSchoolDialog: React.FC<EditSchoolDialogProps> = ({
  school,
  selectedGrades,
  onGradesChange,
  onSave,
  onCancel,
  open
}) => {
  const [location, setLocation] = useState({
    lat: school.latitude,
    lng: school.longitude,
    address: school.address
  });
  const { updateSchool } = useSchools();

  const handleLocationSelect = (newLocation: { lat: number; lng: number; address: string }) => {
    console.log('Location selected:', newLocation);
    setLocation(newLocation);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedSchool = {
      ...school,
      name: formData.get('name') as string,
      address: location.address,
      latitude: location.lat,
      longitude: location.lng,
      contactNumber: formData.get('contactNumber') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as 'active' | 'inactive',
      capacity: parseInt(formData.get('capacity') as string),
      principalName: formData.get('principalName') as string,
      grades: selectedGrades,
    };

    console.log('Submitting school with location:', location);
    onSave(updatedSchool);
  };

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit School</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <form id="editSchoolForm" onSubmit={handleSubmit} className="space-y-6 p-6">
            <AutoSaveInput
              type="text"
              name="name"
              defaultValue={school.name}
              onSave={async (value) => {
                await updateSchool.mutateAsync({ ...school, name: value, id: school.id });
              }}
              required
              label="School Name"
            />

            {/* Location Search */}
            <div className="space-y-2">
              <LocationSearch
                defaultValue={school.address}
                onLocationSelect={handleLocationSelect}
                className="w-full"
              />
              {location && (
                <div className="text-sm text-gray-500">
                  Selected location: {location.address}
                </div>
              )}
            </div>

            <GradeSelector
              selectedGrades={selectedGrades}
              onChange={onGradesChange}
            />

            <div>
              <AutoSaveInput
                type="text"
                name="principalName"
                defaultValue={school.principalName}
                onSave={async (value) => {
                  await updateSchool(school.id, { ...school, principalName: value });
                }}
                required
                label="Principal Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                defaultValue={school.contactNumber}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={school.email}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                defaultValue={school.status}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student Capacity
              </label>
              <input
                type="number"
                name="capacity"
                defaultValue={school.capacity}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditSchoolDialog;