import React from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from '../lib/maps';
import type { School } from '../types';
import { School as SchoolIcon } from 'lucide-react';

interface SchoolMapProps {
  schools: School[];
  selectedSchool: School | null;
  onSchoolSelect: (school: School) => void;
}

const SchoolMap: React.FC<SchoolMapProps> = ({
  schools,
  selectedSchool,
  onSchoolSelect,
}) => {
  const mapStyles = {
    height: '400px',
    width: '100%',
  };

  const { isLoaded, loadError, config } = useGoogleMaps();

  // Calculate bounds to fit all schools
  const getBounds = () => {
    if (schools.length === 0) return null;
    const bounds = new google.maps.LatLngBounds();
    schools.forEach(school => {
      bounds.extend({ lat: school.latitude, lng: school.longitude });
    });
    return bounds;
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md space-y-2">
        <p className="text-sm text-red-600 font-medium">{loadError.message}</p>
        <p className="text-xs text-red-500">{loadError.details}</p>
        {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium">Required Setup:</p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Create a Google Cloud Project</li>
              <li>Enable Maps JavaScript API and Places API</li>
              <li>Create API credentials</li>
              <li>Add VITE_GOOGLE_MAPS_API_KEY to .env</li>
            </ol>
          </div>
        )}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-50">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={config.defaultZoom}
      center={config.defaultCenter}
      options={config.mapOptions}
      onLoad={(map) => {
        const bounds = getBounds();
        if (bounds) {
          map.fitBounds(bounds, 50); // 50px padding
        }
      }}
    >
        {schools.map((school) => (
          <Marker
            key={school.id}
            position={{ lat: school.latitude, lng: school.longitude }}
            onClick={() => onSchoolSelect(school)}
            label={{
              text: school.type === 'branch' ? 'B' : 'S',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: school.type === 'branch' ? '#4F46E5' : '#10B981',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 10,
            }}
          />
        ))}

        {selectedSchool && (
          <InfoWindow
            position={{
              lat: selectedSchool.latitude,
              lng: selectedSchool.longitude,
            }}
            onCloseClick={() => onSchoolSelect(null)}
          >
            <div className="p-3 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <SchoolIcon className="h-5 w-5 text-indigo-600" />
                <h3 className="font-medium text-gray-900">{selectedSchool.name}</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">{selectedSchool.address}</p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {selectedSchool.contactNumber}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {selectedSchool.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Principal:</span> {selectedSchool.principalName}
                </p>
              </div>
            </div>
          </InfoWindow>
        )}
    </GoogleMap>
  );
};

export default SchoolMap;