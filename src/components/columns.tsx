import { ColumnDef } from '@tanstack/react-table';
import { Dog } from '../utils/types';
import DogImage from './DogImage';
import { HeartFilledIcon } from '@radix-ui/react-icons';

export const createColumns = (
  favorites: Set<string>,
  onToggleFavorite: (dogId: string) => void
): ColumnDef<Dog>[] => [
  {
    accessorKey: 'breed',
    header: 'Breed',
    sortDescFirst: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    sortDescFirst: false,
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'zip_code',
    header: 'Zip Code',
    sortDescFirst: false,
  },
  {
    accessorKey: 'img',
    header: 'Image',
    cell: info => <DogImage src={info.getValue() as string} alt="dog" />,
    enableSorting: false,
  },
  {
    id: 'favorite',
    header: 'Favorite',
    cell: info => (
      <button
        onClick={() => onToggleFavorite(info.row.original.id)}
        className={`p-2 rounded-full hover:bg-gray-100 ${
          favorites.has(info.row.original.id) ? 'text-red-500' : 'text-gray-400'
        }`}
      >
        <HeartFilledIcon className="w-5 h-5" />
      </button>
    ),
  },
];
