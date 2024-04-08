import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const ActivityIndicatorComponent2 = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size={'large'} color='#006400' />
      <Text style={styles.text}>Uploading image... Waiting server response...</Text>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 310,
  },
  text: { 
    paddingTop: 20,
    textAlign: 'center', 
    color:'black'
  },
});

export default ActivityIndicatorComponent2
