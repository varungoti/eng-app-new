import { useState, useEffect } from 'react';
import { Plus, Upload, Search, Trash, Edit } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import BulkImportDialog from '../components/BulkImport/BulkImportDialog';
import { useSchools } from '../hooks/useSchools';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { toast } from "../components/ui/use-toast";

const Students = () => {
  const { students, loading, error, addStudent, deleteStudent } = useStudents();
  const { schools } = useSchools();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [_isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  const filteredStudents = students.filter(student => {
    const matchesSchool = !selectedSchool || student.schoolId === selectedSchool;
    const matchesGrade = !selectedGrade || student.gradeId === selectedGrade;
    const matchesSearch = !searchQuery || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSchool && matchesGrade && matchesSearch;
  });

  const handleBulkImport = async (data: any[]) => {
    // Transform imported data to Student type
    const newStudents = data.map(row => ({
      name: row.name,
      rollNumber: row.rollNumber,
      schoolId: row.schoolId,
      gradeId: row.gradeId,
      gender: row.gender,
      dateOfBirth: new Date(row.dateOfBirth),
      contactNumber: row.contactNumber,
      email: row.email,
      address: row.address,
      guardianName: row.guardianName,
      guardianContact: row.guardianContact
    }));
    
    // Add students in batches
    for (const student of newStudents) {
      await addStudent.mutateAsync({
        ...student,
        studentAddress: student.address,
        dateOfBirth: student.dateOfBirth
      });
    }
    
    setIsImportModalOpen(false);
  };

  const handleDeleteClick = (studentId: string) => {
    setStudentToDelete(studentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent.mutateAsync(studentToDelete);
        toast({
          title: "Student deleted",
          description: "The student has been successfully removed from the system."
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete student. Please try again."
        });
      }
    }
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  if (isLoading) {
    return (
      <LoadingSpinner message="Loading students..." />
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <div className="flex space-x-4">
          <button
            title="Import Students"
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Students
          </button>
          <button
            title="Add Student"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School
            </label>
            <Select
              value={selectedSchool}
              onValueChange={setSelectedSchool}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select School" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools.map(school => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <Select
              value={selectedGrade}
              onValueChange={setSelectedGrade}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {selectedSchool && schools
                  .find(s => s.id === selectedSchool)
                  ?.grades?.map(grade => (
                    <SelectItem key={grade} value={grade}>
                      Grade {grade}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or roll number"
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                School
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guardian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 relative">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.rollNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Grade {student.gradeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schools.find(s => s.id === student.schoolId)?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.guardianName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.guardianContact}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    <button 
                      title="Edit Student"
                      type="button"
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button 
                      title="Delete Student"
                      type="button"
                      onClick={() => handleDeleteClick(student.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Import Modal */}
      {isImportModalOpen && (
        <BulkImportDialog
          title="Import Students"
          onImport={handleBulkImport}
          onClose={() => setIsImportModalOpen(false)}
          template={{
            headers: [
              'name',
              'rollNumber',
              'schoolId',
              'gradeId',
              'gender',
              'dateOfBirth',
              'contactNumber',
              'email',
              'address',
              'guardianName',
              'guardianContact'
            ],
            sampleData: [
              {
                name: 'John Smith',
                rollNumber: 'G1001',
                schoolId: 'school-id-1',
                gradeId: 'grade-id-1',
                gender: 'Male',
                dateOfBirth: '2010-01-15',
                contactNumber: '1234567890',
                email: 'john@example.com',
                address: '123 Main St',
                guardianName: 'Jane Smith',
                guardianContact: '9876543210'
              }
            ]
          }}
          validateRow={(row) => {
            const errors = [];
            if (!row.name) errors.push('Name is required');
            if (!row.rollNumber) errors.push('Roll number is required');
            if (!row.schoolId) errors.push('School ID is required');
            if (!row.gradeId) errors.push('Grade ID is required');
            return {
              isValid: errors.length === 0,
              errors
            };
          }}
        />
      )}

      {/* Delete Dialog */}
      {deleteDialogOpen && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this student?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Students;