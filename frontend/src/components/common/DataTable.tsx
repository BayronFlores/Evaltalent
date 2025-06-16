// components/common/DataTable.tsx
import React from 'react';

interface DataTableProps {
  headers: string[];
  data: Array<Record<string, any>>;
  keys: string[];
}

const DataTable: React.FC<DataTableProps> = ({ headers, data, keys }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="py-2 px-4 border">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {keys.map((key, cellIndex) => (
                <td key={cellIndex} className="py-2 px-4 border">
                  {item[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
