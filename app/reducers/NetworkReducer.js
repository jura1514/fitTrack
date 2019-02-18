const initialState = {
  isConnected: true,
  addWorkoutQueue: [],
  updateWorkoutQueue: [],
};

const networkReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NETWORK_CHANGE':
      return {
        ...state,
        isConnected: action.payload,
      };

    case 'CLEAR_ADD_WORKOUT_QUEUE':
      return {
        ...state,
        addWorkoutQueue: action.payload,
      };

    case 'ADD_WORKOUT_QUEUE': {
      return {
        ...state,
        addWorkoutQueue: state.addWorkoutQueue.concat([action.payload]),
      };
    }

    default:
      return state;
  }
};

export default networkReducer;
