const initialState = {
  isConnected: true,
};

const networkReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NETWORK_CHANGE':
      return {
        ...state,
        isConnected: action.payload,
      };

    default:
      return state;
  }
};

export default networkReducer;
