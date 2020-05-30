import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import { postTransactionsToMonthAndYear } from '../../shared/api/routes';

import moment from 'moment';
import { CATEGORIES } from '../../shared/config/const';

class TransactionsCreate extends Component {
  state = {
    description: '',
    amount: '',
    category: 31,
  };

  handleCategory = e => {
    this.setState({ category: e.target.value });
  };

  handleAmount = e => {
    this.setState({ amount: e.target.value });
  };

  handleDescription = e => {
    this.setState({ description: e.target.value });
  };

  submitTransaction = () => {
    const transaction = {
      description: this.state.description,
      amount: +this.state.amount,
      category: this.state.category,
      date: +new Date(),
    };

    const month = moment().month() + 1;
    postTransactionsToMonthAndYear(moment().year(), month, transaction)
      .then(() => {
        this.setState({ description: '', amount: 1, category: 1 });
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} container justify="space-between">
            {[31, 34, 11, 12, 52, 22, 14].map(id => (
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => this.handleCategory({ target: { value: id } })}
                >
                  {CATEGORIES[id].name}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <Select
                value={this.state.category}
                onChange={this.handleCategory}
                inputProps={{
                  name: 'age',
                  id: 'age-simple',
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {Object.keys(CATEGORIES).map(c => (
                  <MenuItem key={CATEGORIES[c].id} value={CATEGORIES[c].id}>
                    {CATEGORIES[c].name}
                  </MenuItem>
                ))}
              </Select>
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <TextField
                type="number"
                label="Amount"
                value={this.state.amount}
                onChange={this.handleAmount}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <TextField
                type="text"
                value={this.state.description}
                onChange={this.handleDescription}
                label="Comment"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <Button variant="contained" onClick={this.submitTransaction}>
                Submit
              </Button>
            </FormGroup>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default TransactionsCreate;
