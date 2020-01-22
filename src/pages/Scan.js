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
import Zoom from '@material-ui/core/Zoom';
import Divider from '@material-ui/core/Divider';

// Custom Components
import { withFirebase } from '../components/Firebase';
import PageTitle from '../components/PageTitle';

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
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
  },
  alert: {}
}));

const availableTokens = [{ label: 'Dinner 1', value: 'dinner1' }];

const standardSchema = yup.object().shape({
  token: yup.string().required('This field is required.'),
  tagID: yup
    .string()
    .min(10, 'NFC Tag ID must be 10 characters.')
    .required('This field is required.')
});

const codeSchema = yup.object().shape({
  token: yup.string().required('This field is required.'),
  code: yup
    .string()
    .min(4, 'Code must be 4 characters.')
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
  };

  const codeSubmit = (values, formikBag) => {
    setAlert(null);
    console.log(values);
    setTimeout(() => {
      formikBag.setSubmitting(false);
      showAlert({
        title: 'Success',
        description: `Successfully consumed token ${values.token}.`,
        severity: 'success'
      });
    }, 500);
  };

  const standardSubmit = (values, formikBag) => {
    setAlert(null);
    console.log(values);
    setTimeout(() => {
      formikBag.setSubmitting(false);
      showAlert({
        title: 'Success',
        description: `Successfully consumed token ${values.token}.`,
        severity: 'success'
      });
    }, 500);
  };

  const LoadingBox = () => (
    <Box className={classes.container}>
      <CircularProgress />
    </Box>
  );

  const CodeForm = () => {
    return (
      <Box component='section' className={classes.container}>
        <Typography variant='h6'>Code Token Consumer</Typography>
        <Formik
          initialValues={{ token: '', code: '' }}
          validationSchema={codeSchema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={codeSubmit}
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
                    inputProps={{ maxLength: 4 }}
                    type='text'
                    label='Code'
                    name='code'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.code}
                    error={errors.code && touched.code ? true : false}
                    helperText={errors.code && touched.code ? errors.code : ''}
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

  const StandardForm = () => {
    return (
      <Box component='section' className={classes.container}>
        <Typography variant='h6'>Standard Token Consumer</Typography>
        <Formik
          initialValues={{ token: '', tagID: '' }}
          validationSchema={standardSchema}
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
    <Box className={classes.root}>
      <PageTitle>Scan</PageTitle>
      <Zoom in={alert !== null}>
        <Alert
          variant='filled'
          severity={alert !== null ? alert.severity : 'info'}
        >
          <AlertTitle>{alert !== null ? alert.title : 'Info'}</AlertTitle>
          {alert !== null ? alert.description : 'Description'}
        </Alert>
      </Zoom>
      <Box>
        <StandardForm />
        <Divider />
        <CodeForm />
      </Box>
    </Box>
  );
};

export default ScanPage;
