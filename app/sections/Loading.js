import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

// eslint-disable-next-line react/prefer-stateless-function
export default class Loading extends React.Component {
  render() {
    return (
      <View
        style={styles.container}
      >
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={this.props.animating}
            color="black"
            size="large"
          />
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }
}

Loading.propTypes = {
  animating: PropTypes.bool,
};

Loading.defaultProps = {
  animating: false,
};
