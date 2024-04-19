  import { Camera, CameraType, FlashMode } from 'expo-camera'
  import React, { useRef, useState } from 'react'
  import { Alert, StyleSheet, Text, View, useWindowDimensions, Image, Modal } from 'react-native'
  import { Icon } from 'react-native-elements'
  import { IconButton, Button } from 'react-native-paper'
  import * as MediaLibrary from 'expo-media-library'
  import Overlay from '../components/CameraOverlay'
  import SendToServer from './SendToServer'
  import ActivityIndicator from './ActivityIndicator2'
  import * as ImagePicker from 'expo-image-picker';
  import * as ImageManipulator from 'expo-image-manipulator';
  import OutputPage from './Output'

  const CameraComponent = () => {
  
    const [type, setType] = useState(CameraType.back)
    const [permission, requestPermission] = Camera.useCameraPermissions()
    const [isCaptured, setIsCaptured] = useState(false)
    const [imageUri, setImageUri] = useState('')
    const [flashMode, setFlashMode] = useState(FlashMode.off)  
    const [permissionResponse, requestPermissionAsync] = MediaLibrary.usePermissions() 
    const [visible, setVisible] = useState(false); 
    const cameraRef = useRef<Camera>(null)
    const { width, height } = useWindowDimensions() 

    if (!permission) {
      return <ActivityIndicator />
    }

    if (!permission.granted) {
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
      setFlashMode((prevMode) => prevMode === FlashMode.off ? FlashMode.torch : FlashMode.off
      )
    }
    
    const captureAndSaveImage = async () => {
      if (cameraRef.current) {
        try {
          const data = await cameraRef.current.takePictureAsync({
            quality: 1,
            base64: true,
          });
          const manipulateData = await ImageManipulator.manipulateAsync(
            data.uri,
            [{ crop: {
              height: 80, 
              originX: 0, 
              originY: 0, 
              width: 120
            } }],
          )
          const asset = await MediaLibrary.createAssetAsync(manipulateData.uri);
          const separatePermission = await requestPermissionAsync();
    
          if (permissionResponse?.accessPrivileges === "all" || separatePermission.accessPrivileges === "all") {
            const album = await MediaLibrary.getAlbumAsync('Recogn');
            await MediaLibrary.addAssetsToAlbumAsync([asset], album);
          }
          
          setImageUri(data.uri); 
          setVisible(true);
          setIsCaptured(true)
        } catch (error) {
          console.error('Error capturing or saving image:', error);
        }
      }
    };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    setVisible(true) 
    setIsCaptured(true)
    if (!result.canceled) {
      console.log(result.assets[0].uri)
      console.log(visible)
      setImageUri(result.assets[0].uri)
    }
  };

    return (
      <>
        <Camera ref={cameraRef} style={{width, height, paddingBottom: 130}} ratio='16:9' type={type} flashMode={flashMode} autoFocus={true}>
          <View style={styles.rectangleContainer}>
            <Overlay /> 
            <IconButton onPress={captureAndSaveImage} icon='circle-slice-8' style={styles.shutterButton} iconColor='white' size={80} />
            <IconButton onPress={toggleFlashMode} icon='flash' style={styles.flash} iconColor='white' size={40} />
            <IconButton onPress={pickImage} icon='folder-image' style={styles.folderImage} iconColor='white' size={40} />
            <View style={styles.buttonContainer}>
              <IconButton onPress={toggleCameraType} icon='camera-front' style={styles.flipCam} iconColor='white' size={30} />
            </View>
          </View>
        </Camera>
        {isCaptured && <SendToServer uri={imageUri} onFinish={() => setIsCaptured(false)}/>}
      </>
    )
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    camera: {
      alignContent: 'center'
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
    modal: {
      height: '100%',
      paddingTop: 90,
    },
    modalContent: {

    },
    previewImage: {

    },
    buttonContainer2: {

    }                                                            
  })

  export default CameraComponent

