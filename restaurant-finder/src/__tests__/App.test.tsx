import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as api from '../services/restaurantApi';

// Mock the API
vi.mock('../services/restaurantApi');

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state initially', () => {
    render(<App />);
    
    expect(screen.getByText('🍕 Restaurant Finder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter uk postcode/i)).toBeInTheDocument();
  });

  it('shows loading spinner when searching', async () => {
    // Mock API to delay response
    vi.spyOn(api, 'fetchRestaurantByPostcode').mockImplementation(
      () => new Promise(() => {}) // Never resolves (stays loading)
    );

    render(<App />);
    
    const input = screen.getByPlaceholderText(/enter uk postcode/i);
    const button = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'EC4M 7RF');
    await userEvent.click(button);
    
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

  it('displays restaurants after successful search', async () => {
    // Mock successful API response
    const mockData = {
      restaurants: [
        {
          id: '1',
          name: 'Pizza Express',
          cuisines: 'Italian, Pizza',
          rating: 4.5,
          ratingCount: 234,
          address: '123 Test St, London, EC4M 7RF'
        },
        {
          id: '2',
          name: 'Curry House',
          cuisines: 'Indian, Curry',
          rating: 4.0,
          ratingCount: 100,
          address: '456 Main St, London, SW1A 1AA'
        }
      ],
      filters: {
        pizza: {
          displayName: 'Pizza',
          group: 'cuisine',
          restaurantIds: [['1']]
        },
        indian: {
          displayName: 'Indian',
          group: 'cuisine',
          restaurantIds: [['2']]
        }
      }
    };

    vi.spyOn(api, 'fetchRestaurantByPostcode').mockResolvedValue(mockData);

    render(<App />);
    
    const input = screen.getByPlaceholderText(/enter uk postcode/i);
    const button = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'EC4M 7RF');
    await userEvent.click(button);
    
    // Wait for restaurants to appear
    await waitFor(() => {
      expect(screen.getByText('Pizza Express')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Curry House')).toBeInTheDocument();
    expect(screen.getByText('Italian, Pizza')).toBeInTheDocument();
  });

  it('displays error message on API failure', async () => {
    vi.spyOn(api, 'fetchRestaurantByPostcode').mockRejectedValue(
      new Error('No restaurants found for this postcode')
    );

    render(<App />);
    
    const input = screen.getByPlaceholderText(/enter uk postcode/i);
    const button = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'INVALID');
    await userEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/no restaurants found/i)).toBeInTheDocument();
    });
  });

  it('filters restaurants by cuisine', async () => {
    const mockData = {
      restaurants: [
        {
          id: '1',
          name: 'Pizza Express',
          cuisines: 'Italian, Pizza',
          rating: 4.5,
          ratingCount: 234,
          address: '123 Test St, London, EC4M 7RF'
        },
        {
          id: '2',
          name: 'Curry House',
          cuisines: 'Indian, Curry',
          rating: 4.0,
          ratingCount: 100,
          address: '456 Main St, London, SW1A 1AA'
        }
      ],
      filters: {
        pizza: {
          displayName: 'Pizza',
          group: 'cuisine',
          restaurantIds: [['1']]
        },
        indian: {
          displayName: 'Indian',
          group: 'cuisine',
          restaurantIds: [['2']]
        }
      }
    };

    vi.spyOn(api, 'fetchRestaurantByPostcode').mockResolvedValue(mockData);

    render(<App />);
    
    const input = screen.getByPlaceholderText(/enter uk postcode/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'EC4M 7RF');
    await userEvent.click(searchButton);
    
    // Wait for restaurants to load
    await waitFor(() => {
      expect(screen.getByText('Pizza Express')).toBeInTheDocument();
    });
    
    // Click Pizza filter
    const pizzaFilter = screen.getByRole('button', { name: 'Pizza' });
    await userEvent.click(pizzaFilter);
    
    // Should still show Pizza Express
    expect(screen.getByText('Pizza Express')).toBeInTheDocument();
    
    // Curry House should be filtered out (not visible)
    expect(screen.queryByText('Curry House')).not.toBeInTheDocument();
  });
});