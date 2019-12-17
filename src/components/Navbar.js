import React from 'react';
import {useLocation, useHistory} from 'react-router-dom';

// Custom
import {withFirebase} from '../components/Firebase';

// Material UI
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const drawerWidth = 240;

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  title: {
    flexGrow: 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
}));

const Navbar = ({firebase, paths, signedIn}) => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  return (
    <React.Fragment>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <Typography variant='h6' noWrap className={classes.title}>
            SwampHacks Internal Site
          </Typography>
          {signedIn && (
            <Button color='inherit' onClick={() => firebase.signOut()}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {signedIn && (
        <Drawer
          className={classes.drawer}
          variant='permanent'
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <List>
            {paths.map(({label, path}, index) => (
              <ListItem
                button
                key={label + index}
                onClick={() => history.push(path)}
              >
                <ListItemText
                  primary={label}
                  style={{
                    textDecoration: `${
                      path === location.pathname ? 'underline' : 'none'
                    }`
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
    </React.Fragment>
  );
};

export default withFirebase(Navbar);
