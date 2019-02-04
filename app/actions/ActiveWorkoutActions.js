import firebase from '../config/firebase';

const actionTypes = {
  getActiveDataFetch: 'ACTIVE_DATA_FETCH',
  getActiveDataFetchExercisesErr: 'ACTIVE_DATA_FETCH_EXERCISES_ERR',
  getActiveDataFetchDaysErr: 'ACTIVE_DATA_FETCH_DAYS_ERR',
  getActiveDataFetchWorkoutErr: 'ACTIVE_DATA_FETCH_WORKOUT_ERR',
};

export const loadDayExercises = (activeWorkout, days, id) => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref('/Exercises')
      .orderByChild('dayId')
      .equalTo(id)
      .once('value', (snapshot) => {
        if (snapshot.val()) {
          const exercises = Object.entries(snapshot.val());

          const exercisesWithIds = exercises.map((e) => {
            // eslint-disable-next-line
            e[1].id = e[0];
            return e[1];
          });

          resolve(exercisesWithIds);
        }
        resolve([]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


export const loadWorkoutDays = (activeWorkout) => {
  return (dispatch) => {
    firebase
      .database()
      .ref('/Days')
      .orderByChild('workoutId')
      .equalTo(activeWorkout.id)
      .once('value', (snapshot) => {
        if (snapshot.val()) {
          const days = Object.entries(snapshot.val());

          const daysWithIds = days.map((e) => {
            // eslint-disable-next-line
            e[1].id = e[0];
            return e[1];
          });

          const daysIds = daysWithIds.map(e => e.id);
          const promises = [];

          daysIds.forEach((e) => {
            promises.push(loadDayExercises(activeWorkout, daysIds, e));
          });

          Promise.all(promises).then((data) => {
            const allExercises = [].concat(...data);

            dispatch({
              type: actionTypes.getActiveDataFetch,
              activeWorkout,
              days: daysWithIds,
              exercises: allExercises,
            });
          }).catch(() => {
            dispatch({
              type: actionTypes.getActiveDataFetchExercisesErr,
              activeWorkout,
              days: daysWithIds,
              exercises: [],
            });
          });
        }
        dispatch({
          type: actionTypes.getActiveDataFetch,
          activeWorkout,
          days: [],
          exercises: [],
        });
      })
      .catch(() => {
        dispatch({ type: actionTypes.getActiveDataFetchDaysErr, activeWorkout });
      });
  };
};


export const loadActiveData = () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase
      .database()
      .ref('/Workouts')
      .orderByChild('email')
      .equalTo(currentUser.email)
      .once('value', (snapshot) => {
        const workouts = snapshot.val();
        let active = null;
        // eslint-disable-next-line
        for (let key in workouts) {
          const newObj = workouts[key];
          if (newObj.isActive) {
            newObj.id = key;
            // it can only be 1 active workout
            active = newObj;
            break;
          }
        }

        if (active) {
          dispatch(loadWorkoutDays(active));
        }

        dispatch({
          type: actionTypes.getActiveDataFetch,
          activeWorkout: null,
          days: [],
          exercises: [],
        });
      })
      .catch(() => {
        dispatch({ type: actionTypes.getActiveDataFetchWorkoutErr });
      });
  };
};