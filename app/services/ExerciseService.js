import moment from 'moment';
import db from '../config/firebase';


export const deleteExecise = (id) => { db.database().ref(`Exercises/${id}`).set({}); };

export const addExerciseToDb = (name, sets, reps, description, dayId) => {
  const creationTime = moment().format('YYYY-MM-DD HH:mm');

  return db
    .database()
    .ref('/Exercises')
    .push({
      name,
      sets,
      reps,
      description,
      dayId,
      creationTime,
    })
    .then((data) => {
      // success callback
      return data.key;
    })
    .catch((error) => {
      // success callback
      return error;
    });
};

export const updateExerciseDb = (id, name, sets, reps, description) => db
  .database()
  .ref(`/Exercises/${id}`)
  .update({
    name,
    sets,
    reps,
    description,
  })
  .then((data) => {
    // success callback
    return data;
  })
  .catch((error) => {
    // error callback
    return error;
  });

export const getExercises = (id) => {
  return db
    .database()
    .ref('/Exercises')
    .orderByChild('dayId')
    .equalTo(id)
    .once('value');
};

export const getExercise = id => db
  .database()
  .ref(`/Exercises/${id}`)
  .once('value');
