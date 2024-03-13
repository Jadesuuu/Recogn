import React, { createContext, useState, useContext, useEffect } from 'react'
import * as DocumentPicker from 'expo-document-picker'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import useStore from '../zustand/store'

const Cnn = () => {
  const { setModelPath, setModelWeightPath } = useStore()
  const [isJsonSelected, setIsJsonSelected] = useState(false)
  const [isBinSelected, setIsBinSelected] = useState(false)
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
        setIsJsonSelected(true)
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
          setIsBinSelected(true)
        }
      }
    } catch (error) {
      console.error(error)
      //TODO: Handle error
    }
  }

  return (
      <View style={styles.container}>
      <Button icon="file-upload" 
      mode={isJsonSelected ? 'outlined' : 'contained'} 
      onPress={pickModelJsonPath} 
      style={styles.button} 
      buttonColor={isJsonSelected ? 'white' : 'green'}>
        Import JSON file
      </Button>
      <View style={styles.buttonSpacer} />
      <Button 
      icon="file-upload" 
      mode={isBinSelected ? 'outlined' : 'contained'} 
      onPress={pickModelWeightPath} 
      style={styles.button} 
      buttonColor={isBinSelected ? 'white' : 'green'}>
        Import BIN file
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
    width: 350
  },
  buttonSpacer: {
    marginVertical: 10
  }
})
