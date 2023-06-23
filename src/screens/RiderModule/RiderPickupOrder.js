import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, FlatList, Modal } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Entypo, Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import { firebase } from '../../../config';
import numeral from 'numeral';

import RBSheet from "react-native-raw-bottom-sheet";

const store = require('../../../assets/images/location-pin.png');
const rider = require('../../../assets/images/placeholder1.png');
export default function RiderPickupOrder({ navigation, route }) {
    const refRBSheet = useRef();
    const { orderKey } = route.params;
    const [orderData, setOrderData] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(true);

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
                    Order Details
                </Text>

                <Separator height={8} />
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(3),
                    }}
                >
                    Order # : {orderData.orderID}
                </Text>

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
                                fontSize: RFPercentage(1.9),
                                color: Colors.DARK_SIX,
                            }}
                        >
                            Subtotal:
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                color: Colors.DARK_SIX,
                                marginVertical: 10,
                            }}
                        >
                            Delivery Fee:
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                color: Colors.DARK_SIX,
                                marginVertical: 10,
                            }}
                        >
                            Total vat(5%):
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                            }}
                        >
                            Total:
                        </Text>
                    </View>


                    <View>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                color: Colors.DARK_SIX,
                                textAlign: 'right'
                            }}
                        >
                            ₱ {numeral(orderData.price * orderData.quantity).format('0,0.00')}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
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
                                fontSize: RFPercentage(1.9),
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
                                fontSize: RFPercentage(2),
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


    function renderEarn() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    marginTop: 10,
                    paddingVertical: 10,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                <Text
                    style={{
                        fontFamily: 'PoppinsMedium',
                        fontSize: RFPercentage(1.9),
                        marginTop: 5,
                    }}
                >You will earn</Text>
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(3.2),
                        color: Colors.SECONDARY_GREEN,
                    }}
                >₱ {numeral(orderData.deliveryFee).format('0,0.00')}</Text>

            </View>
        )
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


    function renderComponent() {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={Colors.DARK_ONE}
                    translucent
                />

                <View
                    style={{
                        paddingHorizontal: 30,
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2.6),
                        }}
                    >You have reached the shop.</Text>
                    <Separator height={5} />
                    <Text
                        style={{
                            textAlign: 'center',
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2),
                            color: Colors.DARK_SIX,
                        }}
                    >Please scan the item's QR code to verify that you have received it.</Text>
                </View>


                <Separator height={20} />
                {/* Button */}
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: Display.setWidth(75),
                            height: Display.setHeight(5.5),
                            backgroundColor: '#01B075',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                        }}
                        onPress={() => {
                            navigation.navigate('DeliveryScan', {
                                productID: orderData.productUid,
                                orderKey: orderKey,
                                buyerID: orderData.buyerId,
                            });
                            refRBSheet.current.close();

                        }}

                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <MaterialCommunityIcons name='line-scan' size={15} color={Colors.DEFAULT_WHITE} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                    marginLeft: 8,
                                }}
                            >Scan & Accept</Text>
                        </View>

                    </TouchableOpacity>
                </View>


                {/* <View style={{ width: Display.setWidth(100), height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 15, }} /> */}

                {/* <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current.close();
                        pickImage();
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >Upload</Text>
                </TouchableOpacity> */}

            </View>
        )
    };


    function renderBottomSheet() {
        return (
            <View>
                <RBSheet
                    ref={refRBSheet}
                    height={210}
                    openDuration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center",
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                        }
                    }}
                >
                    {renderComponent()}
                </RBSheet>
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
                    onPress={() => refRBSheet.current.open()}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2.2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Pick-up</Text>
                </TouchableOpacity>

            </View>
        )
    }

    return (
        <View style={styles.container} >
            <Status />
            <Header title={'Order Details'} />
            {renderBottomSheet()}
            {renderTop()}
            {renderOrder()}
            {renderPayment()}
            {renderEarn()}
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