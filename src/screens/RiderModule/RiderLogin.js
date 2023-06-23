import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, FlatList, TextInput, Alert, Modal } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../constants';
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const { width } = Dimensions.get('screen');
const cardWidth = width / 2.2;
const boarding = require('../../../assets/images/onboarding.jpg');

export default function RiderLogin({ navigation }) {

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    const [modalVisible, setModalVisible] = useState(false);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const usersRef = firebase.firestore().collection('Riders')
    const [isPasswordShow, setIsPasswordShow] = useState(false)
    const [loading, setLoading] = React.useState(false);

    const [emailFocus, setEmailFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [showButton, setShowButton] = useState(true);


    useEffect(() => {
        const isDisabled = email.length === 0 || password.length === 0 || !email.match(/\S+@\S+\.\S+/);
        setShowButton(isDisabled);
    }, [email, password]);


    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true })
        return () => backHandler.remove();
    }, []);

    React.useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                navigation.navigate('RiderMainScreen');
                setModalVisible(false);
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
            setModalVisible(false);
        } catch (error) {
            Alert.alert(error.message);
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
                    setLoading(true)
                    setTimeout(() => {
                        loginUser(email, password);
                        setLoading(false)
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
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
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
                            width: Display.setWidth(100),
                            height: Display.setHeight(35),
                        }}
                    />

                </View>

                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(3),
                            textAlign: 'center',
                        }}
                    >
                        Welcome to Davcu {'\n'} Rider
                    </Text>

                    {/* <Separator height={8} />
                    <Text
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

                <Separator height={35} />

                <View style={[styles.fieldSet, { borderColor: emailFocus ? Colors.SECONDARY_GREEN : Colors.INACTIVE_GREY, }]}>
                    <Text style={styles.legend}>Email</Text>
                    <TextInput
                        placeholder='johndoe@gmail.com'
                        keyboardType='email-address'
                        onFocus={() => {
                            setEmailFocus(true);
                        }}
                        onBlur={() => {
                            setEmailFocus(false);
                        }}
                        autoCapitalize='none'
                        onChangeText={(email) => setEmail(email)}
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2.2),
                            paddingHorizontal: 5,
                        }}
                    />
                </View>


                <Separator height={40} />


                <View style={[styles.fieldSet, { borderColor: passwordFocus ? Colors.SECONDARY_GREEN : Colors.INACTIVE_GREY, }]}>
                    <Text style={styles.legend}>Password</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <TextInput
                            placeholder='**********'
                            secureTextEntry={isPasswordShow ? false : true}
                            onChangeText={(password) => setPassword(password)}
                            onFocus={() => {
                                setPasswordFocus(true);
                            }}
                            onBlur={() => {
                                setPasswordFocus(false);
                            }}
                            style={{
                                flex: 1,
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2.2),
                                paddingHorizontal: 5,
                            }}
                        />
                        <MaterialCommunityIcons
                            name={isPasswordShow ? 'eye-outline' : 'eye-off-outline'}
                            size={18}
                            color={Colors.DARK_SIX}
                            style={{
                                marginRight: 3,
                            }}
                            onPress={() => setIsPasswordShow(!isPasswordShow)}
                        />

                    </View>
                </View>
                <Separator height={5} />
                <View style={{
                    marginHorizontal: 20,
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

                    <TouchableOpacity>
                        <Text
                            style={{
                                // marginLeft: 16,
                                fontSize: RFPercentage(1.9),
                                color: Colors.SECONDARY_GREEN,
                                fontFamily: 'PoppinsMedium',
                            }}
                        // onPress={() => navigation.navigate('ForgotPasswordScreen')}
                        > Forgot Password ?</Text>
                    </TouchableOpacity>
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
                        backgroundColor: showButton ? Colors.LIGHT_GREEN : Colors.SECONDARY_GREEN,
                        borderRadius: 5,
                    }}
                    disabled={showButton}
                    onPress={FullValidating}
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
                                fontSize: RFPercentage(2),
                            }}
                        >
                            Login
                        </Text>
                    </View>
                </TouchableOpacity>

                <Separator height={10} />
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
                        onPress={() => navigation.navigate('RiderRegister')}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                color: Colors.SECONDARY_GREEN,
                            }}
                        > Register</Text>
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
    fieldSet: {
        marginHorizontal: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        paddingBottom: 5,
        paddingTop: 13,
    },
    legend: {
        position: 'absolute',
        top: -9,
        left: 10,
        backgroundColor: '#FFFFFF',
        fontFamily: 'PoppinsMedium',
        fontSize: RFPercentage(1.9),
        paddingHorizontal: 5,
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