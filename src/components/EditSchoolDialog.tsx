import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import LocationSearch from './LocationSearch';
import GradeSelector from './GradeSelector';
import AutoSaveInput from './AutoSaveInput';
import { useSchools } from '../hooks/useSchools';
import type { School } from '../types';

interface EditSchoolDialogProps {
  school: School;
  onSave: (school: School) => void;
  onCancel: () => void;
}

const EditSchoolDialog: React.FC<EditSchoolDialogProps> = ({
  school,
  onSave,
  onCancel,
}) => {
  const [selectedGrades, setSelectedGrades] = React.useState<string[]>(school.grades || []);
  const { updateSchool } = useSchools();

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full my-8 mx-4">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">Edit School</h2>
        </div>
        <ScrollArea className="h-[60vh]">
          <div className="p-6">
            <form
              id="editSchoolForm"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onSave({
                  ...school,
                  name: formData.get('name') as string,
                  address: formData.get('address') as string,
                  latitude: parseFloat(formData.get('latitude') as string),
                  longitude: parseFloat(formData.get('longitude') as string),
                  contactNumber: formData.get('contactNumber') as string,
                  email: formData.get('email') as string,
                  status: formData.get('status') as 'active' | 'inactive',
                  capacity: parseInt(formData.get('capacity') as string),
                  principalName: formData.get('principalName') as string,
                  grades: selectedGrades,
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <AutoSaveInput
                    type="text"
                    name="name"
                    defaultValue={school.name}
                    onSave={async (value) => {
                      await updateSchool(school.id, { ...school, name: value });
                    }}
                    required
                    label="School Name"
                  />
                </div>
                <div>
                  <LocationSearch
                    onLocationSelect={({ lat, lng, address }) => {
                      const form = document.querySelector('#editSchoolForm');
                      if (form) {
                        (form.elements.namedItem('latitude') as HTMLInputElement).value = lat.toString();
                        (form.elements.namedItem('longitude') as HTMLInputElement).value = lng.toString();
                        (form.elements.namedItem('address') as HTMLInputElement).value = address;
                      }
                    }}
                  />
                  <input type="hidden" name="latitude" defaultValue={school.latitude} required />
                  <input type="hidden" name="longitude" defaultValue={school.longitude} required />
                  <input type="hidden" name="address" defaultValue={school.address} required />
                </div>
                <GradeSelector
                  selectedGrades={selectedGrades}
                  onChange={setSelectedGrades}
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
              </div>
            </form>
          </div>
        </ScrollArea>
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button
              type="submit"
              form="editSchoolForm"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSchoolDialog;