import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { DrawerItems } from 'react-navigation';

const styles = StyleSheet.create({
  drawerView: {
    backgroundColor: '#00b5ec',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerHeader: {
    color: 'white',
    fontSize: 30,
  },
});

const DrawerContent = props => (
  <View>
    <View
      style={styles.drawerView}
    >
      <Text style={styles.drawerHeader}>
        { 'fitTrack' }
      </Text>
    </View>
    <DrawerItems {...props} />
  </View>
);

export default DrawerContent;
