import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

export default function SellerPhoneAuth({ navigation, route }) {

    const { phoneNumber } = route.params;

    return (
        <View style={styles.container} >

            <Text>{phoneNumber}</Text>
            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderWidth: 1,
                }}
                onPress={() => navigation.navigate('SellerStoreLocation')}
            >
                <Text
                >Set Store Address</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})