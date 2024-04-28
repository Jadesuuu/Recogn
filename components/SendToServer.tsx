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
import { Platform } from 'react-native'
import axios from 'axios'
import * as FileSystem from 'expo-file-system'

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
    
    const sendImageToServer = async (uri: string) => {
      setActIndVisible(true);
    
      try {
        const base64Data = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64'
        })

        const axiosResponse = await axios.post('https://webhook.site/546d31a3-15d4-4ac1-ae67-74e5a8c08fb2', 'data:image/jpeg;base64,' + base64Data, {
          headers: {
            'Content-Type': 'image/jpeg'
          }
        })
    
        console.log('Response from server:', axiosResponse.data);
    
        setReceivedConfidenceScores(axiosResponse.data);
        setActIndVisible(false);
        setOutputVisible(true);
      } catch (error) {
        console.log('Error uploading image:', error);
        Alert.alert(
          'Failed to send image to server.',
          'Solutions: \n1. Check if the server link is correct \n2. Check your internet connection'
        );
        setActIndVisible(false);
      }
    };

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