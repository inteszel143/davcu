import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, ActivityIndicator, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Colors, Separator, Display, Status } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import SellerPendingOrders from './SellerConstant/SellerPendingOrders';
import SellerUnpaidOrders from './SellerConstant/SellerUnpaidOrders';
import SellerToShipOrders from './SellerConstant/SellerToShipOrders';
import SellerShippedOrders from './SellerConstant/SellerShippedOrders';
import SellerCompletedOrders from './SellerConstant/SellerCompletedOrders';
import { firebase } from '../../../config';
export default function SellerOrders({ navigation }) {

    const [selected, setSelected] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalToShip, setTotalToShip] = useState(0);
    const [totalComplete, setTotalComplete] = useState(0);

    // PENDING ORDERS
    useEffect(() => {
        let isMounted = true;
        firebase.firestore()
            .collection('placeOrders')
            .where('sellerUid', '==', firebase.auth().currentUser.uid)
            .where('orderStatus', '==', 'Pending')
            // .where('orderStatus', "in", ['Pending', 'Process'])
            .get()
            .then(querySnapshot => {
                setTotalOrders(querySnapshot.size);
            });
        // Stop listening for updates when no longer required
        return () => { isMounted = false; };
    }, []);

    // TO SHIP ORDERS
    useEffect(() => {
        let isMounted = true;
        firebase.firestore()
            .collection('placeOrders')
            .where('sellerUid', '==', firebase.auth().currentUser.uid)
            .where('orderStatus', '==', 'To Ship')
            // .where('orderStatus', "in", ['Pending', 'Process'])
            .get()
            .then(querySnapshot => {
                setTotalToShip(querySnapshot.size);
            });
        // Stop listening for updates when no longer required
        return () => { isMounted = false; };
    }, []);


    //COMPLETE ORDERS
    useEffect(() => {
        let isMounted = true;
        firebase.firestore()
            .collection('placeOrders')
            .where('sellerUid', '==', firebase.auth().currentUser.uid)
            .where('orderStatus', '==', 'Completed')
            // .where('orderStatus', "in", ['Pending', 'Process'])
            .get()
            .then(querySnapshot => {
                setTotalComplete(querySnapshot.size);
            });
        // Stop listening for updates when no longer required
        return () => { isMounted = false; };
    }, []);


    const category = [
        {
            name: 'All',
            //icon: 'chart-box-outline',
            data: 0,
        },
        {
            name: 'Unpaid',
            // icon: 'clock-time-eight-outline',
            //status: 'Pending',
            data: totalOrders,
        },
        {
            name: 'To Ship',
            // icon: 'bike',
            // status: 'To Ship',
            data: totalToShip,
        },
        {
            name: 'Shipped',
            // icon: 'truck-fast-outline',
            //: 'Completed',
            data: 0,
        },
        {
            name: 'Completed',
            //icon: 'chat-processing-outline',
            //status: 'Review',
            data: totalComplete,
        },
        {
            name: 'Cancellations',
            //icon: 'keyboard-return',
            // status: 'Return',
            data: 0,
        },
    ];


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
                    onPress={() => navigation.replace('SellerMainScreen')}
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
                    >Manage orders</Text>
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

    function renderCategory() {
        return (
            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                    paddingVertical: 10,

                }}
            >
                <Separator height={7} />
                <FlatList
                    data={category}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            key={index}
                            onPress={() => setSelected(index)}
                        >
                            <View
                                style={{
                                    marginLeft: 15,
                                    paddingHorizontal: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(1.9),
                                        color: selected === index ? Colors.DEFAULT_YELLOW2 : Colors.DEFAULT_BLACK,
                                    }}
                                >{item.name}
                                    {
                                        item.data === 0 ? "" : <Text style={{ color: selected === index ? Colors.DEFAULT_YELLOW2 : Colors.INACTIVE_GREY }} >({item.data})</Text>
                                    }
                                </Text>
                                <Separator height={6} />

                                {
                                    selected === index && <View
                                        style={{
                                            position: 'absolute',
                                            alignSelf: 'center',
                                            bottom: 0,
                                            width: 10,
                                            height: 2,
                                            backgroundColor: Colors.DEFAULT_YELLOW2,
                                            borderRadius: 15,
                                        }}
                                    />
                                }
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    };

    function renderFilter() {
        if (selected === 0) {
            return (
                <SellerPendingOrders />
            )
        } else if (selected === 1) {
            return (
                <SellerUnpaidOrders />
            )
        } else if (selected === 2) {
            return (
                <SellerToShipOrders />
            )
        } else if (selected === 3) {
            return (
                <SellerShippedOrders />
            )
        } else if (selected === 4) {
            return (
                <SellerCompletedOrders />
            )
        }
    }



    return (
        <View style={styles.container} >
            <Status />
            <Separator height={27} />
            {renderTop()}
            {renderCategory()}
            {renderFilter()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_BG,
    }
})