import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Header, Colors, Status } from '../../constants';
import { WebView } from 'react-native-webview';

export default function VendorView() {
    return (
        <View>
            <Header title={'Vendor'} />
            < WebView
                source={{ uri: `https://www.google.com/maps/dir/?api=1&destination=${destinationLatitude},${destinationLongitude}&origin=${userLatitude},${userLongitude}` }}
                style={{ flex: 1 }}
            />
        </View>
    )

}

const styles = StyleSheet.create({})