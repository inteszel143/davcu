import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, FlatList, Modal } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Entypo, Ionicons } from 'react-native-vector-icons';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import { firebase } from '../../../config';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

const store = require('../../../assets/images/location-pin.png');
const rider = require('../../../assets/images/placeholder1.png');


export default function RiderToVendor({ navigation, route }) {
    const mapRef = useRef(null);
    const { orderKey, sellerId } = route.params;
    const [orderData, setOrderData] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(true);

    //LOCATION
    const [storeLocation, setStoreLocation] = useState(null);
    const [riderLocation, setRiderLocation] = useState(null);

    //LINKING
    const [storeLat, setStoreLat] = useState(null);
    const [storeLong, setStoreLong] = useState(null);

    const [riderLat, setRiderLat] = useState(null);
    const [riderLong, setRiderLong] = useState(null);

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
                    setStoreLat(documentSnapshot.data().Latitude);
                    setStoreLong(documentSnapshot.data().Longitude);
                    setLoading(false);

                }
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
        if (riderLocation && storeLocation && mapRef.current) {
            const coordinates = [riderLocation, storeLocation];
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [riderLocation, storeLocation, mapRef]);


    const customMapStyle = [
        {
            featureType: 'poi.business',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
    ];
    const destinationLatitude = storeLat;
    const destinationLongitude = storeLong;
    const userLatitude = riderLat;
    const userLongitude = riderLong;

    const handleOpenMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLatitude},${destinationLongitude}&origin=${userLatitude},${userLongitude}`;

        Linking.openURL(url);
    };


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
                    Vendor Details
                </Text>

                <Separator height={8} />
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(3),
                    }}
                >
                    {orderData.storeName}
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
                    >{orderData.shopLocation}</Text>
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
                    {storeLocation &&
                        <Marker coordinate={storeLocation} >
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
                    onPress={() => navigation.navigate('RiderPickupOrder', {
                        orderKey: orderKey,
                    })}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2.2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Arrived at the vendor</Text>
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
            <Header title={'Go to vendor'} />
            {renderTop()}
            {renderMaps()}
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