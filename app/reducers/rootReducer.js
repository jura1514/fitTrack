import { combineReducers } from 'redux';
import activeWorkoutReducer from './ActiveWorkoutReducer';
import workoutReducer from './WorkoutReducer';
import networkReducer from './NetworkReducer';

const rootReducer = combineReducers({
  network: networkReducer,
  activeWorkout: activeWorkoutReducer,
  workout: workoutReducer,
});

export default rootReducer;
