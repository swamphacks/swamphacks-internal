import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React from 'react';
import firebaseConfig from '../firebaseConfig.json';

const FirebaseContext = React.createContext(null);

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.firestore = firebase.firestore();
    this.auth = firebase.auth();
  }

  signOut = async () => {
    await this.auth.signOut();
  };

  checkSignedIn = callback => {
    const unsubscriber = this.auth.onAuthStateChanged(user => {
      const val = user !== null ? true : false;
      console.log(val);
      callback(val);
    });
    return unsubscriber;
  };
}

const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default Firebase;

export {FirebaseContext, withFirebase};
