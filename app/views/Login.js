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
import { connect } from 'react-redux';
import {
  loginWithEmailAndPassword,
} from '../actions/AuthActions';
import Loading from '../sections/Loading';
import OfflineNotice from '../sections/OfflineNotice';

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
});

class Login extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
    };
  }

  onLoginPress = () => {
    this.setState({ loading: true });

    const { email, password } = this.state;
    this.props.loginWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate('HomeRT');
      })
      .catch((error) => {
        this.setState({ loading: false });
        Alert.alert('Failed to login.', `Reason: ${error.message}`);
      });
  };

  renderLoading = () => {
    if (this.state.loading) {
      return <Loading animating={this.state.loading} />;
    }
    return null;
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <OfflineNotice setAbsolute />
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

        <TouchableHighlight
          style={[styles.buttonContainer, styles.loginButton]}
          disabled={!this.state.password || !this.state.email}
          onPress={() => this.onLoginPress()}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.buttonContainer}
          onPress={() => navigate('ForgotRT')}
        >
          <Text>Forgot your password?</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.buttonContainer}
          onPress={() => navigate('SignupRT')}
        >
          <Text>Register</Text>
        </TouchableHighlight>
        {this.renderLoading()}
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isConnected: state.network.isConnected,
  };
};

export default connect(mapStateToProps, {
  loginWithEmailAndPassword,
})(Login);

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
