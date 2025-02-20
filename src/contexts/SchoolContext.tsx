"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { School } from '@/types';
import { useSchools } from '@/hooks/useSchools';

interface SchoolState {
  currentSchool: School | null;
  schools: School[];
  loading: boolean;
  error: string | null;
}

type SchoolAction =
  | { type: 'SET_CURRENT_SCHOOL'; payload: School }
  | { type: 'SET_SCHOOLS'; payload: School[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_SCHOOL'; payload: School }
  | { type: 'DELETE_SCHOOL'; payload: string }
  | { type: 'ADD_SCHOOL'; payload: School };

interface SchoolContextType extends SchoolState {
  setCurrentSchool: (school: School) => void;
  updateSchool: (school: School) => void;
  deleteSchool: (schoolId: string) => void;
  addSchool: (school: School) => void;
  refreshSchools: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

function schoolReducer(state: SchoolState, action: SchoolAction): SchoolState {
  switch (action.type) {
    case 'SET_CURRENT_SCHOOL':
      return {
        ...state,
        currentSchool: action.payload
      };
    case 'SET_SCHOOLS':
      return {
        ...state,
        schools: action.payload,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'UPDATE_SCHOOL':
      return {
        ...state,
        schools: state.schools.map(school =>
          school.id === action.payload.id ? action.payload : school
        ),
        currentSchool:
          state.currentSchool?.id === action.payload.id
            ? action.payload
            : state.currentSchool
      };
    case 'DELETE_SCHOOL':
      return {
        ...state,
        schools: state.schools.filter(school => school.id !== action.payload),
        currentSchool:
          state.currentSchool?.id === action.payload ? null : state.currentSchool
      };
    case 'ADD_SCHOOL':
      return {
        ...state,
        schools: [...state.schools, action.payload]
      };
    default:
      return state;
  }
}

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const { schools: initialSchools, loading, error, refetch } = useSchools();
  const [state, dispatch] = useReducer(schoolReducer, {
    currentSchool: null,
    schools: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (initialSchools) {
      dispatch({ type: 'SET_SCHOOLS', payload: initialSchools });
    }
    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error });
    }
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [initialSchools, loading, error]);

  const setCurrentSchool = (school: School) => {
    dispatch({ type: 'SET_CURRENT_SCHOOL', payload: school });
  };

  const updateSchool = (school: School) => {
    dispatch({ type: 'UPDATE_SCHOOL', payload: school });
  };

  const deleteSchool = (schoolId: string) => {
    dispatch({ type: 'DELETE_SCHOOL', payload: schoolId });
  };

  const addSchool = (school: School) => {
    dispatch({ type: 'ADD_SCHOOL', payload: school });
  };

  const refreshSchools = () => {
    refetch();
  };

  const value = {
    ...state,
    setCurrentSchool,
    updateSchool,
    deleteSchool,
    addSchool,
    refreshSchools
  };

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchoolContext() {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchoolContext must be used within a SchoolProvider');
  }
  return context;
} 