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

  signIn = async (email, password) => {
    await this.auth.signInWithEmailAndPassword(email, password);
  };

  signOut = async () => {
    await this.auth.signOut();
  };

  checkSignedIn = callback => {
    const unsubscriber = this.auth.onAuthStateChanged(user => {
      const val =
        user !== null && user.email === 'sponsors@swamphacks.com'
          ? true
          : false;
      callback(val);
    });
    return unsubscriber;
  };

  getMetaSize = (doc, callback) => {
    const ref = this.firestore
      .collection('years')
      .doc('2020')
      .collection('metadata')
      .doc(doc);
    const unsubscriber = ref.onSnapshot(snap => {
      const data = snap.data();
      callback(data.size);
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
