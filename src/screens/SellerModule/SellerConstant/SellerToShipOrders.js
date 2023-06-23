import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Animated, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Colors,
    Display,
    Separator, Status, Header
} from '../../../constants';

import { MaterialCommunityIcons, AntDesign, Ionicons, Entypo } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { scale } from 'react-native-size-matters';


import { firebase } from '../../../../config';
import numeral from 'numeral';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
const { width } = Dimensions.get('screen');


export default function SellerToShipOrders() {
    const refRBSheet = useRef();
    const navigation = useNavigation();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const deviceHeight = Dimensions.get('window').height

    const [refreshing, setRefreshing] = useState(false);

    const [orderKey, setOrderKey] = useState('');
    const [loading, setLoading] = useState(true);
    const [newOrders, setNewOrders] = useState('');
    const userId = firebase.auth().currentUser.uid;


    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('placeOrders')
            .orderBy("toShipDate", 'asc')
            .onSnapshot(querySnapshot => {
                const data = [];

                querySnapshot.forEach(documentSnapshot => {

                    if (documentSnapshot.data().sellerUid === userId && documentSnapshot.data().orderStatus === 'To Ship') {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }

                });
                setNewOrders(data);
                setLoading(false);
            });
        return () => { isMounted = false; subscriber() };
    }, []);


    const updateStatus = (key) => {
        firebase.firestore()
            .collection('placeOrders')
            .doc(key)
            .update({
                orderStatus: 'Process',
                ProcessDate: timestamp,
            })
    };





    if (loading) {
        return <View
            style={{
                flex: 1,
                alignItems: "center",
                backgroundColor: Colors.DEFAULT_WHITE,
            }}
        >
            <ActivityIndicator size="small" color={Colors.DEFAULT_YELLOW2} />
        </View>;
    };

    function renderComponent() {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={Colors.DARK_ONE}
                    translucent
                />


                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current.close();
                        navigation.navigate('SellerArrangeShipment', {
                            orderKey: orderKey,
                        });
                    }}
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            marginLeft: 5,
                        }}
                    >Arrange Shipment</Text>
                </TouchableOpacity>

                <View style={{ width: Display.setWidth(100), height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 15, }} />

                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current.close();
                        navigation.navigate('SellerInvoice', {
                            orderKey: orderKey

                        })
                    }}
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    {/* <Ionicons name="ios-print-outline" size={15} /> */}
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            marginLeft: 5,
                        }}
                    >Print Receipt</Text>
                </TouchableOpacity>

                <View style={{ width: Display.setWidth(100), height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 15, }} />

                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current.close();

                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_RED,
                        }}
                    >Cancel</Text>
                </TouchableOpacity>

            </View>
        )
    };


    function renderBottomSheet() {
        return (
            <View>
                <RBSheet
                    ref={refRBSheet}
                    height={180}
                    openDuration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center",
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        }
                    }}
                >
                    {renderComponent()}
                </RBSheet>
            </View>
        )
    }


    return (
        <View style={styles.container} >
            <Status />
            {renderBottomSheet()}
            {
                newOrders.length === 0 ? <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: deviceHeight / 5,
                    }}
                >
                    <Image
                        source={require('../../../../assets/Icon/magnifying-glass.png')}
                        resizeMode='contain'
                        style={{
                            width: 80,
                            height: 80,
                        }}
                    />
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2.6),
                            marginTop: 25,
                        }}
                    >
                        No result found
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'PoppinsRegular',
                            fontSize: RFPercentage(1.9),
                            paddingHorizontal: 50,
                            textAlign: 'center',
                            marginTop: 8,
                            color: Colors.INACTIVE_GREY,
                        }}
                    >
                        "We're sorry, but there are no available items at the moment."
                    </Text>
                </View>

                    :
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: 5,
                        }}
                    >
                        <FlatList
                            data={newOrders}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        backgroundColor: Colors.DEFAULT_WHITE,
                                        paddingVertical: 15,
                                        paddingHorizontal: 10,
                                        shadowColor: Colors.DEFAULT_BG2,
                                        shadowOffset: {
                                            width: 0,
                                            height: 1,
                                        },
                                        shadowOpacity: 0.20,
                                        shadowRadius: 1.41,
                                        elevation: 2,
                                        marginTop: 8,
                                        borderRadius: 5,
                                        marginBottom: 1,
                                    }}
                                // onPress={() => {
                                //     navigation.navigate('SellerToShip', {
                                //         orderKey: item.key
                                //     })
                                //     updateStatus(item.key);
                                // }
                                // }
                                >

                                    {/* ORDER ID */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 5,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'PoppinsSemiBold',
                                                    fontSize: RFPercentage(1.8),
                                                    marginRight: 5,
                                                }}
                                            >{item.orderID}</Text>
                                            <MaterialCommunityIcons name="content-copy" size={13} color={Colors.INACTIVE_GREY} />
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'PoppinsMedium',
                                                    fontSize: RFPercentage(1.8),
                                                    color: Colors.DEFAULT_GREEN,
                                                }}
                                            >Waiting Pick-up</Text>
                                        </View>

                                    </View>


                                    <Separator height={12} />
                                    <View
                                        style={{
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Image
                                            source={{ uri: item.imageUrl }}
                                            resizeMode='contain'
                                            style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 5,
                                            }}
                                        />

                                        <View
                                            style={{
                                                flex: 1,
                                                marginLeft: 10,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}
                                            >

                                                <Text
                                                    numberOfLines={2}
                                                    style={{
                                                        fontFamily: 'PoppinsMedium',
                                                        fontSize: RFPercentage(1.9),
                                                        flex: 1,
                                                    }}
                                                >{item.productName}</Text>

                                            </View>

                                            {/* orderDate */}
                                            <Separator height={5} />
                                            <Text
                                                style={{
                                                    fontFamily: 'PoppinsSemiBold',
                                                    fontSize: RFPercentage(1.9),
                                                    color: Colors.INACTIVE_GREY,
                                                }}
                                            >
                                                {moment(item.orderedDate.toDate()).format('LLL')}
                                            </Text>

                                            <Separator height={5} />
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                {/* PRICE */}

                                                <Text
                                                    style={{
                                                        fontFamily: 'PoppinsMedium',
                                                        fontSize: RFPercentage(1.9),
                                                        paddingVertical: 5,
                                                    }}
                                                >₱{numeral(item.price).format('0,0.00')}</Text>

                                                {/* QUNATITY */}
                                                <Text
                                                    style={{
                                                        fontFamily: 'PoppinsMedium',
                                                        fontSize: RFPercentage(1.9),
                                                    }}
                                                >Qty: {item.quantity}</Text>

                                            </View>

                                            {/* TOTAL ALL */}
                                            <Separator height={10} />
                                            <View
                                                style={{
                                                    alignSelf: 'flex-end'
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'PoppinsSemiBold',
                                                        fontSize: RFPercentage(2),
                                                        // color: Colors.DEFAULT_YELLOW,
                                                    }}
                                                >Total: ₱{numeral(item.price * item.quantity + parseInt(item.deliveryFee)).format('0,0.00')}</Text>
                                            </View>

                                        </View>

                                    </View>

                                </View>
                            )}
                        />

                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_BG,
    }
})