import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../constants';

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { scale } from 'react-native-size-matters';
import { firebase } from '../../../config';
import numeral from 'numeral';
const { width } = Dimensions.get('screen');
const success = require('../../../assets/images/Biking.jpg');


export default function DeliverySuccess({ navigation, route }) {

    const { orderKey, buyerId } = route.params;
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState('');
    const riderID = firebase.auth().currentUser.uid;
    const [modalVisible, setModalVisible] = useState(false);
    const [expoToken, setExpoToken] = useState(null);

    useEffect(() => {
        let isMounted = true;
        firebase.firestore()
            .collection('placeOrders')
            .doc(orderKey)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setData(documentSnapshot.data());
                    setLoading(false);
                }
            });
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        firebase.firestore()
            .collection('users')
            .doc(buyerId)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setExpoToken(documentSnapshot.data().expoPushToken);
                }
            });
    }, [])


    async function sendPushNotification() {
        const message = {
            to: expoToken,
            sound: 'default',
            title: 'Davcu App',
            body: 'Your order successfully delivered!, Thank you for your order!',
            data: { data: 'goes here' },
        };
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        const data = await response.json();
        // console.log(data);
    }


    const updateStatus = (key) => {
        setModalVisible(true);

        firebase.firestore()
            .collection('buyerNotif')
            .add({
                ProductName: data.productName,
                token: expoToken,
                deliveryDate: timestamp,
                orderKey: orderKey,
                buyerId: data.buyerId,
                riderId: riderID,

            })
            .then(() => {
                firebase.firestore()
                    .collection('placeOrders')
                    .doc(key)
                    .update({
                        orderStatus: 'Completed',
                        deliveryDate: timestamp,
                        riderID: riderID,
                    }).then(() => {
                        firebase.firestore()
                            .collection('riderNotif')
                            .doc(orderKey)
                            .update({
                                delivered: 'Yes',
                            })
                            .then(() => {
                                sendPushNotification();
                                setModalVisible(false);
                                navigation.replace('RiderMainScreen');
                            });
                    })
            });

    }

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",

                }}
            >
                <ActivityIndicator size="large" color={Colors.SECONDARY_GREEN} />
            </View>
        );
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


    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={30} />
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                <Image
                    source={success}
                    resizeMode='contain'
                    style={{
                        width: Display.setWidth(65),
                        height: Display.setHeight(34),
                    }}
                />



            </View>

            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 40,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2.7),
                        textAlign: 'center',
                    }}
                > " Congratulations "</Text>

                <Text
                    style={{
                        fontFamily: 'PoppinsMedium',
                        fontSize: RFPercentage(2.2),
                        textAlign: 'center',
                        color: Colors.DARK_SIX
                    }}
                >Customer order's has been successfully delivered!</Text>
            </View>
            <Separator height={20} />
            <View
                style={{
                    marginTop: Display.setHeight(3),
                    paddingHorizontal: 20,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: Colors.LIGHT_GREY2,
                    paddingVertical: 15,
                    marginHorizontal: 10,
                    borderRadius: 2,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: "center",
                    }}
                >
                    <Image
                        source={{ uri: data.imageUrl }}
                        resizeMode='contain'
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 5,
                        }}
                    />


                    <View
                        style={{
                            marginLeft: 10,
                            flex: 1,
                            paddingHorizontal: 10,
                        }}
                    >
                        <Text
                            numberOfLines={3}
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                            }}
                        >{data.productName.toUpperCase()}</Text>

                        <Separator height={10} />
                        {/* PRICE AND QUNATITY */}

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            >₱{numeral(data.price).format('0,0.00')}</Text>

                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(2),
                                }}
                            >Qty : {data.quantity}</Text>

                        </View>


                    </View>

                </View>


                <View style={{ height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.INACTIVE_GREY, marginVertical: 20, }} />

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View>
                        {/* <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                // color: Colors.DARK_SEVEN,
                            }}
                        >Subtotal</Text>
                        <Separator height={15} /> */}
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2.3),

                            }}
                        >Total: </Text>
                    </View>


                    <View>
                        {/* <Text
                            style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: scale(16),
                                // color: Colors.DARK_SEVEN,
                                textAlign: 'right',
                            }}
                        >₱ {numeral(data.price * data.quantity).format('0,0.00')}</Text>
                        <Separator height={15} /> */}
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2.3),
                                textAlign: 'right',
                            }}
                        >₱ {numeral(data.totalPay).format('0,0.00')}</Text>
                    </View>

                </View>

            </View>



            <View
                style={{
                    position: 'absolute',
                    bottom: Display.setHeight(10),
                    alignSelf: 'center',
                }}
            >

                <TouchableOpacity
                    style={{
                        width: Display.setWidth(86),
                        height: Display.setHeight(6.2),
                        backgroundColor: '#01B075',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                    }}
                    onPress={() => {
                        updateStatus(orderKey);
                    }}

                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: scale(15),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Go back Dashboard</Text>
                </TouchableOpacity>

            </View>

            {/* {bottomButton()} */}
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
})