import type { Restaurant } from '../types/restaurant';

export function filterRestaurants(
  allRestaurants: Restaurant[],
  selectedCuisines: string[],
  minRating: number,
  apiFilters: any
): Restaurant[] {
  
  let filtered = [...allRestaurants]; // Copy array

  // STEP 1: Filter by cuisine (OR logic - any selected cuisine)
  if (selectedCuisines.length > 0) {
    const allowedIds = new Set<string>();
    
    // Collect all restaurant IDs from selected cuisines
    selectedCuisines.forEach(cuisineKey => {
      const filter = apiFilters[cuisineKey];
      if (filter?.restaurantIds) {
        // restaurantIds can be nested arrays like [[0-99], [100-158]]
        filter.restaurantIds.forEach((ids: any) => {
          if (Array.isArray(ids)) {
            ids.forEach((id: any) => allowedIds.add(String(id)));
          } else {
            allowedIds.add(String(ids));
          }
        });
      }
    });

    // Filter: keep only restaurants with IDs in allowedIds
    filtered = filtered.filter(r => allowedIds.has(r.id));
    
    console.log(`Filtered by cuisines: ${filtered.length} restaurants match`);
  }

  // STEP 2: Filter by minimum rating
  if (minRating > 0) {
    filtered = filtered.filter(r => r.rating >= minRating);
    console.log(`Filtered by rating ≥${minRating}: ${filtered.length} restaurants`);
  }

  // STEP 3: Sort by rating (highest first)
  filtered.sort((a, b) => {
    // Primary: rating (descending)
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    // Secondary: rating count (more reviews = more reliable)
    return b.ratingCount - a.ratingCount;
  });

  // STEP 4: Take top 10 best restaurants
  const top10 = filtered.slice(0, 10);
  console.log(`Returning top ${top10.length} restaurants`);
  
  return top10;
}