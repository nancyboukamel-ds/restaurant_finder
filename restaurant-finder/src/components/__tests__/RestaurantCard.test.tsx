import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RestaurantCard } from '../RestaurantCard';
import type { Restaurant } from '../../types/restaurant';

describe('RestaurantCard', () => {
  const mockRestaurant: Restaurant = {
    id: '285749',
    name: 'Pizza Express',
    cuisines: 'Italian, Pizza',
    rating: 4.5,
    ratingCount: 234,
    address: '125 High Holborn, London, EC4M 7RF'
  };

  it('should display restaurant information', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Pizza Express')).toBeInTheDocument();
    expect(screen.getByText('Italian, Pizza')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText(/125 High Holborn/i)).toBeInTheDocument();  // ✅ FIXED
  });

  it('displays restaurant name', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Pizza Express')).toBeInTheDocument();
  });

  it('displays cuisines', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Italian, Pizza')).toBeInTheDocument();
  });

  it('displays rating with star emoji', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('displays address', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText(/125 High Holborn/i)).toBeInTheDocument();
  });

  it('handles rating of 0', () => {
    const zeroRatingRestaurant = { ...mockRestaurant, rating: 0 };
    render(<RestaurantCard restaurant={zeroRatingRestaurant} />);
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  it('handles non-number rating gracefully', () => {
    const invalidRestaurant = { ...mockRestaurant, rating: NaN };
    render(<RestaurantCard restaurant={invalidRestaurant} />);
    // Should not crash
    expect(screen.getByText('Pizza Express')).toBeInTheDocument();
  });
});