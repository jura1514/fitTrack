const initialState = {
  days: [],
  exercises: [],
  activeWorkout: null,
  loading: true,
  error: '',
};

const activeWorkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FIND_ACTIVE_WORKOUT':
      return {
        ...state,
        activeWorkout: action.payload,
      };

    case 'FIND_ACTIVE_WORKOUT_ERROR':
      return {
        ...state,
        error: 'Could not get active workout',
      };

    case 'ACTIVE_DATA_FETCH':
      return {
        ...state,
        activeWorkout: action.activeWorkout,
        days: action.days,
        exercises: action.exercises,
        loading: false,
      };

    case 'ACTIVE_DATA_FETCH_EXERCISES_ERR':
      return {
        ...state,
        activeWorkout: action.activeWorkout,
        days: action.days,
        loading: false,
        error: 'Could not fetch exercises',
      };

    case 'ACTIVE_DATA_FETCH_DAYS_ERR':
      return {
        ...state,
        activeWorkout: action.activeWorkout,
        loading: false,
        error: 'Could not fetch days',
      };

    case 'ACTIVE_DATA_FETCH_WORKOUT_ERR':
      return {
        ...state,
        loading: false,
        error: 'Could not fetch active workout',
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

export default activeWorkoutReducer;
