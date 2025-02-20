// Create the preferences type file
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  // Add other preference fields as needed
} 