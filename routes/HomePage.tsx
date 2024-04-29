import * as React from 'react'
import { BottomNavigation, Text, useTheme, Drawer, Switch } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'
import CameraScreen from '../components/CameraComponent'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { lightTheme } from '../themes/lightTheme'
import { darkTheme } from '../themes/darkTheme'
import { Icon } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Settings from '../components/Settings'

const CameraRoute = () => <CameraScreen />
const SettingsRoute = () => <Settings />
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
          onPress={() => setActive('first')} 
          icon="help-box"
        />
        <Drawer.Item
          label="FAQ"
          active={active === 'second'}
          onPress={() => setActive('second')}
          icon="comment-question"
        />
      </Drawer.Section>
      <Drawer.Section title="Preferences">
        <View style={styles.preferences}>
          <Icon name="moon-waning-crescent" type="material-community" style={styles.icon} />
          <Text style={styles.text} >Night Mode</Text>
          <Switch value={isDarkTheme} onValueChange={toggleTheme} style={styles.switch} />
        </View>
      </Drawer.Section>
      <Drawer.Section title="Settings">
        <Drawer.Item 
          label='Host Address'
          icon="cog"
          onPress={() => navigation.navigate('Settings')}
        />
      </Drawer.Section>
    </View>
  )
}

const App = () => {
  
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'settings', title: 'Settings', 
    focusedIcon: () => (
      <MaterialCommunityIcons name='history' size={24} color="white" />
    )},
    { key: 'camera', title: 'Camera', 
    focusedIcon: () => (
      <MaterialCommunityIcons name="camera" size={24} color="white" /> // White focused icon
    ),
    unfocusedIcon: () => (
      <MaterialCommunityIcons name="camera-off" size={24} color="white" /> // White unfocused icon
    ), }
  ])

  const renderScene = BottomNavigation.SceneMap({
    settings: SettingsRoute,
    camera: CameraRoute
  })
  
  const DrawerNav = createDrawerNavigator();
  return (
    <NavigationContainer>
      <DrawerNav.Navigator drawerContent={(props) => <DrawerContent {...props} />} screenOptions={{
        overlayColor: '#404040',
        headerTintColor: 'black',
        sceneContainerStyle: {
          backgroundColor: 'red'
        }
      }}>
        <DrawerNav.Screen name="Recogn">
          {() => (
            <View style={styles.container}>
              <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                barStyle={{backgroundColor: '#404040'}}
                theme={{colors: {secondaryContainer: '#006400'}}}
                activeColor='white'
                inactiveColor='white'
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