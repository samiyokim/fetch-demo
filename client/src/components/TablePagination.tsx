import React from 'react';
import { Table } from '@tanstack/react-table';

interface TablePaginationProps {
  table: Table<any>;
  totalPages: number;
  isLoadingMore: boolean;
  onLoadMore: () => Promise<void>;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  table,
  totalPages,
  isLoadingMore,
  onLoadMore,
}) => {
  const handleNext = () => {
    const currentPage = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const totalItems = table.getPrePaginationRowModel().rows.length;

    if (currentPage * pageSize >= totalItems - pageSize * 2) {
      onLoadMore();
    }
    table.nextPage();
  };

  return (
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
  );
};

export default TablePagination;
