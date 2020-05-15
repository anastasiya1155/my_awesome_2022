import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import RemindIcon from '@material-ui/icons/Notifications';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import EventNoteIcon from '@material-ui/icons/EventNote';
import ListItemText from '@material-ui/core/ListItemText';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import AlarmIcon from '@material-ui/icons/Alarm';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ListAltIcon from '@material-ui/icons/ListAlt';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Badge from '@material-ui/core/Badge';
import useStyles from './useStyles';
import { getExpiredLts, getInProgress } from '../shared/config/routes';
import { clearStorage } from '../shared/utils/storage';

const Layout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [inProgress, setInProgress] = React.useState([]);
  const [reminder, setReminder] = React.useState([]);

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
            <MenuIcon />
          </IconButton>
          {inProgress.length > 0 ? (
            <Grid container>
              {inProgress.map(task => (
                <Grid item key={task.id}>
                  <b> --- {task.body} --- </b>
                </Grid>
              ))}
            </Grid>
          ) : null}
          {reminder.length > 0 ? (
            <>
              <Hidden smUp>
                <Badge
                  color="error"
                  badgeContent={reminder.length}
                  onClick={() => history.push('/last-time')}
                >
                  <RemindIcon />
                </Badge>
              </Hidden>
              <Hidden xsDown>
                <Grid container>
                  {reminder.map(lt => (
                    <Grid item key={lt.id}>
                      <b> !!! {lt.body} !!! </b>
                    </Grid>
                  ))}
                </Grid>
              </Hidden>
            </>
          ) : null}
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
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {open ? <ListSubheader component="spam"> Personal </ListSubheader> : null}
          <Link to="/days">
            <ListItem button>
              <ListItemIcon>
                <EventNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Days" />
            </ListItem>
          </Link>
          <Link to="/projects">
            <ListItem button>
              <ListItemIcon>
                <ViewWeekIcon />
              </ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItem>
          </Link>
          <Link to="/last-time">
            <ListItem button>
              <ListItemIcon>
                <AlarmIcon />
              </ListItemIcon>
              <ListItemText primary="Last Time" />
            </ListItem>
          </Link>
          {open ? <ListSubheader component="spam"> Family </ListSubheader> : <Divider />}
          <Link to="/transactions/list">
            <ListItem button>
              <ListItemIcon>
                <EqualizerIcon />
              </ListItemIcon>
              <ListItemText primary="Transactions" />
            </ListItem>
          </Link>
          <Link to="/tasks">
            <ListItem button>
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Tasks" />
            </ListItem>
          </Link>
          <Link to="/wishlist/list">
            <ListItem button>
              <ListItemIcon>
                <CardGiftcardIcon />
              </ListItemIcon>
              <ListItemText primary="Wishlist" />
            </ListItem>
          </Link>
        </List>
        <div className={classes.bottomIcons}>
          <Divider />
          <ListItem button>
            <ListItemIcon onClick={handleLogout}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </div>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div>{children}</div>
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
