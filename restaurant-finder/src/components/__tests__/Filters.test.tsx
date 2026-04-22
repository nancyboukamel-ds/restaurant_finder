import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';  // ← ADD fireEvent
import userEvent from '@testing-library/user-event';
import { Filters } from '../Filters';
import type { Restaurant } from '../../types/restaurant';

describe('Filters', () => {
  const mockRestaurants: Restaurant[] = [
    { 
      id: '1',
      name: 'Pizza Place', 
      cuisines: 'Italian, Pizza', 
      rating: 4.5, 
      ratingCount: 100,
      address: '123 St' 
    },
    { 
      id: '2',
      name: 'Curry House', 
      cuisines: 'Indian, Curry', 
      rating: 4.0, 
      ratingCount: 50,
      address: '456 St' 
    }
  ];

  const mockApiFilters = {
    pizza: {
      displayName: 'Pizza',
      group: 'cuisine',
      restaurantIds: [['1']]
    },
    indian: {
      displayName: 'Indian',
      group: 'cuisine',
      restaurantIds: [['2']]
    },
    breakfast: {
      displayName: 'Breakfast',
      group: 'cuisine',
      restaurantIds: [['3']]
    }
  };

  it('renders filters heading', () => {
    const mockOnChange = vi.fn();
    render(
      <Filters 
        allRestaurants={mockRestaurants} 
        apiFilters={mockApiFilters}
        onFilterChange={mockOnChange} 
      />
    );
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('displays unique cuisine chips', () => {
    const mockOnChange = vi.fn();
    render(
      <Filters 
        allRestaurants={mockRestaurants} 
        apiFilters={mockApiFilters}
        onFilterChange={mockOnChange} 
      />
    );
    
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Indian')).toBeInTheDocument();
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
  });

  it('calls onFilterChange when cuisine is selected', async () => {
    const mockOnChange = vi.fn();
    render(
      <Filters 
        allRestaurants={mockRestaurants} 
        apiFilters={mockApiFilters}
        onFilterChange={mockOnChange} 
      />
    );
    
    const pizzaButton = screen.getByText('Pizza');
    await userEvent.click(pizzaButton);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      selectedCuisines: ['pizza'],
      minRating: 0
    });
  });

  it('allows multiple cuisine selection', async () => {
    const mockOnChange = vi.fn();
    render(
      <Filters 
        allRestaurants={mockRestaurants} 
        apiFilters={mockApiFilters}
        onFilterChange={mockOnChange} 
      />
    );
    
    await userEvent.click(screen.getByText('Pizza'));
    await userEvent.click(screen.getByText('Indian'));
    
    expect(mockOnChange).toHaveBeenCalledWith({
      selectedCuisines: ['pizza', 'indian'],
      minRating: 0
    });
  });

  it('shows clear filters button when filters are active', async () => {
    const mockOnChange = vi.fn();
    render(
      <Filters 
        allRestaurants={mockRestaurants} 
        apiFilters={mockApiFilters}
        onFilterChange={mockOnChange} 
      />
    );
    
    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
    
    await userEvent.click(screen.getByText('Pizza'));
    
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('clears all filters when clear button clicked', async () => {
    const mockOnChange = vi.fn();
    render(
      <Filters 
        allRestaurants={mockRestaurants} 
        apiFilters={mockApiFilters}
        onFilterChange={mockOnChange} 
      />
    );
    
    await userEvent.click(screen.getByText('Pizza'));
    await userEvent.click(screen.getByText('Clear Filters'));
    
    expect(mockOnChange).toHaveBeenCalledWith({
      selectedCuisines: [],
      minRating: 0
    });
  });

  it('updates rating filter when slider changes', () => {
    const mockOnChange = vi.fn();
    render(
      <Filters 
        allRestaurants={mockRestaurants} 
        apiFilters={mockApiFilters}
        onFilterChange={mockOnChange} 
      />
    );
    
    const slider = screen.getByRole('slider');
    
    // Use fireEvent for range inputs (sliders)
    fireEvent.change(slider, { target: { value: '4' } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      selectedCuisines: [],
      minRating: 4
    });
  });
});