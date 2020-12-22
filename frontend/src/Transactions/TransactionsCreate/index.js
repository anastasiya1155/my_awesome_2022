import React from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { addTransaction } from '../../shared/api/handlers';

const initialValues = { description: '', amount: '', category: 31 };

const TransactionsCreate = ({ history }) => {
  const [values, setValues] = React.useState(initialValues);
  const categories = useSelector((state) => state.transactions.categories);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submitTransaction = () => {
    const data = {
      ...values,
      amount: +values.amount,
    };

    const month = moment().month() + 1;
    const year = moment().year();
    addTransaction(dispatch, { data, month, year })
      .then(() => {
        setValues(initialValues);
        if (isMobile) {
          history.push('/transactions/list');
        }
      })
      .catch(console.log);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Grid container spacing={3}>
        <Grid item xs={12} container justify="space-between">
          {[31, 34, 11, 12, 52, 22, 14].map((id) => (
            <Grid item key={id}>
              <Button
                variant="outlined"
                onClick={() => handleChange({ target: { value: id, name: 'category' } })}
              >
                {categories.find((c) => c.id === id)?.name}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <Select value={values.category} onChange={handleChange} name="category">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
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
              name="amount"
              autoComplete="off"
              value={values.amount}
              onChange={handleChange}
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <TextField
              type="text"
              value={values.description}
              onChange={handleChange}
              name="description"
              label="Comment"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <Button type="submit" variant="contained" onClick={submitTransaction}>
              Submit
            </Button>
          </FormGroup>
        </Grid>
      </Grid>
    </form>
  );
};

export default TransactionsCreate;
