import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useLocation } from '../../contexts/locationContext';
import { locationService } from '../../utils/locationService';
import LocationPicker from './LocationPicker';

export default function LocationButton() {
  const { currentLocation } = useLocation();
  const [showPicker, setShowPicker] = useState(false);

  const getDisplayText = () => {
    if (!currentLocation) return 'Set Location';
    
    const formatted = locationService.formatLocationDisplay(currentLocation);
    const parts = formatted.split(',');
    return parts[0] || 'Unknown Location';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <MapPin className="h-4 w-4 text-gray-600" />
        <span className="text-gray-800 max-w-32 truncate">{getDisplayText()}</span>
        <ChevronDown className="h-3 w-3 text-gray-500" />
      </button>

      {showPicker && (
        <div className="absolute top-full left-0 mt-2 z-50">
          <LocationPicker onClose={() => setShowPicker(false)} />
        </div>
      )}
    </div>
  );
}