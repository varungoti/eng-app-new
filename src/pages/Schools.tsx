import { useState } from 'react';
import { School, Plus, Edit, Trash2, MapPin, Phone, Mail, User } from 'lucide-react';
import type { School as SchoolType } from '../types';
import LocationSearch from '../components/LocationSearch';
import EditSchoolDialog from '../components/EditSchoolDialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { useError } from '../hooks/useError';
import GradeSelector from '../components/GradeSelector';
import { useSchools } from '../hooks/useSchools';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '../components/LoadingSpinner';
//import { Dialog } from '@/components/ui/dialog';

const isSchool = (school: unknown): school is SchoolType => {
  return typeof school === 'object' && school !== null && 'type' in school && 'id' in school;
};

const Schools = () => {
  const { schools, loading, error, addSchool, updateSchool, deleteSchool } = useSchools();
  const { setError } = useError();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | null>(null);
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolType | null>(null);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [_isLoading, setIsLoading] = useState(false);

  const handleEditSchool = (updatedSchool: SchoolType) => {
    console.log('Updating school:', updatedSchool);
    updateSchool.mutate(updatedSchool);
    setEditingSchool(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading schools..." />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const handleAddSchool = async (formData: FormData) => {
    const latitude = parseFloat(formData.get('latitude') as string);
    const longitude = parseFloat(formData.get('longitude') as string);
    const address = formData.get('address') as string;
    
    // Validate form data
    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Please select a valid location');
      return;
    }
    
    if (!address) {
      setError('Please enter a valid address');
      return;
    }

    // Create school object
    const newSchool: Omit<SchoolType, 'id'> = {
      name: formData.get('name') as string,
      type: 'main' as const,
      address,
      latitude,
      longitude,
      contactNumber: formData.get('contactNumber') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as 'active' | 'inactive',
      capacity: {
        total: parseInt(formData.get('capacity') as string),
        current: 0
      },
      principalName: formData.get('principalName') as string,
      grades: selectedGrades,
      schoolType: formData.get('schoolType') as 'public' | 'private' | 'charter' | 'religious' | 'other',
      schoolLevel: formData.get('schoolLevel') as 'elementary' | 'middle' | 'high' | 'other',
      schoolLeader: formData.get('principalName') as string,
      schoolLeaderTitle: 'Principal',
      schoolLeaderEmail: formData.get('leaderEmail') as string,
      schoolLeaderPhone: formData.get('leaderPhone') as string,
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
    };
    try {
      // Show loading state
      setIsLoading(true);

      const result = await addSchool.mutateAsync(newSchool);
      if (result) {
        setIsAddModalOpen(false);
        setSelectedGrades([]);
        setError(null);
        
        // Show success message
        toast({
          title: "Success",
          description: "School added successfully",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add school');
      toast({
        title: "Error",
        description: "Failed to add school",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBranch = async (formData: FormData) => {
    if (selectedSchool) {
      const newBranch: Omit<SchoolType, 'id'> = {
        name: formData.get('name') as string,
        type: 'branch' as const,
        address: formData.get('address') as string,
        latitude: parseFloat(formData.get('latitude') as string),
        longitude: parseFloat(formData.get('longitude') as string),
        contactNumber: formData.get('contactNumber') as string,
        email: formData.get('email') as string,
        status: formData.get('status') as 'active' | 'inactive',
        capacity: {
          total: parseInt(formData.get('capacity') as string),
          current: 0
        },
        principalName: formData.get('principalName') as string,
        schoolType: formData.get('schoolType') as 'public' | 'private' | 'charter' | 'religious' | 'other',
        schoolLevel: formData.get('schoolLevel') as 'elementary' | 'middle' | 'high' | 'other',
        schoolLeader: formData.get('principalName') as string,
        schoolLeaderTitle: 'Principal',
        schoolLeaderEmail: formData.get('leaderEmail') as string,
        schoolLeaderPhone: formData.get('leaderPhone') as string,
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
        isBoarding: false,
        parentId: selectedSchool.id,
        grades: selectedGrades
      };
      await addSchool.mutateAsync(newBranch);
      setIsAddBranchOpen(false);
      setSelectedGrades([]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Schools</h1>
        <div className="flex space-x-4">
          <button
            title="Add School"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {schools
          .filter((school): school is SchoolType => {
            if (!isSchool(school)) return false;
            return school.type !== 'branch';
          })
          .map((school) => (
            <div key={school.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center">
                      <School className="h-6 w-6 text-indigo-600 mr-3" />
                      <div className="text-lg font-medium text-indigo-600">
                        {school.name}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{school.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{school.contactNumber}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{school.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span>{school.principalName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0">
                    <div className="flex space-x-4">
                      <button
                        title="Add branch school"
                        type="button"
                        onClick={() => {
                          setSelectedSchool(school);
                          setIsAddBranchOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-700"
                        aria-label="Add branch school"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                      <button
                        title="Edit school"
                        type="button"
                        onClick={() => {
                          setEditingSchool(school);
                          setSelectedGrades(school.grades || []);
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteSchool.mutate(school.id);
                        }}
                        title="Delete school"
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Branches */}
              <div className="border-t border-gray-200">
                <div className="px-4 py-3">
                  <h3 className="text-sm font-medium text-gray-600">Branches</h3>
                  <div className="mt-2 space-y-2">
                    {schools
                      .filter((branch): branch is SchoolType => 
                        isSchool(branch) && 
                        branch.type === 'branch' && 
                        branch.parentId === school.id
                      )
                      .map((branch) => (
                        <div
                          key={branch.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {branch.name}
                            </div>
                            <div className="text-sm text-gray-500">{branch.address}</div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              title="Edit branch school"
                              type="button"
                              onClick={() => {
                                setEditingSchool(branch);
                                setSelectedGrades(branch.grades || []);
                              }}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              title="Delete branch school"
                              type="button"
                              onClick={() => {
                                deleteSchool.mutate(branch.id);
                              }}
                              className="text-red-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add School Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full my-8 mx-4">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium">Add New School</h2>
            </div>
            <ScrollArea className="h-[60vh]">
              <div className="p-6">
              <form
                id="addSchoolForm"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddSchool(new FormData(e.currentTarget));
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      School Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter school name"
                    />
                  </div>
                  <div className="space-y-2">
                    <LocationSearch
                      onLocationSelect={({ lat, lng, address }) => {
                        const form = document.getElementById('addSchoolForm') as HTMLFormElement;
                        if (form) {
                          (form.elements.namedItem('latitude') as HTMLInputElement).value = lat.toString();
                          (form.elements.namedItem('longitude') as HTMLInputElement).value = lng.toString();
                          (form.elements.namedItem('address') as HTMLInputElement).value = address;
                        }
                      }}
                    />
                    <input type="hidden" name="latitude" required />
                    <input type="hidden" name="longitude" required />
                    <input type="hidden" name="address" required />
                  </div>
                  <div className="mt-4">
                    <GradeSelector
                      selectedGrades={selectedGrades}
                      onChange={setSelectedGrades}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Principal Name
                    </label>
                    <input
                      type="text"
                      name="principalName"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter principal's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      required
                      aria-label="School Status"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                      Student Capacity
                    </label>
                    <input
                      id="capacity"
                      type="number"
                      name="capacity"
                      placeholder="Enter total student capacity"
                      aria-label="Student Capacity"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      School Type
                    </label>
                    <select
                      id="schoolType"
                      name="schoolType"
                      required
                      aria-label="School Type"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="charter">Charter</option>
                      <option value="religious">Religious</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      School Level
                    </label>
                    <select
                      id="schoolLevel"
                      name="schoolLevel"
                      required
                      aria-label="School Level"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="elementary">Elementary</option>
                      <option value="middle">Middle</option>
                      <option value="high">High</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Leader Email
                    </label>
                    <input
                      type="email"
                      name="leaderEmail"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Leader's email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Leader Phone
                    </label>
                    <input
                      type="tel"
                      name="leaderPhone"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Leader's phone number"
                    />
                  </div>
                </div>
              </form>
              </div>
            </ScrollArea>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3">
                <button
                  title="Add School"
                  type="submit"
                  form="addSchoolForm"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Add School
                </button>
                <button
                  title="Cancel"
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {isAddBranchOpen && selectedSchool && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">
                Add Branch for {selectedSchool.name}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto px-6">
            <form
              id="addBranchForm"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddBranch(formData);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter branch name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter complete address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      required
                      placeholder="Latitude (e.g., 51.5074)"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 opacity-0">
                      Location
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      required
                      placeholder="Longitude (e.g., -0.1278)"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Principal Name
                  </label>
                  <input
                    type="text"
                    name="principalName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter principal's name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    aria-label="Branch Status"
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
                    id="capacity"
                    type="number"
                    name="capacity"
                    placeholder="Enter total student capacity"
                    aria-label="Branch Student Capacity"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </form>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3">
                <button
                  title="Add Branch"
                  type="submit"
                  form="addBranchForm"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Add Branch
                </button>
                <button
                  title="Cancel"
                  type="button"
                  onClick={() => {
                    setIsAddBranchOpen(false);
                    setSelectedSchool(null);
                  }}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit School Dialog */}
      {editingSchool && (
        <EditSchoolDialog
          school={editingSchool}
          selectedGrades={selectedGrades}
          onGradesChange={setSelectedGrades}
          onSave={handleEditSchool}
          onCancel={() => {
            setEditingSchool(null);
            setSelectedGrades([]);
          }}
          open={!!editingSchool}
        />
      )}
    </div>
  );
};

export default Schools;