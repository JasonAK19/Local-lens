export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  displayName?: string;
}

export interface LocationSearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
  };
}

class LocationService {
  private readonly STORAGE_KEY = 'user_location';
  private readonly GEOCODING_API = 'https://nominatim.openstreetmap.org';

  // Get current position using browser geolocation
  async getCurrentPosition(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const locationDetails = await this.reverseGeocode(latitude, longitude);
            resolve(locationDetails);
          } catch {
            resolve({ latitude, longitude });
          }
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  async reverseGeocode(lat: number, lon: number): Promise<Location> {
    try {
      const response = await fetch(
        `${this.GEOCODING_API}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      
      return {
        latitude: lat,
        longitude: lon,
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        country: data.address?.country,
        displayName: data.display_name
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { latitude: lat, longitude: lon };
    }
  }

  async searchLocations(query: string): Promise<LocationSearchResult[]> {
    if (!query || query.length < 3) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.GEOCODING_API}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Location search failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }

  saveLocation(location: Location): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(location));
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  }

  // Load location from localStorage
  getSavedLocation(): Location | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load saved location:', error);
      return null;
    }
  }

  clearSavedLocation(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear saved location:', error);
    }
  }

  formatLocationDisplay(location: Location): string {
    if (location.displayName) {
      return location.displayName;
    }

    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country) parts.push(location.country);
    
    return parts.length > 0 ? parts.join(', ') : `${location.latitude}, ${location.longitude}`;
  }
}

export const locationService = new LocationService();