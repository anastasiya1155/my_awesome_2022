import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from '@material-ui/core';
import SubmitIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Close';
import moment from 'moment';

const PeriodEditRow = ({ period, onSubmit, onCancel }) => {
  const [newPeriodName, setNewPeriodName] = React.useState(period.name || '');
  const [newPeriodStart, setNewPeriodStart] = React.useState(
    period.start || moment().format('YYYY-MM-DD'),
  );
  const [newPeriodEnd, setNewPeriodEnd] = React.useState(period.end || '');
  const [isNewPeriodInProgress, setIsNewPeriodInProgress] = React.useState(
    period.id ? !period.end : false,
  );
  return (
    <TableRow key="new-period">
      <TableCell>
        <TextField
          name="periodName"
          value={newPeriodName}
          onChange={e => setNewPeriodName(e.target.value)}
          label="Name"
        />
      </TableCell>
      <TableCell>
        <TextField
          name="periodStart"
          type="date"
          value={newPeriodStart}
          onChange={e => setNewPeriodStart(e.target.value)}
          label="Start date"
          InputLabelProps={{ shrink: true }}
        />
      </TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <Checkbox
              checked={isNewPeriodInProgress}
              onChange={() => setIsNewPeriodInProgress(!isNewPeriodInProgress)}
            />
          }
          label="Is in progress"
        />
        <br/>
        <TextField
          name="periodEnd"
          type="date"
          value={newPeriodEnd}
          onChange={e => setNewPeriodEnd(e.target.value)}
          label="End date"
          disabled={isNewPeriodInProgress}
          InputLabelProps={{ shrink: true }}
        />
      </TableCell>
      <TableCell>
        <IconButton
          onClick={() =>
            onSubmit({
              newPeriodEnd: isNewPeriodInProgress ? null : newPeriodEnd,
              newPeriodStart,
              newPeriodName,
            })
          }
        >
          <SubmitIcon />
        </IconButton>
        <IconButton onClick={onCancel}>
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

PeriodEditRow.propTypes = {
  period: PropTypes.object,
};

export default PeriodEditRow;
