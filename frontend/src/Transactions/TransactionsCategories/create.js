import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useSelector, useDispatch } from 'react-redux';
import { addTransCategoryAction } from '../../shared/api/handlers';

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
}));

const TransactionsCategoriesCreate = () => {
  const [showInput, setShowInput] = React.useState(false);
  const [value, setValue] = React.useState('');
  const nextId = useSelector(state => state.transactions.nextId);
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleText = e => {
    setValue(e.target.value);
  };

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  const createCategory = () => {
    const post = {
      name: value,
      id: nextId,
    };
    addTransCategoryAction(dispatch, post).then(() => {
      setValue('');
      toggleInput();
    });
  };

  return (
    <div>
      <Button variant="outlined" onClick={toggleInput}>
        Add +
      </Button>
      {showInput ? (
        <span>
          <TextField
            type="text"
            className={classes.textField}
            value={value}
            onChange={handleText}
          />
          <Button variant="outlined" onClick={createCategory}>
            Save
          </Button>
        </span>
      ) : (
        ''
      )}
    </div>
  );
};

export default TransactionsCategoriesCreate;
