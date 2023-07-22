import {
    StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, Alert,
    BackHandler, ActivityIndicator, TextInput, KeyboardAvoidingView, Keyboard, Modal, FlatList
} from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';

import {
    Colors, Display, Separator, Status,
} from '../../constants';

import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, Feather } from 'react-native-vector-icons';
import { firebase } from '../../../config';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const ads1 = require('../../../assets/Icon/ads6.jpg');
const ads2 = require('../../../assets/Icon/ads5.jpg');
const ads3 = require('../../../assets/Icon/ads4.jpg');


export default function BuyerLogin({ navigation }) {

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true })
        return () => backHandler.remove();
    }, []);

    const [user, setUser] = useState();
    const [initializing, setInitializing] = useState(true);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isPasswordShow, setIsPasswordShow] = useState(true)
    const [showButton, setShowButton] = useState(true);
    const [loading, setLoading] = React.useState(false);
    const usersRef = firebase.firestore().collection('users')
    const [modalVisible, setModalVisible] = useState(false);

    const advertising = [
        {
            id: 1,
            img: ads1,
        },
        {
            id: 2,
            img: ads2,
        },
        {
            id: 3,
            img: ads3,
        }
    ]


    useEffect(() => {
        const isDisabled = !email || !email.match(/\S+@\S+\.\S+/) || !password || password.length < 8;
        setShowButton(isDisabled);
    }, [email, password]);

    useEffect(() => {
        setTimeout(() => {
            setModalVisible(true); //
        }, 1000);
    }, []);


    React.useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                navigation.navigate('MainScreen');
            }
        });
        return unsubscribe;
    }, []);


    // Handle user state change
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);


    const loginUser = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
            setLoading(false)
        } catch (error) {
            Alert.alert(error.message)
            setLoading(false);
        }

    }

    const FullValidating = () => {
        setLoading(true)
        usersRef
            .where('email', '==', email)
            .get()
            .then((snap) => {
                if (!snap.empty) {

                    setTimeout(() => {
                        loginUser(email, password);
                        // setLoading(false);
                    }, 1000)
                } else {
                    Alert.alert(
                        "Please Check Your Email and Password ",
                        "These credentials do not match our records.",
                        [
                            { text: "OK", onPress: () => setLoading(false) }
                        ]
                    );
                }
            })
    };



    function MessageAlert() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor={Colors.DARK_ONE}
                        translucent
                    />
                    <FlatList
                        data={advertising}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >

                                <Image
                                    source={item.img}
                                    resizeMode='center'
                                    style={{
                                        width: Display.setWidth(100),
                                        height: Display.setHeight(45),
                                    }}
                                />

                                <View
                                    style={{
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: Colors.LIGHT_GREY,
                                        }}
                                    />
                                    <View
                                        style={{
                                            width: 10,
                                            height: 10,
                                            marginLeft: 8,
                                            borderRadius: 5,
                                            backgroundColor: Colors.INACTIVE_GREY,
                                        }}
                                    />
                                </View>
                            </View>
                        )}
                    />
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            bottom: Display.setHeight(17),
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 0.9,
                            borderColor: Colors.LIGHT_GREY2,
                        }}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <MaterialCommunityIcons name="close" size={18} color={Colors.DEFAULT_WHITE} />
                    </TouchableOpacity>

                </View>
            </Modal>
        )
    };


    return (
        <View style={styles.container} >
            <KeyboardAwareScrollView>
                <Status />

                {MessageAlert()}

                <Separator height={65} />
                {/* IMAGE */}
                <View
                    style={{
                        marginLeft: 25,
                    }}
                >
                    <Image
                        source={require('../../../assets/Icon/icon.png')}
                        resizeMode='contain'
                        style={{
                            width: 60,
                            height: 60,
                        }}
                    />
                </View>

                {/* WORDINGS */}
                <View
                    style={{
                        marginLeft: 20,
                        marginTop: 15,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(3.1),
                        }}
                    >
                        Welcome back!
                    </Text>

                    <Text
                        style={{
                            fontFamily: "PoppinsRegular",
                            fontSize: RFPercentage(1.9),
                            color: Colors.INACTIVE_GREY,
                        }}
                    >
                        Please enter your details
                    </Text>
                </View>

                {/* INPUT TEXT */}
                <View
                    style={{
                        marginTop: 25,
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            borderWidth: 0.9,
                            borderColor: Colors.INACTIVE_GREY,
                            borderRadius: 25,
                            width: Display.setWidth(88),
                            justifyContent: 'center',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                        }}
                    >

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons name="mail-outline" size={18} color={Colors.INACTIVE_GREY} />
                            <TextInput
                                placeholder='johndoe@gmail.com'
                                onChangeText={(email) => setEmail(email)}
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                autoCapitalize="none"
                                style={{
                                    flex: 1,
                                    fontFamily: "PoppinsMedium",
                                    fontSize: RFPercentage(2),
                                    marginLeft: 12,
                                }}
                            />

                        </View>
                    </View>


                    <View
                        style={{
                            marginTop: 20,
                            borderWidth: 0.9,
                            borderColor: Colors.INACTIVE_GREY,
                            borderRadius: 25,
                            width: Display.setWidth(88),
                            justifyContent: 'center',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                        }}
                    >

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons name="lock-closed-outline" size={18} color={Colors.INACTIVE_GREY} />
                            <TextInput
                                placeholder='****************'
                                secureTextEntry={isPasswordShow ? true : false}
                                onChangeText={(password) => setPassword(password)}
                                style={{
                                    flex: 1,
                                    fontFamily: "PoppinsMedium",
                                    fontSize: RFPercentage(2),
                                    marginLeft: 12,
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => setIsPasswordShow(!isPasswordShow)}
                            >
                                <Ionicons name={isPasswordShow ? "eye-off-outline" : "eye-outline"} size={18} color={Colors.INACTIVE_GREY} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Separator height={15} />

                {/* FORGOT */}
                <TouchableOpacity
                    style={{
                        alignSelf: 'flex-end',
                        paddingHorizontal: 25,
                    }}
                    onPress={() => navigation.navigate('BuyerForgotPassword')}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(1.9),
                            color: Colors.DEFAULT_YELLOW2,
                        }}
                    >
                        Forgot Password ?
                    </Text>
                </TouchableOpacity>


                {/* BUTTON */}


                {/* BUTTON */}
                <Separator height={25} />
                <TouchableOpacity
                    style={{
                        width: Display.setWidth(88),
                        height: Display.setHeight(6),
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: showButton ? Colors.LIGHT_YELLOW : Colors.DEFAULT_YELLOW2,
                        borderRadius: 20,
                    }}
                    disabled={showButton ? true : false}
                    onPress={FullValidating}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        {
                            loading ? <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                                :
                                <Text
                                    style={{
                                        color: Colors.DEFAULT_WHITE,
                                        fontFamily: 'PoppinsMedium',
                                        fontSize: RFPercentage(2),
                                    }}
                                >
                                    SIGN IN
                                </Text>
                        }

                    </View>
                </TouchableOpacity>


                <View
                    style={{
                        marginTop: 20,
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(1.9),
                            color: Colors.INACTIVE_GREY,
                        }}
                    >Or sign in with</Text>
                </View>


                {/* OTHER BUTTON */}

                <View
                    style={{
                        marginTop: 25,
                        alignItems: 'center',
                    }}
                >

                    <TouchableOpacity
                        style={{
                            width: Display.setWidth(88),
                            height: Display.setHeight(6),
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 0.5,
                            borderColor: Colors.INACTIVE_GREY,
                            borderRadius: 20,
                        }}

                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/facebook.png')}
                                resizeMode='contain'
                                style={{
                                    width: 16,
                                    height: 16,
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(2),
                                    marginLeft: 10,
                                }}
                            >
                                Continue with Facebook
                            </Text>

                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            marginTop: 25,
                            width: Display.setWidth(88),
                            height: Display.setHeight(6),
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 0.5,
                            borderColor: Colors.INACTIVE_GREY,
                            borderRadius: 20,
                        }}

                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/google.png')}
                                resizeMode='contain'
                                style={{
                                    width: 16,
                                    height: 16,
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(2),
                                    marginLeft: 10,
                                }}
                            >
                                Continue with Google
                            </Text>

                        </View>
                    </TouchableOpacity>

                </View>

                <Separator height={40} />
                {/* DONT HAVE AN ACCOUNT */}
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
                        // onPress={() => navigation.navigate('TestScreen')}
                        onPress={() => navigation.navigate('BuyerPhoneNumber')}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                color: Colors.DEFAULT_YELLOW2,
                                marginLeft: 2,
                            }}
                        >Sign up</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
    },
    modalView: {
        backgroundColor: Colors.DEFAULT_WHITE,
        borderRadius: 8,
        width: Display.setWidth(85),
        paddingVertical: 25,
        alignItems: 'center',
    },
})