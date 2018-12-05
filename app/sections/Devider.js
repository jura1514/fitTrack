import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  devider: {
    borderBottomColor: '#00b5ec',
    borderBottomWidth: 3,
    marginBottom: 7,
    marginTop: 7,
    alignSelf: 'center',
    width: '50%',
  },
});

// eslint-disable-next-line react/prefer-stateless-function
export default class Loading extends React.Component {
  render() {
    return (
      <View
        style={styles.devider}
      />
    );
  }
}
