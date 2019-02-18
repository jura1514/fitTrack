import moment from 'moment';
import db from '../config/firebase';

export const getCurrentUser = () => {
  const user = db.auth().currentUser;
  return user;
};

export const deleteWorkout = (id) => {
  return db.database().ref(`Workouts/${id}`).set({});
};

export const addWorkoutToDb = (name, isActive) => {
  const creationTime = moment().format('YYYY-MM-DD HH:mm');
  const user = getCurrentUser();
  const { email } = user;

  return db
    .database()
    .ref('/Workouts')
    .push({
      name,
      isActive,
      email,
      creationTime,
    })
    .then(() => {
      // success callback
      // console.log('data ', data);
    })
    .catch((error) => {
      // error callback
      console.log('error ', error);
    });
};

export const updateWorkout = (id, name, isActive) => db
  .database()
  .ref(`/Workouts/${id}`)
  .update({
    name,
    isActive,
  })
  .then(() => {
    // success callback
    // console.log('data ', data);
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
