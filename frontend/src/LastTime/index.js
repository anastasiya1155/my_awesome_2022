import React from 'react';
import { withRouter } from 'react-router-dom';
import { getLts, postLT, putLT } from '../shared/utils/routes';
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import moment from 'moment';
import AddIcon from '@material-ui/icons/Add';
import AddLastTime from './AddLastTime';

const LastTime = () => {
  const [items, setItems] = React.useState([]);
  const [isAdd, setIsAdd] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [itemToUpdate, setItemToUpdate] = React.useState(null);
  const [updateDate, setUpdateDate] = React.useState(moment().format('YYYY-MM-DDTHH:mm'));

  const fetchLastTimeItems = () => {
    getLts().then(response => {
      if (response.data) {
        setItems(response.data);
      }
    });
  };
  React.useEffect(() => {
    fetchLastTimeItems();
  }, []);

  const handleListItemClick = (e, item) => {
    setAnchorEl(e.currentTarget);
    setItemToUpdate(item);
  };

  const handleUpdate = () => {
    putLT(itemToUpdate.id, { ...itemToUpdate, date: moment(updateDate) }).then(() => {
      setItemToUpdate(null);
      setAnchorEl(null);
      fetchLastTimeItems();
    });
  };

  const handleSubmit = values =>
    postLT(values)
      .then(() => {
        fetchLastTimeItems();
        setIsAdd(false);
      })
      .catch(console.log);

  const handleClose = () => {
    setAnchorEl(null);
    setItemToUpdate(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <h1>LastTime</h1>
      <List>
        {items.map(item => (
          <React.Fragment key={item.id}>
            <ListItem button>
              <ListItemIcon aria-describedby={id} onClick={e => handleListItemClick(e, item)}>
                <BeenhereIcon />
              </ListItemIcon>
              <ListItemText primary={item.body} secondary={moment(item.date).fromNow(true)} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Grid container spacing={1}>
          <Grid item>
            <TextField
              fullWidth
              name="update Date"
              value={updateDate}
              onChange={e => setUpdateDate(e.target.value)}
              type="datetime-local"
            />
          </Grid>
          <Grid item>
            <Button onClick={handleUpdate}>OK</Button>
          </Grid>
        </Grid>
      </Popover>
      <IconButton onClick={() => setIsAdd(true)}>
        <AddIcon />
      </IconButton>
      {isAdd ? <AddLastTime handleSubmit={handleSubmit} /> : null}
    </div>
  );
};
export default withRouter(LastTime);