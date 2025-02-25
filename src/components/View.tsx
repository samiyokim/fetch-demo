import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SortingState } from '@tanstack/react-table';
import api from '../utils/axios';
import Table from './Table';
import Breeds from './Breeds';
import DogImage from './DogImage';
import { useTable } from '../hooks/useTable';
import { Dog, SearchParams } from '../utils/types';

const View: React.FC = () => {
  const navigate = useNavigate();
  const { dogs, allBreeds, totalPages, isLoadingMore, searchDogs, fetchBreeds, loadMore } = useTable();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    breeds: [],
    size: 100,
    sort: 'breed:asc'
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [matchResult, setMatchResult] = useState<Dog | null>(null);

  useEffect(() => {
    if (fetchBreeds) {
      fetchBreeds().catch(console.error).finally(() => setIsLoading(false));
    }
  }, [fetchBreeds]);

  useEffect(() => {
    if (searchDogs) {
      searchDogs(searchParams).catch(console.error);
    }
  }, [searchParams]);

  const handleBreedSelect = (breed: string) => {
    setSearchParams(() => ({
      ...searchParams,
      breeds: [breed]
    }));
  };

  const handleToggleFavorite = (dogId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(dogId)) {
        newFavorites.delete(dogId)
      } else {
        newFavorites.add(dogId)
      }
      return newFavorites;
    });
  };

  const handleGenerateMatch = async () => {
    if (favorites.size === 0) return;
    
    try {
      const response = await api.post('/dogs/match', Array.from(favorites));
      if (response.data.match) {
        const matchDog = await api.post('/dogs', [response.data.match]);
        setMatchResult(matchDog.data[0]);
      }
    } catch (error) {
      console.error('Error generating match:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div 
          role="status"
          aria-label="Loading"
          className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Breeds
              selectedBreed={searchParams.breeds?.[0] || ""}
              onBreedSelect={handleBreedSelect}
              allBreeds={allBreeds}
            />
            {favorites.size > 0 && (
              <button
                onClick={handleGenerateMatch}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Generate Match ({favorites.size})
              </button>
            )}
          </div>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        
        {matchResult && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h2 className="text-lg font-semibold mb-2">Match Found!</h2>
            <div className="flex items-center gap-4">
              <DogImage src={matchResult.img} alt={matchResult.name} />
              <div>
                <p className="font-medium">{matchResult.name}</p>
                <p className="text-sm text-gray-600">{matchResult.breed}</p>
              </div>
            </div>
          </div>
        )}
        
        {dogs.length > 0 && (
          <Table 
            data={dogs}
            sorting={sorting}
            onSortingChange={setSorting}
            totalPages={totalPages}
            onLoadMore={loadMore}
            isLoadingMore={isLoadingMore}
            selectedBreed={searchParams.breeds?.[0] || ""}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>
    </div>
  );
};

export default View;
