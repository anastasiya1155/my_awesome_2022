import React from 'react';
import { TextField, Button, Grid, Typography, IconButton, Popover } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Close';
import PostLabel from '../../PostShow/PostLabel';
import { deleteLabel, getLabels, postLabel } from '../../../shared/utils/routes';
import ColorPicker from '../../../shared/components/ColorPicker';

const LabelsSettings = () => {
  const [activeLabels, setActiveLabels] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [isAdd, setIsAdd] = React.useState(false);
  const [newLabelName, setNewLabelName] = React.useState('');
  const [newLabelColor, setNewLabelColor] = React.useState([]);
  const [isNewLabelActive, setIsNewLabelActive] = React.useState(false);
  const [labels, setLabels] = React.useState([]);

  const fetchLabels = () => {
    getLabels()
      .then(response => {
        const l = response.data.map(c => ({
          id: c.ID,
          name: c.Name,
          color: c.Color,
          colorActive: c.ColorActive,
        }));

        setLabels(l);
      })
      .catch(console.log);
  };

  React.useEffect(() => {
    fetchLabels();
  }, []);

  const handleLabelClick = (e, isActive, labelId) => {
    const newLabels = isActive
      ? activeLabels.filter(l => l !== labelId)
      : [...activeLabels, labelId];
    setActiveLabels(newLabels);
    setAnchorEl(e.currentTarget);
    setItemToDelete(labelId);
  };

  const handleLabelAdd = e => {
    e.preventDefault();
    postLabel({ name: newLabelName, color: newLabelColor[0], colorActive: newLabelColor[1] })
      .then(() => {
        fetchLabels();
        setIsAdd(false);
        setNewLabelName('');
        setNewLabelColor([]);
        setIsNewLabelActive(false);
      })
      .catch(console.log);
  };

  const handleLabelDelete = () => {
    deleteLabel(itemToDelete)
      .then(() => {
        fetchLabels();
        handleClose();
      })
      .catch(console.log);
  };

  const handleClose = () => {
    setItemToDelete(null);
    setAnchorEl(null);
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
        <IconButton onClick={() => setIsAdd(true)}>
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
      </Popover>
      {isAdd && (
        <Grid item xs={12}>
          <form onSubmit={handleLabelAdd}>
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
              </Grid>
            </Grid>
          </form>
        </Grid>
      )}
    </Grid>
  );
};

export default LabelsSettings;
