import * as React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Avatar, Button, Card, Text } from 'react-native-paper'
import { StyleSheet } from 'react-native'

//placeholder for history
const cardData = [
  { title: 'Card Title 1', subtitle: 'Subtitle for Card 1' },
  { title: 'Card Title 2', subtitle: 'Subtitle for Card 2' },
  { title: 'Card Title 3', subtitle: 'Subtitle for Card 3' },
  { title: 'Card Title 4', subtitle: 'Subtitle for Card 4' },
  { title: 'Card Title 5', subtitle: 'Subtitle for Card 5' },
];

const MyComponent = () => (
  <ScrollView style={styles.scrollView}>
    {cardData.map((card) => (
      <Card key={card.title}>
        <Card.Cover source={{ uri: 'https://picsum.photos/200/300?grayscale' }} />
        <Card.Title title={card.title} subtitle={card.subtitle} />
      </Card>
    ))}
  </ScrollView>
)

export default MyComponent

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
  }
})
