import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, BackHandler, Dimensions, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { scale } from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import {
    Colors,
    Display,
    Separator, Animation, Status, MyCart, Header
} from '../../constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
// FIREBASE
import { firebase } from '../../../config';
const emailLogo = require('../../../assets/images/emailSent.jpg')

export default function BuyerForgotEmailSent({ navigation }) {
    return (
        <View style={styles.container} >
            <View
                style={{
                    flex: 1,
                    // justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Separator height={50} />
                <View>
                    <Image
                        source={emailLogo}
                        resizeMode="contain"
                        style={{
                            width: Display.setWidth(90),
                            height: Display.setHeight(30),
                        }}
                    />
                </View>

                {/* WORDING */}
                <Separator height={40} />
                <View>
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2.6),
                            textAlign: 'center',
                            paddingHorizontal: 15,
                        }}
                    >We have just sent you an email.</Text>
                    <Separator height={5} />
                    <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2.2),
                            textAlign: 'center',
                            color: Colors.INACTIVE_GREY,
                            paddingHorizontal: 40,
                        }}
                    >Please check your inbox for more information.</Text>
                </View>

                <Separator height={150} />
                <TouchableOpacity
                    style={{
                        width: '90%',
                        height: Display.setHeight(6),
                        backgroundColor: Colors.DEFAULT_YELLOW2,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.navigate('BuyerLogin')}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >DONE</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE,
    },
})