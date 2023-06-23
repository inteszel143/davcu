import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Animated, TextInput, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Status, Header
} from '../../constants';

import { MaterialCommunityIcons, AntDesign, Octicons, Ionicons, Feather } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';
import numeral from 'numeral';
import moment from 'moment';

export default function BuyerOrderStatus({ navigation, route }) {

    const [modalVisible, setModalVisible] = useState(true);
    const { orderKey } = route.params;
    const [orderDetails, setOrderDetails] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('placeOrders')
            .doc(orderKey)
            .onSnapshot(documentSnapshot => {
                setOrderDetails(documentSnapshot.data());
                setModalVisible(false);
            });

        return () => { isMounted = false; subscriber() };
    }, []);





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
                    >Track Order</Text>
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



    function renderProduct() {
        return (
            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                    borderWidth: 0.5,
                    borderRadius: 10,
                    borderColor: Colors.LIGHT_GREY2,
                    marginHorizontal: 15,
                    paddingHorizontal: 15,
                    paddingVertical: 20,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 10,
                    }}
                >
                    <View>
                        <Image
                            source={{ uri: orderDetails.imageUrl }}
                            resizeMode='contain'
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 5,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            marginLeft: 10,
                            paddingHorizontal: 10,
                            flex: 1,
                        }}
                    >
                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                            }}
                        >{orderDetails.productName}</Text>

                        <Separator height={10} />

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginRight: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            >₱{numeral(orderDetails.price).format('0,0.00')}</Text>

                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(1.8),
                                }}
                            >Qty : <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(1.8),
                                }}
                            >{orderDetails.quantity} item </Text></Text>

                        </View>


                    </View>

                </View>

            </View>
        )
    };


    function renderStatus() {
        return (
            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                    borderColor: Colors.LIGHT_GREY2,
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                    marginHorizontal: 10,
                }}
            >
                {/* ORDER ID */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                                marginRight: 5,
                            }}
                        >
                            {orderDetails.orderID}
                        </Text>
                        <MaterialCommunityIcons name='content-copy' size={15} />
                    </View>
                    {
                        orderDetails.orderStatus == 'Completed' && <TouchableOpacity
                            onPress={() => navigation.navigate('BuyerWriteReview', {
                                productKey: orderKey,
                                productUid: orderDetails.productUid,
                            })}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <MaterialCommunityIcons name='pencil-box-outline' size={18} color={Colors.DEFAULT_YELLOW2} />
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(2),
                                        color: Colors.DEFAULT_YELLOW2,
                                        marginLeft: 5,
                                    }}
                                >Write review</Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>

                <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY2, marginTop: 15, }} />


                {/* DELIVERY STATUS */}
                <Separator height={20} />

                {
                    orderDetails.orderStatus == 'Completed' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.DEFAULT_GREEN} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            >Delivered</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                }}
                            >{moment(orderDetails.deliveryDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }


                {
                    orderDetails.orderStatus == 'On the way' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.DEFAULT_GREEN} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >On the way to your Location</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.pickupDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }



                {
                    orderDetails.orderStatus == 'Completed' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >On the way to your Location</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.pickupDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }


                {
                    orderDetails.orderStatus == 'Pickup' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.DEFAULT_GREEN} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >Pick up Completed</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.pickupDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }

                {
                    orderDetails.orderStatus == 'On the way' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Pick up Completed</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.pickupDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }


                {
                    orderDetails.orderStatus == 'Completed' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Pick up Completed</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.pickupDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }



                {
                    orderDetails.orderStatus == 'Waiting' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.DEFAULT_GREEN} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >Waiting to pick up by rider</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }

                {
                    orderDetails.orderStatus == 'Pickup' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Waiting to pick up by rider</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }


                {
                    orderDetails.orderStatus == 'On the way' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Waiting to pick up by rider</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }


                {
                    orderDetails.orderStatus == 'Completed' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Waiting to pick up by rider</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }



                {
                    orderDetails.orderStatus == 'To Ship' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.DEFAULT_GREEN} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >Ready to ship order</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }


                {
                    orderDetails.orderStatus == 'Waiting' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Ready to ship order</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }

                {
                    orderDetails.orderStatus == 'Pickup' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Ready to ship order</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }


                {
                    orderDetails.orderStatus == 'On the way' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Ready to ship order</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }


                {
                    orderDetails.orderStatus == 'Completed' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Ready to ship order</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }




                {
                    orderDetails.orderStatus == 'Process' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.DEFAULT_GREEN} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >Processing Orders</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    // color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }



                {
                    orderDetails.orderStatus == 'To Ship' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Processing Orders</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }

                {
                    orderDetails.orderStatus == 'Waiting' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Processing Orders</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }


                {
                    orderDetails.orderStatus == 'Pickup' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Processing Orders</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }

                {
                    orderDetails.orderStatus == 'On the way' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Processing Orders</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }


                {
                    orderDetails.orderStatus == 'Completed' && <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 30,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                            <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.LIGHT_GREY2 }} />
                        </View>

                        <View
                            style={{
                                marginLeft: 45,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Processing Orders</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Recipient: Edzel Intes Paras</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{moment(orderDetails.toShipDate.toDate()).format('LLL')}</Text>
                        </View>

                    </View>
                }




                {
                    orderDetails.orderStatus == 'Pending' ?
                        <View
                            style={{
                                flexDirection: 'row',
                                marginLeft: 30,
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Octicons name='check-circle-fill' size={15} color={Colors.DEFAULT_GREEN} />
                                <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.DEFAULT_WHITE }} />
                            </View>

                            <View
                                style={{
                                    marginLeft: 45,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(2),
                                    }}
                                >Pending Order</Text>
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsRegular',
                                        fontSize: RFPercentage(1.9),
                                    }}
                                >Recipient: Edzel Intes Paras</Text>
                                {
                                    orderDetails.orderedDate && <Text
                                        style={{
                                            fontFamily: 'PoppinsMedium',
                                            fontSize: RFPercentage(1.9),
                                        }}
                                    >{moment(orderDetails.orderedDate.toDate()).format('LLL')}</Text>
                                }

                            </View>

                        </View>
                        :
                        <View
                            style={{
                                flexDirection: 'row',
                                marginLeft: 30,
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Octicons name='check-circle-fill' size={15} color={Colors.LIGHT_GREY2} />
                                <View style={{ width: 1.5, height: Display.setHeight(10), backgroundColor: Colors.DEFAULT_WHITE }} />
                            </View>

                            <View
                                style={{
                                    marginLeft: 45,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(2),
                                        color: Colors.INACTIVE_GREY,
                                    }}
                                >Pending Order</Text>
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsRegular',
                                        fontSize: RFPercentage(1.9),
                                        color: Colors.INACTIVE_GREY,
                                    }}
                                >Recipient: Edzel Intes Paras</Text>
                                {
                                    orderDetails.orderedDate && <Text
                                        style={{
                                            fontFamily: 'PoppinsMedium',
                                            fontSize: RFPercentage(1.9),
                                            color: Colors.INACTIVE_GREY,
                                        }}
                                    >{moment(orderDetails.orderedDate.toDate()).format('LLL')}</Text>
                                }

                            </View>

                        </View>
                }
            </View>
        )
    };


    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={27} />

            {renderTop()}
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {renderProduct()}
                {renderStatus()}
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