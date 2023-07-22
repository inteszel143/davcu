import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Animated, TextInput, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Colors,
    Display,
    Separator, Status,
} from '../../constants'
import { MaterialCommunityIcons, AntDesign, Ionicons, Feather } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';
import numeral from 'numeral';
import moment from 'moment';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

export default function SellerInvoice({ navigation, route }) {

    const viewToSnapshotRef = useRef();
    const { orderKey } = route.params;
    const [orderDetails, setOrderDetails] = useState('');
    const [sellerDetail, setSellerDetail] = useState('');
    const [loading, setLoading] = useState(true);
    const SellerID = orderDetails.sellerUid;
    const [modalVisible, setModalVisible] = useState(false);

    const updatePrint = async () => {
        try {
            await firebase.firestore()
                .collection('placeOrders')
                .doc(orderKey)
                .update({
                    print: 1,
                })
                .then(() => {
                    navigation.goBack();
                    setModalVisible(false);
                });
        } catch (error) {
            console.log(error)
        }
    }

    const snapshot = async () => {
        const result = await captureRef(viewToSnapshotRef);
        saveFile(result);
    };


    const saveFile = async (fileUri) => {
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status === "granted") {
            try {
                const asset = await MediaLibrary.createAssetAsync(fileUri);
                const album = await MediaLibrary.getAlbumAsync('Download');
                if (album == null) {
                    await MediaLibrary.createAlbumAsync('Download', asset, false);
                    setModalVisible(true);
                } else {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                    setModalVisible(true);
                    setTimeout(() => {
                        updatePrint();
                    }, 1000)

                }
            } catch (err) {
                console.log("Save err: ", err)
            }
        } else if (status === "denied") {
            alert("please allow permissions to download")
        }
    }

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('placeOrders')
            .doc(orderKey)
            .onSnapshot(documentSnapshot => {
                setOrderDetails(documentSnapshot.data());
            });

        return () => { isMounted = false; subscriber() };
    }, []);


    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('sellers')
            .doc(SellerID)
            .onSnapshot(documentSnapshot => {
                setSellerDetail(documentSnapshot.data());
                setLoading(false);
            });

        return () => { isMounted = false; subscriber() };
    })


    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: Colors.DEFAULT_WHITE,

                }}
            >
                <ActivityIndicator size="large" color={Colors.DEFAULT_YELLOW2} />
                <Text
                    style={{
                        fontFamily: "PoppinsSemiBold",
                        fontSize: RFPercentage(2),
                        textAlign: "center",
                        marginTop: 5,
                    }}
                >Generate Receipt</Text>
            </View>
        );
    }


    function printMe() {
        return (
            <View
                style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    style={{
                        width: Display.setWidth(90),
                        height: Display.setHeight(5.8),
                        backgroundColor: Colors.DEFAULT_YELLOW2,
                        borderWidth: 0.6,
                        borderColor: Colors.DEFAULT_YELLOW2,
                        borderRadius: 2,
                        flexDirection: "row",
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    // onPress={() => navigation.goBack()}
                    onPress={snapshot}
                >
                    <Ionicons name="print-outline" size={15} color={Colors.DEFAULT_WHITE} />
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(1.9),
                            color: Colors.DEFAULT_WHITE,
                            marginLeft: 8,
                        }}
                    >Print & Download</Text>
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
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Feather name="check-circle" size={25} color={'#00FF00'} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                    marginTop: 3,
                                }}
                            >
                                Image saved
                            </Text>
                        </View>

                    </View>
                </View>


            </Modal>
        )
    };



    return (
        <View style={styles.container} >

            <Status />
            {MessageAlert()}

            <ScrollView>

                <Separator height={40} />
                {/* {renderHeader()} */}
                <View
                    ref={viewToSnapshotRef}
                    style={{
                        borderWidth: 0.5,
                        paddingVertical: 10,
                        paddingHorizontal: 25,
                        marginHorizontal: 10,
                        backgroundColor: Colors.DEFAULT_WHITE,
                    }}
                >
                    {/* <Text
                    style={{
                        textAlign: 'center',
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2),
                    }}
                >INVOICE</Text>

                <View style={{ height: 0.5, backgroundColor: Colors.DEFAULT_BLACK, marginVertical: 15, marginHorizontal: 40, }} /> */}


                    <Text
                        style={{
                            textAlign: 'left',
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            textAlign: 'center',
                        }}
                    >Order #: {orderDetails.orderID}</Text>
                    <Separator height={5} />
                    <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(1.9),
                            textAlign: 'center',
                        }}
                    >{sellerDetail.shopName}</Text>

                    <Separator height={5} />
                    <Text
                        style={{
                            fontFamily: 'PoppinsRegular',
                            fontSize: RFPercentage(1.9),
                            textAlign: 'center',
                        }}
                    >{sellerDetail.storeLocation}
                    </Text>

                    <Separator height={5} />
                    <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(1.8),
                            textAlign: 'center',
                        }}
                    > {moment(new Date()).format('LLL')}</Text>




                    <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 10, marginHorizontal: 20, }} />

                    <Text
                        style={{
                            textAlign: 'center',
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2.2),
                        }}
                    >Customer:</Text>
                    <Separator height={5} />

                    <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2.2),
                            textAlign: 'center',
                        }}
                    >{orderDetails.fullName}</Text>

                    {/* method */}
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            textAlign: 'center',
                        }}
                    >
                        {orderDetails.paymentMethod}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >


                    </View>
                    <Separator height={5} />
                    <Text
                        style={{
                            fontFamily: 'PoppinsRegular',
                            fontSize: RFPercentage(1.9),
                            textAlign: 'center',
                        }}
                    >
                        {orderDetails.shippingAddress}
                    </Text>

                    <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(2),
                            textAlign: 'center',
                        }}
                    >{orderDetails.phoneNumber}</Text>
                    <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 20, }} />


                    {/* ITEMS */}
                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <Text
                            style={{
                                width: '20%',
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.8),
                                textAlign: 'center',
                            }}
                        >{orderDetails.quantity}x</Text>
                        <Text
                            style={{
                                width: '60%',
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.8),
                                textAlign: 'center',
                            }}
                        >{orderDetails.productName}</Text>
                        <Text
                            style={{
                                width: '20%',
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.8),
                                textAlign: 'center',
                            }}
                        >₱{numeral(orderDetails.price).format('0,0.00')}</Text>

                    </View>
                    <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 20, }} />


                    {/* SUMMARY */}
                    <View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsMedium',
                                        fontSize: RFPercentage(1.8),
                                        textAlign: 'left',
                                    }}
                                >Subtotal: </Text>
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsMedium',
                                        fontSize: RFPercentage(1.8),
                                        textAlign: 'left',
                                        marginTop: 5,
                                    }}
                                >Delivery fee: </Text>
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(1.8),
                                        textAlign: 'left',
                                        marginTop: 5,
                                    }}
                                >Total: </Text>
                            </View>

                            <View>
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsMedium',
                                        fontSize: RFPercentage(1.8),
                                        textAlign: 'right',
                                    }}
                                >PHP {numeral(orderDetails.price).format('0,0.00')}</Text>
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsMedium',
                                        fontSize: RFPercentage(1.8),
                                        textAlign: 'right',
                                        marginTop: 5,
                                    }}
                                >PHP {numeral(orderDetails.deliveryFee).format('0,0.00')}</Text>
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(1.8),
                                        textAlign: 'right',
                                        marginTop: 5,
                                    }}
                                >PHP {numeral(parseFloat(orderDetails.price) + parseFloat(orderDetails.deliveryFee)).format('0,0.00')}</Text>
                            </View>

                        </View>

                    </View>
                    <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 20, }} />

                    {/* QR CODE */}

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <QRCode
                            content={'https://davcuapp.com/' + orderDetails.productUid}
                            codeStyle='sharp'
                            outerEyeStyle='square'
                            innerEyeStyle='square'
                            size={120}
                        />
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                }}
                            >Product QTY:</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            >{orderDetails.quantity} items</Text>

                            <Separator height={20} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                }}
                            >Amount:</Text>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            >PHP {numeral(parseFloat(orderDetails.price) + parseFloat(orderDetails.deliveryFee)).format('0,0.00')}</Text>

                        </View>
                    </View>
                    <Separator height={15} />
                    <Text
                        style={{
                            fontFamily: 'PoppinsRegular',
                            fontSize: RFPercentage(1.7),
                            textAlign: 'justify',
                        }}
                    >***To all  riders, please double check receipt before you leave***</Text>
                </View>

                <Separator height={20} />
                {printMe()}
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
        // backgroundColor: Colors.DEFAULT_WHITE,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 5,
        // width: Display.setWidth(60),
        // height: Display.setHeight(14),
        paddingHorizontal: 70,
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

})