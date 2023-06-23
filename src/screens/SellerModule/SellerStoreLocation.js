import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Button, TextInput, Dimensions, ScrollView, ActivityIndicator, Alert, BackHandler, Modal } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Colors, Display, Separator, Status, Barangay
} from '../../constants';
import { MaterialCommunityIcons, AntDesign, Ionicons, Entypo } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { SelectList } from 'react-native-dropdown-select-list'
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import * as Location from 'expo-location';
import { firebase } from '../../../config';

const marker = require('../../../assets/images/marker3.png');

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0012;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function SellerStoreLocation({ navigation }) {


    // TOOLS
    const [modalVisible, setModalVisible] = useState(false);
    const [showButton, setShowButton] = useState(true);

    const [Latitude, setLatitude] = useState(0);
    const [Longitude, setLongitude] = useState(0);


    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    const [street, setStreet] = useState('');
    const [selected, setSelected] = React.useState("");

    useEffect(() => {
        const isDisabled = !street || !selected;
        setShowButton(isDisabled);
    }, [street, selected]);


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
        })();
    }, []);


    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    };



    const handleUpdateSeller = async () => {
        setModalVisible(true);
        const storeLocation = street + ' ' + selected + ' ' + 'Davao City ' + 'Davao Del Sur ' + 'Mindanao';
        try {
            await firebase.firestore()
                .collection('sellers')
                .doc(firebase.auth().currentUser.uid)
                .update({
                    Latitude: Latitude,
                    Longitude: Longitude,
                    storeLocation: storeLocation,
                })
                .then(() => {
                    setModalVisible(false);
                    navigation.navigate('SellerMainScreen');
                });
        } catch (error) {
            console.log(error);
        }
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
    function renderContentTop() {
        return (
            <View
                style={{
                    paddingHorizontal: 20,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsBold',
                        fontSize: RFPercentage(3),
                    }}
                >
                    Add shop address
                </Text>
            </View>
        )
    };



    function renderAddress() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,

                }}
            >

                <View
                    style={{
                        backgroundColor: Colors.DEFAULT_WHITE,
                        paddingVertical: 15,
                        borderRadius: 5,
                    }}
                >

                    {/* REGION */}

                    <View
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: Colors.LIGHT_GREY2,
                            flexDirection: 'row',
                            marginHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                marginRight: 3,
                                color: Colors.DARK_SIX,
                            }}
                        >Mindanao</Text>

                        <Ionicons name="information-circle-outline" size={13} color={Colors.DEFAULT_YELLOW} />
                    </View>

                    <Separator height={10} />
                    {/* PROVINCE */}
                    <View
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: Colors.LIGHT_GREY2,
                            flexDirection: 'row',
                            // alignItems: 'center',
                            marginHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                marginRight: 3,
                                color: Colors.DARK_SIX,
                            }}
                        >Davao Del Sur</Text>

                        <Ionicons name="information-circle-outline" size={13} color={Colors.DEFAULT_YELLOW} />
                    </View>



                    <Separator height={10} />
                    {/* CITY */}
                    <View
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: Colors.LIGHT_GREY2,
                            flexDirection: 'row',
                            // alignItems: 'center',
                            marginHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                marginRight: 3,
                                color: Colors.DARK_SIX,
                            }}
                        >Davao City</Text>

                        <Ionicons name="information-circle-outline" size={13} color={Colors.DEFAULT_YELLOW} />
                    </View>

                    {/* BARANGAY */}
                    <Separator height={10} />
                    <SelectList
                        placeholder='Select Barangay'
                        setSelected={(val) => setSelected(val)}
                        data={Barangay.Barangay}
                        save="value"
                        fontFamily='PoppinsMedium'
                        boxStyles={{
                            borderRadius: 0,
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
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
                    <View style={{
                        height: 0.7,
                        backgroundColor: Colors.LIGHT_GREY2,
                        marginHorizontal: 10,
                    }} />



                    <Separator height={10} />
                    <TextInput
                        placeholder='Street Name, Building, House No.'
                        onChangeText={(street) => setStreet(street)}
                        autoCapitalize='words'
                        autoCorrect={false}
                        style={{
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: Colors.LIGHT_GREY2,
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2),
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            marginHorizontal: 10,
                        }}
                    />

                    <Separator height={5} />
                </View>
            </View>
        )
    };




    function shopInfo() {
        return (
            <View>
                <Separator height={10} />
                {/* TEXTINPUT */}

                <View
                    style={{
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        paddingHorizontal: 20,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >Your current location</Text>

                </View>

                <Separator height={10} />
                <View
                    style={{
                        alignSelf: 'center',
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
                    marginTop: 30,
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    style={{
                        width: Display.setWidth(88),
                        height: Display.setHeight(6),
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: showButton ? Colors.LIGHT_YELLOW : Colors.DEFAULT_YELLOW2,
                    }}
                    disabled={showButton}
                    onPress={handleUpdateSeller}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >
                        Save changes
                    </Text>
                </TouchableOpacity>

            </View>
        )
    }

    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Separator height={60} />
                {renderContentTop()}
                {renderAddress()}
                {shopInfo()}
                {renderButton()}
                <Separator height={27} />
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
        width: Display.setWidth(89),
        height: Display.setHeight(30),
        borderRadius: 20,
        borderWidth: 0.6,
        borderColor: Colors.LIGHT_GREY2,
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