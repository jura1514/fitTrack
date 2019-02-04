import React from 'react';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import Thunk from 'redux-thunk';
import Splash from './app/views/Splash';
import Login from './app/views/Login';
import Home from './app/views/Home';
import Signup from './app/views/Signup';
import Forgot from './app/views/Forgot';
import ManageWorkout from './app/views/workout/ManageWorkout';
import ManageDays from './app/views/workout/ManageDays';
import WorkoutList from './app/views/workout/WorkoutList';
import DrawerContent from './app/sections/DrawerContent';
import reducers from './app/reducers/ActiveWorkoutReducer';

const store = createStore(
  reducers,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(Thunk),
);

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
    navigationOptions: {
      drawerIcon: () => (
        <FontAwesome name="home" size={25} />
      ),
    },
  },
  Workouts: {
    screen: WorkoutListStack,
    navigationOptions: {
      drawerIcon: () => (
        <MaterialCommunityIcons name="dumbbell" size={25} />
      ),
    },
  },
}, {
  drawerPosition: 'Left',
  contentComponent: DrawerContent,
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
    console.disableYellowBox = true;
    return (
      <Provider store={store}>
        <MyRoutes />
      </Provider>
    );
  }
}

export default App;
