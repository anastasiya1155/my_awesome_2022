import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import PeriodRow from './PeriodRow';
import PeriodEditRow from './PeriodEditRow';

const PeriodsTable = ({ periods, isAdd, onAddSubmit, onEditSubmit, onDeleteSubmit, cancelAdd }) => {
  const [editRow, setEditRow] = React.useState(null);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {periods.map((period, i) =>
            i === editRow ? (
              <PeriodEditRow
                period={period}
                onSubmit={values => onEditSubmit(period.id, values).then(() => setEditRow(null))}
                onCancel={() => setEditRow(null)}
              />
            ) : (
              <PeriodRow
                period={period}
                onEditClicked={() => setEditRow(i)}
                onDeleteSubmit={onDeleteSubmit}
              />
            ),
          )}
          {isAdd && <PeriodEditRow period={{}} onSubmit={onAddSubmit} onCancel={cancelAdd} />}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

PeriodsTable.propTypes = {
  periods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      start: PropTypes.string,
      end: PropTypes.string,
    }),
  ),
};

export default PeriodsTable;
