import React from 'react';
import { Formik, Form } from 'formik';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import { withFirebase } from '../components/Firebase';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
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

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Must be a valid email.')
    .required('This field is required.'),
  password: yup.string().required('This field is required.')
});

const Login = ({ firebase }) => {
  // Hooks
  const classes = useStyles();
  const history = useHistory();
  // Functions
  const _handleSubmit = async (values, formikBag) => {
    const { email, password } = values;
    console.log(values);
    try {
      const success = await firebase.signIn(email, password);
      if (!success) {
        formikBag.setFieldError(
          'email',
          'This account does not have permission to view this site.'
        );
        formikBag.setSubmitting(false);
      } else {
        history.push('/');
      }
    } catch (error) {
      console.log(error);
      formikBag.setSubmitting(false);
    }
  };
  // Components
  const LoginForm = () => (
    <Box component='section' className={classes.container}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={schema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={_handleSubmit}
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
                  type='email'
                  label='Email'
                  name='email'
                  variant='outlined'
                  margin='dense'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  error={errors.email && touched.email ? true : false}
                  helperText={errors.email && touched.email ? errors.email : ''}
                  fullWidth
                />
                <TextField
                  className={classes.textField}
                  type='password'
                  label='Password'
                  name='password'
                  variant='outlined'
                  margin='dense'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  error={errors.password && touched.password ? true : false}
                  helperText={
                    errors.password && touched.password ? errors.password : ''
                  }
                  fullWidth
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
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );

  const LoadingBox = () => (
    <Box className={classes.container}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <LoginForm />
      </Box>
    </Box>
  );
};

export default withFirebase(Login);
