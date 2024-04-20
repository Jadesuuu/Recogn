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
    const [receivedConfidenceScores, setReceivedConfidenceScores] = useState<ConfidenceScore[]>()

    //call back function for closing the modal. 
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
    
    //Gets the image uri, convert it to blob and sends to server
    const sendImageToServer = async (uri: RequestInfo) => {
      const response = await fetch(uri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'inputImage.jpg')

      try {
        const axiosResponse = await axios.post('http://127.0.0.1:5000', formData);
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

  const processReceivedData = async (confidenceScores: [any, any][]) => {
    //blob to confidence score array
    const convertedConfidenceScores: ((prevState: never[]) => never[]) | { label: any; score: any }[] = []
    console.log('Confidence scores:')

    //set the state for the new confidence score data
    confidenceScores.forEach(([label, score]) => {
      console.log(`${label}: ${score}`)
      convertedConfidenceScores.push({label, score})
    })
    setReceivedConfidenceScores(convertedConfidenceScores)
  }

  //wait for the server, then fetch the blob containing an image and array of confidence scores
  const fetchImageAndScores = async () => {
    try {
      const axiosResponse = await axios.get('http://localhost:5000/upload');
      const axiosConfidenceScores = axiosResponse.data.confidenceScores;
      console.log(axiosConfidenceScores) //log confidence scores
      processReceivedData(axiosConfidenceScores) //process the image and confidence scores
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

  //for testing
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
      {outputVisible && <OutputPage outputData={receivedConfidenceScores} uri={uri}/>}
    </View>
  )
}

//CSS Styles
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