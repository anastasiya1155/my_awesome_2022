import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Grid, Hidden } from '@material-ui/core';
import { Notifications } from '@material-ui/icons';

const Reminder = ({ reminder, history }) => {
  return reminder.length > 0 ? (
    <>
      <Hidden smUp>
        <Badge
          color="error"
          badgeContent={reminder.length}
          onClick={() => history.push('/last-time')}
        >
          <Notifications />
        </Badge>
      </Hidden>
      <Hidden xsDown>
        <Grid container>
          {reminder.map(lt => (
            <Grid item key={lt.id}>
              <b> !!! {lt.body} !!! </b>
            </Grid>
          ))}
        </Grid>
      </Hidden>
    </>
  ) : null;
};

Reminder.propTypes = {
  reminder: PropTypes.array,
  history: PropTypes.object,
};

export default Reminder;
