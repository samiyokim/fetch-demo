import { describe, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import View from '../View';

// Mock the useTable hook
vi.mock('../../hooks/useTable', () => ({
  useTable: () => ({
    dogs: [],
    allBreeds: ['Labrador', 'Poodle'],
    totalPages: 1,
    isLoadingMore: false,
    searchDogs: vi.fn().mockResolvedValue([]),
    fetchBreeds: vi.fn(() => new Promise(resolve => setTimeout(() => resolve([]), 100))),
    loadMore: vi.fn().mockResolvedValue([])
  })
}));

// Mock the api calls
vi.mock('../../utils/axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} })
  }
}));

describe('View Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logout button after loading', async () => {
    render(
      <BrowserRouter>
        <View />
      </BrowserRouter>
    );

    // First, verify loading state
    // const loadingElement = screen.getByLabelText('Loading');
    // expect(loadingElement).toBeInTheDocument();

    // Then wait for content to load
    const logout = await screen.findByText('Logout');
    // expect(breedSelector).toBeInTheDocument();
    expect(logout).toBeInTheDocument();
  });
});
