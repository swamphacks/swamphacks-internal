import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import { Alert, AlertTitle } from '@material-ui/lab';

// Custom Components
import { withFirebase } from '../components/Firebase';
import PageTitle from '../components/PageTitle';

// Styles
const useStyles = makeStyles(theme => ({
  root: {},
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 40
  },
  textField: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%'
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 10
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20
  }
}));

const availableTokens = [{ label: 'Dinner 1', value: 'dinner1' }];

const schema = yup.object().shape({
  token: yup.string().required('This field is required.'),
  tagID: yup
    .string()
    .min(10, 'NFC Tag ID must be 10 characters.')
    .required('This field is required.')
});

// Dropdown to select token to consume
// Input that will read NFC ID
// Message success/failed

const ScanPage = () => {
  const [alert, setAlert] = useState(null);
  const classes = useStyles();

  const showAlert = ({ title, description, severity }) => {
    setAlert({ title, description, severity });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const standardSubmit = (values, formikBag) => {
    console.log(values);
    formikBag.setSubmitting(false);
  };

  const LoadingBox = () => (
    <Box className={classes.container}>
      <CircularProgress />
    </Box>
  );
  const StandardForm = () => {
    return (
      <Box component='section' className={classes.container}>
        <Typography variant='h6'>Token Consumer</Typography>
        <Formik
          initialValues={{ token: '', tagID: '' }}
          validationSchema={schema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={standardSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting
          }) => (
            <Form className={classes.form}>
              {isSubmitting ? (
                <LoadingBox />
              ) : (
                <React.Fragment>
                  <TextField
                    select
                    className={classes.textField}
                    label='Token'
                    name='token'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.token}
                    error={errors.token && touched.token ? true : false}
                    helperText={
                      errors.token && touched.token ? errors.token : ''
                    }
                  >
                    {availableTokens.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    className={classes.textField}
                    inputProps={{ maxLength: 10 }}
                    type='text'
                    label='Tag ID'
                    name='tagID'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.tagID}
                    error={errors.tagID && touched.tagID ? true : false}
                    helperText={
                      errors.tagID && touched.tagID ? errors.tagID : ''
                    }
                  />
                </React.Fragment>
              )}

              <Button
                className={classes.submitButton}
                type='submit'
                disabled={isSubmitting}
                variant='contained'
                color='primary'
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    );
  };

  return (
    <Box>
      <PageTitle>Scan</PageTitle>
      <Box>
        <StandardForm />
      </Box>
    </Box>
  );
};

export default ScanPage;
