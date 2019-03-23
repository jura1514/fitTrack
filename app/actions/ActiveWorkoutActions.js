import firebase from '../config/firebase';
import { retrieveData } from '../services/AsyncStorage';

const actionTypes = {
  setLoadingAction: 'SET_LOADING',
  findActiveWorkout: 'FIND_ACTIVE_WORKOUT',
  findActiveWorkoutError: 'FIND_ACTIVE_WORKOUT_ERROR',
  getActiveDataFetch: 'ACTIVE_DATA_FETCH',
  getActiveDataFetchExercisesErr: 'ACTIVE_DATA_FETCH_EXERCISES_ERR',
  getActiveDataFetchDaysErr: 'ACTIVE_DATA_FETCH_DAYS_ERR',
  getActiveDataFetchWorkoutErr: 'ACTIVE_DATA_FETCH_WORKOUT_ERR',
};

export const setLoading = (value) => {
  return {
    type: actionTypes.setLoadingAction,
    payload: value,
  };
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
  const { email } = currentUser;
  const providerEmail = currentUser.providerData[0].email;

  return (dispatch) => {
    firebase
      .database()
      .ref('/Workouts')
      .orderByChild('email')
      .equalTo(email || providerEmail)
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

export const findActiveWorkout = () => {
  const { currentUser } = firebase.auth();
  const { email } = currentUser;
  const providerEmail = currentUser.providerData[0].email;

  return (dispatch) => {
    firebase
      .database()
      .ref('/Workouts')
      .orderByChild('email')
      .equalTo(email || providerEmail)
      .once('value', (snapshot) => {
        const workouts = Object.entries(snapshot.val());
        const active = workouts.find(w => w.find(e => e.isActive));
        dispatch({
          type: actionTypes.findActiveWorkout,
          payload: active,
        });
      })
      .catch(() => {
        dispatch({ type: actionTypes.findActiveWorkoutError });
      });
  };
};

// load from local storage workouts if app offline
export const loadActiveDataFromStorage = () => {
  return (dispatch) => {
    retrieveData('workouts').then((workouts) => {
      const parsedWorkouts = JSON.parse(workouts);
      if (parsedWorkouts) {
        const activeWorkout = parsedWorkouts.find(e => e.isActive);

        if (activeWorkout) {
          retrieveData('days').then((days) => {
            const parsedDays = JSON.parse(days);
            if (parsedDays) {
              const activeWorkoutDays = parsedDays.filter(e => e.workoutId === activeWorkout.id);
              if (activeWorkoutDays) {
                retrieveData('exercises').then((exercises) => {
                  const parsedExercises = JSON.parse(exercises);
                  if (parsedExercises) {
                    const allExercises = [];
                    activeWorkoutDays.forEach((day) => {
                      const dayExercises = parsedExercises.filter(e => e.dayId === day.id);
                      allExercises.push(...dayExercises);
                    });
                    dispatch({
                      type: actionTypes.getActiveDataFetch,
                      activeWorkout,
                      days: activeWorkoutDays,
                      exercises: allExercises,
                    });
                  } else {
                    dispatch({
                      type: actionTypes.getActiveDataFetch,
                      activeWorkout,
                      days: activeWorkoutDays,
                      exercises: [],
                    });
                  }
                });
              } else {
                dispatch({
                  type: actionTypes.getActiveDataFetch,
                  activeWorkout,
                  days: [],
                  exercises: [],
                });
              }
            } else {
              dispatch({
                type: actionTypes.getActiveDataFetch,
                activeWorkout,
                days: [],
                exercises: [],
              });
            }
          });
        } else {
          dispatch({
            type: actionTypes.getActiveDataFetch,
            activeWorkout: null,
            days: [],
            exercises: [],
          });
        }
      } else {
        dispatch({
          type: actionTypes.getActiveDataFetch,
          activeWorkout: null,
          days: [],
          exercises: [],
        });
      }
    });
  };
};

// load data for specific workout from the local database if app offline
export const findActiveWorkoutFromStorage = () => {
  return (dispatch) => {
    retrieveData('workouts').then((workouts) => {
      const parsedWorkouts = JSON.parse(workouts);
      if (parsedWorkouts) {
        const activeWorkout = parsedWorkouts.find(e => e.isActive);

        dispatch({
          type: actionTypes.findActiveWorkout,
          payload: activeWorkout,
        });
      } else {
        dispatch({ type: actionTypes.findActiveWorkoutError });
      }
    }).catch(() => {
      dispatch({ type: actionTypes.findActiveWorkoutError });
    });
  };
};
