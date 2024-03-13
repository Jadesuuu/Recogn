  import React, { useEffect, useState } from 'react'
  import { ActivityIndicator, Text } from 'react-native'
  import * as tf from '@tensorflow/tfjs'
  import { bundleResourceIO } from '@tensorflow/tfjs-react-native'
  import * as FileSystem from 'expo-file-system'
  import { Buffer } from 'buffer'
  import useStore from '../zustand/store'
  import OutputPage from './Output'

  interface ModelLoadProps {
    inputImage: any
    onLoadingChange?: (isLoading: boolean) => void
  }

    const LoadModel = ({ inputImage, onLoadingChange }: ModelLoadProps) => {
    const { modelPath, modelWeightPath } = useStore()
    const [isLoading, setIsLoading] = useState(false)
    const [model, setModel] = useState<tf.GraphModel | null>(null)
    const [outputData, setOutputData] = useState<any>(null)
    const [onClose, setOnClose] = useState(false)

    useEffect(() => {
      const loadModel = async () => {
        try {
          const modelJson = await FileSystem.readAsStringAsync(modelPath, {
            encoding: FileSystem.EncodingType.UTF8,
          })
          const parsedModel = JSON.parse(modelJson)

          const modelWeightsBuffer = await FileSystem.readAsStringAsync(modelWeightPath, {
            encoding: FileSystem.EncodingType.Base64,
          })
          const buffer = Buffer.from(modelWeightsBuffer, 'base64')
          const numberArray = Array.from(new Uint8Array(buffer))
          setIsLoading(true)
          const loadedModel = await tf.loadGraphModel(bundleResourceIO(parsedModel, numberArray))
          setModel(loadedModel)
        } catch (error) {
          console.error('Error loading model:', error)
        } finally {
          setIsLoading(false)
        }
      }

      if (modelPath && modelWeightPath) {
        loadModel()
      }
    }, [modelPath && modelWeightPath])

    useEffect(() => {
      const indicateActivity = async () => {
        <ActivityIndicator animating={isLoading} size='large' hidesWhenStopped={true} />
      }
      indicateActivity()
    },[isLoading])

    useEffect(() => {
      const useModel = async () => {
        if(model && inputImage) {
          console.log('Model is ready to use')
          const outputData = model.predict(inputImage) as tf.Tensor
          setOutputData(outputData)
        } else {
          console.log('useModel in LoadModel.tsx')
        }
      }
      useModel()
    },[inputImage, modelPath && modelWeightPath])

    const handleOnClose = () => {
      setOnClose(true)
    }

    useEffect(() => {
      const runModal = async () => {
        if(outputData) {
          <OutputPage outputData={outputData} onClose={handleOnClose}/>
        }
      }
      runModal()
    }, [outputData])

    return null
  }

  export default LoadModel
