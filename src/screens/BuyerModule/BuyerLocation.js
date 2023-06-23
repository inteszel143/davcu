import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Button, TextInput, Dimensions, ActivityIndicator, Keyboard, Switch, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
    Colors,
    Display,
    Separator, Status, Barangay, Header
} from '../../constants';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons, AntDesign, Ionicons } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { scale } from 'react-native-size-matters';
const { width } = Dimensions.get('screen');
const cardWidth = width / 2.2;
const boarding = require('../../../assets/images/onboardBuyer.jpg');
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import * as Location from 'expo-location';
import { firebase } from '../../../config';
import { SelectList } from 'react-native-dropdown-select-list'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const marker = require('../../../assets/images/marker3.png');

export default function BuyerLocation({ navigation }) {

    const [selected, setSelected] = React.useState("");
    const [street, setStreet] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // ERROR
    const [errorSelect, setErrorSelect] = useState(null);
    const [errorStreet, setErrorStreet] = useState(null);
    const [errorFullName, setErrorName] = useState(null);
    const [errorPhoneNumber, setErrorPhone] = useState(null);

    // useEffect(() => {
    //     const isDisabled = selected.length === 0 || street.length === 0;
    //     setShowButton(isDisabled);
    // }, [selected, street]);


    // TOOLS
    const [pin, setPin] = useState([]);
    const [Latitude, setLatitude] = useState(0);
    const [Longitude, setLongitude] = useState(0);
    const [loading, setLoading] = React.useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();


    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [userNow, setUserNow] = useState([]);

    //DATA
    const [showButton, setShowButton] = useState(true);
    const buyerID = firebase.auth().currentUser.uid;
    const [showLoading, setShowLoading] = useState(false);

    // SWITCH
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    useEffect(() => {
        firebase.firestore()
            .collection('users')
            .doc(buyerID)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setFullName(documentSnapshot.data().firstName + ' ' + documentSnapshot.data().lastName);
                    setPhoneNumber(documentSnapshot.data().mobileNumber);
                }
            });
    }, [])

    const handleUpdate = async () => {
        setShowLoading(true);

        await firebase.firestore()
            .collection('buyerAddress')
            .add({
                latitude: Latitude,
                longitude: Longitude,
                buyerId: buyerID,
                barangay: selected,
                fullName: fullName,
                phoneNumber: phoneNumber,
                region: 'Mindanao',
                city: 'Davao City',
                province: 'Davao Del Sur',
                default: isEnabled,
                addressInfo: street,
            })
            .then(() => {
                setModalVisible(true);
                const address = street + ' ' + selected + ' ' + ' Davao City' + ' Davao Del Sur' + ' Mindanao';
                firebase.firestore()
                    .collection('users')
                    .doc(buyerID)
                    .update({
                        Latitude: Latitude,
                        Latitude: Longitude,
                        address: address,
                        status: 'active',
                    })
                    .then(() => {
                        firebase.firestore()
                            .collection('viewed')
                            .add({
                                createdAt: timestamp,
                                buyerId: buyerID,
                                category: '',
                            })
                            .then(() => {
                                navigation.replace('MainScreen');
                                setModalVisible(false);
                            });

                    });
            });
    }


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
            console.log(location.coords.latitude);
            console.log(location.coords.longitude);
        })();
    }, []);



    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    };



    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;

        if (!street) {
            setErrorStreet('Enter valid address');
            isValid = false;
        }
        if (!selected) {
            setErrorSelect('Please Select Barangay');
            isValid = false;
        }
        if (!fullName) {
            setErrorName('Enter your full name');
            isValid = false;
        }
        if (!phoneNumber) {
            setErrorPhone('Enter a valid phone number');
            isValid = false;
        }

        //IF ALL WAS VALID THEN PROCEED THIS CODE !!
        if (isValid) {
            { handleUpdate() }
        }
    }




    function renderBottomButton() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: Display.setWidth(100),
                    height: Display.setHeight(10),
                    // backgroundColor: Colors.DEFAULT_WHITE,
                    // borderWidth: 0.5,
                    // borderColor: Colors.DEFAULT_WHITE,
                    // borderTopColor: Colors.LIGHT_GREY2,
                }}
            >
                <Separator height={15} />
                <TouchableOpacity
                    style={{
                        width: Display.setWidth(88),
                        height: Display.setHeight(5.9),
                        justifyContent: 'center',
                        borderRadius: 5,
                        alignItems: 'center',
                        backgroundColor: Colors.DEFAULT_YELLOW2,
                        flexDirection: 'row',
                    }}
                    // disabled={showButton}
                    onPress={validate}
                >
                    {
                        showLoading && <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                    }
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Submit Address</Text>
                </TouchableOpacity>
                <Separator height={25} />
            </View>
        )
    };




    function renderContact() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,

                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2),
                        color: Colors.DARK_SIX,
                    }}
                >
                    Contact information
                </Text>
                <Separator height={8} />
                <View
                    style={{
                        backgroundColor: Colors.DEFAULT_WHITE,
                        paddingHorizontal: 15,
                        paddingVertical: 15,
                        borderWidth: 0.5,
                        borderColor: Colors.LIGHT_GREY,
                        borderRadius: 5,
                    }}
                >
                    <TextInput
                        defaultValue={fullName}
                        onChangeText={(fullName) => setFullName(fullName)}
                        autoCapitalize='words'
                        autoCorrect={false}
                        style={{
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: errorFullName ? Colors.DEFAULT_RED : Colors.LIGHT_GREY2,
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2),
                            paddingVertical: 3,
                            paddingHorizontal: 5,
                        }}
                    />
                    {/* ERROR MESSAGE */}
                    {
                        errorFullName && <View
                            style={{
                                marginTop: 8,
                                flexDirection: 'row',
                                marginLeft: 5,
                            }}
                        >
                            <Ionicons name="warning" size={15} color={Colors.DEFAULT_RED} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.DEFAULT_RED,
                                    marginLeft: 5,
                                }}
                            >
                                {errorFullName}
                            </Text>
                        </View>
                    }
                    <Separator height={10} />
                    <View
                        style={{
                            paddingVertical: 5,
                            paddingHorizontal: 5,
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: errorPhoneNumber ? Colors.DEFAULT_RED : Colors.LIGHT_GREY2,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(2),
                                }}
                            >PH +63 </Text>
                        </View>

                        <TextInput
                            defaultValue={phoneNumber}
                            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                            maxLength={10}
                            keyboardType='number-pad'
                            style={{
                                flex: 1,
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                paddingVertical: 3,
                                paddingHorizontal: 5,
                            }}
                        />

                    </View>
                    {/* ERROR MESSAGE */}
                    {
                        errorPhoneNumber && <View
                            style={{
                                marginTop: 8,
                                flexDirection: 'row',
                                marginLeft: 5,
                            }}
                        >
                            <Ionicons name="warning" size={15} color={Colors.DEFAULT_RED} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.DEFAULT_RED,
                                    marginLeft: 5,
                                }}
                            >
                                {errorPhoneNumber}
                            </Text>
                        </View>
                    }
                    <Separator height={5} />
                </View>
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
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2),
                        color: Colors.DARK_SIX,
                    }}
                >
                    Shipping information
                </Text>
                <Separator height={8} />
                <View
                    style={{
                        backgroundColor: Colors.DEFAULT_WHITE,
                        paddingHorizontal: 5,
                        paddingVertical: 15,
                        borderWidth: 0.5,
                        borderColor: Colors.LIGHT_GREY,
                        borderRadius: 5,
                    }}
                >

                    {/* REGION */}

                    <View
                        style={{
                            paddingVertical: 8,
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
                        >Mindanao</Text>

                        <Ionicons name="information-circle-outline" size={13} color={Colors.DEFAULT_YELLOW} />
                    </View>

                    <Separator height={10} />
                    {/* PROVINCE */}
                    <View
                        style={{
                            paddingVertical: 8,
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
                            paddingVertical: 8,
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


                    {/* PROVINCE */}
                    {/* <Separator height={10} />
                    <TextInput
                        defaultValue='Davao Del Sur'
                        editable={false}
                        style={{
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: Colors.LIGHT_GREY2,
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2),
                            paddingVertical: 3,
                            paddingHorizontal: 10,
                            marginHorizontal: 10,
                            color: Colors.DARK_SIX,
                        }}
                    /> */}


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
                        backgroundColor: errorSelect ? Colors.DEFAULT_RED : Colors.LIGHT_GREY2,
                        marginHorizontal: 10,
                    }} />
                    {/* ERROR MESSAGE */}
                    {
                        errorSelect && <View
                            style={{
                                marginTop: 8,
                                flexDirection: 'row',
                                marginLeft: 12,
                            }}
                        >
                            <Ionicons name="warning" size={15} color={Colors.DEFAULT_RED} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.DEFAULT_RED,
                                    marginLeft: 5,
                                }}
                            >
                                {errorSelect}
                            </Text>
                        </View>
                    }


                    <Separator height={10} />
                    <TextInput
                        placeholder='Street Name, Building, House No.'
                        onChangeText={(street) => setStreet(street)}
                        autoCapitalize='words'
                        autoCorrect={false}
                        style={{
                            borderWidth: 0.7,
                            borderColor: Colors.DEFAULT_WHITE,
                            borderBottomColor: errorStreet ? Colors.DEFAULT_RED : Colors.LIGHT_GREY2,
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2),
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            marginHorizontal: 10,
                        }}
                    />

                    {/* ERROR MESSAGE */}
                    {
                        errorStreet && <View
                            style={{
                                marginTop: 8,
                                flexDirection: 'row',
                                marginLeft: 12,
                            }}
                        >
                            <Ionicons name="warning" size={15} color={Colors.DEFAULT_RED} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.DEFAULT_RED,
                                    marginLeft: 5,
                                }}
                            >
                                {errorStreet}
                            </Text>
                        </View>
                    }



                    <Separator height={5} />
                </View>
            </View>
        )
    };

    function renderCurrent() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,

                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2),
                        color: Colors.DARK_SIX,
                    }}
                >
                    Your Current Location
                </Text>

                <Separator height={10} />
                <View
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal: 15,
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

    function renderSettings() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,

                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2),
                        color: Colors.DARK_SIX,
                    }}
                >
                    Settings
                </Text>
                <Separator height={8} />
                <View
                    style={{
                        backgroundColor: Colors.DEFAULT_WHITE,
                        paddingHorizontal: 5,
                        paddingVertical: 15,
                        borderWidth: 0.5,
                        borderColor: Colors.LIGHT_GREY,
                        borderRadius: 5,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                        >Set as default</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: "#74BBFB" }}
                            thumbColor={isEnabled ? '#FFFFFF' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>

                </View>

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
                        <MaterialCommunityIcons name="check-circle" size={30} color={Colors.DEFAULT_YELLOW2} />
                        <Separator height={8} />
                        <Text style={styles.modalText} >Success ! you have added a new shipping address.</Text>
                        <Separator height={10} />
                    </View>
                </View>


            </Modal>
        )
    };

    function renderHeader() {
        return (
            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                <Separator height={35} />
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 13,
                        paddingVertical: 6,
                    }}
                >
                    <View
                        style={{
                            height: 22,
                            width: 30,
                        }}
                    >

                    </View>

                    <View
                        style={{
                            marginLeft: 15,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2.6),
                            }}
                        >Shipping info</Text>
                    </View>
                    <View
                        style={{
                            height: 22,
                            width: 38,
                        }}
                    >

                    </View>
                </View>
            </View>
        )
    }


    return (
        <View style={styles.container} >
            <Status />
            {renderHeader()}

            {/* <Header title={'Shipping info'} /> */}
            {MessageAlert()}
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
            >
                <Separator height={25} />
                {/* START CONTENT */}
                {renderContact()}
                <Separator height={20} />
                {renderAddress()}
                {/* {renderContent()} */}
                <Separator height={15} />
                {renderCurrent()}
                <Separator height={15} />
                {/* {renderSettings()} */}
                <Separator height={90} />
                {renderBottomButton()}
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_BG,
    },
    map: {
        width: Display.setWidth(91),
        height: Display.setHeight(25),
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
        justifyContent: 'center',
        // backgroundColor: Colors.DEFAULT_WHITE,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 5,
        width: Display.setWidth(90),
        // height: Display.setHeight(15),
        paddingVertical: 20,
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
        color: Colors.DEFAULT_WHITE,
        textAlign: 'center',
        fontFamily: 'PoppinsSemiBold',
        fontSize: RFPercentage(2.4),
        paddingHorizontal: 30,
    },
})