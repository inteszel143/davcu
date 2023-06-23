import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Colors,
    Display,
    Separator, Status, Header
} from '../../constants';
import { MaterialCommunityIcons, Fontisto, Ionicons, Feather } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';
import numeral from 'numeral';
import moment from 'moment';
import Checkbox from 'expo-checkbox';

export default function SellerArrangeShipment({ navigation, route }) {

    const { orderKey, earn } = route.params;
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const sellerId = firebase.auth().currentUser.uid;
    const [isChecked, setChecked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // DATA
    const [storeLocation, setStoreLocation] = useState('');

    // ONE TIME READ
    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('sellers')
            .doc(sellerId)
            .onSnapshot(documentSnapshot => {
                setStoreLocation(documentSnapshot.data().storeLocation);
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);


    const updateStatus = async () => {
        try {
            await firebase.firestore()
                .collection('placeOrders')
                .doc(orderKey)
                .update({
                    orderStatus: 'To Ship',
                    toShipDate: timestamp,
                    shopLocation: storeLocation,
                }).then(() => {
                    setModalVisible(true);
                    firebase.firestore()
                        .collection('riderNotif')
                        .doc(orderKey)
                        .set({
                            earn: earn,
                            toShipDate: timestamp,
                            sellerId: sellerId,
                            delivered: 'No',
                        }).then(() => {
                            console.log('User added!');
                        });

                })
        } catch (error) {
            console.log(error);
        }
    };


    function renderButton() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 100,
                    width: '100%',
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: isChecked === false ? Colors.LIGHT_YELLOW : Colors.DEFAULT_YELLOW2,
                        width: Display.setWidth(88),
                        height: Display.setHeight(6.2),
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                    }}
                    disabled={isChecked === false ? true : false}
                    onPress={updateStatus}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2.1),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Confirm</Text>
                </TouchableOpacity>

            </View>
        )
    };


    function renderProvider() {
        return (
            <View
                style={{
                    marginTop: 15,
                    paddingHorizontal: 10,
                }}
            >


                <View
                    style={{
                        paddingHorizontal: 10,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            color: Colors.DARK_SIX,
                        }}
                    >Collection Method </Text>

                    <Separator height={15} />

                    <View
                        style={{
                            width: Display.setWidth(70),
                            paddingVertical: 17,
                            borderWidth: 0.5,
                            borderColor: Colors.DEFAULT_YELLOW2,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            >Pick-up</Text>
                            <Fontisto name='radio-btn-active' size={16} color={Colors.DEFAULT_YELLOW2} />
                        </View>

                        <Text
                            style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: RFPercentage(1.8),
                                marginTop: 10,
                                paddingHorizontal: 5,
                                color: Colors.DARK_SIX,
                            }}
                        >
                            Schedule pick-up at your shop {'\n'} location
                        </Text>

                    </View>
                </View>

            </View>
        )
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
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Feather name="check-circle" size={25} color={'#00FF00'} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                    marginTop: 3,
                                }}
                            >
                                Success !
                            </Text>

                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.DEFAULT_WHITE,
                                }}
                            >
                                Ready to pick-up orders
                            </Text>
                        </View>
                        <Separator height={12} />
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                navigation.goBack();
                            }}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 5,
                                borderWidth: 0.5,
                                borderColor: Colors.LIGHT_GREY,
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "PoppinsMedium",
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.LIGHT_GREY,
                                }}
                            >Close</Text>
                        </TouchableOpacity>


                    </View>
                </View>


            </Modal>
        )
    };

    return (
        <View style={styles.container} >
            <Status />
            <Header title={'Arrange Shipment'} />
            {MessageAlert()}

            {/* CONDITION */}
            <Separator height={30} />
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 30,
                    borderWidth: 0.5,
                    marginHorizontal: 20,
                    borderColor: Colors.DEFAULT_YELLOW2,
                    borderRadius: 5,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Ionicons name='alert-circle' size={18} color={Colors.DEFAULT_YELLOW2} />
                    <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(1.9),
                            marginLeft: 8,

                            color: Colors.DARK_THREE,
                        }}
                    >
                        Unable to request a particular pick-up time. Your pick-up request will be sent to all riders. By clicking "Confirm" below.
                    </Text>
                </View>

            </View>

            <Separator height={25} />
            {renderProvider()}

            <Separator height={15} />
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 12,
                }}
                onPress={() => setChecked(!isChecked)}
            >
                <Checkbox
                    style={{
                        width: 15,
                        height: 15,
                        margin: 8,
                    }}
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? Colors.DEFAULT_YELLOW2 : Colors.INACTIVE_GREY}
                />
                <Text
                    style={{
                        fontFamily: 'PoppinsRegular',
                        fontSize: RFPercentage(1.9),
                    }}
                >I accept the condition above</Text>
            </TouchableOpacity>

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
        // backgroundColor: Colors.DEFAULT_WHITE,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 5,
        // width: Display.setWidth(60),
        // height: Display.setHeight(14),
        paddingHorizontal: 70,
        paddingVertical: 20,
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