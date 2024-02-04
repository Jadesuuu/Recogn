  import { Camera, CameraType, FlashMode } from 'expo-camera'
  import React, { useRef, useState, useEffect, useContext } from 'react'
  import { StyleSheet, Text, TouchableOpacity, View, Dimensions, useWindowDimensions } from 'react-native'
  import { Icon } from 'react-native-elements'
  import { IconButton, Divider, Button } from 'react-native-paper'
  import * as MediaLibrary from 'expo-media-library'
  import Overlay from '../components/CameraOverlay'
  import NoCameraAvailable from '../components/NoCameraDevice'
  import UnableToSaveImage from './UnableToSaveImage'
  import OutputPage from './Output'
  import * as tf from '@tensorflow/tfjs-core'
  import * as tflite from '@tensorflow/tfjs-tflite'
  import ActivityIndicator from '../components/ActivityIndicator'
  

  interface CameraComponentProps {
    modelPath: string
    labelPath: string
  }

  const CameraComponent: React.FC<CameraComponentProps> = ({modelPath, labelPath}) => {
  
    const [type, setType] = useState(CameraType.back)
    const [permission, requestPermission] = Camera.useCameraPermissions()
    const [flashMode, setFlashMode] = useState(FlashMode.off)  
    const [permissionResponse, requestPermissionAsync] = MediaLibrary.usePermissions()  
    const cameraRef = useRef<Camera>(null)
    const [showModal, setShowModal] = useState(false)
    const [outputData, setOutputData] = useState<any>(null)
    const [model, setModel] = useState<tflite.TFLiteModel | null>(null)
    const { width, height } = useWindowDimensions() 
    const isModelLoading = useRef(false)

    useEffect(() => {
      async function loadModel() {
        isModelLoading.current = true
        try {
          const loadModel = await tflite.loadTFLiteModel(modelPath)
          setModel(loadModel)
        } catch (error) {
          console.error('Error loading model:', error)
        } finally {
          isModelLoading.current = false
        }
      }
  
      loadModel()
    }, [modelPath])

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

    function openGallery() {
      console.log('Gallery opened')
    }

    const captureAndSaveImage = async () => {
      if (cameraRef.current && modelPath) {
        try {
          console.log("test 1")
          const { uri } = await cameraRef.current.takePictureAsync()
          const image = new Image()
          image.src = uri
          const preprocessedImage = tf.browser.fromPixels(image)
          const input = tf.sub(tf.div(tf.expandDims(preprocessedImage), 127.5), 1)
          

          if (model) {
            let outputData = model.predict(input) as tf.Tensor
            setOutputData(outputData)
          } else {
            <ActivityIndicator />
          }
            const asset = await MediaLibrary.createAssetAsync(uri)
            const separatePermission = await requestPermissionAsync()

          if (permissionResponse?.accessPrivileges === "all" || separatePermission.accessPrivileges === "all") {
            const album = await MediaLibrary.getAlbumAsync('Recogn')
            await MediaLibrary.addAssetsToAlbumAsync([asset], album)
          }  
          console.log('Image saved to gallery')
 
          setShowModal(true)
        } catch (error) {
          <UnableToSaveImage />
        }
    } else if (isModelLoading.current) {
      <ActivityIndicator />
    } else {
      console.error('Model failed to load.')
      //TODO: create catch errors
    }
  }
    return (
      
      <View style={styles.container}>
        <Camera ref={cameraRef} style={{width, height, paddingBottom: 60, paddingTop: 60}} ratio='16:9' type={type} flashMode={flashMode} autoFocus={true} >
          <View style={styles.rectangleContainer}>
            <Overlay />
            <IconButton onPress={captureAndSaveImage} icon='circle-slice-8' style={styles.shutterButton} iconColor='white' size={80} />
            {showModal && <OutputPage outputData={outputData} onClose={() => setShowModal(false)} labelData={labelPath} />}
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
  })

  export default CameraComponent

