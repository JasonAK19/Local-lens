"use client"
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Location, locationService } from '../utils/locationService';

interface LocationState {
  currentLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean | null;
}

type LocationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOCATION'; payload: Location }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_PERMISSION'; payload: boolean }
  | { type: 'CLEAR_LOCATION' };

const initialState: LocationState = {
  currentLocation: null,
  isLoading: false,
  error: null,
  hasPermission: null,
};

function locationReducer(state: LocationState, action: LocationAction): LocationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_LOCATION':
      return { 
        ...state, 
        currentLocation: action.payload, 
        isLoading: false, 
        error: null,
        hasPermission: true 
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload, 
        isLoading: false,
        hasPermission: false 
      };
    case 'SET_PERMISSION':
      return { ...state, hasPermission: action.payload };
    case 'CLEAR_LOCATION':
      return { ...state, currentLocation: null, error: null };
    default:
      return state;
  }
}

interface LocationContextType extends LocationState {
  getCurrentLocation: () => Promise<void>;
  setLocation: (location: Location) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = locationService.getSavedLocation();
    if (savedLocation) {
      dispatch({ type: 'SET_LOCATION', payload: savedLocation });
    }
  }, []);

  const getCurrentLocation = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const location = await locationService.getCurrentPosition();
      dispatch({ type: 'SET_LOCATION', payload: location });
      locationService.saveLocation(location);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const setLocation = (location: Location) => {
    dispatch({ type: 'SET_LOCATION', payload: location });
    locationService.saveLocation(location);
  };

  const clearLocation = () => {
    dispatch({ type: 'CLEAR_LOCATION' });
    locationService.clearSavedLocation();
  };

  const value = {
    ...state,
    getCurrentLocation,
    setLocation,
    clearLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}