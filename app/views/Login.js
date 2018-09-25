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

const FB_APP_ID = '298553117405390';

export class Login extends React.Component {
  static navigationOptions = {
    title: "Login"
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     token: "",
  //     expires: ""
  //   };
  // }

  cancelLogin = () => {
    Alert.alert("Login cancelled");
    this.props.navigation.navigate("HomeRT");
  };

  _logIn = async () => {
    const options = {
      permissions: ['public_profile', 'email'],
    };
    try {
      const { type, token, expires } = await Expo.Facebook.logInWithReadPermissionsAsync(
        FB_APP_ID, options
      );
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        let response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );

        let name = await response.json().name;

        let session = {
          "token": token,
          "expires": expires
        };

        let fuu = await AsyncStorage.setItem(
          'userSession',
          JSON.stringify(session),
          (err, result) => {
            Alert.alert(`User ${name} Successfully Logged In.`);
            this.props.navigation.navigate("HomeRT");
          }
        );
        console.log(fuu);
      } else {
        Alert.alert("Failed to login.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {/* <TextInput
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
        <Text style={styles.label}>Enter Password</Text> */}

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
