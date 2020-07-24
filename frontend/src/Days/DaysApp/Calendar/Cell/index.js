import React from 'react';
import PostLabel from '../../../PostLabel';
import { mapLabel } from '../../../../shared/utils/mappers';
import useStyles from './useStyles';

const CalendarCell = (row, col) => {
  const data = row[col.field];
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.date}>{data.date}</div>
      {!data.isEmpty && (
        <div>
          {data.labels?.map(l => (
            <PostLabel label={mapLabel(l)} isActive noMargin />
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarCell;
