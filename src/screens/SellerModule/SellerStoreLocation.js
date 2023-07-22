import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Button, TextInput, Dimensions, ScrollView, ActivityIndicator, Alert, BackHandler, Modal } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Colors, Display, Separator, Status, Barangay
} from '../../constants';
import { MaterialCommunityIcons, AntDesign, Ionicons, Entypo } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { SelectList } from 'react-native-dropdown-select-list'

import { firebase } from '../../../config';



const { width, height } = Dimensions.get('window');



export default function SellerStoreLocation({ navigation }) {
    // TOOLS
    const [modalVisible, setModalVisible] = useState(false);
    const [showButton, setShowButton] = useState(true);



    const [street, setStreet] = useState('');
    const [selected, setSelected] = React.useState("");

    useEffect(() => {
        const isDisabled = !street || !selected;
        setShowButton(isDisabled);
    }, [street, selected]);


    const handleUpdateSeller = async () => {
        setModalVisible(true);
        const storeLocation = street + ' ' + selected + ' ' + 'Davao City ' + 'Davao Del Sur ' + 'Mindanao';
        try {
            await firebase.firestore()
                .collection('sellers')
                .doc(firebase.auth().currentUser.uid)
                .update({
                    Latitude: 7.066973,
                    Longitude: 125.59549,
                    storeLocation: storeLocation,
                })
                .then(() => {
                    setModalVisible(false);
                    navigation.navigate('SellerMainScreen');
                });
        } catch (error) {
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
    function renderContentTop() {
        return (
            <View
                style={{
                    paddingHorizontal: 20,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsBold',
                        fontSize: RFPercentage(3),
                    }}
                >
                    Add shop address
                </Text>
            </View>
        )
    };



    function renderAddress() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,

                }}
            >

                <View
                    style={{
                        backgroundColor: Colors.DEFAULT_WHITE,
                        paddingVertical: 15,
                        borderRadius: 5,
                    }}
                >

                    {/* REGION */}

                    <View
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: Colors.LIGHT_GREY2,
                            flexDirection: 'row',
                            marginHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                marginRight: 3,
                                color: Colors.DARK_SIX,
                            }}
                        >Mindanao</Text>

                        <Ionicons name="information-circle-outline" size={13} color={Colors.DEFAULT_YELLOW} />
                    </View>

                    <Separator height={10} />
                    {/* PROVINCE */}
                    <View
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: Colors.LIGHT_GREY2,
                            flexDirection: 'row',
                            // alignItems: 'center',
                            marginHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                marginRight: 3,
                                color: Colors.DARK_SIX,
                            }}
                        >Davao Del Sur</Text>

                        <Ionicons name="information-circle-outline" size={13} color={Colors.DEFAULT_YELLOW} />
                    </View>



                    <Separator height={10} />
                    {/* CITY */}
                    <View
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: Colors.LIGHT_GREY2,
                            flexDirection: 'row',
                            // alignItems: 'center',
                            marginHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                marginRight: 3,
                                color: Colors.DARK_SIX,
                            }}
                        >Davao City</Text>

                        <Ionicons name="information-circle-outline" size={13} color={Colors.DEFAULT_YELLOW} />
                    </View>

                    {/* BARANGAY */}
                    <Separator height={10} />
                    <SelectList
                        placeholder='Select Barangay'
                        setSelected={(val) => setSelected(val)}
                        data={Barangay.Barangay}
                        save="value"
                        fontFamily='PoppinsMedium'
                        boxStyles={{
                            borderRadius: 0,
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                        }}
                        dropdownStyles={{
                            borderRadius: 0,
                            borderWidth: 0.7,
                            borderColor: Colors.LIGHT_GREY2,
                        }}
                        inputStyles={{
                            fontSize: RFPercentage(2),
                            // color: Colors.INACTIVE_GREY,
                        }}
                    />
                    <View style={{
                        height: 0.7,
                        backgroundColor: Colors.LIGHT_GREY2,
                        marginHorizontal: 10,
                    }} />



                    <Separator height={10} />
                    <TextInput
                        placeholder='Street Name, Building, House No.'
                        onChangeText={(street) => setStreet(street)}
                        autoCapitalize='words'
                        autoCorrect={false}
                        style={{
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: Colors.LIGHT_GREY2,
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2),
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            marginHorizontal: 10,
                        }}
                    />

                    <Separator height={5} />
                </View>
            </View>
        )
    };




    


    function renderButton() {
        return (
            <View
                style={{
                    marginTop: 30,
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    style={{
                        width: Display.setWidth(88),
                        height: Display.setHeight(6),
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: showButton ? Colors.LIGHT_YELLOW : Colors.DEFAULT_YELLOW2,
                    }}
                    disabled={showButton}
                    onPress={handleUpdateSeller}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >
                        Save changes
                    </Text>
                </TouchableOpacity>

            </View>
        )
    }

    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Separator height={80} />
                {renderContentTop()}
                {renderAddress()}
                {renderButton()}
                <Separator height={27} />
            </ScrollView>
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