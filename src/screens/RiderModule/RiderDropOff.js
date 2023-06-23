import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, FlatList, Modal } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Entypo, Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import * as SMS from 'expo-sms';
import { firebase } from '../../../config';
import numeral from 'numeral';

export default function RiderDropOff({ navigation, route }) {

    const { orderKey } = route.params;
    const [orderData, setOrderData] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(true);
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        async function checkAvailability() {
            const isSmsAvailable = await SMS.isAvailableAsync();
            setIsAvailable(isSmsAvailable);
        }
        checkAvailability();
    }, []);


    // ORDER DATA
    useEffect(() => {
        firebase.firestore()
            .collection('placeOrders')
            .doc(orderKey)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setOrderData(documentSnapshot.data());
                    setLoading(false);
                }
            });
    }, []);


    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: 'center',
                    backgroundColor: Colors.DEFAULT_WHITE,

                }}
            >
                {MessageAlert()}
            </View>
        );
    };

    const sendSms = async () => {
        const { result } = await SMS.sendSMSAsync(
            orderData.phoneNumber,
            `You have order from Davcu Rider is on delivery to you . Please prepare cash amount of ₱${numeral(orderData.totalPay).format('0,0.00')}`
        );
        console.log(result);
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
                                flexDirection: 'row',
                            }}
                        >
                            <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                    marginLeft: 8,
                                }}
                            >Loading...</Text>
                        </View>
                        {/* <Text style={styles.modalText} >Success ! you have added a new shipping address.</Text> */}
                    </View>
                </View>


            </Modal>
        )
    };

    function renderTop() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    marginTop: 10,
                    paddingVertical: 15,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                    }}
                >
                    Buyer Details
                </Text>

                <Separator height={8} />
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(3),
                    }}
                >
                    {orderData.fullName}
                </Text>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        marginTop: 8,
                    }}
                >
                    <Ionicons name='location' size={16} color={Colors.SECONDARY_GREEN} />
                    <Text
                        style={{
                            flex: 1,
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(1.9),
                            // color: Colors.DARK_SIX,
                            marginLeft: 10,
                        }}
                    >{orderData.shippingAddress}</Text>
                </View>

            </View>
        )
    };

    function renderOrder() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    marginTop: 10,
                    paddingVertical: 20,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >

                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                    }}
                >
                    Summary
                </Text>

                <Separator height={15} />

                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <View
                        style={{
                            width: '20%',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                            }}
                        >
                            QTY:
                        </Text>
                        <Text
                            style={{
                                marginTop: 20,
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                            }}
                        >
                            {orderData.quantity}
                        </Text>
                    </View>

                    <View
                        style={{
                            width: '60%',
                            paddingHorizontal: 15,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                            }}
                        >
                            ITEM:
                        </Text>
                        <Text
                            style={{
                                marginTop: 20,
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                            }}
                        >
                            {orderData.productName}
                        </Text>
                    </View>

                    <View
                        style={{
                            width: '20%'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                            }}
                        >
                            PRICE:
                        </Text>
                        <Text
                            style={{
                                marginTop: 20,
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                            }}
                        >
                            ₱ {numeral(orderData.price * orderData.quantity).format('0,0.00')}
                        </Text>
                    </View>
                </View>
            </View>
        )
    };

    function renderPayment() {
        return (
            <View
                style={{
                    paddingHorizontal: 20,
                    marginTop: 10,
                    paddingVertical: 20,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                color: Colors.DARK_SIX,
                            }}
                        >
                            Subtotal:
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                color: Colors.DARK_SIX,
                                marginVertical: 10,
                            }}
                        >
                            Delivery Fee:
                        </Text>

                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                color: Colors.DARK_SIX,
                                marginVertical: 10,
                            }}
                        >
                            Total vat(5%):
                        </Text>


                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2.5),
                            }}
                        >
                            Collect Cash:
                        </Text>
                    </View>


                    <View>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                color: Colors.DARK_SIX,
                                textAlign: 'right'
                            }}
                        >
                            ₱ {numeral(orderData.price * orderData.quantity).format('0,0.00')}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                color: Colors.DARK_SIX,
                                marginVertical: 10,
                                textAlign: 'right'
                            }}
                        >
                            ₱ {numeral(orderData.deliveryFee).format('0,0.00')}

                        </Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                color: Colors.DARK_SIX,
                                marginVertical: 10,
                                textAlign: 'right'
                            }}
                        >
                            ₱ {numeral(orderData.totalVat).format('0,0.00')}

                        </Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2.5),
                                textAlign: 'right'
                            }}
                        >
                            ₱ {numeral(orderData.totalPay).format('0,0.00')}
                        </Text>
                    </View>

                </View>

            </View>
        )
    };

    function renderMessage() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 110,
                    right: 20,
                }}
            >
                <TouchableOpacity
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: Colors.DEFAULT_WHITE,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={sendSms}
                >
                    <MaterialCommunityIcons name="message-reply-text-outline" size={25} color={Colors.SECONDARY_GREEN} />
                </TouchableOpacity>

            </View>
        )
    }

    function renderButton() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 50,
                    alignSelf: 'center',

                }}
            >
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: Display.setWidth(86),
                        height: Display.setHeight(6.2),
                        backgroundColor: Colors.SECONDARY_GREEN,
                        borderRadius: 4,
                    }}
                    onPress={() => navigation.navigate('RiderConfirmDrop', {
                        orderKey: orderKey,
                        buyerId: orderData.buyerId,
                    })}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2.2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Drop-off</Text>
                </TouchableOpacity>

            </View>
        )
    }

    return (
        <View style={styles.container} >
            <Status />
            <Header title={'Drop-off'} />
            {renderTop()}
            {renderOrder()}
            {renderPayment()}
            {renderMessage()}
            {renderButton()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: Display.setWidth(50),
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
    modalText: {
        marginTop: 9,
        marginBottom: 10,
        color: Colors.DEFAULT_WHITE,
        textAlign: 'center',
        fontFamily: 'PoppinsSemiBold',
        fontSize: RFPercentage(2.4),
        paddingHorizontal: 30,
    },
})