import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchSorter } from "match-sorter";
import { SortingState } from '@tanstack/react-table';
import api from '../utils/axios';
import Table from './Table';
import Breeds from './Breeds';

interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
}

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const View: React.FC = () => {
  const [allBreeds, setAllBreeds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [nextSearch, setNextSearch] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    breeds: [],
    size: 100,
    sort: 'breed:asc'
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBreeds = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/dogs/breeds');
        setAllBreeds(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/signin');
        }
        console.error('Error fetching dog breeds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreeds();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const searchDogs = async () => {
      try {
        let searchResponse;
        if (nextSearch) {
          searchResponse = await api.get(nextSearch);
        } else {
          searchResponse = await api.get('/dogs/search', {
            params: searchParams
          });
          setTotalPages(Math.ceil(searchResponse.data.total/10) || 0);
        }
        const resultIds = searchResponse.data.resultIds || [];
        setNextSearch(searchResponse.data.next || null);
        console.log('resultIds', searchResponse.data);

        if (resultIds.length > 0) {
          // Fetch dog details in batches of 30
          const batchSize = 100;
          const batches = [];
          for (let i = 0; i < resultIds.length; i += batchSize) {
            batches.push(resultIds.slice(i, i + batchSize));
          }

          const allDogs = [];
          for (const batch of batches) {
            const dogsResponse = await api.post('/dogs', batch);
            allDogs.push(...dogsResponse.data);
          }
          
          setDogs(allDogs);
        } else {
          setDogs([]);
        }
      } catch (error) {
        console.error('Error searching dogs:', error);
        if (error.response?.status === 401) {
          navigate('/signin');
        }
      }
    };

    searchDogs();
  }, [searchParams, navigate]);

  const loadMoreDogs = async () => {
    if (!nextSearch || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const searchResponse = await api.get(nextSearch);
      const resultIds = searchResponse.data.resultIds || [];
      setNextSearch(searchResponse.data.next || null);

      if (resultIds.length > 0) {
        const dogsResponse = await api.post('/dogs', resultIds);
        setDogs(prev => [...prev, ...dogsResponse.data]);
      }
    } catch (error) {
      console.error('Error loading more dogs:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleBreedSelect = (breed: string) => {
    setSearchParams(prev => ({
      ...prev,
      breeds: [breed]
    }));
    setNextSearch(null);
  };


  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Breeds
              selectedBreed={searchParams.breeds?.[0] || ""}
              onBreedSelect={handleBreedSelect}
              allBreeds={allBreeds}
            />

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          
          {dogs.length > 0 && (
            <Table 
              data={dogs}
              sorting={sorting}
              onSortingChange={setSorting}
              totalPages={totalPages}
              onLoadMore={loadMoreDogs}
              hasNextPage={Boolean(nextSearch)}
              isLoadingMore={isLoadingMore}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default View;
