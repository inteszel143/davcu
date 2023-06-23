import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config';
import { Colors, Display, Separator } from '../../constants';

export default function RiderPhoneAuth({ navigation }) {


    const [phoneNumber, setPhoneNumber] = useState('');
    console.log(phoneNumber)

    const handlePhoneAuth = async () => {
        try {
            const result = await firebase.auth().signInWithPhoneNumber('09284856233');
            // Proceed with handling the verification code sent to the user's phone
            // The verification code can be entered in another screen
            console.log(result);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to send verification code.');
        }
    };

    async function signInWithPhoneNumber(phoneNumber) {
        const confirmation = await firebase.auth().signInWithPhoneNumber(phoneNumber);
        console.log(confirmation);
    }

    return (
        <View style={styles.container} >
            <Separator height={50} />

            <Button title="Send Verification Code" onPress={() => signInWithPhoneNumber('+639284856233')} />
            <Button title="GO HOME" onPress={() => navigation.navigate('RiderMainScreen')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.DEFAULT_WHITE,
    }
})