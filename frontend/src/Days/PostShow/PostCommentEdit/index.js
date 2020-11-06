import React from 'react';
import { useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { addCommentAction } from '../../../shared/api/handlers';

let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
const yyyy = today.getFullYear();

if (dd < 10) {
  dd = `0${dd}`;
}

if (mm < 10) {
  mm = `0${mm}`;
}

today = `${yyyy}-${mm}-${dd}`;

const PostCommentEdit = ({ postId, onCancel }) => {
  const [commentBody, setCommentBody] = React.useState('');
  const dispatch = useDispatch();

  const handleText = (e) => {
    setCommentBody(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCommentAction(dispatch, {
      body: commentBody,
      PostId: postId,
    }).then(() => {
      onCancel();
    });
  };

  return (
    <Paper style={{ width: '100%', padding: '0 10px 5px 10px' }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item style={{ minWidth: 91 }}>
          <Typography>{today}</Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            value={commentBody}
            onChange={handleText}
            name="comment"
            placeholder="Comment"
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Send</Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PostCommentEdit;
