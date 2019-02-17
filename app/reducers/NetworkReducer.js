const initialState = {
  isConnected: true,
  queue: [],
};

const networkReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NETWORK_CHANGE':
      return {
        ...state,
        isConnected: action.payload,
      };

    case 'CLEAR_QUEUE':
      return {
        queue: [],
      };

    case 'ADD_TO_QUEUE': {
      const q = state.queue;
      q.push(action);

      return {
        queue: q,
      };
    }

    default:
      return state;
  }
};

export default networkReducer;
