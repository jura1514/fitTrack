import Firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCIiMiaPROdVzb3YwTVNR7JoF6IlRKZq6k',
  authDomain: 'fit-track-e6b50.firebaseapp.com',
  databaseURL: 'https://fit-track-e6b50.firebaseio.com',
  projectId: 'fit-track-e6b50',
  storageBucket: 'fit-track-e6b50.appspot.com',
  messagingSenderId: '167988727653',
};
const app = Firebase.initializeApp(config);
const db = app;
export default db;
