import * as React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Avatar, IconButton, Card, Text, Button, Searchbar } from 'react-native-paper'
import { StyleSheet, View, Modal } from 'react-native'

// Placeholder for history
// AsyncStorage will be used for history features using FlatList for performance.
const cardData = [
  { title: 'Card Title 1', subtitle: 'Subtitle for Card 1' },
  { title: 'Card Title 2', subtitle: 'Subtitle for Card 2' },
  { title: 'Card Title 3', subtitle: 'Subtitle for Card 3' },
  { title: 'Card Title 4', subtitle: 'Subtitle for Card 4' },
  { title: 'Card Title 5', subtitle: 'Subtitle for Card 5' },
]

export default function History() {
  const [modalVisible, setModalVisible] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const onChangeSearch = (query: string) => setSearchQuery(query)
  const showModal = () => {
    setModalVisible(true)
  }
  const hideModal = () => {
    setModalVisible(false)
  }
  
  return (
    <View>
      <IconButton icon={'magnify'} onPress={showModal} />
      <ScrollView style={styles.scrollView}>
        {cardData.map((card) => (
          <Card key={card.title}>
            <Card.Cover source={{ uri: 'https://picsum.photos/200/300?grayscale' }} />
            <Card.Title title={card.title} subtitle={card.subtitle} />
          </Card>
        ))}
      </ScrollView>

      <Modal
      visible={modalVisible}
      animationType='slide'
      onDismiss={hideModal}
      style={styles.modal}
      onRequestClose={hideModal}
      >
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          icon={'arrow-left'}
          onIconPress={hideModal}
          style={styles.searchBar}
    />
      </Modal>
    </View>
  )
}



const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
  },
  container: {
    backgroundColor: 'white',
  },
  modal: {
    
    paddingBottom: 10
  },
  searchBar: {
  }
})
