import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import axios from 'axios';

import moment from 'moment';
import { CATEGORIES } from '../../../redux/const';

class TransactionsCreate extends Component {
  state = {
    description: '',
    amount: 100,
    category: 31,
  };

  handleCategory = (e) => {
    this.setState({ category: e.target.value });
  };

  handleAmount = (e) => {
    this.setState({ amount: e.target.value });
  };

  handleDescription = (e) => {
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

    axios
      .post(
        `https://tranf-ae713.firebaseio.com/transaction/${moment().year()}/${month}.json`,
        transaction,
      )
      .then(() => {
        this.setState({ description: '', amount: 1, category: 1 });
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div>
        <form>
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
              {Object.keys(CATEGORIES).map((c) => (
                <MenuItem key={CATEGORIES[c].id} value={CATEGORIES[c].id}>
                  {CATEGORIES[c].name}
                </MenuItem>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <TextField type="number" value={this.state.amount} onChange={this.handleAmount} />
          </FormGroup>
          <FormGroup>
            <TextField
              type="text"
              value={this.state.description}
              onChange={this.handleDescription}
            />
          </FormGroup>
          <FormGroup>
            <Button variant="outlined" onClick={this.submitTransaction}>
              Submit
            </Button>
          </FormGroup>
        </form>
      </div>
    );
  }
}

export default TransactionsCreate;
