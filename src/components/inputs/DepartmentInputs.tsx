import React from 'react';
import DepartmentInput from './DepartmentInput';

const DepartmentInputs: React.FC = () => {
  const departments = ['sales', 'marketing', 'content', 'technical', 'accounts'];

  const handleSubmit = (data: any) => {
    // Here you would typically send this data to your backend
    console.log('Department input submitted:', data);
  };

  return (
    <div className="space-y-6">
      {departments.map((dept) => (
        <DepartmentInput
          key={dept}
          department={dept}
          onSubmit={handleSubmit}
        />
      ))}
    </div>
  );
};

export default DepartmentInputs;