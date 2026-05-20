import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('renders search input and button', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    expect(screen.getByPlaceholderText(/enter uk postcode/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearch with postcode when submitted', async () => {
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/enter uk postcode/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'EC4M 7RF');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('EC4M 7RF');
  });

  it('trims whitespace from postcode', async () => {
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/enter uk postcode/i);
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, '  EC4M 7RF  ');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('EC4M 7RF');
  });

  it('disables button when loading', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);

    const button = screen.getByRole('button', { name: /searching/i });
    expect(button).toBeDisabled();
  });

  it('does not submit empty postcode', async () => {
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('clicking example postcode fills input', async () => {
    const user = userEvent.setup();
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />);

    const exampleButton = screen.getByRole('button', { name: 'EC4M 7RF' });
    await user.click(exampleButton);

    const input = screen.getByPlaceholderText(/enter uk postcode/i);
    expect(input).toHaveValue('EC4M 7RF');
  });
});