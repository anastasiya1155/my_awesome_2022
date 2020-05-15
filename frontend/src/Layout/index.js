import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
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
import useStyles from './useStyles';
import { getInProgress } from '../shared/config/routes';

const Layout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [inProgress, setInProgress] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getInProgress();
      setInProgress(result.data);
    }
    fetchData();
  }, []);

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

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
