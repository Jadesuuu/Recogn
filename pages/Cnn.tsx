import React, { createContext, useState, useContext } from 'react'
import * as DocumentPicker from 'expo-document-picker'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import useStore from '../zustand/store'

const Cnn = () => {
  const { setModelPath, setModelWeightPath } = useStore()
  
  const pickModelJsonPath = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      })

      if (result.canceled) {
        // TODO: Handle user cancellation
      } else {
        const modelPath = result.assets[0].uri
        setModelPath(modelPath)
      }
    } catch (error) {
      console.error(error)
      //TODO: handle error
    }
  }

  const pickModelWeightPath = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/octet-stream',
      })

      if (result.canceled) {
        // TODO: Handle user cancellation
      } else {
        const uriModelWeight = result.assets[0].uri
        if(!uriModelWeight.endsWith('.bin')) {
          console.error("File selected is not .bin")
        } else {
          setModelWeightPath(uriModelWeight)
        }
      }
    } catch (error) {
      console.error(error)
      //TODO: Handle error
    }
  }

  return (
      <View style={styles.container}>
      <Button icon="file-upload" mode="outlined" onPress={pickModelJsonPath} style={styles.button}>
        Import "yourModel.json"
      </Button>
      <Button icon="file-upload" mode="outlined" onPress={pickModelWeightPath} style={styles.button}>
        Import "yourModelWeights.bin"
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
    borderRadius: 8, 
    paddingHorizontal: 30,
    paddingVertical: 15,
  }
})
