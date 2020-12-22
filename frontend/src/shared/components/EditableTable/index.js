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
import Row from './Row';
import EditRow from './EditRow';

const EditableTable = ({
  items,
  columns,
  isAdd,
  onAddSubmit,
  onEditSubmit,
  onDeleteSubmit,
  cancelAdd,
  size,
}) => {
  const [editRow, setEditRow] = React.useState(null);
  return (
    <TableContainer component={Paper}>
      <Table size={size}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={`head-${col.name}`}>{col.label}</TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, i) =>
            i === editRow ? (
              <EditRow
                key={`edit=${item.id}`}
                item={item}
                onSubmit={(values) => onEditSubmit(item.id, values).then(() => setEditRow(null))}
                onCancel={() => setEditRow(null)}
                columns={columns}
              />
            ) : (
              <Row
                key={item.id}
                item={item}
                onEditClicked={() => setEditRow(i)}
                onDeleteSubmit={onDeleteSubmit}
                columns={columns}
              />
            ),
          )}
          {isAdd && (
            <EditRow item={{}} onSubmit={onAddSubmit} onCancel={cancelAdd} columns={columns} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

EditableTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
      start: PropTypes.string,
      end: PropTypes.string,
    }),
  ),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
      type: PropTypes.string,
    }),
  ),
  isAdd: PropTypes.bool,
  onAddSubmit: PropTypes.func,
  onEditSubmit: PropTypes.func,
  onDeleteSubmit: PropTypes.func,
  cancelAdd: PropTypes.func,
  size: PropTypes.string,
};

export default EditableTable;
