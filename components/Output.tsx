import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { IconButton } from 'react-native-paper'

interface OutputPageProps {
  outputData: any
  uri: string
}

const OutputPage: React.FC<OutputPageProps> = ({ outputData, uri }) => {
  const [topPredictions, setTopPredictions] = useState<string[]>([])
  const [modalVisible, setModalVisible] = useState(true)

  useEffect(() => {

    const sortedPredictions = outputData.slice().sort((a: number[], b: number[]) => b[1] - a[1])
    const formattedPredictions = sortedPredictions
      .slice(0, 3)
      .map((prediction: number[]) => {
        const confidence = (prediction[1] * 100).toFixed(0)
        return `${prediction[0]} ${confidence}%`
      })

    setTopPredictions(formattedPredictions)
  }, [outputData])

  const closeOutputModal = () => {
    setModalVisible(!modalVisible)
  }

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
        <View style={{ height: '69%', marginTop: 'auto', backgroundColor: '#404040', borderRadius: 35 }}>
          <View>
            <View style={styles.imageContainer}>
            <IconButton icon={'close'} onPress={closeOutputModal} style={styles.modalClose} iconColor='white'></IconButton>
              {uri && 
              <Image source={{ uri }} style={styles.image} />
              }
            </View>
          </View>
          {topPredictions.map((prediction, index) => (
            <View key={index}>
              <Text style={index === 0 ? styles.predictionTextBold : styles.predictionText}>
                {prediction}
              </Text>
              <View style={styles.divider} />
            </View>
          ))}
        </View>
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
    color: '#A0A0A0',
    textAlign: 'center',
  },
  predictionTextBold: {
    fontSize: 28,
    marginBottom: 5,
    color: 'white',
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
    backgroundColor: '#606060'
  }, 
  modalClose: {
    marginLeft: 330
  }
})

export default OutputPage

