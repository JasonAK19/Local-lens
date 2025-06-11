import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Navigation, X, Check } from 'lucide-react';
import { useLocation } from '@/contexts/locationContext';
import { locationService, LocationSearchResult } from '../../utils/locationService';

interface LocationPickerProps {
  onClose?: () => void;
  compact?: boolean;
}

export default function LocationPicker({ onClose, compact = false }: LocationPickerProps) {
  const { currentLocation, isLoading, error, getCurrentLocation, setLocation, clearLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle search with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length >= 3) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await locationService.searchLocations(searchQuery);
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleLocationSelect = (result: LocationSearchResult) => {
    const location = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      city: result.address.city,
      state: result.address.state,
      country: result.address.country,
      displayName: result.display_name
    };
    
    setLocation(location);
    setSearchQuery('');
    setShowResults(false);
    if (onClose) onClose();
  };

  const handleCurrentLocationClick = async () => {
    await getCurrentLocation();
    if (onClose) onClose();
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>
            {currentLocation 
              ? locationService.formatLocationDisplay(currentLocation).split(',')[0] 
              : 'Select location'
            }
          </span>
        </div>
        <button
          onClick={handleCurrentLocationClick}
          disabled={isLoading}
          className="p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          title="Use current location"
        >
          <Navigation className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Set Your Location</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Current Location Display */}
      {currentLocation && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Current Location</p>
                <p className="text-xs text-green-600">
                  {locationService.formatLocationDisplay(currentLocation)}
                </p>
              </div>
            </div>
            <button
              onClick={clearLocation}
              className="text-green-600 hover:text-green-800"
              title="Clear location"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Auto-detect Location Button */}
      <button
        onClick={handleCurrentLocationClick}
        disabled={isLoading}
        className="w-full mb-4 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <Navigation className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'Detecting...' : 'Use Current Location'}</span>
      </button>

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a city or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                onClick={() => handleLocationSelect(result)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {result.display_name.split(',').slice(0, 3).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {result.display_name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 3 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-500 text-center">No locations found</p>
          </div>
        )}
      </div>
    </div>
  );
}