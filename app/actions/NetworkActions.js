import {
  updateWorkout,
  addWorkoutToDb,
  deleteWorkout,
} from '../services/WorkoutService';

const actionTypes = {
  networkChangeAction: 'NETWORK_CHANGE',
  addWorkoutToQueueAction: 'ADD_WORKOUT_QUEUE',
  clearAddWorkoutQueueAction: 'CLEAR_ADD_WORKOUT_QUEUE',
  updateWorkoutToQueueAction: 'UPDATE_WORKOUT_QUEUE',
  clearUpdateWorkoutQueueAction: 'CLEAR_UPDATE_WORKOUT_QUEUE',
  deleteWorkoutToQueueAction: 'DELETE_WORKOUT_QUEUE',
  clearDeleteWorkoutQueueAction: 'CLEAR_DELETE_WORKOUT_QUEUE',
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

export const updateWorkoutToQueue = (workout) => {
  return {
    type: actionTypes.updateWorkoutToQueueAction,
    payload: workout,
  };
};

export const clearUpdateWorkoutQueue = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { updateWorkoutQueue } = state.network;
    if (updateWorkoutQueue && updateWorkoutQueue.length > 0) {
      let counter = 0;
      updateWorkoutQueue.forEach((e) => {
        updateWorkout(e.workoutId, e.name, e.isActive)
          .then(() => {
            counter += 1;

            if (counter === updateWorkoutQueue.length) {
              dispatch({
                type: actionTypes.clearUpdateWorkoutQueueAction,
                payload: [],
              });
            }
          })
          .catch(() => {
            dispatch({
              type: actionTypes.clearUpdateWorkoutQueueAction,
              payload: [],
            });
          });
      });
    }
  };
};

export const deleteWorkoutToQueue = (id) => {
  return {
    type: actionTypes.deleteWorkoutToQueueAction,
    payload: id,
  };
};

export const clearDeleteWorkoutQueue = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { deleteWorkoutQueue } = state.network;
    if (deleteWorkoutQueue && deleteWorkoutQueue.length > 0) {
      let counter = 0;
      deleteWorkoutQueue.forEach((id) => {
        deleteWorkout(id)
          .then(() => {
            counter += 1;

            if (counter === deleteWorkoutQueue.length) {
              dispatch({
                type: actionTypes.clearDeleteWorkoutQueueAction,
                payload: [],
              });
            }
          })
          .catch(() => {
            dispatch({
              type: actionTypes.clearDeleteWorkoutQueueAction,
              payload: [],
            });
          });
      });
    }
  };
};
