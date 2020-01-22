import React, { useState, useEffect } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

// Custom Components
import { withFirebase } from '../components/Firebase';
import SimpleDataDisplay from '../components/SimpleDataDisplay';
import PageTitle from '../components/PageTitle';

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

const Home = ({ firebase }) => {
  const classes = useStyles();
  const [data, setData] = useState({
    numHackers: null,
    numHackersConfirmed: null,
    numMentors: null,
    numVolunteers: null,
    numHackersAttended: null
  });

  useEffect(() => {
    const unsubscribe = firebase.getMetadata(val => {
      setData(val);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <PageTitle>Home</PageTitle>
      <Grid container spacing={2}>
        {datas.map((d, index) => (
          <Grid key={d.index} item xs={12} md={6} lg={4}>
            <SimpleDataDisplay
              label={d.label}
              data={data[d.index] !== null ? data[d.index] : null}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default withFirebase(Home);
