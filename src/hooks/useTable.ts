import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { Dog, SearchParams } from '../utils/types';

export const useTable = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [allBreeds, setAllBreeds] = useState<string[]>([]);
  const [nextSearch, setNextSearch] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();

  const searchDogs = async (searchParams: SearchParams) => {
    try {
      const searchResponse = await api.get('/dogs/search', { params: searchParams });
      setTotalPages(Math.ceil(searchResponse.data.total/10) || 0);
      const resultIds = searchResponse.data.resultIds || [];
      setNextSearch(searchResponse.data.next || null);

      if (resultIds.length > 0) {
        const batchSize = 100;
        const batches = resultIds.reduce((acc: string[][], curr: string, i: number) => {
          const batchIndex = Math.floor(i / batchSize);
          if (!acc[batchIndex]) acc[batchIndex] = [];
          acc[batchIndex].push(curr);
          return acc;
        }, []);

        const allDogs = [];
        for (const batch of batches) {
          const dogsResponse = await api.post('/dogs', batch);
          allDogs.push(...dogsResponse.data);
        }
        setDogs(allDogs);
      } else {
        setDogs([]);
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        navigate('/signin');
      }
      throw error;
    }
  };

  const fetchBreeds = useMemo(() => async () => {
    try {
      const response = await api.get('/dogs/breeds');
      setAllBreeds(response.data);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        navigate('/signin');
      }
    }
  }, [navigate]);

  const loadMore = async () => {
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
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    dogs,
    allBreeds,
    totalPages,
    isLoadingMore,
    searchDogs,
    fetchBreeds,
    loadMore
  };
};
