import React, { PureComponent } from 'react';
import {
  View,
  Text,
  NetInfo,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import networkChange from '../actions/NetworkActions';

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
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    this.props.networkChange(isConnected);
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
    if (!this.props.isConnected) {
      return this.drawConnectionStatusBar(this.props.setAbsolute);
    }
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    isConnected: state.network.isConnected,
  };
};

export default connect(mapStateToProps, { networkChange })(OfflineNotice);
