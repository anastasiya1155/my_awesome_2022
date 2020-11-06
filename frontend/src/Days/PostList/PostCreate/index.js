import React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createPostAction } from '../../../shared/api/handlers';

const today = moment().format('YYYY-MM-DD');
const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

const PostCreate = () => {
  const [value, setValue] = React.useState('');
  const [date, setDate] = React.useState(
    process.env.REACT_APP_USER_ID === 'Anastasiia' ? yesterday : today,
  );
  const dispatch = useDispatch();

  const handleText = (e) => {
    setValue(e.target.value);
  };

  const handleDate = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = () => {
    const post = {
      body: value,
      date: moment.utc(date),
    };
    createPostAction(dispatch, post).then(() => setValue(''));
  };

  return (
    <form style={{ marginBottom: '30px', textAlign: 'center' }}>
      <TextField
        multiline
        fullWidth
        rows={4}
        variant="outlined"
        value={value}
        onChange={handleText}
      />
      <Button
        style={{ marginRight: 15 }}
        onClick={() => handleDate({ target: { value: yesterday } })}
      >
        Yesterday
      </Button>
      <TextField style={{ marginRight: 15 }} type="date" value={date} onChange={handleDate} />
      <Button onClick={() => handleDate({ target: { value: today } })}>Today</Button>
      <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
        Send
      </Button>
    </form>
  );
};

export default PostCreate;
