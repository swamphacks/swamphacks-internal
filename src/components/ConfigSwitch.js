import React, { useState } from 'react';

// Material UI
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
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
    padding: 20
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  }
}));

const ConfigSwitch = ({ label, index, value, onChange }) => {
  const classes = useStyles();
  const [changing, setChanging] = useState(false);

  const handleSwitch = async () => {
    setChanging(true);
    await onChange({ index, value: !value });
    setChanging(false);
  };

  return (
    <Paper className={classes.root}>
      {value !== null && !changing ? (
        <React.Fragment>
          <FormControlLabel
            control={
              <Switch
                disabled={changing}
                checked={value}
                onChange={handleSwitch}
              />
            }
            label={value ? 'Open' : 'Closed'}
          />

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

export default ConfigSwitch;
