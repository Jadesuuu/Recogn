import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

export default function CameraOverlay() {
  return (
    <View>
        <View style={styles.rectangle}>
            <View style={styles.rectangleColor} />
            <View style={styles.topLeft} />
            <View style={styles.topRight} />
            <View style={styles.bottomLeft} />
            <View style={styles.bottomRight} />
        </View>
    </View>
  )
}

const deviceHeight = Dimensions.get("window").height
const deviceWidth = Dimensions.get("window").width

const styles = StyleSheet.create({
    rectangle: {
        overflow: 'hidden',
        borderLeftColor: 'rgba(0, 0, 0, .5)',
        borderRightColor: 'rgba(0, 0, 0, .5)',
        borderTopColor: 'rgba(0, 0, 0, .5)',
        borderBottomColor: 'rgba(0, 0, 0, .5)',
        borderLeftWidth: deviceWidth / 1,
        borderRightWidth: deviceWidth / 1,
        borderTopWidth: deviceHeight / 1,
        borderBottomWidth: deviceHeight / 1,
        borderRadius: 5
      
    },
    rectangleColor: {
        height: 335,
        width: 335,
        backgroundColor: 'transparent'
    },
    topLeft: {
        width: 50,
        height: 50,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        position: 'absolute',
        left: -1,
        top: -1,
        borderLeftColor: 'white',
        borderTopColor: 'white'
    },
    topRight: {
        width: 50,
        height: 50,
        borderTopWidth: 4,
        borderRightWidth: 4,
        position: 'absolute',
        right: -1,
        top: -1,
        borderRightColor: 'white',
        borderTopColor: 'white'
    },
    bottomLeft: {
        width: 50,
        height: 50,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        position: 'absolute',
        left: -1,
        bottom: -1,
        borderLeftColor: 'white',
        borderBottomColor: 'white'
    },
    bottomRight: {
        width: 50,
        height: 50,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        position: 'absolute',
        right: -1,
        bottom: -1,
        borderRightColor: 'white',
        borderBottomColor: 'white'
    }
})