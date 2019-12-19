import React, {useState} from 'react';
import {Formik, Form} from 'formik';
import * as yup from 'yup';

// Material UI
import {makeStyles} from '@material-ui/core/styles';
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

// Custom Components
import {withFirebase} from '../components/Firebase';
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

const CheckIn = ({firebase}) => {
  // Hooks
  const classes = useStyles();
  const [user, setUser] = useState(null);
  const [manualUsers, setManualUsers] = useState([]);

  // Functions
  const _handleSubmitStandard = (values, formikBag) => {
    // Check if the user exists
    // Make sure the user is not already checked-in
    const u = _createUser({
      firstName: 'Zachary',
      lastName: 'Cowan',
      email: 'example@gmail.com',
      school: 'University of Florida',
      uid: '1234'
    });
    formikBag.setSubmitting(false);
    setUser(u);
  };

  const _handleSubmitManual = (values, formikBag) => {
    // Get a list of users with matching first and last name
    // Filter out users who have already been checked-in
    // If there are multiple users, show select dialog
    // NOTE: Make sure to account for case
    const u1 = _createUser({
      firstName: 'Zachary',
      lastName: 'Cowan',
      email: 'example@gmail.com',
      school: 'University of Florida',
      uid: '1234'
    });
    const u2 = _createUser({
      firstName: 'Zachary',
      lastName: 'Cowan',
      email: 'example2@gmail.com',
      school: 'University of Alabama',
      uid: '1234'
    });
    formikBag.setSubmitting(false);
    setManualUsers([u1, u2]);
  };

  const _selectManualUser = mu => {
    setUser(mu);
    setManualUsers([]);
  };

  const _handleSubmitNFC = (values, formikBag) => {
    // Assign tagID to user
    // Set checked-in to true
    // Set a check-in time
    formikBag.setSubmitting(false);
    setUser(null);
  };

  const _createUser = ({firstName, lastName, email, school, uid}) => ({
    name: firstName + ' ' + lastName,
    email: email,
    school: school,
    uid: uid
  });

  // Components
  const NFCModal = () => {
    const name = user !== null ? user.name : 'Error';
    const email = user !== null ? user.email : 'Error';
    const school = user !== null ? user.school : 'Error';
    return (
      <Dialog open={user !== null ? true : false}>
        <DialogTitle>Assign NFC Tag</DialogTitle>
        <Formik
          initialValues={{tagID: ''}}
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
                    inputProps={{maxLength: 10}}
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
        initialValues={{code: ''}}
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
                inputProps={{maxLength: 4}}
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
        initialValues={{firstName: '', lastName: ''}}
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
    const name = manualUsers.length > 0 ? manualUsers[0].name : 'Error';
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
