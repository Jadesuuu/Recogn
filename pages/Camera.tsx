import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useCameraDevice, useCameraPermission, Camera } from 'react-native-vision-camera'
import NoCameraDeviceError from '../components/NoCameraDevice'

export default function CameraComponent() {
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  if (device == null) return <NoCameraDeviceError />
  
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
}
