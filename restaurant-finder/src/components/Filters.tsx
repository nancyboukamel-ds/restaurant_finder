import { useState, useEffect } from 'react';
import type { Restaurant } from '../types/restaurant';


interface FiltersProps {
  allRestaurants: Restaurant[];
  apiFilters: any;
  // callback function (pipe sends data back up to the parent)
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  selectedCuisines: string[];
  minRating: number;
}

export function Filters({ allRestaurants, apiFilters, onFilterChange }: FiltersProps) {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  // Extract ONLY cuisine filters (filter out promotions!)
  // The variable availableCuisines is calculated every time the component renders.
  // It performs a "search and rescue" mission on the apiFilters object:
  const availableCuisines = Object.keys(apiFilters)
    .filter(key => {
      const filter = apiFilters[key];
      // Only include if it has 'group: cuisine' AND displayName
      return filter?.group === 'cuisine' && filter?.displayName;
    })
    .map(key => ({
      key: key,
      name: apiFilters[key].displayName
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Whenever the user clicks a checkbox (changing selectedCuisines) or moves a rating
  // slider (changing minRating), this "Effect" fires.
  useEffect(() => {
    onFilterChange({ 
      selectedCuisines, 
      minRating 
    });
  }, [selectedCuisines, minRating]); 

  const toggleCuisine = (cuisineKey: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisineKey)
        ? prev.filter(c => c !== cuisineKey)
        : [...prev, cuisineKey]
    );
  };

  const clearFilters = () => {
    setSelectedCuisines([]);
    setMinRating(0);
  };

  const hasActiveFilters = selectedCuisines.length > 0 || minRating > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Rating: {minRating > 0 ? `${minRating}⭐` : 'Any'}
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jet-orange"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Any</span>
          <span>5⭐</span>
        </div>
      </div>

      {/* Cuisine Filter */}
      {availableCuisines.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cuisines {selectedCuisines.length > 0 && `(${selectedCuisines.length} selected)`}
          </label>
          <div className="flex flex-wrap gap-2">
            {availableCuisines.map(({ key, name }) => (
              <button
                key={key}
                onClick={() => toggleCuisine(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCuisines.includes(key)
                    ? 'bg-jet-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}