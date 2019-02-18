import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  checkUserLoggedIn,
} from '../actions/AuthActions';
import Loading from '../sections/Loading';


class Splash extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.props.checkUserLoggedIn().then((user) => {
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

const mapStateToProps = (state) => {
  return {
    isConnected: state.network.isConnected,
  };
};

export default connect(mapStateToProps, {
  checkUserLoggedIn,
})(Splash);

Splash.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
