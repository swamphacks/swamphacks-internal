import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import React from 'react';
import firebaseConfig from '../firebaseConfig.json';

const FirebaseContext = React.createContext(null);

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.firestore = firebase.firestore();
    this.auth = firebase.auth();
    this.functions = firebase.functions();
    this.checkIn = this.functions.httpsCallable('checkIn');
    this.getHackerByCode = this.functions.httpsCallable('getHackerByCode');
    this.getHackersByName = this.functions.httpsCallable('getHackersByName');
    this.getFoodTokens = this.functions.httpsCallable('getFoodTokens');
    this.consumeToken = this.functions.httpsCallable('consumeToken');
    this.setYearConfig = this.functions.httpsCallable('setYearConfig');
  }

  signIn = async (email, password) => {
    await this.auth.signInWithEmailAndPassword(email, password);
    return (
      this.auth.currentUser.email === 'sponsors@swamphacks.com' ||
      this.auth.currentUser.email === 'volunteer@swamphacks.com'
    );
  };

  checkPermissionLevel = () => {
    if (this.auth.currentUser.email === 'sponsors@swamphacks.com') {
      return 'ADMIN';
    } else {
      return 'STANDARD';
    }
  };

  signOut = async () => {
    await this.auth.signOut();
  };

  checkSignedIn = callback => {
    const unsubscriber = this.auth.onAuthStateChanged(user => {
      const val =
        user !== null &&
        (user.email === 'sponsors@swamphacks.com' ||
          user.email === 'volunteer@swamphacks.com')
          ? true
          : false;
      callback(val);
    });
    return unsubscriber;
  };

  getYearFields = callback => {
    const ref = this.firestore.collection('years').doc('2020');
    const unsubscriber = ref.onSnapshot(snap => {
      const datas = snap.data();
      callback(datas);
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

export { FirebaseContext, withFirebase };
