const initialState = {
  workouts: [],
  days: [],
  exercisesForDay: [],
  foundWorkout: null,
  workoutName: '',
  workoutActiveState: false,
  loading: true,
  error: '',
};

const workoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADED_WORKOUT':
      return {
        ...state,
        foundWorkout: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_WORKOUT_NAME':
      return {
        ...state,
        workoutName: action.payload,
      };

    case 'SET_WORKOUT_ACTIVE_STATE':
      return {
        ...state,
        workoutActiveState: action.payload,
      };

    case 'WORKOUTS_FETCH':
      return {
        ...state,
        workouts: action.payload,
        loading: false,
      };

    case 'WORKOUTS_FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: 'Could not fetch workouts',
      };

    case 'WORKOUT_DAYS_FETCH':
      return {
        ...state,
        days: action.payload,
        loading: false,
      };

    case 'WORKOUT_DAYS_FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: 'Could not fetch days',
      };

    case 'WORKOUT_FETCH':
      return {
        ...state,
        foundWorkout: action.payload,
        loading: false,
      };

    case 'WORKOUT_FETCH_ERROR':
      return {
        ...state,
        error: 'Could not fetch workout',
      };

    case 'DELETE_WORKOUT':
      return {
        ...state,
      };

    case 'DELETE_WORKOUT_ERROR':
      return {
        ...state,
        error: 'Could not delete workout',
      };

    case 'EXERCISES_FOR_DAY_FETCH':
      return {
        ...state,
        exercisesForDay: action.payload,
        loading: false,
      };

    case 'EXERCISES_FOR_DAY_FETCH_ERROR':
      return {
        ...state,
        error: 'Could not fetch workout',
      };

    default:
      return state;
  }
};

export default workoutReducer;
