import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, IconButton, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditableTable from '../../../shared/components/EditableTable';
import {
  createPeriodAction,
  deletePeriodAction,
  editPeriodAction,
  getPeriodsAction,
} from '../../../shared/api/handlers';
import moment from 'moment';

const PeriodSettings = () => {
  const [isAdd, setIsAdd] = React.useState(false);
  const periods = useSelector((state) => state.post.periods);
  const dispatch = useDispatch();

  React.useEffect(() => {
    getPeriodsAction(dispatch);
  }, [dispatch]);

  const handlePeriodAdd = (values) => {
    const data = {
      End: values.isendInProgress ? null : moment.utc(values.end).format(),
      Start: moment.utc(values.start).format(),
      Name: values.name,
    };
    createPeriodAction(dispatch, data).then(() => {
      setIsAdd(false);
    });
  };

  const handlePeriodDelete = (id) => {
    return deletePeriodAction(dispatch, id);
  };

  const handlePeriodEdit = (id, values) => {
    const data = {
      End: values.isendInProgress ? null : moment.utc(values.end).format(),
      Start: moment.utc(values.start).format(),
      Name: values.name,
    };
    return editPeriodAction(dispatch, { id, data });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">My periods: </Typography>
        <EditableTable
          items={periods}
          columns={[
            { name: 'name', label: 'Name', type: 'string' },
            { name: 'start', label: 'Start date', type: 'date' },
            { name: 'end', label: 'End date', type: 'nullable-date' },
          ]}
          isAdd={isAdd}
          cancelAdd={() => setIsAdd(false)}
          onAddSubmit={handlePeriodAdd}
          onDeleteSubmit={handlePeriodDelete}
          onEditSubmit={handlePeriodEdit}
        />
        <IconButton onClick={() => setIsAdd(true)}>
          <AddIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default PeriodSettings;
