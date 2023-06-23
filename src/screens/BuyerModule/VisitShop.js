import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Modal, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Separator, Display, Status, } from '../../constants';
import { MaterialCommunityIcons, Feather, Fontisto, Ionicons } from 'react-native-vector-icons';
import { firebase } from '../../../config';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as Linking from 'expo-linking';
const { width } = Dimensions.get('screen');
const cardWidth = width / 2.2;
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import ShopRecommend from './BuyerConstant/ShopRecommend';
import ShoTopProduct from './BuyerConstant/ShoTopProduct';
import ShopArrival from './BuyerConstant/ShopArrival';

const storeLogo = require('../../../assets/images/selling.png');
const marker = require('../../../assets/images/marker3.png');

export default function VisitShop({ navigation, route }) {


    const { sellerId, productKey } = route.params;
    const [allData, setData] = useState('')
    const [shopData, setShopData] = useState('')
    const [totalProducts, setTotalProducts] = useState('')


    const [topSelect, setTopSelect] = useState(false)
    const [recommendSelect, setRecommendSelect] = useState(true)
    const [newArrival, setNewArrival] = useState(false)

    const [loading, setLoading] = useState(true)
    const [sellerLatitude, setSellerLatitude] = useState(null);
    const [sellerLongitude, setSellerLongitude] = useState(null);
    const [userLocation, setUserLocation] = useState(null);


    //LINKING
    const [storeLat, setStoreLat] = useState(null);
    const [storeLong, setStoreLong] = useState(null);

    const [riderLat, setRiderLat] = useState(null);
    const [riderLong, setRiderLong] = useState(null);

    // ALL DATA
    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('allProducts')
            .where("sellerUid", "==", sellerId)
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    data.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });

                });
                setData(data);
                setLoading(false);

            });
        return () => { isMounted = false; subscriber() };
    }, []);

    // BUYER
    useEffect(() => {
        let isMounted = true;
        firebase.firestore()
            .collection('allProducts')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.id === productKey) {
                        setShopData(documentSnapshot.data());
                    }
                });
            });
        return () => { isMounted = false; };
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
            setRiderLat(latitude);
            setRiderLong(longitude);

        })();
    }, []);

    // SELLERS
    useEffect(() => {
        let isMounted = true;
        firebase.firestore()
            .collection('sellers')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.id === sellerId) {
                        setSellerLatitude(documentSnapshot.data().Latitude);
                        setSellerLongitude(documentSnapshot.data().Longitude);
                        setStoreLat(documentSnapshot.data().Latitude);
                        setStoreLong(documentSnapshot.data().Longitude);

                        setUserLocation({
                            latitude: documentSnapshot.data().Latitude,
                            longitude: documentSnapshot.data().Longitude,
                            latitudeDelta: 0.0012,
                            longitudeDelta: 0.0012,
                        });

                    }
                });
            });
        return () => { isMounted = false; };
    }, []);

    // TOTAL PRODUCT
    useEffect(() => {
        let isMounted = true;
        firebase.firestore()
            .collection('allProducts')
            .where('sellerUid', '==', sellerId)
            .get()
            .then(querySnapshot => {
                setTotalProducts(querySnapshot.size);
            });

        return () => { isMounted = false; };
    }, []);




    const totalSold = (allData) => {
        let total = 0;

        for (let i = 0; i < allData.length; i++) {
            total += allData[i].totalSold;
        }
        return total;
    };


    const destinationLatitude = storeLat;
    const destinationLongitude = storeLong;
    const userLatitude = riderLat;
    const userLongitude = riderLong;

    const handleOpenMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLatitude},${destinationLongitude}&origin=${userLatitude},${userLongitude}`;
        Linking.openURL(url); fetchBundle
    }



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
                    >Shop</Text>
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

    function renderStoreName() {
        return (
            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                    paddingHorizontal: 12,
                    paddingVertical: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 60,
                            width: 65,
                            borderRadius: 40,
                            backgroundColor: Colors.LIGHT_GREY,
                        }}
                    >
                        <Image
                            source={storeLogo}
                            resizeMode='contain'
                            style={{
                                width: 30,
                                height: 30,
                                tintColor: Colors.INACTIVE_GREY,
                            }}
                        />
                    </View>

                    {/* STORE NAME */}
                    <View
                        style={{
                            paddingHorizontal: 10,
                            marginTop: 8,
                            flex: 1,
                        }}
                    >
                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2.2),
                            }}
                        >{shopData.storeName}</Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.6),
                                    color: Colors.DARK_SIX,
                                }}
                            ><Text style={{ color: Colors.DEFAULT_BLACK }} >{totalProducts}</Text> products</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.6),
                                    color: Colors.DARK_SIX,
                                }}
                            > | <Text style={{ color: Colors.DEFAULT_BLACK }} >{totalSold(allData)}</Text> sold</Text>
                        </View>


                    </View>
                </View>

                {/* BUTTONS */}
                <View>
                    <TouchableOpacity
                        style={{
                            borderWidth: 0.5,
                            borderColor: Colors.INACTIVE_GREY,
                            width: Display.setWidth(20),
                            height: Display.setHeight(3),
                            borderRadius: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            // marginBottom: 7,

                        }}
                        onPress={() => navigation.navigate('BuyerChat', {
                            productId: productKey,
                            sellerId: sellerId,
                        })}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.7),
                            }}
                        >Chat</Text>
                    </TouchableOpacity>

                </View>

            </View>
        )
    };


    function renderLocation() {
        return (
            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    // marginHorizontal: 5,
                    borderRadius: 8,
                    // marginBottom: 8,
                }}
            >
                <View
                    style={{
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(1.9),
                            color: Colors.DARK_SIX,
                        }}
                    >
                        Shop location
                    </Text>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                        }}
                        onPress={handleOpenMaps}
                    // onPress={() => {
                    //     navigation.navigate('BuyerStoreLocation', {
                    //         sellerUid: sellerUid,
                    //     });
                    // }}
                    >
                        <Ionicons name="navigate-outline" size={14} />
                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(1.8),
                                marginLeft: 5,

                            }}
                        >Get Direction</Text>
                    </TouchableOpacity>


                </View>

                <Separator height={5} />
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {userLocation ? (
                        <MapView
                            mapType="standard"
                            style={styles.map}
                            initialRegion={userLocation}
                        // showsUserLocation={true}
                        >
                            {/* USERLOCATION  */}
                            <Marker
                                coordinate={userLocation}
                            >
                                <Image
                                    source={marker}
                                    resizeMode='contain'
                                    style={{
                                        width: Display.setWidth(8),
                                        height: Display.setHeight(8),
                                    }}
                                />
                            </Marker>

                        </MapView>
                    ) : (
                        <Text>Loading...</Text>
                    )}
                </View>

                <Separator height={5} />

            </View>
        )
    };


    function renderContent() {
        return (
            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                    paddingHorizontal: 8,
                    paddingVertical: 10,
                }}
            >
                {/* <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY2, }} /> */}

                <View
                    style={{
                        marginTop: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setRecommendSelect(true);
                            setTopSelect(false);
                            setNewArrival(false);
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                color: recommendSelect === true ? Colors.DEFAULT_BLACK : Colors.INACTIVE_GREY,
                            }}
                        >Recommended</Text>
                    </TouchableOpacity>

                    <Text> | </Text>


                    <TouchableOpacity
                        onPress={() => {
                            setTopSelect(true);
                            setRecommendSelect(false);
                            setNewArrival(false);
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                color: topSelect === true ? Colors.DEFAULT_BLACK : Colors.INACTIVE_GREY,
                            }}
                        >Top Products</Text>
                    </TouchableOpacity>

                    <Text> | </Text>



                    <TouchableOpacity
                        onPress={() => {
                            setNewArrival(true);
                            setRecommendSelect(false);
                            setTopSelect(false);
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                color: newArrival === true ? Colors.DEFAULT_BLACK : Colors.INACTIVE_GREY,
                            }}
                        >New Arrival</Text>
                    </TouchableOpacity>

                </View>

            </View>
        )
    };


    function renderProducts() {
        if (recommendSelect === true) {
            return (
                <ShopRecommend
                    sellerUid={sellerId}
                />
            )
        }
        else if (topSelect === true) {
            return (
                <ShoTopProduct
                    sellerUid={sellerId}
                />
            )
        }
        else {
            return (
                <ShopArrival />
            )
        }
    }



    return (
        <View style={styles.container} >
            <Status />
            <Separator height={27} />

            {renderTop()}
            {renderStoreName()}
            <ScrollView>
                {renderLocation()}
                {renderContent()}
                {renderProducts()}
            </ScrollView>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE,
    },
    map: {
        width: Display.setWidth(92),
        height: Display.setHeight(18),
        borderWidth: 0.6,
        borderColor: Colors.LIGHT_GREY2,
    },
})