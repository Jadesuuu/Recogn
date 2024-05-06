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
import useInputStore from './useInputStore'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

    const retrieveHostAddress = async () => {
      try {
        const value = await AsyncStorage.getItem('@hostAddress')
        if (value !== null) {
          console.log('Retrieved host address from AsyncStorage:', value)
          return value
        } else {
          console.warn('No host address found in AsyncStorage.');
          return ''
        }
      } catch (error) {
        console.error('Error retrieving host address:', error)
        return ''
      }
    };

    //call back function for closing the modal. 
    const handleFinish = () => {
        
        if (onFinish) {
          onFinish(); 
        }
      };

       const handleConfirmButton = async () => {
    if (uri) {
      const hostAddress = await retrieveHostAddress();
      if (hostAddress) {
        await sendImageToServer(uri, hostAddress);
      } else {
        console.warn('Missing host address. Please set it in Settings.');
      }
    } else {
      console.warn('Missing Captured image URI');
    }
  };
    
    const sendImageToServer = async (uri: string, hostAddress: string) => {
      setActIndVisible(true);
      console.log("Sending to host: " + hostAddress)
      try {
        const base64Data = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64'
        })
        const hostUrl = `http://${hostAddress}:5000/predict`
        const axiosResponse = await axios.post(hostUrl, base64Data, {
          headers: {
            'Content-Type': 'image/jpeg'
          }
        })
    
        
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
    ['Camera', '0.998989'],
    ['Eye', '0.000000121'],
    ['Box', '0.00'],
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
            <Button onPress={handleConfirmButton} mode='elevated' buttonColor='#006400' textColor='white' style={styles.confirmButton}>Send</Button>
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
    width: 360,
    height: 320,
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