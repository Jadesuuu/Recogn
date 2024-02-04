import * as React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { lightTheme } from './themes/lightTheme'
import { darkTheme } from './themes/darkTheme'
import { AppRegistry, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import HomePage from './routes/HomePage'

export default function App() {

  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme
  
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
          <HomePage />
      </PaperProvider>
    </SafeAreaProvider>
  )
}

