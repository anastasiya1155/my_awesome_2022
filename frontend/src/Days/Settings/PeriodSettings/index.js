import React from 'react';
import moment from 'moment';
import { Grid, IconButton, Typography } from '@material-ui/core';
import { deletePeriod, getPeriods, postPeriod, putPeriod } from '../../../shared/utils/routes';
import AddIcon from '@material-ui/icons/Add';
import PeriodsTable from './PeriodsTable';

const PeriodSettings = () => {
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [isAdd, setIsAdd] = React.useState(false);
  const [periods, setPeriods] = React.useState([]);

  const fetchPeriods = () => {
    getPeriods()
      .then(response => {
        const p = response.data.map(c => ({
          id: c.ID,
          name: c.Name,
          start: moment(c.Start).format('YYYY-MM-DD'),
          end: c.End === '0001-01-01T00:00:00Z' ? null : moment(c.End).format('YYYY-MM-DD'),
        }));

        setPeriods(p);
      })
      .catch(console.log);
  };

  React.useEffect(() => {
    fetchPeriods();
  }, []);

  const handlePeriodAdd = values => {
    postPeriod({
      Name: values.newPeriodName,
      Start: values.newPeriodStart,
      End: values.newPeriodEnd,
    })
      .then(() => {
        fetchPeriods();
        setIsAdd(false);
      })
      .catch(console.log);
  };

  const handlePeriodDelete = () => {
    return deletePeriod(itemToDelete)
      .then(() => {
        fetchPeriods();
        handleClose();
      })
      .catch(console.log);
  };

  const handleClose = () => {
    setItemToDelete(null);
  };

  const handlePeriodEdit = (id, data) => {
    return putPeriod(id, data)
      .then(() => {
        fetchPeriods();
        handleClose();
      })
      .catch(console.log);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography>My periods: </Typography>
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
