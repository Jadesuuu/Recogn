import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Alert,
} from 'react-native'
import { Button } from 'react-native-paper'
import ActivityIndicator from './ActivityIndicator2'
import OutputPage from './Output'
import axios from 'axios'

interface SendToServerProps {
    uri: string
    onFinish: any
}

interface ConfidenceScore {
  label: string; score: string
}

const SendToServer: React.FC<SendToServerProps> = ({  uri, onFinish }) => {
    const [modalVisible, setModalVisible] = useState(true)
    const [actIndVisible, setActIndVisible] = useState(false)
    const [outputVisible, setOutputVisible] = useState(false)

    const initialConfidenceScores: ConfidenceScore[] = [];
    const [receivedImage, setReceivedImage] = useState('')
    const [receivedConfidenceScores, setReceivedConfidenceScores] = useState<ConfidenceScore[]>()

    const handleFinish = () => {
        
        if (onFinish) {
          onFinish(); 
        }
      };

      const handleConfirmButton = async () => {
        if (uri) {
          await sendImageToServer(uri)
        } else {
          console.warn('Missing Captured image URI')
        }
      }

    const sendImageToServer = async (uri: RequestInfo) => {
      const response = await fetch(uri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'inputImage.jpg')

      try {
        const axiosResponse = await axios.post('http://192.168.1.56:5000/predict', formData);
        console.log(axiosResponse.data); //check
      } catch (error) {
        console.log('Error uploading image:', error);
        Alert.alert(
          'Failed to send image to server.',
          'Solutions: \n1. Check if the server link is written correctly \n2. Check your internet connection'
        );
      }
      setActIndVisible(true)
      fetchImageAndScores()
    }

  const processReceivedData = async (blob: Blob | MediaSource, confidenceScores: [any, any][]) => {
    //blob to image, then get its uri
    const imageUrl = URL.createObjectURL(blob);
    setReceivedImage(imageUrl)

    //blob to confidence score array
    const convertedConfidenceScores: ((prevState: never[]) => never[]) | { label: any; score: any }[] = []
    console.log('Confidence scores:')
    confidenceScores.forEach(([label, score]) => {
      console.log(`${label}: ${score}`)
      convertedConfidenceScores.push({label, score})
    })
    setReceivedConfidenceScores(convertedConfidenceScores)
  }

  const fetchImageAndScores = async () => {
    try {
      const axiosResponse = await axios.get('http://localhost:5000/upload');
      const axiosBlob = new Blob([axiosResponse.data], { type: 'image/jpg' }) //assuming blob contains an image
      const axiosConfidenceScores = axiosResponse.data.confidenceScores;

      console.log(axiosBlob)
      console.log(axiosConfidenceScores)
      processReceivedData(axiosBlob, axiosConfidenceScores)
      setActIndVisible(false)
      setOutputVisible(true)
    } catch (error) {
      console.log('Fetching image and scores error: ',error)
      setActIndVisible(false)
    }
  }

  const closeOutputModal = () => {
    setModalVisible(false)
    handleFinish();
  }

  const sampleConfidenceScores = [
    ['Camera', '0.88'],
    ['Eye', '0.11'],
    ['Box', '0.01'],
  ];

  return (
    <View style={styles.outerView}>
      <Modal
        animationType="slide"
        style={styles.modal}
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeOutputModal}
        onDismiss={closeOutputModal}
      >
        <View style={{ height: '65%', marginTop: 'auto', backgroundColor: '#F5F5F5', borderRadius: 35 }}>
            <View style={styles.imageContainer}>
              {uri && 
              <Image source={{ uri }} style={styles.image} />
              }
            <Button onPress={closeOutputModal}>Retake</Button>
            <Button onPress={handleConfirmButton}>Confirm</Button>
            </View>
        </View>
      </Modal>
      <Modal visible={actIndVisible}>
          <ActivityIndicator />
      </Modal>
      {outputVisible && <OutputPage outputData={receivedConfidenceScores} uri={receivedImage}/>}
    </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height: '60%',
    borderRadius: 35,
  },
  outerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButton: {
    fontSize: 24,
    color: 'gray',
  },
  imageContainer: {
    paddingTop: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 370,
    height: 370,
    resizeMode: 'contain',
    borderRadius: 35,
  },
  predictionText: {
    fontSize: 18,
    marginBottom: 5,
    color: 'gray',
    textAlign: 'center',
  },
  predictionTextBold: {
    fontSize: 28,
    marginBottom: 5,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  modal: {
    height: '50%',
    paddingTop: 30,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#F0F0F0'
  }
})

export default SendToServer