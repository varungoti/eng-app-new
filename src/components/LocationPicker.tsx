/// <reference types="@types/google.maps" />

import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Search } from 'lucide-react';
import { useGoogleMaps, INDIA_BOUNDS } from '../lib/maps';
import { logger } from '../lib/logger';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address: string };
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [marker, setMarker] = useState<google.maps.LatLng | null>(
    initialLocation && window.google ? new window.google.maps.LatLng(initialLocation.lat, initialLocation.lng) : null
  );
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoaded, loadError, config } = useGoogleMaps();

  // Initialize Autocomplete
  useEffect(() => {
    if (!isLoaded || !searchInputRef.current || !window.google) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        ...config.autocompleteOptions,
        bounds: new google.maps.LatLngBounds(
          { lat: INDIA_BOUNDS.south, lng: INDIA_BOUNDS.west },
          { lat: INDIA_BOUNDS.north, lng: INDIA_BOUNDS.east }
        )
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        
        if (!place?.geometry?.location) {
          setError('No location found for this place');
          return;
        }

        setMarker(place.geometry.location);
        onLocationSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || '',
        });
        
        if (mapRef.current) {
          mapRef.current.panTo(place.geometry.location);
          mapRef.current.setZoom(15);
        }

        setError(null);
        
        logger.info('Location selected from autocomplete', {
          context: {
            address: place.formatted_address,
            location: place.geometry.location.toJSON()
          },
          source: 'LocationPicker'
        });
      });
    } catch (error) {
      setError('Failed to initialize location search');
      logger.error('Places API Error', {
        context: { error },
        source: 'LocationPicker'
      });
    }
  }, [isLoaded, config.autocompleteOptions, onLocationSelect]);

  // Set initial location
  useEffect(() => {
    if (initialLocation && isLoaded) {
      setMarker(new google.maps.LatLng(initialLocation.lat, initialLocation.lng));
      if (searchInputRef.current) {
        searchInputRef.current.value = initialLocation.address;
      }
    }
  }, [initialLocation, isLoaded]);

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
        <h3 className="text-sm font-medium text-red-800 mb-2">Google Maps Error</h3>
        <p className="text-sm text-red-600">{loadError.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Location
          </label>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a location or landmark"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={config.defaultZoom}
          center={marker ? marker.toJSON() : config.defaultCenter}
          options={{
            ...config.mapOptions,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true
          }}
          onLoad={(map) => {
            mapRef.current = map;
            if (marker) {
              map.panTo(marker);
              map.setZoom(15);
            }
          }}
          onClick={(e) => {
            if (!e.latLng) return;
            
            setMarker(e.latLng);
            
            // Reverse geocode to get address
            if (!window.google) return;
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: e.latLng }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                const address = results[0].formatted_address;
                if (searchInputRef.current) {
                  searchInputRef.current.value = address;
                }
                onLocationSelect({
                  lat: e.latLng!.lat(),
                  lng: e.latLng!.lng(),
                  address,
                });
                setError(null);

                logger.info('Location selected from map click', {
                  context: {
                    address,
                    location: e.latLng!.toJSON()
                  },
                  source: 'LocationPicker'
                });
              } else {
                setError('Failed to get address for selected location');
                logger.error('Geocoding failed', {
                  context: { status, location: e.latLng!.toJSON() },
                  source: 'LocationPicker'
                });
              }
            });
          }}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default LocationPicker;