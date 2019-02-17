import moment from 'moment';
import firebase from '../config/firebase';
import { retrieveData, storeData } from '../services/AsyncStorage';

const actionTypes = {
  setLoadingAction: 'SET_LOADING',
  updateWorkoutNameAction: 'SET_WORKOUT_NAME',
  updateWorkoutActiveStateAction: 'SET_WORKOUT_ACTIVE_STATE',
  getWorkoutsFetch: 'WORKOUTS_FETCH',
  getWorkoutsFetchError: 'WORKOUTS_FETCH_ERROR',
  getWorkoutDaysFetch: 'WORKOUT_DAYS_FETCH',
  getWorkoutDaysFetchError: 'WORKOUT_DAYS_FETCH_ERROR',
  getWorkoutFetch: 'WORKOUT_FETCH',
  getWorkoutFetchError: 'WORKOUT_FETCH_ERROR',
  deleteWorkoutAction: 'DELETE_WORKOUT',
  deleteWorkoutActionError: 'DELETE_WORKOUT_ERROR',
};

export const setLoading = (value) => {
  return {
    type: actionTypes.setLoadingAction,
    payload: value,
  };
};

export const setWorkoutName = (value) => {
  return {
    type: actionTypes.updateWorkoutNameAction,
    payload: value,
  };
};

export const setWorkoutActiveState = (value) => {
  return {
    type: actionTypes.updateWorkoutActiveStateAction,
    payload: value,
  };
};

// get days count for workouts
export const loadWorkoutDays = (workoutId) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref('/Days')
        .orderByChild('workoutId')
        .equalTo(workoutId)
        .once('value', (snapshot) => {
          if (snapshot.val()) {
            const days = Object.entries(snapshot.val());
            const daysWithIds = days.map((e) => {
              // eslint-disable-next-line
              e[1].id = e[0];
              return e[1];
            });

            dispatch({ type: actionTypes.getWorkoutDaysFetch, payload: daysWithIds });
            resolve(daysWithIds);
          } else {
            resolve(null);
          }
        })
        .catch(() => {
          dispatch({ type: actionTypes.getWorkoutDaysFetchErr });
          reject();
        });
    });
  };
};

// load all workouts -> return them to view and store locally
export const loadWorkoutsData = () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref('/Workouts')
        .orderByChild('email')
        .equalTo(currentUser.email)
        .once('value', (snapshot) => {
          const workouts = Object.entries(snapshot.val());

          const workoutsWithIds = workouts.map((e) => {
          // eslint-disable-next-line
          e[1].id = e[0];
            return e[1];
          });

          // store data locally
          storeData('workouts', JSON.stringify(workoutsWithIds));

          dispatch({ type: actionTypes.getWorkoutsFetch, payload: workoutsWithIds });
          resolve();
        })
        .catch(() => {
          dispatch({ type: actionTypes.getWorkoutsFetchErr });
          reject();
        });
    });
  };
};

// load from local storage workouts if app offline
export const loadWorkoutsFromStorage = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      retrieveData('workouts').then((workouts) => {
        const parsedWorkouts = JSON.parse(workouts);
        if (parsedWorkouts) {
          resolve(parsedWorkouts);
          dispatch({ type: actionTypes.getWorkoutsFetch, payload: parsedWorkouts });
        } else {
          dispatch({ type: actionTypes.getWorkoutsFetchErr });
          reject();
        }
      });
    });
  };
};

// load from local storage days if app offline
export const loadDaysFromStorage = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      retrieveData('days').then((days) => {
        const parsedDays = JSON.parse(days);
        if (parsedDays) {
          resolve(parsedDays);
          dispatch({ type: actionTypes.getWorkoutDaysFetch, payload: parsedDays });
        } else {
          dispatch({ type: actionTypes.getWorkoutDaysFetchErr });
          reject();
        }
      }).catch((error) => {
        dispatch({ type: actionTypes.getWorkoutDaysFetchErr });
        reject(error);
      });
    });
  };
};

// load data for specific workout from the local database if app offline
export const loadWorkoutDataFromStorage = (id, dispatchExtra) => {
  return (dispatch) => {
    retrieveData('workouts').then((workouts) => {
      const parsedWorkouts = JSON.parse(workouts);
      if (parsedWorkouts) {
        const workout = parsedWorkouts.find(e => e.id === id);
        if (workout) {
          if (dispatchExtra) {
            dispatch(setWorkoutName(workout.name));
            dispatch(setWorkoutActiveState(workout.isActive));
            dispatch({ type: actionTypes.getWorkoutFetch, payload: workout });
          } else {
            dispatch({ type: actionTypes.getWorkoutFetch, payload: workout });
          }
        } else {
          dispatch({ type: actionTypes.getWorkoutFetch, payload: null });
        }
      } else {
        dispatch({ type: actionTypes.getWorkoutFetch, payload: null });
      }
    }).catch(() => {
      dispatch({ type: actionTypes.getWorkoutFetchErr });
    });
  };
};

// load data for specific workout
export const loadWorkoutData = (id, dispatchExtra) => {
  return (dispatch) => {
    firebase
      .database()
      .ref(`/Workouts/${id}`)
      .once('value', (snapshot) => {
        if (snapshot.val()) {
          const workout = snapshot.val();

          if (dispatchExtra) {
            dispatch(setWorkoutName(workout.name));
            dispatch(setWorkoutActiveState(workout.isActive));
            dispatch({ type: actionTypes.getWorkoutFetch, payload: workout });
          } else {
            dispatch({ type: actionTypes.getWorkoutFetch, payload: workout });
          }
        } else {
          dispatch({ type: actionTypes.getWorkoutFetch, payload: null });
        }
      })
      .catch(() => {
        dispatch({ type: actionTypes.getWorkoutFetchErr });
      });
  };
};

// delete workout
export const deleteWorkoutAction = (id) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(`Workouts/${id}`)
        .set({}, () => {
          dispatch({ type: actionTypes.deleteWorkoutAction });
          resolve();
        })
        .catch(() => {
          dispatch({ type: actionTypes.deleteWorkoutActionError });
          reject();
        });
    });
  };
};


export const addNewWorkout = (name, makeActive) => {
  const creationTime = moment().format('YYYY-MM-DD HH:mm');
  const { currentUser } = firebase.auth();
  const { email } = currentUser;

  return (dispatch, getState) => {
    const state = getState();
    const { isConnected } = state.network;
    firebase
      .database()
      .ref('/Workouts')
      .push({
        name,
        makeActive,
        email,
        creationTime,
      })
      .then((data) => {
      // success callback
        console.log('data ', data);

        // dispatch({
        //   type: actionTypes.findActiveWorkout,
        //   payload: active,
        // });
      })
      .catch(() => {
        // dispatch({ type: actionTypes.findActiveWorkoutError });
      });
  };
};
