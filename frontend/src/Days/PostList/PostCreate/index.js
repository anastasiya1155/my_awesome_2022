import React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createPostAction } from '../../../shared/api/handlers';

const PostCreate = () => {
  const [value, setValue] = React.useState('');
  const [date, setDate] = React.useState(moment().format('YYYY-MM-DD'));
  const dispatch = useDispatch();

  const handleText = e => {
    setValue(e.target.value);
  };

  const handleDate = e => {
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
      <TextField type="date" value={date} onChange={handleDate} />
      <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
        Send
      </Button>
    </form>
  );
};

export default PostCreate;
