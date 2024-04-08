  import { Camera, CameraType, FlashMode } from 'expo-camera'
  import React, { useRef, useState } from 'react'
  import { Alert, StyleSheet, Text, View, useWindowDimensions, Image, Modal } from 'react-native'
  import { Icon } from 'react-native-elements'
  import { IconButton, Button } from 'react-native-paper'
  import * as MediaLibrary from 'expo-media-library'
  import Overlay from '../components/CameraOverlay'
  import UnableToSaveImage from './UnableToSaveImage'
  import ActivityIndicator from './ActivityIndicator2'
  import * as ImagePicker from 'expo-image-picker';
  import OutputPage from './Output'

  const CameraComponent = () => {
  
    const [type, setType] = useState(CameraType.back)
    const [permission, requestPermission] = Camera.useCameraPermissions()
    const [imageUri, setImageUri] = useState('')
    // const [isImageReady, setImageReady] = useState(false)
    const [flashMode, setFlashMode] = useState(FlashMode.off)  
    const [permissionResponse, requestPermissionAsync] = MediaLibrary.usePermissions() 
    const [visible, setVisible] = useState(false); 
    const [actIndVisible, setActIndVisible] = useState(false)
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

    const handleCloseModal = () => {
      setVisible(false); 
    }


    const sendImageToServer = async (capturedImageUri: string) => {
      setVisible(false)
      setActIndVisible(true)
      const response = await fetch(capturedImageUri)
      const arrayBuffer = await response. arrayBuffer()
      const blob = new Blob([arrayBuffer], {type: 'image/jpg'})
      const formData = new FormData();
      formData.append('image', blob, 'inputImage.jpg')
      
      try { 
        await fetch('server_ni_jerome', {
          method: 'POST',
          body: formData
        })
        setVisible(false); 
      } catch (error) {
        console.error('Error sending image:', error);
        Alert.alert('Error', 'Failed to send image to server.');
      }
    }
    
    const captureAndSaveImage = async () => {
      if (cameraRef.current) {
        try {
          const data = await cameraRef.current.takePictureAsync();
          const asset = await MediaLibrary.createAssetAsync(data.uri);
          const separatePermission = await requestPermissionAsync();
    
          if (permissionResponse?.accessPrivileges === "all" || separatePermission.accessPrivileges === "all") {
            const album = await MediaLibrary.getAlbumAsync('Recogn');
            await MediaLibrary.addAssetsToAlbumAsync([asset], album);
          }
          
          console.log(data.uri)
          setImageUri(data.uri); 
          // setImageReady(true)
          setVisible(true);
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

    if (!result.canceled) {
      console.log(result.assets[0].uri)
      setVisible(true) 
      console.log(visible) //?????
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
          <Modal visible={visible} onDismiss={handleCloseModal} style={styles.modal} onRequestClose={handleCloseModal} animationType='slide'>
            <View style={styles.modalContent}>
              {imageUri && (  
                <Image source={{uri: imageUri}} style={styles.previewImage} />
              )}
              <View style={styles.buttonContainer2}>
                <Button mode="contained" onPress={() => handleCloseModal()}>Retake</Button>
                <Button mode="contained" onPress={() => imageUri && sendImageToServer(imageUri)}>Confirm</Button>
              </View>
            </View>
          </Modal>
        <Modal visible={actIndVisible}>
          <ActivityIndicator />
        </Modal>
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

