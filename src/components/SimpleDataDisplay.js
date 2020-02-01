import React from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20,
    height: '100%'
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  }
}));

const SimpleDataDisplay = ({ label, data }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      {data !== null ? (
        <React.Fragment>
          <Typography variant='h4'>{data}</Typography>
          <Typography variant='subtitle1'>{label}</Typography>
        </React.Fragment>
      ) : (
        <div className={classes.progressContainer}>
          <CircularProgress size={20} />
        </div>
      )}
    </Paper>
  );
};

export default SimpleDataDisplay;
