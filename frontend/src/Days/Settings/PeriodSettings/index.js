import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, IconButton, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PeriodsTable from './PeriodsTable';
import {
  createPeriodAction,
  deletePeriodAction,
  editPeriodAction,
  getPeriodsAction,
} from '../../../shared/api/handlers';

const PeriodSettings = () => {
  const [isAdd, setIsAdd] = React.useState(false);
  const periods = useSelector(state => state.post.periods);
  const dispatch = useDispatch();

  React.useEffect(() => {
    getPeriodsAction(dispatch);
  }, [dispatch]);

  const handlePeriodAdd = values => {
    createPeriodAction(dispatch, values).then(() => {
      setIsAdd(false);
    });
  };

  const handlePeriodDelete = id => {
    return deletePeriodAction(dispatch, id);
  };

  const handlePeriodEdit = (id, data) => {
    return editPeriodAction(dispatch, { id, data });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">My periods: </Typography>
        <PeriodsTable
          periods={periods}
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
