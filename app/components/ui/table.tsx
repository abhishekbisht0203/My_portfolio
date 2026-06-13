import React from 'react';

type Props = React.HTMLAttributes<HTMLTableElement> & { children?: React.ReactNode };

export const Table: React.FC<Props> = ({ children, className = '', ...props }) => (
  <table className={`w-full ${className}`} {...props}>
    {children}
  </table>
);

export const TableHeader: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <thead className={className}>{children}</thead>
);

export const TableBody: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <tbody className={className}>{children}</tbody>
);

export const TableRow: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <tr className={className}>{children}</tr>
);

export const TableHead: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th className={`text-left px-2 py-3 ${className}`}>{children}</th>
);

export const TableCell: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td className={`px-2 py-2 ${className}`}>{children}</td>
);

export default Table;
