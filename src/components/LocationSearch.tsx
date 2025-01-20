/// <reference types="@types/google.maps" />

import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Search } from 'lucide-react';
import { useGoogleMaps } from '../lib/maps';

const INDIA_BOUNDS = {
  north: 35.513327,  // Northern India
  south: 6.4626999,  // Southern India
  east: 97.395561,   // Eastern India
  west: 68.7917517,  // Western India
};

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [searchError, setSearchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError, config } = useGoogleMaps();

  const handleLocationSelect = (location: google.maps.places.PlaceResult) => {
    if (!location.geometry?.location) {
      setSearchError('No location found');
      return;
    }

    const lat = location.geometry.location.lat();
    const lng = location.geometry.location.lng();
    const address = location.formatted_address || '';

    onLocationSelect({
      lat,
      lng,
      address
    });

    // Update map marker
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    }

    setSearchError(null);
  };

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    try {
      // Initialize geocoder
      geocoderRef.current = new google.maps.Geocoder();

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        bounds: new google.maps.LatLngBounds(
          { lat: INDIA_BOUNDS.south, lng: INDIA_BOUNDS.west },
          { lat: INDIA_BOUNDS.north, lng: INDIA_BOUNDS.east }
        ),
        componentRestrictions: { country: 'in' },
        fields: ['geometry', 'formatted_address'],
        types: ['geocode', 'establishment']
      });

      autocompleteRef.current.setOptions({
        strictBounds: false,
        bounds: new google.maps.LatLngBounds(
          { lat: INDIA_BOUNDS.south, lng: INDIA_BOUNDS.west },
          { lat: INDIA_BOUNDS.north, lng: INDIA_BOUNDS.east }
        )
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        
        if (!place || !place.geometry?.location) {
          setSearchError('No location found for this place');
          return;
        }

        if (mapRef.current) {
          mapRef.current.panTo(place.geometry.location);
          mapRef.current.setZoom(15);
        }

        // Update marker
        if (markerRef.current) {
          markerRef.current.setPosition(place.geometry.location);
        } else {
          markerRef.current = new google.maps.Marker({
            map: mapRef.current,
            position: place.geometry.location
          });
        }

        onLocationSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || '',
        });

        setSearchError(null);
      });

    } catch (error) {
      setSearchError('Failed to initialize location search');
      console.error('Places API Error:', error);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [isLoaded, config.defaultCenter, onLocationSelect]);

  if (!isLoaded) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded-md"></div>
        <div className="h-[300px] bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h3 className="text-sm font-medium text-red-800 mb-2">Google Maps Configuration Required</h3>
        <div className="text-sm text-gray-600 space-y-4">
          <p className="text-red-600">{loadError.message}</p>
          <div className="bg-white p-4 rounded border border-gray-200">
            <p className="font-medium mb-2">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to the <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
              <li>Create a new project or select an existing one</li>
              <li>Enable the following APIs:
                <ul className="ml-6 mt-1 list-disc text-gray-500">
                  <li>Maps JavaScript API</li>
                  <li>Places API</li>
                </ul>
              </li>
              <li>Create API credentials with the following restrictions:
                <ul className="ml-6 mt-1 list-disc text-gray-500">
                  <li>Application restrictions: HTTP referrers</li>
                  <li>API restrictions: Maps JavaScript API and Places API</li>
                </ul>
              </li>
              <li>Add your API key to <code className="px-2 py-1 bg-gray-100 rounded">.env</code> as <code className="px-2 py-1 bg-gray-100 rounded">VITE_GOOGLE_MAPS_API_KEY</code></li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location Search
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter a location or landmark"
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
      </div>


      {searchError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {searchError}
        </div>
      )}

      <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerClassName="w-full h-full"
          zoom={config.defaultZoom}
          center={config.defaultCenter}
          options={{
            ...config.mapOptions,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            restriction: {
              latLngBounds: INDIA_BOUNDS,
              strictBounds: false
            }
          }}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onClick={(e) => {
            if (!e.latLng) return;
            
            // Update marker
            if (markerRef.current) {
              markerRef.current.setPosition(e.latLng);
            } else {
              markerRef.current = new google.maps.Marker({
                map: mapRef.current,
                position: e.latLng
              });
            }
            
            // Reverse geocode to get address
            geocoderRef.current?.geocode({ location: e.latLng }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                const address = results[0].formatted_address;
                if (inputRef.current) {
                  inputRef.current.value = address;
                }
                onLocationSelect({
                  lat: e.latLng!.lat(),
                  lng: e.latLng!.lng(),
                  address,
                });
                setSearchError(null);
              } else {
                setSearchError('Failed to get address for selected location');
              }
            });
          }}
         />
      </div>
    </div>
  );
};

export default LocationSearch;