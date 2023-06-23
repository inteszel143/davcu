import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Button } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Colors, Display, Separator, Status } from '../../constants'
import { MaterialCommunityIcons, Ionicons, Feather } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../../../firebaseConfig';
import firebase from 'firebase/compat/app';
export default function TestScreen({ navigation }) {

    const [modalVisible, setModalVisible] = useState(false);


    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")

    const handleAddData = async () => {
        setModalVisible(true)
        try {
            await firebase.firestore()
                .collection('users')
                .add({
                    firstName,
                    lastName,
                    mobileNumber,
                    email,
                    address,
                })
                .then(() => {
                    setModalVisible(false)
                    console.log('User added!');
                });
        } catch (error) {
            setModalVisible(true)
            console.log(error);
        }
    }


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
            {MessageAlert()}

            <Status />
            <Separator height={30} />

            <View
                style={{
                    marginTop: 25,
                    paddingHorizontal: 20,
                }}
            >
                <MaterialCommunityIcons name="close" size={22} />
            </View>


            <View
                style={{
                    marginTop: 25,
                    paddingHorizontal: 30,
                }}
            >
                <Text
                    style={{
                        fontFamily: "PoppinsBold",
                        fontSize: RFPercentage(2.5),
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
                    marginTop: 10,
                    paddingHorizontal: 40,
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
                        placeholder='First name'
                        onChangeText={(firstName) => setFirstName(firstName)}
                        style={{

                            marginLeft: 5,
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(2.1),
                        }}
                    />
                </View>
            </View>

            <View
                style={{
                    marginTop: 10,
                    paddingHorizontal: 40,
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
                        placeholder='Last name'
                        onChangeText={(lastName) => setLastName(lastName)}
                        style={{
                            marginLeft: 5,
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(2.1),
                        }}
                    />
                </View>

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
                        onChangeText={(mobileNumber) => setMobileNumber(mobileNumber)}
                        keyboardType='phone-pad'
                        maxLength={10}
                        style={{
                            flex: 1,
                            marginLeft: 5,
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(2.1),
                        }}
                    />
                </View>

            </View>


            <View
                style={{
                    marginTop: 10,
                    paddingHorizontal: 40,
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
                        placeholder='Email'
                        onChangeText={(email) => setEmail(email)}
                        style={{
                            marginLeft: 5,
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(2.1),
                        }}
                    />
                </View>

            </View>



            <View
                style={{
                    marginTop: 10,
                    paddingHorizontal: 40,
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
                        placeholder='Address'
                        onChangeText={(address) => setAddress(address)}
                        style={{
                            marginLeft: 5,
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(2.1),
                        }}
                    />
                </View>

            </View>






            <Separator height={30} />

            {/* BUTTOM */}
            <View
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
                        backgroundColor: Colors.DEFAULT_YELLOW2,
                        borderRadius: 6,
                    }}
                    onPress={handleAddData}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >
                        Submit Data
                    </Text>
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