import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Alert,
} from 'react-native'
import { Button, Icon, IconButton } from 'react-native-paper'
import ActivityIndicator from './ActivityIndicator2'
import OutputPage from './Output'
import axios from 'axios'
import * as FileSystem from 'expo-file-system'
import useInputStore from './useInputStore';

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
    const {inputValue} = useInputStore()

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
      console.log(inputValue)
      try {
        const base64Data = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64'
        })

        const axiosResponse = await axios.post(inputValue, base64Data, {
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
        <View style={{ height: '65%', marginTop: 'auto', backgroundColor: '#404040', borderRadius: 35 }}>
            <View style={styles.imageContainer}>
            <IconButton icon={'close'} onPress={closeOutputModal} style={styles.modalClose} iconColor='white'></IconButton>
              {uri && 
              <Image source={{ uri }} style={styles.image} resizeMode='contain'/>
              }
            <Button onPress={handleConfirmButton} mode='elevated' buttonColor='#006400' textColor='white' style={styles.confirmButton}>Confirm</Button>
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
  },
  modalClose: {
    marginLeft: 330
  }, 
  confirmButton: {
    width: '80%',
    height: 40, 
    borderRadius: 10,
  }
})

export default SendToServer