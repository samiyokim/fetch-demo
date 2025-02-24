import React, { useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import DogImage from './DogImage';
import TableRow from './Row';
import { HeartFilledIcon } from '@radix-ui/react-icons';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface TableProps {
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

const Table: React.FC<TableProps> = ({
  data,
  sorting,
  onSortingChange,
  totalPages,
  onLoadMore,
  isLoadingMore,
  selectedBreed,
  favorites,
  onToggleFavorite,
}) => {
  const columns = React.useMemo<ColumnDef<Dog>[]>(
    () => [
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
    ],
    [favorites]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange,
    state: {
      sorting,
    },
    autoResetPageIndex: false,
  });

  function handleNext() {
    const currentPage = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const totalItems = data.length;

    console.log(currentPage, pageSize, totalItems);

    if (currentPage * pageSize >= totalItems - pageSize*2) {
      onLoadMore();
    }
    table.nextPage();
  }

  useEffect(() => {
    table.setPageIndex(0);
  }, [table, selectedBreed]);

  return (
    <div className="mt-6">
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          {isLoadingMore ? (
            <span className="text-gray-500">Loading more...</span>
          ) : (
            `Page ${table.getState().pagination.pageIndex + 1} of ${totalPages}`
          )}
        </span>
        <button
          onClick={handleNext}
          disabled={!table.getCanNextPage() || isLoadingMore}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
