import React, { createContext, useState, useContext } from 'react'
import * as DocumentPicker from 'expo-document-picker'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'

const ModelContext = createContext({})

const Cnn = () => {
  const [modelPath, setModelPath] = useState('')
  const [labelPath, setLabelPath] = useState('')
  

  const pickTFLiteModel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/octet-stream',
      })

      if (result.canceled) {
        // TODO: Handle user cancellation
      } else {
        const uriModel = result.assets[0].uri
        setModelPath(uriModel)
      }
    } catch (error) {
      console.error(error)
      //TODO: handle error
    }
  }

  const pickTFLiteLabel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
      })

      if (result.canceled) {
        // TODO: Handle user cancellation
      } else {
        const uriLabel = result.assets[0].uri
        setLabelPath(uriLabel)
      }
    } catch (error) {
      console.error(error)
      //TODO: Handle error
    }
  }

  const lockIn = () => {
    if (modelPath && labelPath) {
      setModelPath(modelPath)
      setLabelPath(labelPath)
    }
  }

  return (
      <View style={styles.container}>
      <Button icon="file-upload" mode="outlined" onPress={pickTFLiteModel} style={styles.button}>
        Import CNN Trained Model
      </Button>
      <Button icon="file-upload" mode="outlined" onPress={pickTFLiteLabel} style={styles.button}>
        Import CNN Model Label
      </Button>
      <Button icon="lock" mode="outlined" onPress={lockIn} style={styles.button}>
        Lock In
      </Button>
    </View>
  )
}



export default Cnn

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 8, // Adjust rounding for square-ish shape
    paddingHorizontal: 30,
    paddingVertical: 15,
  }
})
export { ModelContext }
