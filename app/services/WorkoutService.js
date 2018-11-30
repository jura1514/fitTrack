import moment from 'moment';
import db from '../config/firebase';

export const getCurrentUser = () => {
  const user = db.auth().currentUser;
  return user;
};

export const deleteWorkout = (id) => { db.database().ref(`Workouts/${id}`).set({}); };

export const addWorkoutToDb = (name, numberOfDays, isActive) => {
  const creationTime = moment().format('YYYY-MM-DD HH:mm');
  const user = getCurrentUser();
  const { email } = user;

  return db
    .database()
    .ref('/Workouts')
    .push({
      name,
      numberOfDays,
      isActive,
      email,
      creationTime,
    })
    .then((data) => {
      // success callback
      console.log('data ', data);
    })
    .catch((error) => {
      // error callback
      console.log('error ', error);
    });
};

export const updateWorkout = (id, name, numberOfDays, isActive) => db
  .database()
  .ref(`/Workouts/${id}`)
  .update({
    name,
    numberOfDays,
    isActive,
  })
  .then((data) => {
    // success callback
    console.log('data ', data);
  })
  .catch((error) => {
    // error callback
    console.log('error ', error);
  });

export const getWorkouts = () => {
  const user = getCurrentUser();
  const { email } = user;

  return db
    .database()
    .ref('/Workouts')
    .orderByChild('email')
    .equalTo(email)
    .once('value');
};

export const getWorkout = id => db
  .database()
  .ref(`/Workouts/${id}`)
  .once('value');

export function formatDateTime(dateString) {
  const parsed = moment(new Date(dateString));

  if (!parsed.isValid()) {
    return dateString;
  }

  return parsed.format('H A on D MMM YYYY');
}
