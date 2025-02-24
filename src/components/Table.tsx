import React, { useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import TableRow from './Row';
import TablePagination from './TablePagination';
import { createColumns } from './columns';
import { TableProps } from '../utils/types';

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
  const columns = React.useMemo(
    () => createColumns(favorites, onToggleFavorite),
    [favorites, onToggleFavorite]
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
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
      <TablePagination
        table={table}
        totalPages={totalPages}
        isLoadingMore={isLoadingMore}
        onLoadMore={onLoadMore}
      />
    </div>
  );
};

export default Table;
