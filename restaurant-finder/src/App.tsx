// create state variables that can change over time and cause the component to re-render when they do
import { useState } from 'react';
// import the function that will fetch restaurant data from the API
import { fetchRestaurantByPostcode } from './services/restaurantApi';
// import the function that will filter the restaurant data based on cuisine and rating
import { filterRestaurants } from './utils/filterRestaurants';  
// import your components
import { SearchBar } from './components/SearchBar';
import { Filters } from './components/Filters';
import { RestaurantCard } from './components/RestaurantCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { EmptyState } from './components/EmptyState';
// import the Restaurant type for TypeScript type checking
import type { Restaurant } from './types/restaurant';

//TypeScript interface - it defines the shape of filter data.
//TypeScript will check that filters match this structure
//Prevents bugs (can't accidentally pass wrong data type) 
export interface FilterState {
  selectedCuisines: string[];
  minRating: number;
}

function App() {
  // Stores ALL restaurants from API (unfiltered), Starts as empty array []
  // why separated? - we want to keep the original data from the API so we can re-apply filters without needing to fetch again
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  //Stores filter options from the API (e.g. available cuisines, rating ranges) - starts as empty object {}
  const [apiFilters, setApiFilters] = useState<any>({});
  // filtered restaurants (by rating or cuisine)
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  // loading state (true when fetching data, false otherwise)
  const [loading, setLoading] = useState(false);
  //Stores error message if API fails, starts as null (no error)
  const [error, setError] = useState<string | null>(null);
  // Tracks if user has searched yet (used to show empty state before first search), starts as false
  const [hasSearched, setHasSearched] = useState(false);

  // async = this function does async operations (API calls), Takes postcode as parameter (string type)
  const handleSearch = async (postcode: string) => {
    // Show loading spinner and reset error state when search starts
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // await = wait for API call to finish
      // fetchRestaurantByPostcode(postcode) = call your API service with the postcode
      // destructure the response to get restaurants and filters
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
      setLoading(false); //ensure UI didn't get stuck in loading state if API call fails
    }
  };

  // This function is called when filters change (e.g. user selects a cuisine or changes rating)
  const handleFilterChange = (filterState: FilterState) => {
    const filtered = filterRestaurants(
      allRestaurants,
      filterState.selectedCuisines,
      filterState.minRating,
      apiFilters
    );
    
    setFilteredRestaurants(filtered);
  };

  // This function is called when user clicks "Retry" button after an error
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