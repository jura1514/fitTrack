const initialState = {
  days: [],
  exercises: [],
  activeWorkout: null,
  loading: true,
  error: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
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

    default:
      return state;
  }
};
