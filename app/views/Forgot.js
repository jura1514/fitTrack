import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
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
  resetButton: {
    backgroundColor: '#00b5ec',
  },
  resetText: {
    color: 'white',
  },
});

export default class Forgot extends React.Component {
  static navigationOptions = {
    title: 'Reset Password',
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false,
    };
  }

  onResetPress() {
    this.setState({ loading: true });

    const { email } = this.state;
    db.auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Success', 'Password reset successfully sent.');
        this.setState({ loading: false });
        this.props.navigation.navigate('LoginRT');
      })
      .catch((error) => {
        this.setState({ loading: false });
        Alert.alert('Failed to reset password.', `Reason: ${error.message}`);
      });
  }

  renderLoading = () => {
    if (this.state.loading) {
      return <Loading animating={this.state.loading} />;
    }
    return null;
  };

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

        <TouchableHighlight
          style={[styles.buttonContainer, styles.resetButton]}
          disabled={!this.state.email}
          onPress={() => this.onResetPress()}
        >
          <Text style={styles.resetText}>Reset Password</Text>
        </TouchableHighlight>

        {this.renderLoading()}
      </KeyboardAvoidingView>
    );
  }
}

Forgot.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
