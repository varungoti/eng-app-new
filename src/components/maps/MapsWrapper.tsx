"use client";

import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import { GOOGLE_MAPS_CONFIG } from '@/config/maps';
import { LoadingSpinner } from '../LoadingSpinner';

interface MapsWrapperProps {
  children: React.ReactNode;
}

// Convert readonly array to mutable array for LoadScript
const libraries: ("places" | "geometry")[] = [...GOOGLE_MAPS_CONFIG.libraries];

export function MapsWrapper({ children }: MapsWrapperProps) {
  if (!GOOGLE_MAPS_CONFIG.apiKey) {
    return (
      <div className="p-4 border border-red-200 rounded-md">
        <p className="text-sm text-red-500">
          Google Maps API key is not configured. Please check your environment variables.
        </p>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_CONFIG.apiKey}
      libraries={libraries}
      loadingElement={<LoadingSpinner />}
      onLoad={() => console.log('Google Maps script loaded')}
      onError={(error) => console.error('Google Maps script error:', error)}
    >
      {children}
    </LoadScript>
  );
} 