/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

// declare module '@supabase/supabase-js' {
//   export * from '@supabase/supabase-js'
// }

// declare module '@tanstack/react-query' {
//   export * from '@tanstack/react-query'
// }

// declare module '@phosphor-icons/react' {
//   export * from '@phosphor-icons/react'
// }

import * as React from 'react';

declare global {
  namespace NodeJS {
    interface Timeout {}
  }

  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Extend Window interface for audio context support
interface Window {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}

export {}; 