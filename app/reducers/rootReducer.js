import { combineReducers } from 'redux';
import activeWorkoutReducer from './ActiveWorkoutReducer';
import workoutReducer from './WorkoutReducer';

const rootReducer = combineReducers({
  activeWorkout: activeWorkoutReducer,
  workout: workoutReducer,
});

export default rootReducer;
