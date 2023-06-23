import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Animated, Modal, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Status, Header
} from '../../constants';
import { MaterialCommunityIcons, AntDesign, SimpleLineIcons, Ionicons, Feather } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { scale } from 'react-native-size-matters';
import { firebase } from '../../../config';
import numeral from 'numeral';
import moment from 'moment';

const paypal = require('../../../assets/Icon/paypal.png');
const cod = require('../../../assets/Icon/COD.png');

export default function BuyerOrderDetails({ navigation, route }) {

    const { orderKey } = route.params;
    const [orderData, setOrderData] = useState('');
    const [modalVisible, setModalVisible] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('placeOrders')
            .doc(orderKey)
            .onSnapshot(documentSnapshot => {
                setOrderData(documentSnapshot.data());
                setModalVisible(false);
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);


    // if (loading) {
    //     return (
    //         <View
    //             style={{
    //                 flex: 1,
    //                 backgroundColor: Colors.DEFAULT_WHITE,
    //                 alignItems: "center",
    //                 justifyContent: 'center',
    //             }}
    //         >
    //             {MessageAlert()}
    //         </View>
    //     )
    // };
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

    function renderTop() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                <TouchableOpacity
                    style={{
                        width: '20%',
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left-thin" size={26} />
                </TouchableOpacity>

                <View
                    style={{
                        width: '60%',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2.3),
                        }}
                    >Details</Text>
                </View>

                <View
                    style={{
                        width: '20%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    <TouchableOpacity>
                        <Feather name="filter" size={18} style={{ marginRight: 8 }} />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons name="settings-outline" size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    };
    function renderContent() {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <View
                    style={{

                        flexDirection: 'row',
                        paddingHorizontal: 15,
                        paddingVertical: 15,
                        borderWidth: 0.5,
                        borderColor: Colors.LIGHT_GREY2,
                        borderRadius: 10,
                        marginHorizontal: 10,
                        backgroundColor: Colors.DEFAULT_WHITE,
                    }}
                >
                    {/* IMAGE */}
                    <View>
                        <Image
                            source={{ uri: orderData.imageUrl }}
                            resizeMode='contain'
                            style={{
                                height: 80,
                                width: 80,
                            }}
                        />
                    </View>

                    {/* DETAILS */}
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: 5,
                            marginLeft: 15,
                        }}
                    >
                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                            }}
                        >{orderData.productName}</Text>

                        <Separator height={10} />
                        <Text
                            style={{
                                fontSize: RFPercentage(1.8),
                                fontFamily: 'PoppinsMedium',
                                color: Colors.DARK_SIX,
                            }}
                        > QTY: {orderData.quantity}</Text>

                        <Separator height={10} />
                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                            }}
                        >₱{numeral(orderData.price).format('0,0.00')}</Text>

                    </View>


                </View>

                {/* LINEEEEEEEEEEEEEEEEEEEEEEEE */}
                {/* <View style={{ height: 0.5, backgroundColor: Colors.LIGHT_GREY2, marginHorizontal: 10 }} /> */}

            </View >
        )
    };

    function renderAddress() {
        return (
            <View
                style={{
                    marginHorizontal: 10,
                    borderRadius: 5,
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    marginTop: 10,
                    borderWidth: 0.5,
                    borderColor: Colors.LIGHT_GREY2,
                }}
            >

                <View>
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            paddingVertical: 5,
                        }}
                    >Shipping Address</Text>

                    <View
                        style={{
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <Feather name='map-pin' size={14} />
                            <View
                                style={{
                                    flex: 1,
                                    marginLeft: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(1.9),
                                    }}
                                >{orderData.fullName}</Text>

                                <Separator height={5} />
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsMedium',
                                        fontSize: RFPercentage(1.9),
                                    }}
                                >(+63) {orderData.phoneNumber}</Text>


                                <Separator height={5} />

                                <Text
                                    style={{
                                        fontFamily: 'PoppinsMedium',
                                        fontSize: RFPercentage(1.9),
                                        color: Colors.DARK_SIX,

                                    }}
                                >{orderData.shippingAddress}</Text>


                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    function renderSummary() {
        return (
            <View
                style={{
                    marginHorizontal: 5,
                    borderRadius: 10,
                    marginTop: 10,
                    marginHorizontal: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    borderWidth: 1.5,
                    borderColor: Colors.LIGHT_GREY2,
                    borderStyle: 'dashed',
                }}
            >

                <View>
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >Order summary</Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 10,
                        }}
                    >

                        <View
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            >Quantity:</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    marginTop: 10,
                                }}
                            >Payment Method:</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    marginTop: 10,
                                }}
                            >Order Status: </Text>
                        </View>


                        <View
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(1.9),
                                    textAlign: 'right',
                                }}
                            >{orderData.quantity} Item</Text>

                            <View
                                style={{
                                    marginTop: 10,
                                    flexDirection: "row",
                                    alignItems: 'center',
                                }}
                            >

                                <Image
                                    source={orderData.paymentMethod === "Paypal" ? paypal : cod}
                                    resizeMode='contain'
                                    style={{
                                        width: 20,
                                        height: 20,

                                    }}
                                />
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(1.9),
                                        textAlign: 'right',
                                        marginLeft: 5,
                                    }}
                                >{orderData.paymentMethod}</Text>
                            </View>

                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    textAlign: 'right',
                                    marginTop: 10,
                                    color: Colors.DEFAULT_YELLOW2,
                                }}
                            >{orderData.orderStatus}</Text>
                        </View>


                    </View>

                </View>

                <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY2, marginTop: 20, }} />


                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 5,
                        marginTop: 10,
                    }}
                >

                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: scale(14),
                            }}
                        >Subtotal: </Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: scale(14),
                                marginTop: 10,
                            }}
                        >Delivery Fee: </Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: scale(16),
                                marginTop: 10,
                            }}
                        >Total Fee: </Text>
                    </View>


                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: scale(14),
                                textAlign: 'right',
                            }}
                        >₱ {numeral(orderData.price * orderData.quantity).format('0,0.00')}</Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: scale(14),
                                textAlign: 'right',
                                marginTop: 10,
                            }}
                        >₱ {numeral(orderData.deliveryFee).format('0,0.00')}</Text>

                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: scale(16),
                                textAlign: 'right',
                                marginTop: 10,
                            }}
                        >₱ {numeral(orderData.totalPay).format('0,0.00')}</Text>
                    </View>

                </View>

                {/* NEW END */}

            </View>
        )
    };
    function renderBottom() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: Display.setWidth(100),
                    paddingVertical: 10,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    justifyContent: 'center',
                    // alignItems: 'center',
                }}
            >

                {
                    orderData.orderStatus === 'Completed' ? <View
                        style={{
                            alignSelf: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: Display.setWidth(90),
                                height: Display.setHeight(6),
                                borderWidth: 0.9,
                                borderColor: Colors.LIGHT_GREY2,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}
                            onPress={() => {
                                navigation.navigate('BuyerWriteReview', {
                                    productKey: orderKey,
                                    productUid: orderData.productUid,
                                })
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.DEFAULT_YELLOW2,
                                }}
                            >Write Review</Text>
                        </TouchableOpacity>
                    </View>
                        :
                        <TouchableOpacity
                            style={{
                                width: Display.setWidth(90),
                                height: Display.setHeight(6),
                                borderWidth: 0.9,
                                borderColor: Colors.LIGHT_GREY2,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}
                            onPress={() => {
                                navigation.navigate('BuyerOrderStatus', {
                                    orderKey: orderKey
                                })
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(1.9)
                                }}
                            >Track order</Text>
                        </TouchableOpacity>
                }







            </View>
        )
    };

    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={27} />
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 30,
                }}
                showsVerticalScrollIndicator={false}
            >
                {renderTop()}
                {renderContent()}
                {renderAddress()}
                {renderSummary()}
            </ScrollView>

            {renderBottom()}
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
        // margin: 20,
        // backgroundColor: Colors.DEFAULT_WHITE,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 5,
        width: Display.setWidth(45),
        // height: Display.setHeight(15),
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