const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('VITE_GOOGLE_MAPS_API_KEY is not defined in environment variables');
}

export const GOOGLE_MAPS_CONFIG = {
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ["places", "geometry"] as const,
  defaultCenter: { lat: 20.5937, lng: 78.9629 }, // Center of India
  bounds: {
    north: 35.513327,  // Northern India
    south: 6.4626999,  // Southern India
    east: 97.395561,   // Eastern India
    west: 68.7917517,  // Western India
  },
  mapOptions: {
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
    mapTypeId: 'roadmap',
    gestureHandling: 'cooperative',
  } as const,
  autocompleteOptions: {
    componentRestrictions: { country: 'in' },
    fields: ['address_components', 'geometry', 'formatted_address', 'name'],
    types: ['geocode', 'establishment'],
    strictBounds: false
  } as const
};

// Verify API key is available
if (!GOOGLE_MAPS_CONFIG.apiKey) {
  console.error('Google Maps API key is not configured');
} 