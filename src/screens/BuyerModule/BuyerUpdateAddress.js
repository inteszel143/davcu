import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Modal, TextInput, Dimensions, ActivityIndicator, Keyboard, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, Separator, Status, Display, Barangay } from '../../constants'
import { firebase } from '../../../config';
import { MaterialCommunityIcons, AntDesign, Ionicons } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { SelectList } from 'react-native-dropdown-select-list'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Messaging from './BuyerConstant/Messaging';
import ShoppingCart from './BuyerConstant/ShoppingCart';

const { width } = Dimensions.get('screen');
const cardWidth = width / 2.2;
const marker = require('../../../assets/images/marker3.png');
const boarding = require('../../../assets/images/onboardBuyer.jpg');

export default function BuyerUpdateAddress({ navigation, route }) {


    const { addressKey } = route.params;
    const [selected, setSelected] = React.useState("");
    const [street, setStreet] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // ERROR
    const [errorSelect, setErrorSelect] = useState(null);
    const [errorStreet, setErrorStreet] = useState(null);
    const [errorFullName, setErrorName] = useState(null);
    const [errorPhoneNumber, setErrorPhone] = useState(null);

    // TOOLS
    const [pin, setPin] = useState([]);
    const [Latitude, setLatitude] = useState(0);
    const [Longitude, setLongitude] = useState(0);
    const [loading, setLoading] = React.useState(true);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [userNow, setUserNow] = useState([]);

    //DATA
    const [showButton, setShowButton] = useState(true);
    const buyerID = firebase.auth().currentUser.uid;
    const [showLoading, setShowLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);

    // SWITCH
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const [dummyId, setDummyId] = useState('');

    useEffect(() => {
        firebase.firestore()
            .collection('buyerAddress')
            .doc(addressKey)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setFullName(documentSnapshot.data().fullName);
                    setPhoneNumber(documentSnapshot.data().phoneNumber);
                    setStreet(documentSnapshot.data().addressInfo);
                    setSelected(documentSnapshot.data().barangay);
                    setIsEnabled(documentSnapshot.data().default);
                }
            });
    }, []);


    useEffect(() => {
        firebase.firestore()
            .collection('buyerAddress')
            .where("default", "==", true)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().buyerId === firebase.auth().currentUser.uid)
                        setDummyId(documentSnapshot.id);
                });
            });
    }, []);


    const handleUpdate = () => {
        setShowLoading(true);
        if (addressKey != dummyId) {
            firebase.firestore()
                .collection('buyerAddress')
                .doc(addressKey)
                .update({
                    latitude: 7.066973,
                    longitude: 125.59549,
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
                    firebase.firestore()
                        .collection('buyerAddress')
                        .doc(dummyId)
                        .update({
                            default: false,
                        })
                        .then(() => {
                            navigation.navigate('ShippingAddress');
                        });
                });
        } else {
            firebase.firestore()
                .collection('buyerAddress')
                .doc(addressKey)
                .update({
                    latitude: 7.066973,
                    longitude: 125.59549,
                    buyerId: buyerID,
                    barangay: selected,
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                    region: 'Mindanao',
                    city: 'Davao City',
                    province: 'Davao Del Sur',
                    default: isEnabled,
                    addressInfo: street,
                }).then(() => {
                    navigation.navigate('ShippingAddress');
                });
        }
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
                    >Edit address</Text>
                </View>
                <View
                    style={{
                        width: '20%',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {/* MESSAGIN HERE */}
                    <Messaging />
                    {/* SHOOPPING CART HERE */}
                    <ShoppingCart />
                </View>
            </View>
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
                        height: Display.setHeight(5.9),
                        justifyContent: 'center',
                        borderRadius: 5,
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


                    {/* BARANGAY */}
                    <Separator height={10} />
                    <SelectList
                        placeholder={selected}
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
                        defaultValue={street}
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





    return (
        <View style={styles.container} >
            <Status />
            <Separator height={27} />
            {renderTop()}
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
                {renderSettings()}
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