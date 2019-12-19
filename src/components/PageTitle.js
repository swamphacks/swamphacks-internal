import React from 'react';

// Material UI
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Styles
const useStyles = makeStyles(theme => ({
  title: {
    paddingBottom: 40
  }
}));

const PageTitle = ({children}) => {
  const classes = useStyles();
  return (
    <Typography variant='h3' className={classes.title}>
      {children}
    </Typography>
  );
};

export default PageTitle;
