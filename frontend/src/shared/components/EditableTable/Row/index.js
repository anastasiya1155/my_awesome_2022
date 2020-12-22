import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, TableCell, TableRow, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

const Row = ({ item, onEditClicked, onDeleteSubmit, columns }) => {
  const [isDelete, setIsDelete] = React.useState(false);
  return isDelete ? (
    <TableRow>
      <TableCell colSpan={2}>
        <Button fullWidth variant="contained" onClick={() => setIsDelete(false)}>
          CANCEL
        </Button>
      </TableCell>
      <TableCell colSpan={2}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => onDeleteSubmit(item.id).then(() => setIsDelete(false))}
        >
          DELETE
        </Button>
      </TableCell>
    </TableRow>
  ) : (
    <TableRow key={item.id}>
      {columns.map((col) => (
        <TableCell key={`show-${col.name}`}>
          {col.render ? col.render(item, col) : item[col.name]}
        </TableCell>
      ))}
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

Row.propTypes = {
  item: PropTypes.object,
};

export default Row;
