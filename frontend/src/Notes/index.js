import React from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  useMediaQuery,
  useTheme,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import {
  deleteNoteCategory,
  getNoteCategories,
  postNoteCategory,
  putNoteCategory,
} from '../shared/api/routes';
import AddNoteCategory from './AddNoteCategory';
import CloseIcon from '@material-ui/icons/Close';

const NoteCategories = (props) => {
  const [noteCategories, setNoteCategories] = React.useState([]);
  const [isAdd, setIsAdd] = React.useState(false);
  const [noteCategoryToEdit, setNoteCategoryToEdit] = React.useState(null);
  const [noteCategoryToDelete, setNoteCategoryToDelete] = React.useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    getNoteCategories()
      .then((response) => setNoteCategories(response.data))
      .catch(console.log);
  }, []);

  const fetchData = () => {
    getNoteCategories()
      .then((response) => setNoteCategories(response.data))
      .catch(console.log);
  };

  const handleSubmit = (values) => {
    if (isAdd) {
      postNoteCategory(values)
        .then(() => {
          fetchData();
          setIsAdd(false);
        })
        .catch(console.log);
    } else {
      putNoteCategory(noteCategoryToEdit.id, values)
        .then(() => {
          fetchData();
          setNoteCategoryToEdit(null);
        })
        .catch(console.log);
    }
  };

  const handleDeleteSubmit = () => {
    deleteNoteCategory(noteCategoryToDelete.id)
      .then(() => {
        fetchData();
        handleCancel();
      })
      .catch(console.log);
  };

  const handleEditClick = (e, note) => {
    e.stopPropagation();
    setNoteCategoryToEdit(note);
    setIsAdd(false);
  };

  const handleCancel = () => {
    setNoteCategoryToEdit(null);
    setNoteCategoryToDelete(null);
    setIsAdd(false);
  };

  const handleDeleteClick = (e, note) => {
    e.stopPropagation();
    setNoteCategoryToDelete(note);
  };

  return (
    <div>
      <h1>Notes</h1>
      <List>
        {noteCategories.map((list) => (
          <ListItem key={list.id} button onClick={() => props.history.push(`/notes/${list.id}`)}>
            <ListItemText primary={list.name} />
            <ListItemIcon>
              <IconButton onClick={(e) => handleEditClick(e, list)}>
                <EditIcon />
              </IconButton>
            </ListItemIcon>
            <ListItemIcon>
              <IconButton onClick={(e) => handleDeleteClick(e, list)}>
                <CloseIcon />
              </IconButton>
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
      <IconButton
        onClick={() => {
          setIsAdd(true);
          setNoteCategoryToEdit(null);
        }}
      >
        <AddIcon />
      </IconButton>
      {isAdd || noteCategoryToEdit ? (
        <AddNoteCategory
          handleSubmit={handleSubmit}
          initialValues={noteCategoryToEdit}
          handleCancel={handleCancel}
        />
      ) : null}
      <Dialog open={!!noteCategoryToDelete} fullScreen={fullScreen} onClose={handleCancel}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {noteCategoryToDelete?.title} with all notes in it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="outlined">
            Nooo
          </Button>
          <Button onClick={handleDeleteSubmit} variant="contained">
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NoteCategories;
