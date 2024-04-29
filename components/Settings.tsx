import React, { useState, useRef } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { TextInput, Button, PaperProvider, Portal, Dialog, Text } from 'react-native-paper';
import useInputStore from './useInputStore';

const Settings = () => {
    const [visible, setVisible] = useState(false)
    const inputRef = useRef(null);
    const { inputValue, setInputValue } = useInputStore();

    const hideDialog = () => {
        setVisible(false)
    }

    const handleConfirmEdit = () => {
    console.log('Uploading input:', inputValue);
    Keyboard.dismiss()
    setVisible(true)
  };

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
            <Dialog visible={visible}>
                <Dialog.Content>
                    <Text variant='bodyMedium'>Host Address has been set!</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>Okay</Button>
                </Dialog.Actions>
            </Dialog>
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
        width: '90%'
    }
})
