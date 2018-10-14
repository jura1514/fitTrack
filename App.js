import React from 'react';
import { createStackNavigator } from 'react-navigation';

import Splash from './app/views/Splash';
import Login from './app/views/Login';
import Home from './app/views/Home';
import Signup from './app/views/Signup';
import Forgot from './app/views/Forgot';
import AddWorkout from './app/views/workout/AddWorkout';

const MyRoutes = createStackNavigator(
  {
    SplashRT: {
      screen: Splash,
    },
    LoginRT: {
      screen: Login,
    },
    HomeRT: {
      screen: Home,
    },
    SignupRT: {
      screen: Signup,
    },
    ForgotRT: {
      screen: Forgot,
    },
    AddWorkoutRT: {
      screen: AddWorkout,
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
