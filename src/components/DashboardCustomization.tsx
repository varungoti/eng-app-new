import React from 'react';

interface DashboardCustomizationProps {
  onClose: () => void;
}

export default function DashboardCustomization({ onClose }: DashboardCustomizationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4">Dashboard Customization</h2>
        {/* Add customization options here */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
} 