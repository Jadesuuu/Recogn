import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Icon } from 'react-native-elements';

export default function CameraNoPerm() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 200 }}>
      <Icon
        name="camera-off"
        type="material-community"
        style={styles.icon}
        size={150}
        color="gray"
      />
      <Text style={{ textAlign: 'center' }}>
        Recogn: Eyes does not have permission to use the camera.
      </Text>
      <Text style={{ textAlign: 'left' }}>
        Please go to:
      </Text>
      <Text style={{ textAlign: 'left' }}>
        • Settings
      </Text>
      <Text style={{ textAlign: 'left' }}>
        • Recogn: Eyes
      </Text>
      <Text style={{ textAlign: 'left' }}>
        • Make sure that Camera is enabled
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {

  },
  icon: {

  }
});
