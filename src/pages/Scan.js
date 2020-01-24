import React, { useState, useEffect } from 'react';
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
import Divider from '@material-ui/core/Divider';
import AlertPopup from '../components/AlertPopup';

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
  backButton: {
    marginRight: 10
  },
  backContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingBottom: 20
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

const tokenSchema = yup.object().shape({
  token: yup.string().required('This field is required.')
});

const standardSchema = yup.object().shape({
  tagID: yup
    .string()
    .min(10, 'NFC Tag ID must be 10 characters.')
    .required('This field is required.')
});

const codeSchema = yup.object().shape({
  code: yup
    .string()
    .min(4, 'Code must be 4 characters.')
    .required('This field is required.')
});

// Dropdown to select token to consume
// Input that will read NFC ID
// Message success/failed

const ScanPage = ({ firebase }) => {
  // Hooks
  const [token, setToken] = useState('');
  const [availableTokens, setAvailableTokens] = useState([]);
  const [alert, setAlert] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const getTokens = async () => {
      const { data } = await firebase.getFoodTokens();
      if (data !== availableTokens) {
        setAvailableTokens([...data, { label: 'Shirt', value: 'Shirt' }]);
      }
    };
    getTokens();
  }, []);

  // Functions
  const showAlert = ({ title, description, severity, persist }) => {
    setAlert({ title, description, severity, persist });
  };

  const handleBack = () => {
    setToken('');
  };

  const tokenSubmit = (values, formikBag) => {
    formikBag.setSubmitting(false);
    setToken(values.token);
  };

  const codeSubmit = async (values, formikBag) => {
    try {
      const { data } = await firebase.consumeToken({
        token: token,
        code: values.code
      });
      console.log(data);
      formikBag.setSubmitting(false);
      if (data && data.allergiesDiet !== 'None') {
        showAlert({
          title: 'Success: Restrictions',
          description: `This hacker has food allergies/dietary restrictions: ${data.allergiesDiet}.`,
          severity: 'warning',
          persist: true
        });
      } else {
        showAlert({
          title: 'Success',
          description: `Successfully consumed token ${token}.`,
          severity: 'success'
        });
      }
    } catch (error) {
      formikBag.setSubmitting(false);
      showAlert({
        title: `Error: ${error.code}`,
        description: error.message,
        severity: 'error'
      });
    }
  };

  const standardSubmit = async (values, formikBag) => {
    try {
      const { data } = await firebase.consumeToken({
        token: token,
        tagID: values.tagID
      });
      console.log(data);
      formikBag.setSubmitting(false);
      if (data && data.allergiesDiet !== 'None') {
        showAlert({
          title: 'Success: Restrictions',
          description: `This hacker has food allergies/dietary restrictions: ${data.allergiesDiet}.`,
          severity: 'warning',
          persist: true
        });
      } else {
        showAlert({
          title: 'Success',
          description: `Successfully consumed token ${token}.`,
          severity: 'success'
        });
      }
    } catch (error) {
      formikBag.setSubmitting(false);
      showAlert({
        title: `Error: ${error.code}`,
        description: error.message,
        severity: 'error'
      });
    }
  };

  // Components
  const LoadingBox = () => (
    <Box className={classes.container}>
      <CircularProgress />
    </Box>
  );

  const TokenForm = () => {
    return (
      <Box component='section' className={classes.container}>
        <Typography variant='h6'>Choose a Token</Typography>
        <Formik
          initialValues={{ token: '' }}
          validationSchema={tokenSchema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={tokenSubmit}
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
                <TextField
                  select
                  className={classes.textField}
                  label='Token'
                  name='token'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.token}
                  error={errors.token && touched.token ? true : false}
                  helperText={errors.token && touched.token ? errors.token : ''}
                >
                  {availableTokens.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
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

  const CodeForm = () => {
    return (
      <Box component='section' className={classes.container}>
        <Typography variant='h6'>Consume by Code</Typography>
        <Formik
          initialValues={{ code: '' }}
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
        <Typography variant='h6'>Consume by Tag</Typography>
        <Formik
          initialValues={{ tagID: '' }}
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
                  helperText={errors.tagID && touched.tagID ? errors.tagID : ''}
                />
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

  if (availableTokens.length === 0) {
    return (
      <Box>
        <LoadingBox />
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <PageTitle>Scan</PageTitle>
      <AlertPopup alert={alert} />
      {token && (
        <Box className={classes.backContainer}>
          <Button
            className={classes.backButton}
            variant='text'
            color='primary'
            onClick={handleBack}
          >
            Back
          </Button>
          <Typography variant='h6'>Token: {token}</Typography>
        </Box>
      )}
      <Box>
        {token === '' && <TokenForm />}
        {token && (
          <React.Fragment>
            <StandardForm />
            <Divider />
            <CodeForm />
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};

export default withFirebase(ScanPage);
