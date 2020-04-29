import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PostShow from '../shared/components/PostShow';
import Year from './Year';
import { getLabels, getMonth, getYears } from '../shared/utils/routes';

class DaysApp extends Component {
  state = {
    years: [],
    posts: [],
    labels: [],
    selectedMonth: '',
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
        const years = Object.keys(response.data).map(key => ({
          id: key,
          months: response.data[key],
        }));
        this.setState({ years });
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

  render() {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          {this.state.years.map(y => (
            <Year
              key={y.id}
              year={y.id}
              months={y.months}
              fetchmonth={this.fetchmonth}
              selected={this.state.selectedMonth}
            />
          ))}
        </Grid>
        <Grid item xs={12} md={8} container direction="column" spacing={4}>
          {this.state.posts.map(p => (
            <Grid item key={p.id}>
              <PostShow post={p} labels={this.state.labels} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }
}

export default DaysApp;
