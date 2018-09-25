import React from "react";
import { StyleSheet, Text, View, Button, AsyncStorage, Alert } from "react-native";

export class Home extends React.Component {

  displaySessionDetails = () => {
    AsyncStorage.getItem('userSession', (err, result) => {
      console.log(result);
      Alert.alert(result.token);
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>This is your home screen.</Text>
        <Button title="Get Session" onPress={this.displaySessionDetails} />
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
  }
});