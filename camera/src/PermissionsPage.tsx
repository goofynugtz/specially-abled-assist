import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Permissions: React.FC = () => {
  return (
      <View style={styles.overlay}>
        <Text style={styles.popupText}>Please allow access to Camera.</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupText: {
    fontSize: 32,
    marginVertical: 'auto',
    marginHorizontal: 10,
    color: 'white'
  }
});

export default Permissions;
