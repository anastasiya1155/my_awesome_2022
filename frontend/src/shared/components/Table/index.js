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

const TransactionsTable = ({ columns, data, size }) => {
  return (
    <TableContainer component={Paper}>
      <Table size={size}>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell>{col.title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              {columns.map(col => (
                <TableCell>{col.render ? col.render(row, col) : row[col.field]}</TableCell>
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
};

export default TransactionsTable;
