import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import {
    Colors,
    Display,
    Separator, Animation, Status, MyCart, Header
} from '../../constants';
import { Ionicons, AntDesign } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
// FIREBASE
import { firebase } from '../../../config';

export default function BuyerForgotPassword({ navigation }) {

    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [loading, setLoading] = useState(false);


    //Change the password
    const handleChangePassword = () => {
        firebase.auth().sendPasswordResetEmail(phoneNumber)
            .then(() => {
                // alert('Please check your email address to reset your password !');
                navigation.navigate('BuyerForgotEmailSent');
                setLoading(false);
            }).catch((error) => {
                alert(error)
            })
    };


    function renderHeader() {
        return (
            <View
                style={{
                    paddingHorizontal: 20,
                    marginTop: 10,
                }}
            >
                <TouchableOpacity
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.LIGHT_GREY2,
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name='close' size={15} />

                </TouchableOpacity>
            </View>
        )
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={styles.container} >
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor={Colors.DEFAULT_WHITE}
                    translucent
                />

                <Separator height={StatusBar.currentHeight} />

                {renderHeader()}

                <Text
                    style={{
                        fontSize: RFPercentage(2.8),
                        fontFamily: 'PoppinsSemiBold',
                        marginTop: 30,
                        marginBottom: 10,
                        marginHorizontal: 20,

                    }}
                >Forgot Password</Text>
                <Text
                    style={{
                        fontSize: RFPercentage(2.2),
                        fontFamily: 'PoppinsRegular',
                        marginHorizontal: 20,

                    }}
                >Please enter your Email so we can help you to recover your password!</Text>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        marginVertical: 50,
                    }}
                >
                    {/* <TouchableOpacity
            style={{
              backgroundColor: Colors.LIGHT_GREY,
              width: Display.setWidth(22),
              marginRight: 10,
              borderRadius: 8,
              height: Display.setHeight(7),
              justifyContent: 'space-evenly',
              alignItems: 'center',
              borderWidth: 0.5,
              borderColor: Colors.LIGHT_GREY2,
              flexDirection: 'row',
            }}
          >
            <Image
              source={Images.FLAG}
              style={{
                height: 20,
                width: 20,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'PoppinsRegular',
              }}
            >+63</Text>
          </TouchableOpacity> */}

                    <View
                        style={{
                            paddingHorizontal: 10,
                            borderRadius: 8,
                            height: Display.setHeight(7),
                            borderWidth: 0.5,
                            borderColor: Colors.LIGHT_GREY2,
                            justifyContent: 'center',
                            flex: 1,

                        }}
                    >
                        <TextInput
                            style={{
                                flex: 1,
                                marginVertical: 4,
                                padding: 5,
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                            placeholder="Enter your email"
                            autoFocus
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            autoCapitalize="none"
                            onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
                        />
                    </View>
                </View>


                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.DEFAULT_YELLOW2,
                        borderRadius: 5,
                        marginHorizontal: 20,
                        height: Display.setHeight(6),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 23,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        handleChangePassword();
                        setLoading(true);
                    }}
                >
                    {
                        loading ? <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                            :
                            <Text
                                style={{
                                    color: Colors.DEFAULT_WHITE,
                                    fontSize: RFPercentage(2),
                                    fontFamily: 'PoppinsSemiBold',
                                }}
                            >Reset Password</Text>
                    }

                </TouchableOpacity>



            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE
    }
})