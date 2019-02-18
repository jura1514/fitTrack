const initialState = {
  loggedInUser: null,
  isLoggedIn: false,
};

const networkReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_WITH_EMAIL_AND_PASSWORD':
      return {
        ...state,
        loggedInUser: action.payload,
        isLoggedIn: action.isLoggedIn,
      };

    case 'LOGIN_WITH_EMAIL_AND_PASSWORD_ERR':
      return {
        ...state,
        loggedInUser: action.payload,
        isLoggedIn: action.isLoggedIn,
      };

    case 'CHECK_USER_LOGGEDIN':
      return {
        ...state,
        addWorkoutQueue: action.payload,
      };

    default:
      return state;
  }
};

export default networkReducer;
