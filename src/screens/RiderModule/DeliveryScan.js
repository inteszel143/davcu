import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../constants';
import { MaterialCommunityIcons, SimpleLineIcons, FontAwesome5 } from 'react-native-vector-icons';
import Modal from "react-native-modal";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { scale } from 'react-native-size-matters';
import { firebase } from '../../../config';
import numeral from 'numeral';
const { width } = Dimensions.get('screen');
export default function DeliveryScan({ navigation, route }) {

    const { productID, orderKey, buyerID } = route.params;
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const [hasPermission, setHasPermission] = useState(null);
    const [scanData, setScanData] = useState();

    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);


    const updateStatus = (key) => {
        firebase.firestore()
            .collection('placeOrders')
            .doc(key)
            .update({
                orderStatus: 'On the way',
                pickupDate: timestamp,
            })
    }

    const handleBarCodeScanned = ({ type, data }) => {


        if (data === 'https://davcuapp.com/' + productID) {
            navigation.navigate('DeliveryClaimSuccess', {
                orderKey: orderKey,
                buyerID: buyerID,
            });
            updateStatus(orderKey);

        } else {
            navigation.navigate('DeliveryScanFailed', {
                productID: productID,
                orderKey: orderKey,
                buyerID: buyerID,
            });
            // console.log('FAILED TRY AGAIN');
        }

    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }


    // MODALLLLLLLLLLL
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    function MessageAlert() {
        return (
            <Modal
                isVisible={isModalVisible}
                animationIn={'zoomIn'}
                animationOut={'bounceOut'}
            >
                <View style={{ backgroundColor: Colors.DEFAULT_WHITE, height: '45%', borderRadius: 10, marginHorizontal: 20, }}>

                    <View
                        style={{
                            marginTop: 25,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <SimpleLineIcons name='question' size={85} color={Colors.DEFAULT_YELLOW} />
                        </View>
                        <View
                            style={{
                                paddingHorizontal: 15,
                                paddingVertical: 15,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: scale(17),
                                    textAlign: 'center',
                                }}
                            >Are you sure? you about to <Text style={{ fontFamily: 'PoppinsSemiBold' }} >CANCEL</Text> this order? </Text>
                        </View>

                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            marginTop: 20,
                        }}
                    >

                        <TouchableOpacity
                            style={{
                                height: 45,
                                backgroundColor: Colors.LIGHT_GREY2,
                                paddingHorizontal: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={toggleModal}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: scale(15),
                                    color: Colors.DARK_THREE
                                }}
                            >No, Cancel</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={{
                                height: 45,
                                paddingHorizontal: 20,
                                backgroundColor: Colors.DEFAULT_YELLOW,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5,
                            }}

                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: scale(15),
                                    color: Colors.DEFAULT_WHITE
                                }}
                            >Yes, Proceed</Text>
                        </TouchableOpacity>

                    </View>


                </View>


            </Modal>
        )
    }



    return (
        <View style={styles.container} >
            <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.DARK_ONE}
                translucent
            />


            <BarCodeScanner
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
            />


            <View
                style={{
                    position: 'absolute',
                    top: Display.setHeight(12),
                    alignSelf: 'center',
                    paddingHorizontal: 15,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: scale(25),
                        color: Colors.DEFAULT_WHITE,
                        textAlign: 'center',
                    }}
                >Scan QR Code</Text>

                <Text
                    style={{
                        fontFamily: 'PoppinsRegular',
                        fontSize: scale(15),
                        color: Colors.DEFAULT_WHITE,
                        textAlign: 'center',
                        marginTop: 8,
                    }}
                > Please Scan the Item QR code to confirm you accept the order.</Text>

            </View>

            <View
                style={{
                    position: 'absolute',
                    bottom: Display.setHeight(40),
                    alignSelf: 'center',
                }}
            >
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: Colors.DEFAULT_WHITE,
                        width: width / 1.5,
                        height: width / 1.5,
                    }}
                >

                </View>

            </View>




            <View
                style={{
                    position: 'absolute',
                    bottom: Display.setHeight(15),
                    alignSelf: 'center',
                    paddingHorizontal: 15,
                }}
            >
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: scale(15),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Cancel</Text>
                </TouchableOpacity>

            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DARK_ONE,
    }
})