"use client";

/// <reference types="@types/google.maps" />

import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from './LoadingSpinner';
import { GOOGLE_MAPS_CONFIG } from '@/config/maps';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  defaultValue?: string;
  className?: string;
}

export function LocationSearch({ onLocationSelect, defaultValue = '', className }: LocationSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries,
    version: "weekly",
    language: "en",
    region: "IN"
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          ...GOOGLE_MAPS_CONFIG.autocompleteOptions,
          bounds: new google.maps.LatLngBounds(
            { lat: GOOGLE_MAPS_CONFIG.bounds.south, lng: GOOGLE_MAPS_CONFIG.bounds.west },
            { lat: GOOGLE_MAPS_CONFIG.bounds.north, lng: GOOGLE_MAPS_CONFIG.bounds.east }
          )
        }
      );

      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    } catch (err) {
      console.error('Error initializing Places Autocomplete:', err);
      setError('Error initializing location search');
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isLoaded]);

  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;

    setLoading(true);
    try {
      const place = autocompleteRef.current.getPlace();
      
      if (!place?.geometry?.location) {
        setError('Please select a location from the dropdown');
        return;
      }

      const location: Location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address || place.name || ''
      };

      setSelectedLocation(place.geometry.location);
      setQuery(location.address);
      onLocationSelect(location);
      setError(null);

      if (map) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
      }
    } catch (err) {
      console.error('Error processing place:', err);
      setError('Error processing location');
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng || !map) return;

    setSelectedLocation(e.latLng);
    setLoading(true);

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { 
        location: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
      }, 
      (results, status) => {
        setLoading(false);
        if (status === 'OK' && results?.[0]) {
          const address = results[0].formatted_address;
          setQuery(address);
          onLocationSelect({
            lat: e.latLng!.lat(),
            lng: e.latLng!.lng(),
            address
          });
          setError(null);
        } else {
          setError('Could not find address for this location');
        }
      }
    );
  };

  if (loadError) {
    return (
      <div className="p-4 border border-red-200 rounded-md">
        <p className="text-sm text-red-500">
          Error loading Google Maps. Please check your API key and billing settings.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>Location</Label>
      <div className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a location..."
            className="pl-10"
            autoComplete="off"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-4 h-[300px] rounded-lg overflow-hidden border border-gray-200">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={selectedLocation?.toJSON() || GOOGLE_MAPS_CONFIG.defaultCenter}
            zoom={selectedLocation ? 15 : 5}
            options={{
              ...GOOGLE_MAPS_CONFIG.mapOptions,
              restriction: {
                latLngBounds: GOOGLE_MAPS_CONFIG.bounds,
                strictBounds: false
              }
            }}
            onClick={handleMapClick}
            onLoad={setMap}
          >
            {selectedLocation && (
              <Marker
                position={selectedLocation}
                animation={google.maps.Animation.DROP}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}

export default LocationSearch;