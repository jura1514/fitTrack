import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation";

import { Login } from "./app/views/Login.js";

const MyRoutes = createStackNavigator(
  {
    LoginRT: {
      screen: Login
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
