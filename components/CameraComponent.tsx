  import { Camera, CameraType, FlashMode } from 'expo-camera'
  import React, { useRef, useState, useEffect } from 'react'
  import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
  import { Icon } from 'react-native-elements'
  import { IconButton, Divider, Button } from 'react-native-paper'
  import * as MediaLibrary from 'expo-media-library'
  import { ActivityIndicator, MD2Colors } from 'react-native-paper'
import { Dimensions } from 'react-native'

  export default function CameraComponent() {
    const [type, setType] = useState(CameraType.back)
    const [permission, requestPermission] = Camera.useCameraPermissions()
    const [flashMode, setFlashMode] = useState(FlashMode.off)    
    const cameraRef = useRef<Camera>(null)


    if (!permission) {
      // Camera permissions are still loading
      return <ActivityIndicator animating={true} color={MD2Colors.purple100} size={'large'}/>
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

    function toggleFlashMode() {
      setFlashMode((prevMode) => prevMode === FlashMode.off ? FlashMode.on : FlashMode.off
      )
    }

    function openGallery() {
      console.log('Gallery opened')
    }

    const captureAndSaveImage = async () => {
      if (cameraRef.current) {
        try {
          const { uri } = await cameraRef.current.takePictureAsync()
          const asset = await MediaLibrary.createAssetAsync(uri)
  
          const album = await MediaLibrary.getAlbumAsync('Recogn')
  
          await MediaLibrary.addAssetsToAlbumAsync([asset], album)
          console.log('Image saved to gallery');
        } catch (error) {
          console.error('Error capturing and saving image:', error)
        }
      }
    }

    

    
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} flashMode={flashMode}>
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle}>
            <View style={styles.rectangleColor} />
            <View style={styles.topLeft} />
            <View style={styles.topRight} />
            <View style={styles.bottomLeft} />
            <View style={styles.bottomRight} />
            </View>
            <IconButton onPress={captureAndSaveImage} icon='circle-slice-8' style={styles.shutterButton} iconColor='white' size={80} />
            <IconButton onPress={toggleFlashMode} icon='flash' style={styles.flash} iconColor='white' size={40} />
            <IconButton onPress={openGallery} icon='folder-image' style={styles.folderImage} iconColor='white' size={40} />
            <View style={styles.buttonContainer}>
              <IconButton onPress={toggleCameraType} icon='camera-front' style={styles.flipCam} iconColor='white' size={30} />
            </View>
          </View>
        </Camera>
      </View>
    )
  }

  const deviceHeight = Dimensions.get("window").height

  const deviceWidth = Dimensions.get("window").width

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
      position: 'absolute',
      bottom: 40,
      left: 60,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shutterButton: {
      position: 'absolute',
      bottom: 20,
      left: 140,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    folderImage: {
      position: 'absolute',
      bottom: 40,
      left: 265,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rectangleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
  },
  rectangle: {
      overflow: 'hidden',
      borderLeftColor: 'rgba(0, 0, 0, .8)',
      borderRightColor: 'rgba(0, 0, 0, .8)',
      borderTopColor: 'rgba(0, 0, 0, .8)',
      borderBottomColor: 'rgba(0, 0, 0, .8)',
      borderLeftWidth: deviceWidth / 1,
      borderRightWidth: deviceWidth / 1,
      borderTopWidth: deviceHeight / 1,
      borderBottomWidth: deviceHeight / 1
  },
  rectangleColor: {
      height: 335,
      width: 335,
      backgroundColor: 'transparent'
  },
  topLeft: {
      width: 50,
      height: 50,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      position: 'absolute',
      left: -1,
      top: -1,
      borderLeftColor: 'white',
      borderTopColor: 'white'
  },
  topRight: {
      width: 50,
      height: 50,
      borderTopWidth: 2,
      borderRightWidth: 2,
      position: 'absolute',
      right: -1,
      top: -1,
      borderRightColor: 'white',
      borderTopColor: 'white'
  },
  bottomLeft: {
      width: 50,
      height: 50,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      position: 'absolute',
      left: -1,
      bottom: -1,
      borderLeftColor: 'white',
      borderBottomColor: 'white'
  },
  bottomRight: {
      width: 50,
      height: 50,
      borderBottomWidth: 2,
      borderRightWidth: 2,
      position: 'absolute',
      right: -1,
      bottom: -1,
      borderRightColor: 'white',
      borderBottomColor: 'white'
  }
  })