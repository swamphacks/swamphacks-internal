import React, { useState, useEffect } from 'react';

// Material UI
import { Alert, AlertTitle } from '@material-ui/lab';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Styles
const useStyles = makeStyles(theme => ({
  alert: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 400,
    zIndex: 99999
  }
}));

const AlertPopup = ({ alert }) => {
  // Hooks
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [timeoutIDs, setTimeoutIDs] = useState([]);
  const theme = useTheme();
  const isComputer = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (timeoutIDs.length > 0) {
      timeoutIDs.forEach(id => {
        clearTimeout(id);
      });
    }
    setOpen(false);
    const id1 = setTimeout(() => {
      setOpen(true);
    }, 50);
    const id2 = setTimeout(() => {
      setOpen(false);
    }, 5000);
    setTimeoutIDs([id1, id2]);
  }, [alert]);

  // Functions
  const closeAlert = () => {
    timeoutIDs.forEach(id => {
      clearTimeout(id);
    });
    setOpen(false);
  };

  // Render
  return (
    <Zoom in={open}>
      <Alert
        variant='filled'
        severity={alert !== null ? alert.severity : 'info'}
        className={classes.alert}
        style={isComputer ? {} : { left: 20, width: 'calc(100% - 40px)' }}
        onClose={closeAlert}
      >
        <AlertTitle>{alert !== null ? alert.title : 'Info'}</AlertTitle>
        {alert !== null ? alert.description : 'Alerts will show up here.'}
      </Alert>
    </Zoom>
  );
};

export default AlertPopup;
