import React from 'react';
import PostLabel from '../../../PostLabel';
import { mapLabel } from '../../../../shared/utils/mappers';

const CalendarCell = (row, col, classes) => {
  const data = row[col.field];
  return (
    <div
      className={classes.container}
      onClick={() => {
        window.location.hash = `#${data.id}`;
      }}
    >
      <div className={classes.date}>{data.date}</div>
      {!data.isEmpty && (
        <div>
          {data.labels?.map((l) => (
            <PostLabel key={l.ID} label={mapLabel(l)} isActive noMargin />
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarCell;
