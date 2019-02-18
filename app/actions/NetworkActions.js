import {
  addWorkoutToDb,
} from '../services/WorkoutService';

const actionTypes = {
  networkChangeAction: 'NETWORK_CHANGE',
  addWorkoutToQueueAction: 'ADD_WORKOUT_QUEUE',
  clearAddWorkoutQueueAction: 'CLEAR_ADD_WORKOUT_QUEUE',
};

export const networkChange = (isConnected) => {
  return {
    type: actionTypes.networkChangeAction,
    payload: isConnected,
  };
};

export const addWorkoutToQueue = (workout) => {
  return {
    type: actionTypes.addWorkoutToQueueAction,
    payload: workout,
  };
};

export const clearAddWorkoutQueue = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { addWorkoutQueue } = state.network;
    if (addWorkoutQueue && addWorkoutQueue.length > 0) {
      let counter = 0;
      addWorkoutQueue.forEach((e) => {
        addWorkoutToDb(e.name, e.isActive)
          .then(() => {
            counter += 1;

            if (counter === addWorkoutQueue.length) {
              dispatch({
                type: actionTypes.clearAddWorkoutQueueAction,
                payload: [],
              });
            }
          })
          .catch(() => {
            dispatch({
              type: actionTypes.clearAddWorkoutQueueAction,
              payload: [],
            });
          });
      });
    }
  };
};
