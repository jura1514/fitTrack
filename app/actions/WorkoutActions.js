import firebase from '../config/firebase';

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
            // for now just returning a count of array since dont need the whole array
            resolve(daysWithIds.length);
          } else {
            // for now just returning a count of array since dont need the whole array
            resolve(0);
          }
        })
        .catch(() => {
          dispatch({ type: actionTypes.getWorkoutDaysFetchErr });
          reject();
        });
    });
  };
};

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
