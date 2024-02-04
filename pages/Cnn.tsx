import React, { createContext, useState, useContext } from 'react'
import * as DocumentPicker from 'expo-document-picker'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import useStore from '../zustand/store'
import * as FileSystem from 'expo-file-system'

const Cnn = () => {
  const { setModelJson, setLabelPath, setModelWeight } = useStore()
  
  const pickTFLiteModel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/octet-stream',
      })

      if (result.canceled) {
        // TODO: Handle user cancellation
      } else {
        const modelJson = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: FileSystem.EncodingType.UTF8,
        })
        const modelWeights = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: FileSystem.EncodingType.Base64
        })
        setModelJson(modelJson)
        setModelWeight(modelWeights)
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


  return (
      <View style={styles.container}>
      <Button icon="file-upload" mode="outlined" onPress={pickTFLiteModel} style={styles.button}>
        Import CNN Trained Model
      </Button>
      <Button icon="file-upload" mode="outlined" onPress={pickTFLiteLabel} style={styles.button}>
        Import CNN Model Label
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
