import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from '@material-ui/core';

const TransactionsTable = ({ columns, data, size, cellStyles }) => {
  return (
    <TableContainer component={Paper}>
      <Table size={size}>
        <TableHead>
          <TableRow>
            {columns.map((col, i) => (
              <TableCell key={`head-${i}`}>{col.title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow
              key={row.id || row.category || row.reduce((prev, cur) => prev + cur.date || 0, 0)}
            >
              {columns.map((col, i) => (
                <TableCell key={`body-${i}`}>
                  {col.render ? col.render(row, col, cellStyles) : row[col.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TransactionsTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  size: PropTypes.string,
  cellStyles: PropTypes.object,
};

export default TransactionsTable;
