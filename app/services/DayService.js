import moment from 'moment';
import db from '../config/firebase';

export const getCurrentUser = () => {
  const user = db.auth().currentUser;
  return user;
};

export const deleteDay = (id) => { db.database().ref(`Days/${id}`).set({}); };

export const addDayToDb = (name, weekDay, workoutId) => {
  const creationTime = moment().format('YYYY-MM-DD HH:mm');

  return db
    .database()
    .ref('/Days')
    .push({
      name,
      weekDay,
      workoutId,
      creationTime,
    })
    .then((data) => {
      // success callback
      return data.key;
    })
    .catch((error) => {
      // error callback
      return error;
    });
};

export const updateDayDb = (id, name, weekDay) => db
  .database()
  .ref(`/Days/${id}`)
  .update({
    name,
    weekDay,
  })
  .then((data) => {
    // success callback
    return data;
  })
  .catch((error) => {
    // error callback
    return error;
  });

export const getDays = (id) => {
  return db
    .database()
    .ref('/Days')
    .orderByChild('workoutId')
    .equalTo(id)
    .once('value');
};

export const getDay = id => db
  .database()
  .ref(`/Days/${id}`)
  .once('value');
