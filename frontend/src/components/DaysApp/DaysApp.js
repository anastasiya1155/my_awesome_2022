import React, { Component } from 'react';
import axios from 'axios/index';
import PostShow from '../PostShow';
import Year from './Year';
import { IP, PORT } from '../../redux/const';

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
    axios
      .get(`http://${IP}:${PORT}/labels`)
      .then((response) => {
        const labels = response.data.map((c) => ({
          id: c.ID,
          name: c.Name,
          color: c.Color,
          colorActive: c.ColorActive,
        }));

        this.setState({ labels });
      })
      .catch((error) => console.log(error));
  };

  fetchYears = () => {
    axios
      .get(`http://${IP}:${PORT}/posts-months/`)
      .then((response) => {
        const years = Object.keys(response.data).map((key) => ({
          id: key,
          months: response.data[key],
        }));
        this.setState({ years });
      })
      .catch((error) => console.log(error));
  };

  fetchmonth = (ym) => {
    axios
      .get(`http://${IP}:${PORT}/posts-by-month/?ym=${ym}`)
      .then((response) => {
        const posts = response.data.map((c) => ({
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
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div className="App">
        <div className="row">
          <div className="column" style={{ textAlign: 'left' }}>
            {this.state.years.map((y) => (
              <Year
                key={y.id}
                year={y.id}
                months={y.months}
                fetchmonth={this.fetchmonth}
                selected={this.state.selectedMonth}
              />
            ))}
          </div>
          <div className="column" style={{ float: 'left', width: '65%' }}>
            <div>
              {this.state.posts.map((p) => (
                <PostShow key={p.id} post={p} labels={this.state.labels} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DaysApp;
