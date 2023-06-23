import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, Separator, Status, Display } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { WebView } from 'react-native-webview';
import { FontAwesome, Ionicons, Feather, AntDesign, MaterialCommunityIcons } from 'react-native-vector-icons';
import queryString from 'query-string';
import paypalApi from '../../apis/paypalApi';
export default function PaypalPayment({ navigation, route }) {

    const { paypalUrl, token, totalPay } = route.params;


    const onUrlChange = (webviewState) => {
        console.log("webviewState: ", webviewState);
        if (webviewState.url.includes('https://example.com/cancel')) {
            navigation.navigate('OrderSummary');
        }
        if (webviewState.url.includes('https://example.com/return')) {

            const urlValues = queryString.parseUrl(webviewState.url);
            console.log("URL: ", urlValues);
            const { token } = urlValues.query
            if (!!token) {
                paymentSuccess(token)
                navigation.navigate('PaypalReceipt', {
                    totalPay: totalPay,
                });
            }
        }
    };

    const paymentSuccess = async (id) => {
        try {
            const res = paypalApi.capturePayment(id, token)
            console.log("CapturePayment", res)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container} >
            <Separator height={27} />
            <WebView source={{ uri: paypalUrl }}
                onNavigationStateChange={onUrlChange}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE,
    }
})