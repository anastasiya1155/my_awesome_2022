import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import AddNote from './AddNote';
import { deleteNote, getNotes, postNote, putNote } from '../shared/api/routes';
import AddIcon from '@material-ui/icons/Add';
import { IconButton, ListItem, Menu, Paper, Typography } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useStyles from './useStyles';

const NoteCategoryShow = ({ match }) => {
  const [menuAnchorElement, setMenuAnchorElement] = React.useState(null);
  const [pressedNote, setPressedNote] = React.useState(null);
  const [notes, setNotes] = React.useState([]);
  const [isAdd, setIsAdd] = React.useState(false);
  const [noteToEdit, setNoteToEdit] = React.useState(null);
  const classes = useStyles();

  React.useEffect(() => {
    getNotes(match.params.id)
      .then((resp) => setNotes(resp.data))
      .catch(console.log);
  }, []);

  const handleSubmit = (values) => {
    let action = isAdd ? () => postNote(values) : () => putNote(noteToEdit.id, values);
    return action()
      .then(() => {
        getNotes(match.params.id)
          .then((resp) => {
            setNotes(resp.data);
            setIsAdd(false);
            setNoteToEdit(null);
          })
          .catch(console.log);
      })
      .catch(console.log);
  };

  const handleCancel = () => {
    setIsAdd(false);
    setNoteToEdit(null);
  };

  const handleMoreClick = (note, element) => {
    setPressedNote(note);
    setMenuAnchorElement(element);
  };

  const handleMenuClose = () => {
    setPressedNote(null);
    setMenuAnchorElement(null);
  };

  const handleDelete = (note) => {
    deleteNote(note.id)
      .then(() => {
        getNotes(match.params.id)
          .then((resp) => {
            setNotes(resp.data);
            handleMenuClose();
          })
          .catch(console.log);
      })
      .catch(console.log);
  };

  return (
    <div>
      <IconButton
        onClick={() => {
          setIsAdd(true);
          setNoteToEdit(null);
        }}
      >
        <AddIcon />
      </IconButton>
      {notes.map((note) => (
        <Paper key={note.id} className={classes.paper}>
          <Typography className={classes.noteText}>
            {note.body.split('\n').map((item, key) => (
              <Fragment key={key}>
                {item}
                <br />
              </Fragment>
            ))}
          </Typography>
          <IconButton
            onClick={(event) => handleMoreClick(note, event.currentTarget)}
            className={classes.moreIcon}
          >
            <MoreVertIcon />
          </IconButton>
        </Paper>
      ))}
      <Menu
        anchorEl={menuAnchorElement}
        open={Boolean(menuAnchorElement)}
        onClose={handleMenuClose}
      >
        <ListItem
          onClick={() => {
            setNoteToEdit(pressedNote);
            handleMenuClose();
          }}
        >
          Edit
        </ListItem>
        <ListItem onClick={() => handleDelete(pressedNote)}>Delete</ListItem>
      </Menu>
      <AddNote
        isOpen={isAdd || !!noteToEdit}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        initialValue={noteToEdit?.body}
      />
    </div>
  );
};

NoteCategoryShow.propTypes = {
  match: PropTypes.object,
};

export default NoteCategoryShow;
