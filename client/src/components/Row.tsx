import React from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { Dog } from '../types/dog';

interface RowProps {
  row: Row<Dog>;
}

const TableRow: React.FC<RowProps> = ({ row }) => {
  return (
    <tr key={row.id}>
      {row.getVisibleCells().map(cell => (
        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
