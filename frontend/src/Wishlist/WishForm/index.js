import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gutterBottom: {
    marginBottom: theme.spacing(3),
  },
  maxWidth: {
    flex: 1,
    minWidth: 350,
    '@media screen and (max-width: 500px)': {
      minWidth: 'auto',
    },
  },
  img: {
    width: 400,
    height: 170,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.background.paper,
    '@media screen and (max-width: 500px)': {
      width: '100%',
    },
  },
  marginRight: {
    marginRight: theme.spacing(2),
  },
}));

const WishForm = ({ onSubmit, handleChange, values }) => {
  const classes = useStyles();
  return (
    <form onSubmit={onSubmit}>
      <FormGroup className={classes.gutterBottom}>
        <TextField fullWidth value={values.name} name="name" onChange={handleChange} label="Name" />
      </FormGroup>
      <FormGroup row className={classes.gutterBottom}>
        <div
          style={{ backgroundImage: `url(${values.picture})` }}
          className={[classes.img, classes.marginRight].join(' ')}
        />
        <TextField
          className={classes.maxWidth}
          value={values.picture}
          name="picture"
          onChange={handleChange}
          label="Link to picture"
        />
      </FormGroup>
      <FormGroup row className={classes.gutterBottom}>
        <TextField
          className={classes.marginRight}
          type="number"
          value={values.priceFrom}
          name="priceFrom"
          onChange={handleChange}
          label="Price From"
        />
        <TextField
          type="number"
          value={values.priceTo}
          name="priceTo"
          onChange={handleChange}
          label="Price To"
        />
      </FormGroup>
      <FormGroup>
        <Button type="submit" fullWidth variant="outlined">
          Submit
        </Button>
      </FormGroup>
    </form>
  );
};

WishForm.propTypes = {
  handleChange: PropTypes.func,
  onSubmit: PropTypes.func,
  values: PropTypes.object,
};

export default WishForm;
