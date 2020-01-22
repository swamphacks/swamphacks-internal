import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Alert, AlertTitle } from '@material-ui/lab';
import Zoom from '@material-ui/core/Zoom';

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
    marginBottom: 10
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

// Validation Schemas
const standardSchema = yup.object().shape({
  code: yup
    .string()
    .min(4, 'Check-In Code must be 4 characters.')
    .required('This field is required.')
});

const manualSchema = yup.object().shape({
  firstName: yup.string().required('This field is required.'),
  lastName: yup.string().required('This field is required.')
});

const nfcSchema = yup.object().shape({
  tagID: yup
    .string()
    .min(10, 'NFC Tag ID must be 10 characters.')
    .required('This field is required.')
});

const CheckIn = ({ firebase }) => {
  // Hooks
  const classes = useStyles();
  const [user, setUser] = useState(null);
  const [manualUsers, setManualUsers] = useState([]);
  const [alert, setAlert] = useState(null);

  // Functions
  const showAlert = ({ title, description, severity }) => {
    setAlert(null);
    setTimeout(() => {
      setAlert({ title, description, severity });
    }, 100);
  };

  const _handleSubmitStandard = async (values, formikBag) => {
    // Check if the user exists
    try {
      const { data } = await firebase.getHackerByCode({
        code: values.code,
        checkIn: true
      });
      const { docData, docID } = data;
      const u = _createUser({
        firstName: docData.applicationData.firstName,
        lastName: docData.applicationData.lastName,
        email: docData.email,
        school: docData.applicationData.school,
        docID: docID
      });
      formikBag.setSubmitting(false);
      setUser(u);
    } catch (error) {
      formikBag.setSubmitting(false);
      showAlert({
        title: `Error: ${error.code}`,
        description: error.message,
        severity: 'error'
      });
    }
  };

  const _handleSubmitManual = async (values, formikBag) => {
    // Get a list of users with matching first and last name
    // Filter out users who have already been checked-in
    // If there are multiple users, show select dialog
    // NOTE: Make sure to account for case
    try {
      const { data } = await firebase.getHackersByName({
        firstName: values.firstName,
        lastName: values.lastName,
        checkIn: true
      });
      const { hackersFound } = data;
      if (hackersFound.length > 1) {
        let createdUsers = [];
        hackersFound.forEach(hacker => {
          const { docData, docID } = hacker;
          const u = _createUser({
            firstName: docData.applicationData.firstName,
            lastName: docData.applicationData.lastName,
            email: docData.email,
            school: docData.applicationData.school,
            docID: docID
          });
          createdUsers.push(u);
        });
        formikBag.setSubmitting(false);
        setManualUsers(createdUsers);
      } else {
        let createdUser = null;
        hackersFound.forEach(hacker => {
          const { docData, docID } = hacker;
          const u = _createUser({
            firstName: docData.applicationData.firstName,
            lastName: docData.applicationData.lastName,
            email: docData.email,
            school: docData.applicationData.school,
            docID: docID
          });
          createdUser = u;
        });
        formikBag.setSubmitting(false);
        setUser(createdUser);
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

  const _selectManualUser = mu => {
    setUser(mu);
    setManualUsers([]);
  };

  const _handleSubmitNFC = async (values, formikBag) => {
    console.log(user);
    try {
      await firebase.checkIn({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        docID: user.docID,
        nfcID: values.tagID
      });
      formikBag.setSubmitting(false);
      const fName = user.firstName;
      const lName = user.lastName;
      showAlert({
        title: `Success`,
        description: `${fName} ${lName} has been successfully checked in.`,
        severity: 'success'
      });
      setUser(null);
    } catch (error) {
      formikBag.setSubmitting(false);
      formikBag.setFieldError('tagID', error.message);
      showAlert({
        title: `Error: ${error.code}`,
        description: error.message,
        severity: 'error'
      });
    }
  };

  const _createUser = ({ firstName, lastName, email, school, docID }) => ({
    firstName: firstName,
    lastName: lastName,
    email: email,
    school: school,
    docID: docID
  });

  // Components
  const NFCModal = () => {
    const name = user !== null ? `${user.firstName} ${user.lastName}` : 'Error';
    const email = user !== null ? user.email : 'Error';
    const school = user !== null ? user.school : 'Error';
    return (
      <Dialog open={user !== null ? true : false}>
        <DialogTitle>Assign NFC Tag</DialogTitle>
        <Formik
          initialValues={{ tagID: '' }}
          validationSchema={nfcSchema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={_handleSubmitNFC}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting
          }) => (
            <Form>
              <DialogContent>
                <DialogContentText>
                  Name: {name} <br /> School: {school} <br /> Email: {email}
                </DialogContentText>
                <DialogContentText>
                  Check that the hacker's name on their ID matches the name
                  listed above. If so, please assign the hacker an NFC tag.
                </DialogContentText>
                {isSubmitting ? (
                  <LoadingBox />
                ) : (
                  <TextField
                    className={classes.textField}
                    inputProps={{ maxLength: 10 }}
                    autoFocus
                    type='text'
                    label='NFC Tag ID'
                    name='tagID'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.tagID}
                    error={errors.tagID && touched.tagID ? true : false}
                    helperText={
                      errors.tagID && touched.tagID ? errors.tagID : ''
                    }
                    fullWidth
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setUser(null)} color='primary'>
                  Cancel
                </Button>
                <Button type='submit' disabled={isSubmitting} color='primary'>
                  Assign
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    );
  };

  const StandardForm = () => (
    <Box component='section' className={classes.container}>
      <Typography variant='h6'>Standard Check-In</Typography>
      <Formik
        initialValues={{ code: '' }}
        validationSchema={standardSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={_handleSubmitStandard}
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
                autoFocus
                type='text'
                label='Check-In Code'
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

  const ManualForm = () => (
    <Box component='section' className={classes.container}>
      <Typography variant='h6'>Manual Check-In</Typography>
      <Formik
        initialValues={{ firstName: '', lastName: '' }}
        validationSchema={manualSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={_handleSubmitManual}
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
                  className={classes.textField}
                  type='text'
                  label='First Name'
                  name='firstName'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName}
                  error={errors.firstName && touched.firstName ? true : false}
                  helperText={
                    errors.firstName && touched.firstName
                      ? errors.firstName
                      : ''
                  }
                />
                <TextField
                  className={classes.textField}
                  type='text'
                  label='Last Name'
                  name='lastName'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                  error={errors.lastName && touched.lastName ? true : false}
                  helperText={
                    errors.lastName && touched.lastName ? errors.lastName : ''
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

  const ManualUsersModal = () => {
    const name =
      manualUsers.length > 0
        ? `${manualUsers[0].firstName} ${manualUsers[0].lastName}`
        : 'Error';
    return (
      <Dialog onClose={() => setManualUsers([])} open={manualUsers.length > 0}>
        <DialogTitle>Select a Hacker</DialogTitle>
        <DialogContent>
          <DialogContentText>
            It looks like there are multiple {name}'s in our system. Please
            select the correct hacker to continue.
          </DialogContentText>
        </DialogContent>
        <List>
          {manualUsers.map(mu => (
            <ListItem
              button
              onClick={() => _selectManualUser(mu)}
              key={mu.email}
            >
              <ListItemText primary={mu.email} secondary={mu.school} />
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button onClick={() => setManualUsers([])} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const LoadingBox = () => (
    <Box className={classes.container}>
      <CircularProgress />
    </Box>
  );

  // Render
  return (
    <Box className={classes.root}>
      <PageTitle>Check-In</PageTitle>
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
        {/* NFC Pop-Up Modal */}
        <NFCModal />
        {/* Manual User Select Modal */}
        <ManualUsersModal />
        {/* Standard Check-In */}
        <StandardForm />
        <Divider />
        {/* Manual Check-In */}
        <ManualForm />
      </Box>
    </Box>
  );
};

export default withFirebase(CheckIn);
