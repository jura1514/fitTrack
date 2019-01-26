import React from 'react';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import Splash from './app/views/Splash';
import Login from './app/views/Login';
import Home from './app/views/Home';
import Signup from './app/views/Signup';
import Forgot from './app/views/Forgot';
import ManageWorkout from './app/views/workout/ManageWorkout';
import ManageDays from './app/views/workout/ManageDays';
import WorkoutList from './app/views/workout/WorkoutList';

const HomeStack = createStackNavigator(
  {
    HomeRT: {
      screen: Home,
    },
  },
);
const WorkoutListStack = createStackNavigator(
  {
    WorkoutListRT: {
      screen: WorkoutList,
    },
  },
);

const MyDrawerRoutes = createDrawerNavigator({
  Home: {
    screen: HomeStack,
  },
  Workout: {
    screen: WorkoutListStack,
  },
}, {
  drawerPosition: 'Left',
});

const MyRoutes = createStackNavigator(
  {
    SplashRT: {
      screen: Splash,
    },
    LoginRT: {
      screen: Login,
    },
    HomeRT: {
      screen: MyDrawerRoutes,
      navigationOptions: {
        header: null,
      },
    },
    SignupRT: {
      screen: Signup,
    },
    ForgotRT: {
      screen: Forgot,
    },
    WorkoutListRT: {
      screen: WorkoutList,
    },
    ManageWorkoutRT: {
      screen: ManageWorkout,
    },
    ManageDaysRT: {
      screen: ManageDays,
    },
  },
  {
    initialRouteName: 'SplashRT',
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerLayoutPreset: 'center',
    }),
  },
);

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component {
  render() {
    return <MyRoutes />;
  }
}

export default App;
