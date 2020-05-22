import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Grid, Typography, IconButton, Popover } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import PostLabel from '../../PostShow/PostLabel';
import ColorPicker from '../../../shared/components/ColorPicker';
import { addLabelAction, deleteLabelAction, editLabelAction } from '../../../shared/api/handlers';

const LabelsSettings = () => {
  const [activeLabels, setActiveLabels] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [isAdd, setIsAdd] = React.useState(false);
  const [newLabelName, setNewLabelName] = React.useState('');
  const [newLabelColor, setNewLabelColor] = React.useState([]);
  const [isNewLabelActive, setIsNewLabelActive] = React.useState(false);
  const [labelToEdit, setLabelToEdit] = React.useState(null);
  const [isEdit, setIsEdit] = React.useState(false);
  const labels = useSelector(state => state.post.labels);
  const dispatch = useDispatch();

  const handleLabelClick = (e, isActive, labelId) => {
    const newLabels = isActive
      ? activeLabels.filter(l => l !== labelId)
      : [...activeLabels, labelId];
    setActiveLabels(newLabels);
    setAnchorEl(e.currentTarget);
    setItemToDelete(labelId);
    setLabelToEdit(labelId);
  };

  const handleLabelEdit = e => {
    e.preventDefault();
    editLabelAction(dispatch, {
      labelId: labelToEdit,
      data: {
        name: newLabelName,
        color: newLabelColor[0],
        colorActive: newLabelColor[1],
      },
    }).then(() => {
      setIsEdit(false);
      setNewLabelName('');
      setNewLabelColor([]);
      setIsNewLabelActive(false);
    });
  };

  const handleLabelAdd = e => {
    e.preventDefault();
    addLabelAction(dispatch, {
      name: newLabelName,
      color: newLabelColor[0],
      colorActive: newLabelColor[1],
    }).then(() => {
      setIsAdd(false);
      setNewLabelName('');
      setNewLabelColor([]);
      setIsNewLabelActive(false);
    });
  };

  const handleLabelDelete = () => {
    deleteLabelAction(dispatch, itemToDelete)
      .then(() => {
        handleClose();
      })
      .catch(console.log);
  };

  const handleClose = () => {
    setItemToDelete(null);
    setAnchorEl(null);
  };

  const cancelForm = () => {
    setItemToDelete(null);
    setLabelToEdit(null);
    setAnchorEl(null);
    setIsAdd(false);
    setIsEdit(false);
    setNewLabelName('');
    setNewLabelColor([]);
    setIsNewLabelActive(false);
  };

  const handleLabelEditClick = () => {
    const editLabel = labels.find(l => l.id === labelToEdit);
    setIsEdit(true);
    setIsAdd(false);
    setNewLabelName(editLabel.name);
    setNewLabelColor([editLabel.color, editLabel.colorActive]);
  };

  const handleAddClicked = () => {
    setIsAdd(true);
    setIsEdit(false);
    setLabelToEdit(null);
    setNewLabelName('');
    setNewLabelColor([]);
    setIsNewLabelActive(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography>My labels: </Typography>
        {labels.map(l => (
          <PostLabel
            key={l.id}
            label={l}
            isActive={activeLabels.includes(l.id)}
            onClick={(e, active) => handleLabelClick(e, active, l.id)}
          />
        ))}
        <IconButton onClick={handleAddClicked}>
          <AddIcon />
        </IconButton>
      </Grid>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <IconButton onClick={handleLabelDelete}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={handleLabelEditClick}>
          <EditIcon />
        </IconButton>
      </Popover>
      {(isAdd || isEdit) && (
        <Grid item xs={12}>
          <form onSubmit={isAdd ? handleLabelAdd : handleLabelEdit}>
            <Grid container spacing={3} justify="space-between">
              <Grid item>
                <TextField
                  name="labelName"
                  value={newLabelName}
                  onChange={e => setNewLabelName(e.target.value)}
                  label="Name"
                />
              </Grid>
              <Grid item>
                <Typography>Color</Typography>
                <ColorPicker value={newLabelColor} onChange={val => setNewLabelColor(val)} />
              </Grid>
              <Grid item>
                <Typography>Preview</Typography>
                <PostLabel
                  key="new-label"
                  label={{
                    name: newLabelName,
                    color: newLabelColor[0],
                    colorActive: newLabelColor[1],
                  }}
                  isActive={isNewLabelActive}
                  onClick={() => setIsNewLabelActive(!isNewLabelActive)}
                />
              </Grid>
              <Grid item>
                <Button type="submit" variant="outlined">
                  Submit
                </Button>
                <Button variant="outlined" onClick={cancelForm}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      )}
    </Grid>
  );
};

export default LabelsSettings;
