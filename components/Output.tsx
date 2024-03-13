import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native'

interface OutputPageProps {
  outputData: any
  onClose: () => void
}

const OutputPage: React.FC<OutputPageProps> = ({ outputData, onClose }) => {
  const [topPredictions, setTopPredictions] = useState<string[]>([])

  // Extract and format top 3 predictions (adjust based on prediction format)
  useEffect(() => {
    // Example assuming outputData is an array with confidence scores
    const sortedPredictions = outputData.slice().sort((a: number[], b: number[]) => b[1] - a[1])
    const formattedPredictions = sortedPredictions
      .slice(0, 3)
      .map((prediction: number[]) => `${prediction[0]} (Confidence: ${prediction[1].toFixed(2)})`)
    setTopPredictions(formattedPredictions)
  }, [outputData])

  return (
    <Modal animationType="slide" visible={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.titleText}>Top Predictions:</Text>
        {topPredictions.map((prediction, index) => (
          <Text key={index} style={styles.predictionText}>
            {prediction}
          </Text>
        ))}
        <View style={styles.buttonContainer}>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    // Add styles for modal layout and appearance
  },
  titleText: {
    // Add styles for title text
  },
  predictionText: {
    // Add styles for prediction text
  },
  buttonContainer: {
    // Add styles for button alignment
  },
})

export default OutputPage
