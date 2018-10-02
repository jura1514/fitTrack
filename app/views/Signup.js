import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  Alert,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import db from '../config/firebase';
import Loading from '../sections/Loading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#00b5ec',
  },
  loginText: {
    color: 'white',
  },
  errorPassword: {
    color: 'red'
  },
});

export default class Signup extends React.Component {
  static navigationOptions = {
    title: 'Register',
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      passwordDoesMatch: false,
      loading: false,
    };
  }

  handleSignUp = async () => {
    try {
      this.setState({ loading: true });

      const { email, password } = this.state;
      const results = await db
        .auth()
        .createUserWithEmailAndPassword(email, password);

      if (results) {
        this.setState({ loading: false });
        Alert.alert('Success.', 'User has been registered');
        this.props.navigation.navigate('LoginRT');
      }
    } catch (error) {
      this.setState({ loading: false });
      Alert.alert('Failed to signup.', `Reason: ${error.message}`);
    }
  };

  handleConfirmPasswordChange = (confirmPassword) => {
    this.setState({ confirmPassword });
    if (this.state.password === confirmPassword) {
      this.setState({ passwordDoesMatch: true });
    } else {
      this.setState({ passwordDoesMatch: false });
    }
  };

  renderPasswordError = () => {
    if (!this.state.passwordDoesMatch && this.state.confirmPassword) {
      return <Text style={styles.errorPassword}>Password does not match</Text>;
    }
    return null;
  };

  renderLoading = () => {
    if (this.state.loading) {
      return <Loading animating={this.state.loading} />;
    }
    return null;
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={require('../../assets/icons/email.png')}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={require('../../assets/icons/key.png')}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry
            underlineColorAndroid="transparent"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require('../../assets/icons/checked.png')} />
          <TextInput
            style={styles.inputs}
            placeholder="Confirm Password"
            secureTextEntry
            underlineColorAndroid="transparent"
            onChangeText={confirmPassword => this.handleConfirmPasswordChange(confirmPassword)}
            value={this.state.confirmPassword}
          />
        </View>
        {this.renderPasswordError()}

        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          disabled={
            !this.state.password
            || !this.state.email
            || !this.state.confirmPassword
            || !this.state.passwordDoesMatch
          }
          onPress={() => this.handleSignUp()}
        >
          <Text style={styles.loginText}>Register</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.buttonContainer}
          onPress={() => this.props.navigation.navigate('LoginRT')}
        >
          <Text>Already have an account? Login</Text>
        </TouchableHighlight>

        {this.renderLoading()}
      </KeyboardAvoidingView>
    );
  }
}

Signup.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
