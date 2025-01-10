import { Libraries } from '@react-google-maps/api';
import { useLoadScript } from '@react-google-maps/api';
import { useMemo } from 'react';
import { logger } from './logger';

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// India bounds for restricting map view
export const INDIA_BOUNDS = {
  north: 35.513327,  // Northern India
  south: 6.4626999,  // Southern India
  east: 97.395561,   // Eastern India
  west: 68.7917517,  // Western India
};

export const GOOGLE_MAPS_CONFIG = {
  libraries: ['places', 'geometry'] as Libraries,
  defaultCenter: { lat: 17.2313, lng: 78.2930  }, // Hyderabad
  defaultZoom: 13,
  mapOptions: {
    disableDefaultUI: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    gestureHandling: 'cooperative',
    mapTypeId: 'roadmap',
    restriction: {
      latLngBounds: INDIA_BOUNDS,
      strictBounds: false
    },
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  },
  autocompleteOptions: {
    componentRestrictions: { country: 'IN' },
    types: ['geocode', 'establishment'],
    fields: ['formatted_address', 'geometry', 'name']
  },
};

export const useGoogleMaps = () => {
  const apiKey = useMemo(() => GOOGLE_MAPS_API_KEY, []);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries: GOOGLE_MAPS_CONFIG.libraries,
    onLoad: () => {
      logger.info('Google Maps loaded successfully', {
        source: 'GoogleMaps'
      });
    },
    onError: (error) => {
      logger.error('Failed to load Google Maps', {
        context: { error },
        source: 'GoogleMaps'
      });
    }
  });

  const error = useMemo(() => {
    if (!apiKey) {
      return {
        message: 'Google Maps API key is not configured',
        details: 'Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables'
      };
    }
    if (loadError) {
      return {
        message: 'Failed to load Google Maps',
        details: loadError.message,
      };
    }
    return null;
  }, [apiKey, loadError]);

  return {
    isLoaded,
    loadError: error,
    config: GOOGLE_MAPS_CONFIG,
  };
};