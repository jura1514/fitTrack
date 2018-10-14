import React from 'react';
import PropTypes from 'prop-types';
import db from '../config/firebase';
import Loading from '../sections/Loading';

// eslint-disable-next-line react/prefer-stateless-function
export default class Splash extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    db.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate('HomeRT');
      } else {
        this.props.navigation.navigate('LoginRT');
      }
    });
  }

  render() {
    return <Loading animating />;
  }
}

Splash.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
