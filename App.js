import React from 'react';
import { createStackNavigator } from 'react-navigation';

import Login from './app/views/Login';
import Home from './app/views/Home';
import Signup from './app/views/Signup';
import Forgot from './app/views/Forgot';

const MyRoutes = createStackNavigator(
  {
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
  },
  {
    initialRouteName: 'LoginRT',
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
