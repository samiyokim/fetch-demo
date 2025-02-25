import { OnChangeFn, SortingState } from '@tanstack/react-table';

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
}

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
  onSortingChange: OnChangeFn<SortingState>;
  totalPages: number;
  onLoadMore: () => Promise<void>;
  isLoadingMore: boolean;
  selectedBreed: string;
  favorites: Set<string>;
  onToggleFavorite: (dogId: string) => void;
}
