import React, {useState} from 'react';

// Material UI
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    padding: 20
  },
  input: {
    marginTop: 20
  },
  button: {
    marginTop: 30
  }
}));

const fields = [
  {
    label: 'Email'
  },
  {
    label: 'Password'
  }
];

const Login = () => {
  const classes = useStyles();
  const [submitting, setSubmitting] = useState(false);
  return (
    <div className={classes.root}>
      <Typography variant='h3' className={classes.title}>
        Login
      </Typography>
      {fields.map((field, index) => (
        <TextField
          key={index}
          id={field + index}
          required
          label={field.label}
          margin='dense'
          variant='outlined'
          className={classes.input}
        />
      ))}
      <Button color='primary' variant='contained' className={classes.button}>
        Login
      </Button>
    </div>
  );
};

export default Login;
