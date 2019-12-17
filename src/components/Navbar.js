import React from 'react';
import {useLocation, useHistory} from 'react-router-dom';

// Material UI
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const drawerWidth = 240;

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
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

const Navbar = ({paths}) => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  return (
    <React.Fragment>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <Typography variant='h6' noWrap>
            Potato
          </Typography>
        </Toolbar>
      </AppBar>
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
    </React.Fragment>
  );
};

export default Navbar;
