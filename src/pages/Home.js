import React, { useState, useEffect } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

// Custom Components
import { withFirebase } from '../components/Firebase';
import SimpleDataDisplay from '../components/SimpleDataDisplay';
import ConfigSwitch from '../components/ConfigSwitch';
import PageTitle from '../components/PageTitle';
import Typography from '@material-ui/core/Typography';

// Styles
const useStyles = makeStyles(theme => ({
  root: {}
}));

// Datas
const datas = [
  {
    label: 'Hacker Applications',
    index: 'numHackers'
  },
  {
    label: 'Confirmed Hackers',
    index: 'numHackersConfirmed'
  },
  {
    label: 'Hackers Attended',
    index: 'numHackersAttended'
  },
  {
    label: 'Mentor Applications',
    index: 'numMentors'
  },
  {
    label: 'Volunteer Applications',
    index: 'numVolunteers'
  }
];

// Configs
const configs = [
  {
    label: 'Check-In',
    index: 'checkInOpen'
  },
  {
    label: 'Confirmations',
    index: 'confirmationsOpen'
  },
  {
    label: 'Hacker Applications',
    index: 'hackerAppsOpen'
  },
  {
    label: 'Mentor/Volunteer Applications',
    index: 'mentorVolunteerAppsOpen'
  },
  {
    label: 'Standby Applications',
    index: 'standbyAppsOpen'
  }
];

const Home = ({ firebase }) => {
  const classes = useStyles();
  const [data, setData] = useState({});
  const [config, setConfig] = useState({});

  useEffect(() => {
    const unsubscribe = firebase.getYearFields(val => {
      setConfig(val.config);
      setData(val.data);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <PageTitle>Home</PageTitle>
      {firebase.checkPermissionLevel() === 'ADMIN' ? (
        <React.Fragment>
          <Typography variant='h6'>Data</Typography>
          <Grid container spacing={2}>
            {datas.map(d => (
              <Grid key={d.index} item xs={12} md={6} lg={4}>
                <SimpleDataDisplay
                  label={d.label}
                  data={data[d.index] ? data[d.index] : null}
                />
              </Grid>
            ))}
          </Grid>
          <Typography variant='h6'>Configuration</Typography>
          <Grid container spacing={2}>
            {configs.map(d => (
              <Grid key={d.index} item xs={12} md={6} lg={4}>
                <ConfigSwitch
                  index={d.index}
                  label={d.label}
                  value={config[d.index] !== undefined ? config[d.index] : null}
                  onChange={firebase.setYearConfig}
                />
              </Grid>
            ))}
          </Grid>
        </React.Fragment>
      ) : (
        <Typography variant='subtitle1'>
          Access to this page is restricted.
        </Typography>
      )}
    </div>
  );
};

export default withFirebase(Home);
