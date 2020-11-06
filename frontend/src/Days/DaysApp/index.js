import React from 'react';
import { Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import PostShow from '../PostShow';
import { getMonth, getYears } from '../../shared/api/routes';
import Calendar from './Calendar';
import useStyles from './useStyles';
import { mapPost } from '../../shared/utils/mappers';

const DaysApp = ({ labels, oauthToken }) => {
  const [years, setYears] = React.useState([]);
  const [posts, setPosts] = React.useState([]);
  const [selectedMonth, setSelectedMonth] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState('');
  const classes = useStyles();

  React.useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = () => {
    getYears()
      .then((response) => {
        setYears(response.data);
      })
      .catch(console.log);
  };

  const fetchMonth = (ym) => {
    getMonth(ym)
      .then((response) => {
        const p = response.data.map(mapPost);

        setPosts(p);
        setSelectedMonth(ym);
      })
      .catch(console.log);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    fetchMonth(e.target.value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item container xs={12} md={5} direction="column">
        <Grid item container>
          <Grid item xs={4} sm={4} className={classes.marginRight}>
            <FormControl fullWidth>
              <InputLabel id="year-label">Year</InputLabel>
              <Select labelId="year-label" value={selectedYear} onChange={handleYearChange}>
                {Object.keys(years).map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={7} sm={6}>
            <FormControl disabled={!selectedYear} fullWidth>
              <InputLabel id="month-label">Month</InputLabel>
              <Select labelId="month-label" value={selectedMonth} onChange={handleMonthChange}>
                {selectedYear &&
                  years[selectedYear].map((m) => (
                    <MenuItem key={m.YM} value={m.YM}>
                      {m.M} ({m.Cnt})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item container direction="column">
          {posts.map((p) => (
            <Grid item key={p.id} className={classes.marginTop}>
              <span id={p.id} style={{ position: 'absolute', top: -100 }} />
              <PostShow
                post={{ ...p, labels: p.labels || [] }}
                oauthToken={oauthToken}
                labels={labels}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} md={7}>
        <Calendar year={selectedYear} month={selectedMonth?.slice(3)} posts={posts} />
      </Grid>
    </Grid>
  );
};

export default DaysApp;
