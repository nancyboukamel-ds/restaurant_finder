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

export function Filters({apiFilters, onFilterChange }: FiltersProps) {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  // Extract ONLY cuisine filters (filter out promotions!)
  // The variable availableCuisines is calculated every time the component renders.
  // It performs a "search and rescue" mission on the apiFilters object:

  // 1. Object.keys(apiFilters) gets an array of all the keys in the apiFilters object.
  // 2. .filter(...) goes through each key and checks if it corresponds to a cuisine filter by looking for 'group: cuisine' and 'displayName' properties. 
  // 3. .map(...) transforms the filtered keys into a new array of objects that contain the key and the display name of the cuisine.
  // 4. .sort(...) sorts the resulting array alphabetically by the cuisine name for better user experience in the UI.
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

  //Adds or removes a cuisine from the selected list when the user clicks on it.
  const toggleCuisine = (cuisineKey: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisineKey)
        ? prev.filter(c => c !== cuisineKey) //remove if already selected
        //spread operator ...prev = take all the previously selected cuisines and put them in this new array, then add the new cuisineKey to the end of the array
        : [...prev, cuisineKey] //add if not selected
    );
  };

  const clearFilters = () => {
    setSelectedCuisines([]);
    setMinRating(0);
  };

  //ACTIVE FILTERS CHECK - this variable is true if there are any selected cuisines or if the minimum rating is greater than 0.
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