import React from 'react';
import PropTypes from 'prop-types';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Alarm, CardGiftcard, Equalizer, EventNote, ListAlt, ViewWeek } from '@material-ui/icons';

const LayoutToolbar = ({ open }) => {
  return (
    <List>
      {open ? <ListSubheader component="spam"> Personal </ListSubheader> : null}
      <Link to="/days">
        <ListItem button>
          <ListItemIcon>
            <EventNote />
          </ListItemIcon>
          <ListItemText primary="Days" />
        </ListItem>
      </Link>
      <Link to="/projects">
        <ListItem button>
          <ListItemIcon>
            <ViewWeek />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItem>
      </Link>
      <Link to="/last-time">
        <ListItem button>
          <ListItemIcon>
            <Alarm />
          </ListItemIcon>
          <ListItemText primary="Last Time" />
        </ListItem>
      </Link>
      {open ? <ListSubheader component="spam"> Family </ListSubheader> : <Divider />}
      <Link to="/transactions/list">
        <ListItem button>
          <ListItemIcon>
            <Equalizer />
          </ListItemIcon>
          <ListItemText primary="Transactions" />
        </ListItem>
      </Link>
      <Link to="/tasks">
        <ListItem button>
          <ListItemIcon>
            <ListAlt />
          </ListItemIcon>
          <ListItemText primary="Tasks" />
        </ListItem>
      </Link>
      <Link to="/wishlist/list">
        <ListItem button>
          <ListItemIcon>
            <CardGiftcard />
          </ListItemIcon>
          <ListItemText primary="Wishlist" />
        </ListItem>
      </Link>
    </List>
  );
};

LayoutToolbar.propTypes = {
  open: PropTypes.bool,
};

export default LayoutToolbar;
