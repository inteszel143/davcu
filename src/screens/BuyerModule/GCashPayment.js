import { StyleSheet, Text, View, Button, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, Separator, Status, Display } from '../../constants'
import paypalApi from '../../apis/paypalApi'
import { WebView } from 'react-native-webview';

export default function GCashPayment() {
    const [url, seturl] = React.useState()

    const [paypalUrl, setPaypalUrl] = useState(null)
    const [accessToken, setAccessToken] = useState(null)

    const onPressPaypal = async () => {
        try {

            // const token = "A21AAKtXppcq5GsFYJSv1VONq3b_p1F1tOMyLQcv4N61R8xJzhyoWlKywNAJT5x0W6MHPdOp6n8yINLIY1tUh_rMO7D2WE0PA"; () => navigation.navigate('PaypalPayment')
            const token = await paypalApi.generateToken()
            // console.log(token);
            setAccessToken(token);
            const res = await paypalApi.createOrder(token)
            // console.log(res);
            if (!!res?.links) {
                const findUrl = res.links.find(data => data?.rel == "approve");
                // console.log("URL:", findUrl);
                setPaypalUrl(findUrl.href);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container} >
            <Separator height={30} />
            <Button title="Pay with Paypal" onPress={onPressPaypal} />
            {/* <WebView source={{ uri: 'https://www.sandbox.paypal.com/checkoutnow?token=7WG19674RU172513K' }} /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.DEFAULT_WHITE,
    }
})