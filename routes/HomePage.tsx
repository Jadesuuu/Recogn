import * as React from 'react'
import { BottomNavigation, Text, useTheme, Drawer, Switch } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'
import HistoryScreen from '../pages/History'
import CameraScreen from '../components/CameraComponent'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { lightTheme } from '../themes/lightTheme'
import { darkTheme } from '../themes/darkTheme'
import { Icon } from 'react-native-elements'

const CameraRoute = () => <CameraScreen />
const HistoryRoute = () => <HistoryScreen />
const DrawerContent = ({ navigation }: { navigation: any }) => {

  const [isDarkTheme, setIsDarkTheme] = React.useState(false) 
  const theme = isDarkTheme ? darkTheme : lightTheme
  const [active, setActive] = React.useState('')
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }
  return (
    <View style={styles.container}>
      <Drawer.Section title="Menu">
        <Drawer.Item
          label="About"
          active={active === 'first'}
          onPress={() => setActive('first')} // open modal siguro
          icon="help-box"
        />
        <Drawer.Item
          label="FAQ"
          active={active === 'second'}
          onPress={() => setActive('second')}
          icon="comment-question"
        />
      </Drawer.Section>
      <Drawer.Section title="preferences">
        <View style={styles.preferences}>
          <Icon name="moon-waning-crescent" type="material-community" style={styles.icon} />
          <Text style={styles.text} >Night Mode</Text>
          <Switch value={isDarkTheme} onValueChange={toggleTheme} style={styles.switch} />
        </View>
      </Drawer.Section>
    </View>
  )
}

const App = () => {
  
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'camera', title: 'Camera', focusedIcon: 'camera', unfocusedIcon: 'camera-off' },
    { key: 'history', title: 'History', focusedIcon: 'history' }
  ])

  const renderScene = BottomNavigation.SceneMap({
    camera: CameraRoute,
    history: HistoryRoute,
  })
  const DrawerNav = createDrawerNavigator();

  return (
    <NavigationContainer>
      <DrawerNav.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <DrawerNav.Screen name="Recogn">
          {() => (
            <View style={styles.container}>
              <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                barStyle={{backgroundColor: '#F5F5F5'}}
                theme={{colors: {secondaryContainer: '#006400'}}}
              />
            </View>
          )}
        </DrawerNav.Screen>
      </DrawerNav.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  drawerItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  preferences: {
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    paddingLeft: 18, 
  },
  text: {
    paddingLeft: 5, 
  }, 
  switch: {
    paddingLeft: 80
  }
})