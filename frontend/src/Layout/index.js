import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Menu, ChevronLeft, ExitToApp } from '@material-ui/icons';
import {
  Snackbar,
  AppBar,
  IconButton,
  Toolbar,
  ListItemText,
  ListItem,
  ListItemIcon,
  Divider,
  Drawer,
} from '@material-ui/core';
import useStyles from './useStyles';
import { getExpiredLts, getInProgress } from '../shared/api/routes';
import { clearStorage } from '../shared/utils/storage';
import LayoutToolbar from './LayoutToolbar';
import TasksInProgress from './TasksInProgress';
import Reminder from './Reminder';

const Layout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [inProgress, setInProgress] = React.useState([]);
  const [reminder, setReminder] = React.useState([]);

  const error = useSelector(state => state.root.error);

  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      const result = await getInProgress();
      const reminder = await getExpiredLts();
      setInProgress(result.data);
      setReminder(reminder.data);
    }
    fetchData();
  }, []);

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  const handleLogout = () => {
    clearStorage();
    history.push('/login');
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={`${classes.appBar} ${open ? classes.appBarShift : ''}`}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={`${classes.menuButton} ${open ? classes.hide : ''}`}
          >
            <Menu />
          </IconButton>
          <TasksInProgress inProgress={inProgress} />
          <Reminder reminder={reminder} history={history} />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={`${classes.drawer} ${open ? classes.drawerOpen : classes.drawerClose}`}
        classes={{
          paper: open ? classes.drawerOpen : classes.drawerClose,
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <LayoutToolbar open={open} />
        <div className={classes.bottomIcons}>
          <Divider />
          <ListItem button>
            <ListItemIcon onClick={handleLogout}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </div>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={!!error}
          autoHideDuration={5000}
          ContentProps={{ className: classes.error }}
          message={error}
        />
        <div>{children}</div>
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
