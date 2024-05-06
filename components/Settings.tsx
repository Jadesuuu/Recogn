import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { TextInput, Button, PaperProvider, Portal, Dialog, Text } from 'react-native-paper';
import useInputStore from './useInputStore';
import AsyncStorage from '@react-native-async-storage/async-storage'


const Settings = () => {
    const [visible, setVisible] = useState(false)
    const inputRef = useRef(null);
    const { inputValue, setInputValue } = useInputStore();
    const [isHostAddressReady, setHostAddressReady] = useState(false)

    const storeData = async (value: string) => {
        try {
          await AsyncStorage.setItem('@hostAddress', value);
        } catch (error) {
          console.error('Error storing data:', error);
        }
      };

      const retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('@hostAddress');
          if (value !== null) {
            setInputValue(value);
          }
        } catch (error) {
          console.error('Error retrieving data:', error);
        }
      };

    const hideDialog = () => {
        setVisible(false)
        setHostAddressReady(false)
    }

    const handleConfirmEdit = async () => {
    console.log('Uploading input:', inputValue);
    Keyboard.dismiss()
    setVisible(true)
    await storeData(inputValue)
    setHostAddressReady(true)
  };

  useEffect(() => {
    retrieveData(); 
  }, []);

  return (
    <PaperProvider>
        <View style={styles.container}>
        <TextInput
        ref={inputRef}
        label="Enter IP"
        value={inputValue}
        onChangeText={setInputValue}
        mode='outlined'
        style={styles.textInput}
        />
        <Button mode="contained" onPress={handleConfirmEdit} style={styles.button} buttonColor='#006400' textColor='white'>
            Set Host Address
        </Button>
        <Portal>
            {isHostAddressReady && (
                <Dialog visible={visible}>
                <Dialog.Content>
                    <Text variant='bodyMedium'>Host Address has been set!</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>Okay</Button>
                </Dialog.Actions>
            </Dialog>
            )}
        </Portal>
        </View>
    </PaperProvider>
  );
};

export default Settings

const styles = StyleSheet.create({
    button: {
        paddingTop: 10,
        marginTop: 10,
    },
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: 'white'
    },
    textInput: {
        width: '90%',
        backgroundColor: 'white',
        color: 'black'
    }
})
