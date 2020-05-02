import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, TableCell, TableRow, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

const PeriodRow = ({ period, onEditClicked, onDeleteSubmit }) => {
  const [isDelete, setIsDelete] = React.useState(false);
  return isDelete ? (
    <TableRow>
      <TableCell colSpan={4}>
        <Button fullWidth variant="contained" onClick={() => onDeleteSubmit().then(() => setIsDelete(false))}>
          DELETE
        </Button>
      </TableCell>
    </TableRow>
  ) : (
    <TableRow key={period.id}>
      <TableCell>{period.name}</TableCell>
      <TableCell>{period.start}</TableCell>
      <TableCell>{period.end}</TableCell>
      <TableCell>
        <IconButton onClick={() => setIsDelete(true)}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={onEditClicked}>
          <EditIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

PeriodRow.propTypes = {
  period: PropTypes.object,
};

export default PeriodRow;
