import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Menu, ChevronLeft, ExitToApp } from '@material-ui/icons';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {
  AppBar,
  IconButton,
  Toolbar,
  ListItemText,
  ListItem,
  ListItemIcon,
  Divider,
  Drawer,
  CssBaseline,
} from '@material-ui/core';
import useStyles from './useStyles';
import LayoutToolbar from './LayoutToolbar';
import TasksInProgress from './TasksInProgress';
import Reminder from './Reminder';
import { getInProgressAction, getReminderAction, getUser } from '../shared/api/handlers';
import ErrorSnackbar from '../shared/components/ErrorSnackbar';
import { SET_ERROR } from '../shared/redux/rootReducer';
import { USER_SIGN_OUT } from '../shared/redux/photosReducer';

const Layout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const { error, userTheme } = useSelector((state) => state.root);
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    getInProgressAction(dispatch);
    getReminderAction(dispatch);
    getUser(dispatch);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch({ type: USER_SIGN_OUT });
    history.push('/signin');
  };

  const handleClose = () => {
    dispatch({ type: SET_ERROR, payload: '' });
  };

  return (
    <MuiThemeProvider theme={userTheme}>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar position="fixed" className={`${classes.appBar} ${open ? classes.appBarShift : ''}`}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              edge="start"
              className={`${classes.menuButton} ${open ? classes.hide : ''}`}
            >
              <Menu />
            </IconButton>
            <TasksInProgress />
            <Reminder history={history} />
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
            <IconButton onClick={() => setOpen(false)}>
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
          <ErrorSnackbar error={error} handleClose={handleClose} />
          <div>{children}</div>
        </main>
      </div>
    </MuiThemeProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
