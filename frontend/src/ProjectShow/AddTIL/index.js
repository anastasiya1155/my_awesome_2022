import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { TextField, Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { editTaskAction } from '../../shared/api/handlers';
import useStyles from './useStyles';

const AddTIL = ({ isOpen, handleClose, task, projectId }) => {
  const [value, setValue] = React.useState(task ? task.outcome : '');
  const classes = useStyles();
  const dispatch = useDispatch();

  React.useEffect(() => {
    setValue(task ? task.outcome : '');
  }, [task]);

  const submitTIL = () => {
    editTaskAction(dispatch, {
      id: task.id,
      data: {
        outcome: value,
        today_i_learned: true,
      },
      projectId,
    }).then(handleClose);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.modalPaper}>
        <h2 id="simple-modal-title">{task ? task.body : ''}</h2>
        <TextField
          multiline
          name="description"
          fullWidth
          label="Description"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <Button onClick={submitTIL} fullWidth>
          Submit
        </Button>
      </div>
    </Modal>
  );
};

AddTIL.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  task: PropTypes.object,
  projectId: PropTypes.string,
};

export default AddTIL;
