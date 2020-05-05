import React, { Component } from 'react';
import { Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import PostShow from '../PostShow';
import { getLabels, getMonth, getYears } from '../../shared/utils/routes';

class DaysApp extends Component {
  state = {
    years: [],
    posts: [],
    labels: [],
    selectedMonth: '',
    selectedYear: '',
  };

  componentDidMount() {
    this.fetchYears();
    this.fetchLabels();
  }

  fetchLabels = () => {
    getLabels()
      .then(response => {
        const labels = response.data.map(c => ({
          id: c.ID,
          name: c.Name,
          color: c.Color,
          colorActive: c.ColorActive,
        }));

        this.setState({ labels });
      })
      .catch(error => console.log(error));
  };

  fetchYears = () => {
    getYears()
      .then(response => {
        this.setState({ years: response.data });
      })
      .catch(error => console.log(error));
  };

  fetchmonth = ym => {
    getMonth(ym)
      .then(response => {
        const posts = response.data.map(c => ({
          id: c.ID,
          labels: c.Labels,
          comments: c.Comments,
          periods: c.Periods,
          body: c.Body,
          date: c.Date.slice(0, 10),
        }));

        this.setState({
          posts,
          selectedMonth: ym,
        });
      })
      .catch(error => console.log(error));
  };

  handleYearChange = e => {
    this.setState({ selectedYear: e.target.value });
  };

  handleMonthChange = e => {
    this.setState({ selectedMonth: e.target.value });
    this.fetchmonth(e.target.value);
  };

  render() {
    const { years, selectedYear, selectedMonth } = this.state;

    return (
      <Grid container spacing={3}>
        <Grid item container xs={12} spacing={2}>
          <Grid item xs={5} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel id="year-label">Year</InputLabel>
              <Select labelId="year-label" value={selectedYear} onChange={this.handleYearChange}>
                {Object.keys(years).map(y => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={7} sm={6} md={3}>
            <FormControl disabled={!selectedYear} fullWidth>
              <InputLabel id="month-label">Month</InputLabel>
              <Select labelId="month-label" value={selectedMonth} onChange={this.handleMonthChange}>
                {selectedYear &&
                  years[selectedYear].map(m => (
                    <MenuItem key={m.YM} value={m.YM}>
                      {m.M} ({m.Cnt})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} container direction="column" spacing={2}>
          {this.state.posts.map(p => (
            <Grid item key={p.id}>
              <PostShow post={{...p, labels: p.labels || []}} labels={this.state.labels} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }
}

export default DaysApp;
