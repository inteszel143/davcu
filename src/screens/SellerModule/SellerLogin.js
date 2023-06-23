import {
    StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, Alert,
    BackHandler, ActivityIndicator, FlatList, TextInput, Modal, KeyboardAvoidingView, Keyboard,
} from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';

import {
    Colors, Display, Separator, Status,
} from '../../constants';
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, Feather } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../../config';
const { width } = Dimensions.get('screen');
const cardWidth = width / 2.2;
const boarding = require('../../../assets/images/sellerLogin.png');
const facebook = require('../../../assets/images/facebook.png');

export default function SellerLogin({ navigation }) {
    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true })
        return () => backHandler.remove();
    }, []);

    const [loading, setLoading] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isPasswordShow, setIsPasswordShow] = React.useState(false)
    const usersRef = firebase.firestore().collection('sellers')

    const [emailFocused, setEmailFocused] = React.useState(false);
    const [passwordFocused, setPasswordFocused] = React.useState(false);

    const [emailError, setEmailError] = React.useState(null);
    const [passwordError, setPasswordError] = React.useState(null);

    React.useEffect(() => {

        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                navigation.replace('SellerMainScreen');
            }
        });

        return unsubscribe;
    }, [])


    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;

        if (!email) {
            setEmailError('Please Enter Email Address');
            isValid = false;
        } else if (!email.match(/\S+@\S+\.\S+/)) {
            setEmailError('Please input a valid email');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Please Enter Password');
            isValid = false;
        } else if (password < 8) {
            setPasswordError('Password must contain at least 8 characters');
            isValid = false;
        }

        //IF ALL WAS VALID THEN PROCEED THIS CODE !!
        if (isValid) {
            { FullValidating() }
        }
    }


    const loginUser = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
            setModalVisible(false)
        } catch (error) {
            Alert.alert(error.message)
            setModalVisible(false);
        }

    }


    const FullValidating = () => {
        setModalVisible(true);
        usersRef
            .where('email', '==', email)
            .get()
            .then((snap) => {
                if (!snap.empty) {

                    // setLoading(true)
                    setTimeout(() => {
                        loginUser(email, password);
                    }, 1000)
                } else {
                    Alert.alert(
                        "Please Check Your Email and Password ",
                        "These credentials do not match our records.",
                        [
                            { text: "OK", onPress: () => setModalVisible(false) }
                        ]
                    );
                }
            })
    };



    function MessageAlert() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View
                            style={{
                                // flexDirection: 'row',
                            }}
                        >
                            <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                    marginTop: 5,
                                }}
                            >Loading</Text>
                        </View>

                    </View>
                </View>
            </Modal>
        )
    };


    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            < KeyboardAwareScrollView
                keyboardDismissMode='on-drag'

            >


                <Separator height={50} />
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={boarding}
                        resizeMode='contain'
                        style={{
                            width: Display.setWidth(90),
                            height: Display.setHeight(35),
                        }}
                    />

                </View>
                <Separator height={10} />
                {/* WORDS */}
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsBold',
                            fontSize: RFPercentage(3.2),
                            textAlign: 'center',
                        }}
                    >
                        Welcome to Davcu
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'PoppinsBold',
                            fontSize: RFPercentage(3.2),
                            textAlign: 'center',
                        }}
                    >
                        Seller
                    </Text>

                    <Separator height={12} />
                    {/* <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2),
                            textAlign: 'center',
                            color: Colors.DARK_SIX,
                            paddingHorizontal: 25,
                        }}
                    >
                        Please enter your login credentials to access your account.
                    </Text> */}

                </View>
                <Separator height={15} />
                {/* INPUT TEXT */}

                <View>
                    <View
                        style={[styles.inputContainer,
                        { borderColor: emailError ? Colors.DEFAULT_RED : passwordFocused ? Colors.LIGHT_GREY2 : Colors.LIGHT_GREY2 }]}
                    >
                        <View
                            style={styles.inputSubContainer}
                        >
                            <MaterialCommunityIcons
                                name='email-check-outline'
                                size={20}
                                color={emailError ? Colors.DEFAULT_RED : Colors.DARK_SIX}
                                style={{
                                    marginRight: 10,
                                }}
                            />

                            <TextInput
                                style={{
                                    flex: 1,
                                    fontSize: RFPercentage(2),
                                    marginVertical: 10,
                                    fontFamily: 'PoppinsMedium',
                                    marginLeft: 2,
                                }}
                                placeholder="Email"
                                onFocus={() => {
                                    setEmailFocused(true);
                                    setEmailError(null);
                                    setPasswordError(null);
                                }}
                                onBlur={() => setEmailFocused(false)}
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                autoCapitalize="none"
                                onChangeText={(email) => setEmail(email)}
                            />
                            {emailError && <MaterialCommunityIcons
                                name='alert-circle-outline'
                                size={20}
                                color={Colors.DEFAULT_RED}

                            />}
                        </View>
                    </View>

                    {emailError && (
                        <Text
                            style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: RFPercentage(1.9),
                                color: Colors.DEFAULT_RED,
                                marginHorizontal: 25,
                                marginTop: 5,
                            }}
                        >{emailError}</Text>
                    )}

                    <Separator height={20} />

                    {/* PASSSWWWOWOWOWOWORRRRR */}

                    <View style={[styles.inputContainer, { borderColor: passwordError ? Colors.DEFAULT_RED : Colors.LIGHT_GREY2 }]}>
                        <View style={styles.inputSubContainer}>

                            <MaterialCommunityIcons
                                name='lock-outline'
                                size={20}
                                color={passwordError ? Colors.DEFAULT_RED : Colors.DARK_SIX}
                                style={{
                                    marginRight: 8,

                                }}
                            />

                            <TextInput
                                style={{
                                    flex: 1,
                                    fontSize: RFPercentage(2),
                                    textAlignVertical: 'center',
                                    marginVertical: 10,
                                    fontFamily: 'PoppinsMedium',
                                    marginLeft: 2,
                                }}
                                placeholder="Password"
                                onFocus={() => {
                                    setPasswordFocused(true);
                                    setPasswordError(null);
                                    setEmailError(null);
                                }}
                                onBlur={() => setPasswordFocused(false)}
                                secureTextEntry={isPasswordShow ? false : true}
                                onChangeText={(password) => setPassword(password)}
                            />

                            {passwordError ? <MaterialCommunityIcons
                                name='alert-circle-outline'
                                size={20}
                                color={Colors.DEFAULT_RED}

                            /> : <MaterialCommunityIcons
                                name={isPasswordShow ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color={Colors.DARK_SIX}
                                onPress={() => setIsPasswordShow(!isPasswordShow)}
                            />

                            }


                        </View>
                    </View>

                    {passwordError && (
                        <Text
                            style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: 14,
                                color: Colors.DEFAULT_RED,
                                marginHorizontal: 25,
                                marginTop: 5,
                            }}
                        >{passwordError}</Text>
                    )}

                    <Separator height={8} />
                    <View style={{
                        marginHorizontal: 25,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',

                    }} >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            {/* <ToggleButton size={0.5} /> */}
                            <Text
                                style={{
                                    marginLeft: 10,
                                    fontSize: 14,
                                    lineHeight: 12 * 1.4,
                                    fontFamily: 'PoppinsMedium',

                                }}
                            ></Text>
                        </View>

                        <Text
                            style={{
                                marginLeft: 16,
                                fontSize: RFPercentage(1.9),
                                color: Colors.DEFAULT_YELLOW2,
                                fontFamily: 'PoppinsSemiBold',
                            }}
                            onPress={() => navigation.navigate('BuyerForgotPassword')}
                        > Forgot Password ?</Text>
                    </View>
                </View>


                {/* BUTTON */}
                <Separator height={25} />
                <TouchableOpacity
                    style={{
                        width: Display.setWidth(85),
                        height: Display.setHeight(6),
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.DEFAULT_YELLOW2,
                        borderRadius: 10,
                    }}
                    onPress={validate}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.DEFAULT_WHITE,
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2.2),
                            }}
                        >
                            Login
                        </Text>

                    </View>
                </TouchableOpacity>

                {/* <Separator height={20} /> */}

                {/* <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}

                >
                    <TouchableOpacity
                        style={{
                            width: Display.setWidth(85),
                            height: Display.setHeight(6),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.FABEBOOK_BLUE,
                            borderRadius: 5,
                            flexDirection: 'row',
                        }}
                    // onPress={() => navigation.replace('FacebookLogin')}
                    >
                        <View
                            style={{
                                backgroundColor: Colors.DEFAULT_WHITE,
                                padding: 2,
                                borderRadius: 3,
                                position: 'absolute',
                                left: 25,
                            }}
                        >
                            <Image
                                source={facebook}
                                style={{
                                    height: Display.setHeight(2.6),
                                    width: Display.setWidth(5.3),
                                }}
                            />
                        </View>

                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                color: Colors.DEFAULT_WHITE,
                            }}
                        >Login with Facebook</Text>

                    </TouchableOpacity>

                </View> */}

                <Separator height={20} />
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SelectType')}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.8),
                            }}
                        >
                            Don't have an account?
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SellerRegister')}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                color: Colors.DEFAULT_YELLOW2,
                            }}
                        > Register</Text>
                    </TouchableOpacity>

                </View>

            </KeyboardAwareScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: Colors.DEFAULT_WHITE,
    },
    inputContainer: {
        backgroundColor: Colors.DEFAULT_BG,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: Colors.LIGHT_GREY2,
        justifyContent: 'center',
    },
    inputSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 20,
    },
    modalView: {
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 5,
        width: Display.setWidth(45),

        paddingVertical: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})