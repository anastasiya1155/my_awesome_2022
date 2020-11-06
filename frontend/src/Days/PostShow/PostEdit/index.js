import React from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { editPostAction } from '../../../shared/api/handlers';

const useStyles = makeStyles((theme) => ({
  textarea: {
    width: '100%',
    padding: theme.spacing(2),
  },
}));

const PostEdit = ({ body, post, onCancel }) => {
  const [updatedValue, setUpdatedValue] = React.useState(body);
  const dispatch = useDispatch();

  const classes = useStyles();

  React.useEffect(() => {
    setUpdatedValue(body);
  }, [body]);

  const handleText = (e) => {
    setUpdatedValue(e.target.value);
  };

  const handleSubmit = () => {
    editPostAction(dispatch, { postId: post.id, value: { body: updatedValue } }).then(() => {
      onCancel();
    });
  };

  return (
    <form style={{ marginBottom: '30px' }}>
      <Grid container justify="center">
        <Grid item xs={12}>
          <TextField
            multiline
            className={classes.textarea}
            value={updatedValue}
            onChange={handleText}
          />
        </Grid>
        <Grid item>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default PostEdit;
