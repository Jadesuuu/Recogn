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
import { Asset } from 'expo-asset'

interface SendToServerProps {
    uri: string
    onFinish: any
}

const SendToServer: React.FC<SendToServerProps> = ({  uri, onFinish }) => {
    const [modalVisible, setModalVisible] = useState(true)
    const [actIndVisible, setActIndVisible] = useState(false)
    const [outputVisible, setOutputVisible] = useState(false)

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
      console.log("Sending image to server...")
        const response = await fetch(uri)
        const arrayBuffer = await response. arrayBuffer()
        const blob = new Blob([arrayBuffer], {type: 'image/jpg'})
        const formData = new FormData();
        formData.append('image', blob, 'inputImage.jpg')

        try { 
        await fetch('server_ni_jerome', {
            method: 'POST',
            body: formData
        })
        setModalVisible(false); 
        setActIndVisible(true)
        } catch (error) {
        console.error('Error sending image:', error);
        Alert.alert('Error', 'Failed to send image to server.');
        }
    }

  const closeOutputModal = () => {
    setModalVisible(false)
    handleFinish();
  }

  const openOutput = () => {
    console.log(imageUri)
    setOutputVisible(true)
  }

  const sampleConfidenceScores = [
    ['Camera', '0.88'],
    ['Eye', '0.11'],
    ['Box', '0.01'],
  ];
  const imageUri = Asset.fromModule('../assets/icon.png')

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