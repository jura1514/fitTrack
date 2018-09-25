import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  AsyncStorage
} from "react-native";
// import { Expo } from "expo";

const FB_APP_ID = "298553117405390";

export class Login extends React.Component {
  static navigationOptions = {
    title: "Login"
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      passwrd: ""
    };
  }

  cancelLogin = () => {
    Alert.alert("Login cancelled");
    this.props.navigation.navigate("HomeRT");
  };

  // loginUser = () => {
  //   if (!this.state.username) {
  //     Alert.alert("Please enter a username");
  //   } else if (!this.state.passwrd) {
  //     Alert.alert("Please enter a password");
  //   } else {
  //     AsyncStorage.getItem("userLoggedIn", (err, result) => {
  //       if (result !== "none") {
  //         Alert.alert("Someone already logged on");
  //         this.props.navigation.navigate("HomeRT");
  //       } else {
  //         AsyncStorage.getItem(this.state.username, (err, result) => {
  //           if (result !== null) {
  //             if (result !== this.state.passwrd) {
  //               Alert.alert("Password incorrect");
  //             } else {
  //               AsyncStorage.setItem(
  //                 "userLoggedIn",
  //                 this.state.username,
  //                 (err, result) => {
  //                   Alert.alert(`${this.state.username} Logged in`);
  //                   this.props.navigation.navigate("HomeRT");
  //                 }
  //               );
  //             }
  //           } else {
  //             Alert.alert(`No account for ${this.state.username}`);
  //           }
  //         });
  //       }
  //     });
  //   }
  // };

  _logIn = async () => {
    try {
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
        FB_APP_ID,
        {
          permissions: ["public_profile"]
        }
      );
      debugger;
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
      }
    } catch(e) {
      console.log(e);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputs}
          onChangeText={text => this.setState({ username: text })}
          value={this.state.username}
        />
        <Text style={styles.label}>Enter Username</Text>

        <TextInput
          style={styles.inputs}
          onChangeText={text => this.setState({ passwrd: text })}
          value={this.state.passwrd}
          secureTextEntry={true}
        />
        <Text style={styles.label}>Enter Password</Text>

        <View style={styles.buttonsView}>
          <Button
            style={styles.buttons}
            onPress={this._logIn}
            underlayColor="#31e981"
            title="Login"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingBottom: "45%",
    paddingTop: "10%"
  },
  inputs: {
    flex: 1,
    width: "80%",
    paddingTop: 25,
    paddingLeft: 5
  },
  buttons: {
    fontSize: 16
  },
  labels: {
    paddingBottom: 10
  },
  buttonsView: {
    flexDirection: "row",
    marginTop: 15
  }
});
