import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, FlatList, Modal } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Entypo, Ionicons } from 'react-native-vector-icons';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import { firebase } from '../../../config';
import numeral from 'numeral';

const store = require('../../../assets/images/location-pin.png');
const buyer = require('../../../assets/images/placeholder.png');

export default function RiderPickOrder({ navigation, route }) {
    const mapRef = useRef(null);

    const { orderKey, sellerId, buyerId } = route.params;
    const [orderData, setOrderData] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(true);


    //LOCATION
    const [storeLocation, setStoreLocation] = useState(null);
    const [buyerLocation, setBuyerLocation] = useState(null);


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

    // SELLER LOCATION
    useEffect(() => {
        firebase.firestore()
            .collection('sellers')
            .doc(sellerId)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setStoreLocation({
                        latitude: documentSnapshot.data().Latitude,
                        longitude: documentSnapshot.data().Longitude,
                    });
                    setLoading(false);

                }
            });
    }, []);



    // BUYER LOCATION
    useEffect(() => {
        firebase.firestore()
            .collection('buyerAddress')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().buyerId === buyerId && documentSnapshot.data().default === true) {
                        setBuyerLocation({
                            latitude: documentSnapshot.data().latitude,
                            longitude: documentSnapshot.data().longitude,
                        });
                    }
                    setLoading(false);

                });
            });
    }, []);


    useEffect(() => {
        // Center the map between the user's location and the destination location
        if (buyerLocation && storeLocation && mapRef.current) {
            const coordinates = [buyerLocation, storeLocation];
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [buyerLocation, storeLocation, mapRef]);



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



    function renderMaps() {
        return (
            <View
                style={{
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    width: Display.setWidth(92),
                    height: Display.setHeight(32),
                    alignSelf: 'center',
                    marginTop: 10,
                }}
            >
                <MapView
                    ref={mapRef}
                    style={styles.map}
                >
                    {storeLocation &&
                        <Marker coordinate={storeLocation} >
                            <Image source={store} style={{ height: 35, width: 35 }} />
                        </Marker>
                    }

                    {buyerLocation &&
                        <Marker coordinate={buyerLocation} >
                            <Image source={buyer} style={{ height: 35, width: 35 }} />
                        </Marker>
                    }
                </MapView>

            </View >
        )
    }

    function renderDetails() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    marginTop: 8,
                    paddingVertical: 12,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2),
                    }}
                >
                    Delivery Details
                </Text>

                <Separator height={15} />

                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                    }}
                >
                    <Entypo name='shop' size={15} />
                    <View
                        style={{
                            marginLeft: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                            }}
                        >Pick-up</Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                        >{orderData.storeName}</Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: RFPercentage(1.8),
                            }}
                        >{orderData.shopLocation}</Text>
                    </View>
                </View>

                <View style={{ width: '100%', height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 14, }} />
                {/* <Separator height={20} /> */}
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                    }}
                >
                    <Ionicons name='person-circle-outline' size={15} />
                    <View
                        style={{
                            marginLeft: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                            }}
                        >Drop-off</Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                        >{orderData.fullName}</Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: RFPercentage(1.8),
                            }}
                        >{orderData.shippingAddress}</Text>
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
                    marginTop: 5,
                    paddingTop: 10,
                    paddingVertical: 5,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                    }}
                >Total Item</Text>
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2.5),
                    }}
                >₱ {numeral(orderData.price * orderData.quantity).format('0,0.00')}</Text>
                <View style={{ width: Display.setWidth(50), height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 5, }} />
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
                        fontSize: RFPercentage(3),
                        color: Colors.SECONDARY_GREEN,
                    }}
                >₱ {numeral(orderData.deliveryFee).format('0,0.00')}</Text>

            </View>
        )
    }

    function renderButton() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 20,
                    alignSelf: 'center',

                }}
            >
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: Display.setWidth(86),
                        height: Display.setHeight(6),
                        backgroundColor: Colors.SECONDARY_GREEN,
                        borderRadius: 4,
                    }}
                    onPress={() => navigation.navigate('RiderToVendor', {
                        orderKey: orderKey,
                        sellerId: sellerId,
                    })}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Accept Order</Text>
                </TouchableOpacity>

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
            <Header title={'Pick-up order'} />
            {renderMaps()}
            {renderDetails()}
            {renderEarn()}
            {renderButton()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    map: {
        width: '100%', height: '100%',

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