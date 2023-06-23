import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, FlatList, Modal } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../constants';
import { MaterialCommunityIcons, SimpleLineIcons, Ionicons } from 'react-native-vector-icons';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { scale } from 'react-native-size-matters';
import { firebase } from '../../../config';
import numeral from 'numeral';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

const store = require('../../../assets/images/placeholder.png');
const rider = require('../../../assets/images/placeholder1.png');

const { width } = Dimensions.get('screen');


export default function DeliveryClaimSuccess({ navigation, route }) {
    const mapRef = useRef(null);
    const { orderKey, buyerID } = route.params;
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const [orderData, setOrderData] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(true);

    const [data, setData] = useState('');
    const riderID = firebase.auth().currentUser.uid;


    //LOCATION
    const [buyerLocation, setBuyerLocation] = useState(null);
    const [riderLocation, setRiderLocation] = useState(null);

    //LINKING
    const [buyerLat, setBuyerLat] = useState(null);
    const [buyerLong, setBuyerLong] = useState(null);

    const [riderLat, setRiderLat] = useState(null);
    const [riderLong, setRiderLong] = useState(null);


    // DEEP LINKING
    const destinationLatitude = buyerLat;
    const destinationLongitude = buyerLong;
    const userLatitude = riderLat;
    const userLongitude = riderLong;



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


    // BUYER LOCATION
    useEffect(() => {
        firebase.firestore()
            .collection('buyerAddress')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().buyerId === buyerID && documentSnapshot.data().default === true) {
                        setBuyerLocation({
                            latitude: documentSnapshot.data().latitude,
                            longitude: documentSnapshot.data().longitude,
                        });
                        setBuyerLat(documentSnapshot.data().latitude);
                        setBuyerLong(documentSnapshot.data().longitude);

                    }
                    setLoading(false);

                });
            });
    }, []);

    useEffect(() => {
        (async () => {
            // Request permission to access the user's location
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            // Get the user's current location
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setRiderLocation({ latitude, longitude });
            setRiderLat(latitude);
            setRiderLong(longitude);

        })();
    }, []);


    useEffect(() => {
        // Center the map between the user's location and the destination location
        if (riderLocation && buyerLocation && mapRef.current) {
            const coordinates = [riderLocation, buyerLocation];
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [riderLocation, buyerLocation, mapRef]);


    const handleOpenMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLatitude},${destinationLongitude}&origin=${userLatitude},${userLongitude}`;

        Linking.openURL(url);
    };


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


    // const updateStatus = (key) => {
    //     firebase.firestore()
    //         .collection('placeOrders')
    //         .doc(key)
    //         .update({
    //             orderStatus: 'On the way',
    //             riderID: riderID,
    //             onTheWayDate: timestamp,
    //             Latitude: Latitude,
    //             Longitude: Longitude,
    //         })
    // };

    const customMapStyle = [
        {
            featureType: 'poi.business',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
    ];



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


    function renderMaps() {
        return (
            <View
                style={{
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    width: Display.setWidth(92),
                    height: Display.setHeight(50),
                    alignSelf: 'center',
                    marginTop: 15,
                }}
            >
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    customMapStyle={customMapStyle}
                >
                    {buyerLocation &&
                        <Marker coordinate={buyerLocation} >
                            <Image source={store} style={{ height: 35, width: 35 }} />
                        </Marker>
                    }
                    {riderLocation &&
                        <Marker coordinate={riderLocation} >
                            <Image source={rider} style={{ height: 35, width: 35 }} />
                        </Marker>
                    }

                </MapView>

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 15,
                        right: 15,
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.SECONDARY_GREEN,
                    }}
                    onPress={handleOpenMaps}
                >
                    <Ionicons name="navigate" size={24} color={Colors.DEFAULT_WHITE} />
                </TouchableOpacity>

            </View>
        )
    };

    return (
        <View style={styles.container} >
            <Status />
            <Header title={'Track Buyer'} />
            {renderTop()}
            {/* <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                <Image
                    source={require('../../assets/images/delivery.jpg')}
                    resizeMode='contain'
                    style={{
                        width: Display.setWidth(60),
                        height: Display.setHeight(38),
                    }}
                />



            </View>

            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 25,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: scale(20),
                        textAlign: 'center',
                    }}
                > Great job! You have claimed the order successfully.</Text>
            </View> */}
            {renderMaps()}


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
                    onPress={() => navigation.navigate('RiderDropOff', {
                        orderKey: orderKey,
                    })}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2.2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Arrived at the buyer</Text>
                </TouchableOpacity>

            </View>

            {/* {bottomButton()} */}
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