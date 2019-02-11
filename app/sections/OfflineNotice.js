import React, { PureComponent } from 'react';
import {
  View,
  Text,
  NetInfo,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    top: 0,
  },
  offlineText: {
    color: '#fff',
  },
  positionAbsolute: {
    position: 'absolute',
  },
});

class OfflineNotice extends PureComponent {
  state = {
    isConnected: true,
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected });
  }

  drawConnectionStatusBar = (isAbsolute) => {
    return (
      <View
        style={isAbsolute
          ? [styles.offlineContainer, styles.positionAbsolute]
          : styles.offlineContainer}
      >
        <Text style={styles.offlineText}>No Internet Connection</Text>
      </View>
    );
  }

  render() {
    if (!this.state.isConnected) {
      return this.drawConnectionStatusBar(this.props.setAbsolute);
    }
    return null;
  }
}

export default OfflineNotice;
