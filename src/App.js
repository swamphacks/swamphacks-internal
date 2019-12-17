import React, {useEffect, useState} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

// Custom
import {withFirebase} from './components/Firebase';
import Navbar from './components/Navbar';

// Material UI
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

// Pages
import Home from './pages/Home';
import CheckIn from './pages/CheckIn';
import Login from './pages/Login';

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
}));

const LoadingBox = () => {
  return (
    <Box
      bgcolor='background.paper'
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress />
    </Box>
  );
};

// Routes
const routes = [
  {
    label: 'Home',
    path: '/',
    exact: true,
    main: Home
  },
  {
    label: 'Check-In',
    path: '/check-in',
    exact: true,
    main: CheckIn
  }
];

// Paths
const paths = [
  ...routes.map(({label, path}) => ({
    label: label,
    path: path
  }))
];

const App = ({firebase}) => {
  const [signedIn, setSignedIn] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const unsubscribe = firebase.checkSignedIn(val => setSignedIn(val));
    return () => unsubscribe();
  }, []);

  const PrivateRoute = ({children, ...rest}) => {
    return (
      <Route
        {...rest}
        render={props =>
          signedIn === true ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: {from: rest.path}
              }}
            />
          )
        }
      />
    );
  };

  if (signedIn === null) {
    return <LoadingBox />;
  }

  return (
    <div className={classes.root}>
      <Navbar paths={paths} />
      <div className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          {routes.map((route, index) => (
            <PrivateRoute
              key={index}
              path={route.path}
              exact={route.exact}
              children={<route.main />}
            />
          ))}
          <Route exact path='/login'>
            <Login />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default withFirebase(App);
