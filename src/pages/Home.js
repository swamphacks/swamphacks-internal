import React, {useState, useEffect} from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';

// Custom Components
import {withFirebase} from '../components/Firebase';
import SimpleDataDisplay from '../components/SimpleDataDisplay';

// Datas
const datas = [
  {
    label: 'Hacker Applications',
    index: 'numApplications'
  },
  {
    label: 'Mentor/Volunteer Applications',
    index: 'numMVApplications'
  }
];

const Home = ({firebase}) => {
  const [numApplications, setNumApplications] = useState(null);
  const [numMVApplications, setNumMVApplications] = useState(null);
  const state = {numApplications, numMVApplications};

  useEffect(() => {
    const unsubscribe1 = firebase.getMetaSize('applications', val =>
      setNumApplications(val)
    );
    const unsubscribe2 = firebase.getMetaSize(
      'mentorVolunteerApplications',
      val => setNumMVApplications(val)
    );
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <Grid container spacing={2}>
        {datas.map((d, index) => (
          <Grid key={d.index} item xs={12} md={3}>
            <SimpleDataDisplay label={d.label} data={state[d.index]} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default withFirebase(Home);
