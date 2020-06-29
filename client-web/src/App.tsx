import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Switch, Route } from 'react-router-dom';
import {
  LoginView
} from './views';
import { useHistory, useLocation } from "react-router-dom";
import { Link } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import ListItem from '@material-ui/core/ListItem';
import { FiActivity } from 'react-icons/fi'
import { RiUser3Line } from 'react-icons/ri'

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
// import Button from '@material-ui/core/Button'
import Routes from './Routes'
import { useStores } from './stores'
const drawerWidth = 240;


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.down('sm')]: {
        width: theme.spacing(0) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

export default function App() {
  let location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const { App, Profile } = useStores()
  const [open, setOpen] = React.useState(false);
  let [requestSent, setRequestSent] = React.useState(false)
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const home = () => {
    if (window.location.pathname !== '/') {
      history.push('/')
    }
  }
  useEffect(() => {
    if (!requestSent) {
      setRequestSent(true)
      fetch(`/api/profile`, {
        method: 'Get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'jwt': App.auth
        }
      }).then(res => {
        return res.json();
      }).then(post => {
        Profile.id = post.id
      });
    }
  })
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const goToPage = (path: string) => {
    history.push(path)
  };
  return (
    <div className={classes.root}>
      <Switch>
        <Route
          component={LoginView}
          exact
          path="/login"
        />
        <Route
        >
          <CssBaseline />
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              // [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={open ? handleDrawerClose : handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  // [classes.hide]: open,
                })}
              >
                {open ? <MenuOpenIcon /> : <MenuIcon />}
              </IconButton>
              <div onClick={home}>
                <Typography variant="h6" noWrap>
                  Hupda
              </Typography>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
          >
            <div className={classes.toolbar}>
            </div>
            <Divider />
            <List>
              <ListItem button onClick={() => { goToPage('/topic') }} key={'Trending Topics'} selected={location.pathname.startsWith('/topic')}>
                <ListItemIcon><FiActivity size={'2em'} /></ListItemIcon>
                <ListItemText primary={'Trending Topics'} />
              </ListItem>
              <ListItem button onClick={() => { goToPage(`/profile/${Profile.id}`) }} key={'My Page'} selected={location.pathname.startsWith('/profile')}>
                <ListItemIcon><RiUser3Line size={'2em'} /></ListItemIcon>
                <ListItemText primary={'My Page'} />
              </ListItem>
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Routes />
          </main>
        </Route>
      </Switch>

    </div >
  );
}