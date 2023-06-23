import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Modal, TextInput, Dimensions, ActivityIndicator, Keyboard, Switch, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, Separator, Status, Display, Barangay } from '../../constants'
import { firebase } from '../../../config';
import { MaterialCommunityIcons, AntDesign, Ionicons } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as Location from 'expo-location';
import { SelectList } from 'react-native-dropdown-select-list'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import Messaging from './BuyerConstant/Messaging';
import ShoppingCart from './BuyerConstant/ShoppingCart';

const { width } = Dimensions.get('screen');
const cardWidth = width / 2.2;
const marker = require('../../../assets/images/marker3.png');
const boarding = require('../../../assets/images/onboardBuyer.jpg');



export default function BuyerSetupLocation({ navigation, route }) {

    const { mobileNumber } = route.params;


    const [selected, setSelected] = React.useState("");
    const [street, setStreet] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(mobileNumber);

    // ERROR
    const [errorSelect, setErrorSelect] = useState(null);
    const [errorStreet, setErrorStreet] = useState(null);
    const [errorFullName, setErrorName] = useState(null);
    const [errorPhoneNumber, setErrorPhone] = useState(null);

    // TOOLS
    const [Latitude, setLatitude] = useState(0);
    const [Longitude, setLongitude] = useState(0);
    const [loading, setLoading] = React.useState(true);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [userNow, setUserNow] = useState([]);

    //DATA
    const [modalVisible, setModalVisible] = useState(true);
    const buyerID = firebase.auth().currentUser.uid;
    const [showLoading, setShowLoading] = useState(false);

    // SWITCH
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    // GET BUYER DATA
    useEffect(() => {
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setFullName(documentSnapshot.data().firstName + " " + documentSnapshot.data().lastName);
                    // setPhoneNumber(documentSnapshot.data().mobileNumber);
                }
            });
    }, [])

    // HANDLE UPDATE
    const handleUpdate = () => {
        setShowLoading(true);
        const address = street + ' ' + selected + ' Davao City' + ' Davao Del Sur' + ' Mindanao';
        firebase.firestore()
            .collection('buyerAddress')
            .add({
                latitude: Latitude,
                longitude: Longitude,
                buyerId: buyerID,
                barangay: selected,
                fullName: fullName,
                phoneNumber: mobileNumber,
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
                        mobileNumber: mobileNumber,
                    })
                    .then(() => {
                        navigation.navigate('MainScreen');
                        setShowLoading(false);
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
            setLoading(false)
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
       

        //IF ALL WAS VALID THEN PROCEED THIS CODE !!
        if (isValid) {
            { handleUpdate() }
        }
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
                        height: Display.setHeight(6.2),
                        justifyContent: 'center',
                        borderRadius: 15,
                        alignItems: 'center',
                        backgroundColor: Colors.DEFAULT_YELLOW2,
                        // backgroundColor: showButton ? Colors.LIGHT_YELLOW : Colors.DEFAULT_YELLOW2,
                    }}
                    // disabled={showButton}
                    onPress={validate}
                >
                    {
                        showLoading ? <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                            :
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                }}
                            >Submit Address</Text>
                    }
                </TouchableOpacity>
                <Separator height={35} />
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
                        placeholder='Enter name'
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
                            borderBottomColor: Colors.LIGHT_GREY2,
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
                            value={mobileNumber}
                            placeholder='Enter phone number'
                            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                            maxLength={10}
                            keyboardType='number-pad'
                            style={{
                                flex: 1,
                                letterSpacing: 1.2,
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                paddingVertical: 3,
                                paddingHorizontal: 5,
                            }}
                        />

                    </View>
                
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



    function renderTop() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    paddingTop: 15,
                    paddingVertical: 10,
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                <TouchableOpacity
                    style={{
                        width: '20%',
                    }}
                // onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="close" size={22} />
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
                    >Shipping info</Text>
                </View>
                <View
                    style={{
                        width: '20%',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                </View>
            </View>
        )
    };











    return (
        <View style={styles.container} >
            <Status />
            <Separator height={27} />
            {renderTop()}
            <ScrollView
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
                {/* <Separator height={15} />
                {renderSettings()} */}
                <Separator height={90} />
                {renderBottomButton()}
            </ScrollView>


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