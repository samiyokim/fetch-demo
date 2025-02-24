export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface TableProps {
  data: Dog[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  totalPages: number;
  onLoadMore: () => Promise<void>;
  isLoadingMore: boolean;
  selectedBreed: string;
  favorites: Set<string>;
  onToggleFavorite: (dogId: string) => void;
}

import { SortingState } from '@tanstack/react-table';
