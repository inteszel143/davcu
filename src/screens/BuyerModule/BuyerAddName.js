import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Colors, Display, Separator, Status } from '../../constants'
import { MaterialCommunityIcons, Ionicons, Feather, AntDesign } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';

export default function BuyerAddName({ navigation }) {


    // TOOLS
    const [showButton, setShowButton] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // DATA
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    useEffect(() => {
        const isDisabled = firstName.length == 0 || !lastName;
        setShowButton(isDisabled);
    }, [firstName, lastName]);


    // UPDATE DATA

    const handleUpdateData = async () => {
        setModalVisible(true);
        try {
            await firebase.firestore()
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .update({
                    firstName: firstName,
                    lastName: lastName,
                })
                .then(() => {
                    navigation.replace("BuyerAddLocation");
                    setModalVisible(false);
                });
        } catch (error) {
            console.log(error);
            setModalVisible(false);
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

    function renderTopUsa() {
        return (
            <View>
                <TouchableOpacity
                    style={{
                        marginTop: 25,
                        paddingHorizontal: 20,
                    }}
                // onPress={() => navigation.replace('BuyerLogin')}
                >
                    <MaterialCommunityIcons name="close" size={22} />
                </TouchableOpacity>

                {/* TITLE */}
                <View
                    style={{
                        marginTop: 25,
                        paddingHorizontal: 30,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2.6),
                        }}
                    >
                        Add display name
                    </Text>
                </View>

                {/* SUBTITLE */}
                <View
                    style={{
                        marginTop: 8,
                        paddingHorizontal: 31,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsRegular",
                            fontSize: RFPercentage(1.9),
                            color: Colors.INACTIVE_GREY,
                        }}
                    >
                        You can always change this later.
                    </Text>
                </View>

            </View>
        )
    };

    function renderDataField() {
        return (
            <View>

                <View
                    style={{
                        marginTop: 15,
                        paddingHorizontal: 30,
                    }}
                >
                    <View
                        style={{
                            borderWidth: 0.5,
                            paddingVertical: 5,
                            borderBottomColor: Colors.INACTIVE_GREY,
                            borderColor: Colors.DEFAULT_WHITE,
                            paddingHorizontal: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TextInput
                            placeholder='First name'
                            onChangeText={(firstName) => setFirstName(firstName)}
                            autoCapitalize='words'
                            autoCorrect={false}
                            autoFocus
                            style={{
                                flex: 1,
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2),
                            }}
                        />

                    </View>
                </View>



                <View
                    style={{
                        marginTop: 20,
                        paddingHorizontal: 30,
                    }}
                >
                    <View
                        style={{
                            borderWidth: 0.5,
                            paddingVertical: 5,
                            borderBottomColor: Colors.INACTIVE_GREY,
                            borderColor: Colors.DEFAULT_WHITE,
                            paddingHorizontal: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TextInput
                            placeholder='Last name'
                            onChangeText={(lastName) => setLastName(lastName)}
                            autoCapitalize='words'
                            autoCorrect={false}
                            style={{
                                flex: 1,
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2),
                            }}
                        />

                    </View>
                </View>
            </View>
        )
    };

    function renderButton() {
        return (
            <View>
                {/* BUTTOM */}
                <Separator height={55} />
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
                        onPress={handleUpdateData}
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


    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={30} />

            {renderTopUsa()}
            {renderDataField()}
            {renderButton()}
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