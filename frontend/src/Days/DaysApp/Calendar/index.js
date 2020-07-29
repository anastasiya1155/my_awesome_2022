import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import Table from '../../../shared/components/Table';
import { getCalendar } from '../../../shared/utils/calendar';
import CalendarCell from './Cell';

const columns = [
  { title: 'Mon', field: 0, render: CalendarCell },
  { title: 'Tue', field: 1, render: CalendarCell },
  { title: 'Wed', field: 2, render: CalendarCell },
  { title: 'Thu', field: 3, render: CalendarCell },
  { title: 'Fri', field: 4, render: CalendarCell },
  { title: 'Sat', field: 5, render: CalendarCell },
  { title: 'Sun', field: 6, render: CalendarCell },
];

const Calendar = ({ year, month, posts }) => {
  const [data, setData] = React.useState([]);
  const yearToDisplay = year || new Date().getFullYear();
  const monthToDisplay = month || new Date().getMonth() + 1;

  React.useEffect(() => {
    const calendar = getCalendar(monthToDisplay, yearToDisplay);
    const dataToSet = calendar.map(week => {
      return week.map(d => {
        const post = posts.find(post => moment(post?.date).format('D') === d?.date?.toString());
        return { ...d, ...post, labels: post?.labels, isEmpty: !post };
      });
    });
    setData(dataToSet);
  }, [year, month, posts]);

  return (
    <div>
      <Typography variant="h6">
        {yearToDisplay}-{monthToDisplay}
      </Typography>
      <Table columns={columns} data={data} size="small" />
    </div>
  );
};

Calendar.propTypes = {
  year: PropTypes.string,
  month: PropTypes.string,
};

export default Calendar;
