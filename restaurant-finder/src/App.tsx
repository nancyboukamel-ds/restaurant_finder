import { useState } from 'react';
import { fetchRestaurantByPostcode } from './services/restaurantApi';
import { filterRestaurants } from './utils/filterRestaurants';  
import { SearchBar } from './components/SearchBar';
import { Filters } from './components/Filters';
import { RestaurantCard } from './components/RestaurantCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { EmptyState } from './components/EmptyState';
import type { Restaurant } from './types/restaurant';

export interface FilterState {
  selectedCuisines: string[];
  minRating: number;
}

function App() {
  // all restaurants
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [apiFilters, setApiFilters] = useState<any>({});
  // filtered restaurants (by rating or cuisine)
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (postcode: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const { restaurants, filters } = await fetchRestaurantByPostcode(postcode);
      setAllRestaurants(restaurants);
      setApiFilters(filters);
      
      // Initially show first 10 (no filters applied)
      setFilteredRestaurants(restaurants.slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAllRestaurants([]);
      setFilteredRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterState: FilterState) => {
    const filtered = filterRestaurants(
      allRestaurants,
      filterState.selectedCuisines,
      filterState.minRating,
      apiFilters
    );
    
    setFilteredRestaurants(filtered);
  };

  const handleRetry = () => {
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🍕 Restaurant Finder
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Powered by Just Eat Takeaway API
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && !loading && <ErrorDisplay message={error} onRetry={handleRetry} />}

        {/* Filters - Only show if we have results */}
        {!loading && !error && allRestaurants.length > 0 && (
          <Filters
            allRestaurants={allRestaurants}
            apiFilters={apiFilters}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Results */}
        {!loading && !error && filteredRestaurants.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Found {filteredRestaurants.length} Restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
              {filteredRestaurants.length !== allRestaurants.length && (
                <span className="text-gray-500 text-lg ml-2">
                  (filtered from {allRestaurants.length})
                </span>
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRestaurants.map((restaurant, index) => (
                <RestaurantCard key={index} restaurant={restaurant} />
              ))}
            </div>
          </>
        )}

        {/* No results after filtering */}
        {!loading && !error && allRestaurants.length > 0 && filteredRestaurants.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No matches found</h3>
            <p className="text-gray-600">Try adjusting your filters or search for a different area</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !hasSearched && <EmptyState />}
      </main>

      <footer className="py-8 bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Built for Just Eat Takeaway Early Careers Program</p>
          <p className="mt-1">React + TypeScript + Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;