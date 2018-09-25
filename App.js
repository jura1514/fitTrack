import React from "react";
import { createStackNavigator } from "react-navigation";

import { Login } from "./app/views/Login.js";
import { Home } from "./app/views/Home.js";

const MyRoutes = createStackNavigator(
  {
    LoginRT: {
      screen: Login
    },
    HomeRT: {
      screen: Home
    }
  },
  {
    initialRouteName: "LoginRT",
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: "bold"
      },
      headerLayoutPreset: 'center'
    }),
  }
);

export default class App extends React.Component {
  render() {
    return <MyRoutes />;
  }
}
