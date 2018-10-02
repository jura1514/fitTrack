import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

export default class SignupSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.props.navigate('SignupRT')}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigate('ForgotRT')}>
          <Text style={styles.buttonText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 25,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonText: {
    color: 'blue',
    backgroundColor: 'transparent',
  },
});
