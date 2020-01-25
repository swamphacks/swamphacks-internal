import React, { useState, useEffect } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import { withFirebase } from '../components/Firebase';
import SimpleDataDisplay from '../components/SimpleDataDisplay';
import ConfigSwitch from '../components/ConfigSwitch';
import PageTitle from '../components/PageTitle';

// Styles
const useStyles = makeStyles(theme => ({
  root: {},
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  }
}));

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
  const [data, setData] = useState([]);
  const [config, setConfig] = useState({});

  const _getDataArray = dataObject => {
    const keys = Object.keys(dataObject);
    const ret = [];
    for (const key of keys) {
      const d = dataObject[key];
      ret.push({
        label: d.name,
        value: d.num
      });
    }
    return ret;
  };

  useEffect(() => {
    const unsubscribe = firebase.getYearFields(val => {
      setConfig(val.config);
      const { events, people, ...others } = val.data;
      const eventsData = _getDataArray(events);
      const peopleData = _getDataArray(people);
      setData([...peopleData, ...eventsData]);
    });
    return unsubscribe;
  }, []);

  const Progress = () => (
    <div className={classes.progressContainer}>
      <CircularProgress />
    </div>
  );

  return (
    <div>
      <PageTitle>Home</PageTitle>
      {firebase.checkPermissionLevel() === 'ADMIN' ? (
        <React.Fragment>
          <Typography variant='h6'>Data</Typography>
          {data.length > 0 ? (
            <Grid container spacing={2}>
              {data.map((d, index) => (
                <Grid key={index} item xs={12} md={6} lg={4}>
                  <SimpleDataDisplay label={d.label} data={d.value} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Progress />
          )}

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
