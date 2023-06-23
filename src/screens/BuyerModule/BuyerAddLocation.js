import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Colors, Display, Separator, Status, Barangay } from '../../constants'
import { MaterialCommunityIcons, Ionicons, Feather, AntDesign } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import * as Location from 'expo-location';
import { SelectList } from 'react-native-dropdown-select-list'

const marker = require('../../../assets/images/marker3.png');

export default function BuyerAddLocation({ navigation }) {


    // DATA
    const [selected, setSelected] = useState("");
    const [street, setStreet] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");


    // TOOLS
    const [showButton, setShowButton] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // TOOLS
    const [Latitude, setLatitude] = useState(0);
    const [Longitude, setLongitude] = useState(0);
    const [loading, setLoading] = React.useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // LOCATION
    const [location, setLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    // HANDLE ERROR
    useEffect(() => {
        const isDisabled = !street || !selected;
        setShowButton(isDisabled);
    }, [street, selected]);


    // CURRENT LOCATION
    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0012,
                longitudeDelta: 0.0012,
            });
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
            setLoading(false)
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    };

    // GET BUYER DATA
    useEffect(() => {
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setFullName(documentSnapshot.data().firstName + " " + documentSnapshot.data().lastName);
                    setPhoneNumber(documentSnapshot.data().mobileNumber);
                }
            });
    }, []);


    // HANDLE UPDATE
    const handleUpdate = async () => {
        setModalVisible(true);
        const address = street + ' ' + selected + ' Davao City' + ' Davao Del Sur' + ' Mindanao';
        await firebase.firestore()
            .collection('buyerAddress')
            .add({
                latitude: Latitude,
                longitude: Longitude,
                buyerId: firebase.auth().currentUser.uid,
                barangay: selected,
                fullName: fullName,
                phoneNumber: phoneNumber,
                region: 'Mindanao',
                city: 'Davao City',
                province: 'Davao Del Sur',
                default: true,
                addressInfo: street,
            })
            .then(() => {
                firebase.firestore()
                    .collection('users')
                    .doc(firebase.auth().currentUser.uid)
                    .update({
                        address: address,
                    })
                    .then(() => {
                        navigation.navigate('MainScreen');
                        setModalVisible(false);
                    });

            });
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

    function renderTopUsa() {
        return (
            <View>
                <TouchableOpacity
                    style={{
                        marginTop: 25,
                        paddingHorizontal: 20,
                    }}
                // onPress={() => navigation.replace('BuyerLogin')}
                >
                    <MaterialCommunityIcons name="close" size={22} />
                </TouchableOpacity>

                {/* TITLE */}
                <View
                    style={{
                        marginTop: 25,
                        paddingHorizontal: 30,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2.6),
                        }}
                    >
                        Setup your location
                    </Text>
                </View>

                {/* SUBTITLE */}
                <View
                    style={{
                        marginTop: 8,
                        paddingHorizontal: 31,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsRegular",
                            fontSize: RFPercentage(1.9),
                            color: Colors.INACTIVE_GREY,
                        }}
                    >
                        To help the shipping carrier deliver the package to your correct location.
                    </Text>
                </View>

            </View>
        )
    };

    function selectBarangay() {
        return (
            <View>
                <View
                    style={{
                        marginTop: 15,
                        paddingHorizontal: 30,
                    }}
                >

                    <SelectList
                        placeholder='Select Barangay'
                        setSelected={(val) => setSelected(val)}
                        data={Barangay.Barangay}
                        save="value"
                        fontFamily='PoppinsMedium'
                        boxStyles={{
                            borderRadius: 0,
                            borderWidth: 0.7,
                            paddingHorizontal: 10,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: Colors.INACTIVE_GREY,
                        }}
                        dropdownStyles={{
                            borderRadius: 0,
                            borderWidth: 0.7,
                            borderColor: Colors.LIGHT_GREY2,
                        }}
                        inputStyles={{
                            fontSize: RFPercentage(2),
                            // color: Colors.INACTIVE_GREY,
                        }}
                    />

                </View>
            </View>
        )
    }


    function renderDataField() {
        return (
            <View>

                <View
                    style={{
                        marginTop: 15,
                        paddingHorizontal: 30,
                    }}
                >
                    <View
                        style={{
                            borderWidth: 0.5,
                            paddingVertical: 5,
                            borderBottomColor: Colors.INACTIVE_GREY,
                            borderColor: Colors.DEFAULT_WHITE,
                            paddingHorizontal: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TextInput
                            placeholder='Street Name, Building, House No.'
                            onChangeText={(street) => setStreet(street)}
                            autoCapitalize='words'
                            autoCorrect={false}
                            style={{
                                flex: 1,
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2),
                            }}
                        />

                    </View>

                    {/* <View
                        style={{
                            marginTop: 5,
                            flexDirection: "row",
                        }}
                    >
                        <Ionicons name="warning-outline" size={14} color={Colors.DEFAULT_RED} />
                        <Text
                            style={{
                                fontFamily: "PoppinsRegular",
                                fontSize: RFPercentage(1.8),
                                color: Colors.DEFAULT_RED,
                                marginLeft: 8,
                            }}
                        >Required field*</Text>
                    </View> */}
                </View>

            </View>
        )
    }

    function renderCurrent() {
        return (
            <View>


                <View
                    style={{
                        marginTop: 40,
                        paddingHorizontal: 25,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2),
                            color: Colors.DARK_SIX,
                            marginRight: 5,
                        }}
                    >
                        Current Location
                    </Text>
                    <MaterialCommunityIcons name="navigation-variant-outline" size={18} />
                </View>


                <Separator height={10} />
                <View
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        backgroundColor: Colors.DEFAULT_WHITE,
                        flexDirection: 'row',
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: Colors.DEFAULT_YELLOW2,
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <MaterialCommunityIcons name='bell-ring' size={15} color={Colors.DEFAULT_WHITE} />
                    </View>

                    <View
                        style={{
                            marginLeft: 8,
                            paddingHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                color: Colors.DEFAULT_YELLOW2,
                            }}
                        >
                            Place an accurate pin
                        </Text>
                        <Text
                            style={{
                                fontSize: RFPercentage(1.6),
                                textAlign: 'justify',
                                fontFamily: 'PoppinsRegular',
                                color: Colors.DARK_SIX,
                            }}
                        >
                            To change the location of the pin, simply hold the marker for 3 seconds and drag into the desired location.
                        </Text>
                    </View>
                </View>

                <Separator height={10} />

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
                                draggable={true}
                                onDragEnd={(e) => {
                                    setLatitude(e.nativeEvent.coordinate.latitude)
                                    setLongitude(e.nativeEvent.coordinate.longitude)
                                }}
                            >
                                <Image
                                    source={marker}
                                    resizeMode='contain'
                                    style={{
                                        width: Display.setWidth(10),
                                        height: Display.setHeight(10),
                                    }}
                                />
                            </Marker>

                        </MapView>
                    ) : (
                        <Text>Loading...</Text>
                    )}
                </View>
            </View>
        )
    };


    function renderButton() {
        return (
            <View
                style={{
                    marginTop: 40,
                    alignSelf: 'center',
                }}
            >
                <TouchableOpacity
                    style={{
                        width: Display.setWidth(88),
                        height: Display.setHeight(6),
                        borderRadius: 2,
                        backgroundColor: showButton ? Colors.LIGHT_YELLOW : Colors.DEFAULT_YELLOW2,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    disabled={showButton}
                    onPress={handleUpdate}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Sign up</Text>
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={30} />
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {renderTopUsa()}
                {selectBarangay()}
                {renderDataField()}
                {renderCurrent()}
                {renderButton()}
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
    map: {
        width: Display.setWidth(91),
        height: Display.setHeight(25),
        borderWidth: 0.6,
        borderColor: Colors.LIGHT_GREY2,
    },
})