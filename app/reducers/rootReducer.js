import { combineReducers } from 'redux';
import activeWorkoutReducer from './ActiveWorkoutReducer';
import workoutReducer from './WorkoutReducer';
import networkReducer from './NetworkReducer';
import authReducer from './AuthReducer';

const rootReducer = combineReducers({
  network: networkReducer,
  activeWorkout: activeWorkoutReducer,
  workout: workoutReducer,
  auth: authReducer,
});

export default rootReducer;
