  import { Camera, CameraType, FlashMode } from 'expo-camera'
  import { useState } from 'react'
  import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
  import { Icon } from 'react-native-elements';
  import { IconButton, Divider, Button } from 'react-native-paper';

  export default function App() {
    const [type, setType] = useState(CameraType.back)
    const [permission, requestPermission] = Camera.useCameraPermissions()
    const [flashMode, setFlashMode] = useState(FlashMode.off)
    

    if (!permission) {
      // Camera permissions are still loading
      return <View />
    }

    if (!permission.granted) {
      // Camera permissions are not granted yet
      return (
        <>
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 200 }}>
        <Icon
          name="camera-off"
          type="material-community"
          style={styles.icon}
          size={150}
          color="gray"
        />
        </View>
        <Text style={{ textAlign: 'center' }}>
          Recogn: Eyes does not have permission to use the camera.
        </Text>
        <Button icon="camera" mode="text" onPress={requestPermission}>
            Grant Permission
        </Button>
      </>
      
      )
    }

    function toggleCameraType() {
      setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
    }

    const toggleFlashMode = () => {
      setFlashMode((prevMode) => prevMode === FlashMode.off ? FlashMode.on : FlashMode.off
      )
    }

    return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} flashMode={flashMode}>
          <View style={styles.buttonContainer}>
            <IconButton onPress={toggleCameraType} icon='camera-front' style={styles.flipCam} iconColor='white' size={30} />
            <IconButton onPress={toggleFlashMode} icon='flash' style={styles.flash} iconColor='white' size={30} />
          </View>
          <View>
            {/* <IconButton onPress={} icon='camera-iris' style={styles.shutterButton} iconColor='white' size={80} /> */}
          </View>
        </Camera>
      </View>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 10,
    },
    button: {
      padding: 10,
      alignItems: 'center',
    },
    text: {
      fontSize: 24, 
      fontWeight: 'bold',
      color: 'white',
    },
    icon: {

    },
    textContainer: {
      textAlign: 'left',
    },
    flipCam: {
      paddingTop: 20,
      alignContent: 'flex-end'
    },
    flash: {
      position: 'relative',
      top: -0,
      left: -0,
    },
    shutterButton: {
      position: 'absolute',
      bottom: 50,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 50,
      padding: 20,
    }
  })