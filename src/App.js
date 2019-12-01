import React, {useEffect, useState} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import {withFirebase} from './components/Firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

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

const App = ({firebase}) => {
  const [signedIn, setSignedIn] = useState(null);

  useEffect(() => {
    setSignedIn(firebase.checkSignedIn());
  }, []);

  const PrivateRoute = ({children: Component, ...rest}) => (
    <Route
      {...rest}
      render={props =>
        signedIn === true ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  );

  if (signedIn === null) {
    return <LoadingBox />;
  }

  return (
    <Switch>
      <PrivateRoute exact path='/'>
        <Home />
      </PrivateRoute>
      <Route exact path='/login'>
        <Login />
      </Route>
    </Switch>
  );
};

export default withFirebase(App);
