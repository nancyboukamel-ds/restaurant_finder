import { describe, it, expect } from 'vitest';
import { fetchRestaurantByPostcode } from '../../services/restaurantApi';

describe('restaurantApi', () => {
  it('should validate postcode format', async () => {
    // Test empty postcode
    await expect(fetchRestaurantByPostcode('')).rejects.toThrow('valid UK postcode');
    
    // Test too short postcode
    await expect(fetchRestaurantByPostcode('ABC')).rejects.toThrow('valid UK postcode');
  });
});