import type { Restaurant } from '../types/restaurant';

const API_BASE_URL = 'http://localhost:3001/api/restaurants';

export async function fetchRestaurantByPostcode(postcode: string): Promise<{
  restaurants: Restaurant[]; // Property 1: Array of restaurants
  filters: any; // Property 2: Filters object
}> {
  try {
    // 'g' flag= global find all matches, not just first
    // \s whitespace character (space, tab, newline, etc...)
    const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase();

    if (!cleanPostcode || cleanPostcode.length < 5) {
      throw new Error('Please enter a valid UK postcode');
    }

    console.log('Fetching from backend proxy:', `${API_BASE_URL}/${cleanPostcode}`);

    const response = await fetch(`${API_BASE_URL}/${cleanPostcode}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No restaurants found for this postcode');
      }
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    console.log('Total restaurants:', data.restaurants?.length);

    // Transform ALL restaurants (don't limit to 10 yet!)
    const transformedRestaurants: Restaurant[] = (data.restaurants || []).map((r: any) => ({
      id: String(r.id),  
      name: r.name || 'Unknown',
      cuisines: r.cuisines?.map((c: any) => c.name).join(', ') || 'Not specified',
      rating: r.rating?.starRating || 0,
      ratingCount: r.rating?.count || 0,
      address: formatAddress(r.address),
      latitude: r.address?.location?.coordinates?.[1],
      longitude: r.address?.location?.coordinates?.[0]
    }));

    console.log('Returning', transformedRestaurants.length, 'restaurants');

    // Return restaurants AND filters
    return {
      restaurants: transformedRestaurants,
      filters: data.filters || {}
    };

  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend. Make sure server is running.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

function formatAddress(address: any): string {
  if (!address) return 'Address not available';
  
  const parts = [
    address.firstLine,
    address.city,
    address.postcode
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(', ') : 'Address not available';
}