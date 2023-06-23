import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Colors, Display, Separator, Status } from '../../constants'
import { MaterialCommunityIcons, Ionicons, Feather, AntDesign } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../../../firebaseConfig';
import firebase from 'firebase/compat/app';

export default function BuyerPhoneNumber({ navigation }) {


    const [phoneNumber, setPhoneNumber] = useState("");
    const [code, setCode] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [showButton, setShowButton] = useState(true);
    const [buttonConfirm, setButtonConfirm] = useState(true);
    const [viewCodeInput, setViewCode] = useState(false);

    const [seconds, setSeconds] = useState(180);
    const [isRunning, setIsRunning] = useState(false);

    const [handleTrap, setHandleTrap] = useState(0);

    const [codeError, setCodeError] = useState(false);


    useEffect(() => {
        const isDisabled = !phoneNumber || phoneNumber.length != 10 || phoneNumber.charAt(0) != '9';
        setShowButton(isDisabled);
    }, [phoneNumber]);

    useEffect(() => {
        const isDisabled = !code || code.length != 6;
        setButtonConfirm(isDisabled);
    }, [code]);

    useEffect(() => {
        let interval = null;

        if (isRunning && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isRunning, seconds]);

    useEffect(() => {
        if (seconds === 0) {
            // Timer has reached 0 seconds, perform any required actions
            // For example, display a message or trigger an event
            setIsRunning(false);
        }
    }, [seconds]);

    const handleStartTimer = () => {
        setIsRunning(true);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const sendVerification = () => {
        handleStartTimer();
        const phpNumber = "+63" + phoneNumber;
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(phpNumber, recaptchaVerifier.current)
            .then(setVerificationId);
        setViewCode(true);
        // setPhoneNumber("");
    };


    const confirmCode = () => {
        setModalVisible(true);
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        // navigation.navigate('BuyerSetupLocation', {
        //     mobileNumber: phoneNumber,
        // });
        // firebase.auth().signInWithCredential(credential)
        //     .then(() => {
        //         firebase.auth()
        //             .signOut()
        //             .then(() => {
        //                 setCode("");
        //                 setModalVisible(false);
        //             }).catch((error) => {
        //                 Alert.alert('Error', error, [
        //                     { text: 'OK', onPress: () => setModalVisible(false) },
        //                 ]);
        //             })
        //     }).catch((error) => {
        //         Alert.alert('Error', error, [
        //             { text: 'OK', onPress: () => setModalVisible(false) },
        //         ]);
        //     })
        firebase.auth().signInWithCredential(credential)
            .then(() => {
                setCode("");
                firebase.auth().signOut().then(() => {
                    setCode("");
                    setModalVisible(false);
                    navigation.replace('BuyerAddEmail', {
                        mobileNumber: phoneNumber,
                    });
                })
            })
            .catch((error) => {
                setCodeError(true);
                console.log(error);
                setModalVisible(false);
            })


    };

    const errorTrap = async () => {
        try {
            await firebase.firestore()
                .collection('users')
                .where("mobileNumber", "==", phoneNumber)
                .get()
                .then(querySnapshot => {
                    setHandleTrap(querySnapshot.size);
                    if (querySnapshot.size >= 1) {
                        console.log("Already exist");
                    } else {
                        sendVerification();
                    }
                    // querySnapshot.forEach(documentSnapshot => {
                    //     console.log(documentSnapshot.data().mobileNumber);
                    // });
                });
        } catch (error) {
            console.log(error);
        }
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

    if (viewCodeInput) {
        return (
            <View style={styles.container}>
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />
                {MessageAlert()}
                <Status />
                <Separator height={30} />
                <View
                    style={{
                        marginTop: 25,
                        paddingHorizontal: 20,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setViewCode(false)}
                    >
                        <MaterialCommunityIcons name="close" size={22} />
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        marginTop: 28,
                        paddingHorizontal: 30,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2.6),
                        }}
                    >
                        Enter 6-digit code
                    </Text>
                </View>


                <View
                    style={{
                        marginTop: 10,
                        paddingHorizontal: 30,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsRegular",
                            fontSize: RFPercentage(1.9),
                            color: Colors.INACTIVE_GREY,
                        }}
                    >
                        We sent a verification code to verify your mobile number.
                    </Text>
                </View>


                {/* CONFIRM CODE TEXTINPUT */}
                <View
                    style={{
                        marginTop: 20,
                        paddingHorizontal: 30,
                    }}
                >
                    <View
                        style={{
                            borderWidth: 1,
                            paddingVertical: 5,
                            borderBottomColor: Colors.INACTIVE_GREY,
                            borderColor: Colors.DEFAULT_WHITE,
                        }}
                    >
                        <TextInput
                            placeholder='123456'
                            onChangeText={(code) => setCode(code)}
                            keyboardType="numeric"
                            maxLength={6}
                            autoFocus
                            style={{
                                marginLeft: 5,
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2.1),
                            }}
                        />
                    </View>
                </View>

                {/* ERROR */}
                {
                    codeError && <View
                        style={{
                            marginTop: 10,
                            paddingHorizontal: 35,
                            flexDirection: "row",
                        }}
                    >
                        <Ionicons name="warning-outline" size={14} color={Colors.DEFAULT_RED} />
                        <Text
                            style={{
                                fontFamily: "PoppinsRegular",
                                fontSize: RFPercentage(1.7),
                                color: Colors.DEFAULT_RED,
                                marginLeft: 8,
                            }}
                        >Verification failed. Please double check code and try again.*</Text>
                    </View>
                }


                {/* RESEND BUTTON */}
                <View
                    style={{
                        marginTop: 15,
                        paddingHorizontal: 35,
                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: 'space-between',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(1.9),
                            color: Colors.INACTIVE_GREY,
                        }}
                    >
                        Resend code: <Text style={{ color: Colors.DEFAULT_YELLOW2 }} >{formatTime(seconds)}</Text>
                    </Text>
                    <Ionicons name="refresh" size={15} />
                </View>

                <Separator height={60} />
                {/* BUTTOM */}
                {/* <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            marginTop: 20,
                            width: Display.setWidth(80),
                            height: Display.setHeight(5.8),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: buttonConfirm ? Colors.DEFAULT_BG : Colors.DEFAULT_YELLOW2,
                            borderRadius: 6,
                        }}
                        disabled={buttonConfirm}
                        onPress={confirmCode}

                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(2),
                                color: buttonConfirm ? Colors.DARK_SEVEN : Colors.DEFAULT_WHITE,
                            }}
                        >
                            Confirm code
                        </Text>
                    </TouchableOpacity>

                </View> */}

                <View
                    style={{
                        paddingHorizontal: 30,
                        alignSelf: 'flex-end',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: 55,
                            height: 55,
                            borderRadius: 26,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: buttonConfirm ? Colors.DEFAULT_BG : Colors.DEFAULT_YELLOW2,
                        }}
                        disabled={buttonConfirm}
                        onPress={confirmCode}
                    >
                        <AntDesign
                            name="arrowright"
                            size={20}
                            color={buttonConfirm ? Colors.DARK_SEVEN : Colors.DEFAULT_WHITE} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    } else {
        return (
            <View style={styles.container} >
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />

                <Status />
                <Separator height={30} />

                <TouchableOpacity
                    style={{
                        marginTop: 25,
                        paddingHorizontal: 20,
                    }}
                    onPress={() => navigation.replace('BuyerLogin')}
                >
                    <MaterialCommunityIcons name="close" size={22} />
                </TouchableOpacity>


                <View
                    style={{
                        marginTop: 28,
                        paddingHorizontal: 30,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2.6),
                        }}
                    >
                        Enter phone number
                    </Text>
                </View>

                <View
                    style={{
                        marginTop: 10,
                        paddingHorizontal: 30,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsRegular",
                            fontSize: RFPercentage(1.9),
                            color: Colors.INACTIVE_GREY,
                        }}
                    >
                        We'll send an SMS with a verification code. SMS fees may apply.
                    </Text>
                </View>



                <View
                    style={{
                        marginTop: 25,
                        paddingHorizontal: 40,
                    }}
                >
                    <View
                        style={{
                            borderWidth: 1,
                            paddingVertical: 5,
                            borderBottomColor: Colors.INACTIVE_GREY,
                            borderColor: Colors.DEFAULT_WHITE,
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "PoppinsMedium",
                                    fontSize: RFPercentage(2.1),
                                    marginRight: 5,
                                }}
                            >
                                PH +63
                            </Text>
                            <Ionicons name="caret-down-outline" size={14} />
                        </View>

                        <TextInput
                            placeholder='Enter phone number'
                            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                            keyboardType='phone-pad'
                            maxLength={10}
                            autoFocus
                            style={{
                                flex: 1,
                                marginLeft: 5,
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2.1),
                            }}
                        />
                    </View>

                </View>

                {/* ERROR MESSAGE */}
                {
                    handleTrap >= 1 && <View
                        style={{
                            marginTop: 10,
                            paddingHorizontal: 35,
                            flexDirection: "row",
                        }}
                    >
                        <Ionicons name="warning-outline" size={14} color={Colors.DEFAULT_RED} />
                        <Text
                            style={{
                                fontFamily: "PoppinsRegular",
                                fontSize: RFPercentage(1.8),
                                color: Colors.DEFAULT_RED,
                                marginLeft: 8,
                            }}
                        >Mobile number is already taken*</Text>
                    </View>
                }


                <Separator height={60} />

                {/* BUTTOM */}
                {/* <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >

                    <TouchableOpacity
                        style={{
                            marginTop: 10,
                            width: Display.setWidth(80),
                            height: Display.setHeight(5.8),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: showButton ? Colors.DEFAULT_BG : Colors.DEFAULT_YELLOW2,
                            borderRadius: 6,
                        }}
                        // disabled={showButton}
                        // onPress={sendVerification}
                        onPress={errorTrap}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(2),
                                color: showButton ? Colors.DARK_SEVEN : Colors.DEFAULT_WHITE,
                            }}
                        >
                            Send Code
                        </Text>
                    </TouchableOpacity>

                </View> */}

                <View
                    style={{
                        paddingHorizontal: 30,
                        alignSelf: 'flex-end',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: 55,
                            height: 55,
                            borderRadius: 26,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: showButton ? Colors.DEFAULT_BG : Colors.DEFAULT_YELLOW2,
                        }}
                        disabled={showButton}
                        onPress={errorTrap}
                    >
                        <AntDesign
                            name="arrowright"
                            size={20}
                            color={showButton ? Colors.DARK_SEVEN : Colors.DEFAULT_WHITE} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
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