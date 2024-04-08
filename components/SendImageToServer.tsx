import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import useStore from '../zustand/store'
import OutputPage from './Output'
import axios from 'axios'

interface ServerOutput {
    predictions: string[][]
    preprocessedImage: string
  }

  const SendImageToServer: React.FC = () => {
    const { imageUri } = useStore((state) => state.imageState)
    const [serverResponse, setServerResponse] = useState<ServerOutput | null>(null)
    const [preProcessedImage, setPreProcessedImage] = useState()
    //PUTA NEED MAG UPLOAD NG IMAGE
    const handleImageUpload = async () => {
      try {
        const formData = new FormData()
  
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    };
  
    useEffect(() => {
      if (imageUri) {
        handleImageUpload();
      }
    }, [imageUri]);
  
    return (
      <OutputPage outputData={serverResponse} uri={''} />
    )
  }
  
  export default SendImageToServer;