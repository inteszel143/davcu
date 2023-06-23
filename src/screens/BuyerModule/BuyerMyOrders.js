import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, ActivityIndicator, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';

import {
    Colors,
    Display,
    Separator, Animation, Status, MyCart, Header
} from '../../constants';

import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import numeral from 'numeral';
import { scale } from 'react-native-size-matters';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';
const emptyBox = require('../../../assets/Icon/magnifying-glass.png');
import BuyerFilterOrders from './BuyerConstant/BuyerFilterOrders';
import BuyerFilterPending from './BuyerConstant/BuyerFilterPending';
import BuyerFilterToShip from './BuyerConstant/BuyerFilterToShip';
import BuyerFilterDelivered from './BuyerConstant/BuyerFilterDelivered';
import BuyerFilterReview from './BuyerConstant/BuyerFilterReview';
import BuyerFilterReturn from './BuyerConstant/BuyerFilterReturn';

export default function BuyerMyOrders({ navigation }) {

    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const buyerId = firebase.auth().currentUser.uid;
    const [selected, setSelected] = useState(0);
    const [status, setStatus] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [total, setTotal] = useState(0);
    const [pending, setPending] = useState(0);
    const [toShip, setToShip] = useState(0);
    const [complete, setComplete] = useState(0);

    useEffect(() => {
        firebase.firestore()
            .collection('placeOrders')
            .where("buyerId", "==", buyerId)
            .get()
            .then(querySnapshot => {
                setTotal(querySnapshot.size);
            });
    }, []);

    useEffect(() => {
        firebase.firestore()
            .collection('placeOrders')
            .where("buyerId", "==", buyerId)
            .where("orderStatus", "==", "Pending")
            .get()
            .then(querySnapshot => {
                setPending(querySnapshot.size);
            });
    }, []);

    useEffect(() => {
        firebase.firestore()
            .collection('placeOrders')
            .where("buyerId", "==", buyerId)
            .where("orderStatus", "==", "To Ship")
            .get()
            .then(querySnapshot => {
                setToShip(querySnapshot.size);
            });
    }, []);

    useEffect(() => {
        firebase.firestore()
            .collection('placeOrders')
            .where("buyerId", "==", buyerId)
            .where("orderStatus", "==", "Completed")
            .where("rated", "==", 0)
            .get()
            .then(querySnapshot => {
                setComplete(querySnapshot.size);
            });
    }, []);


    const category = [
        {
            name: 'All',
            icon: 'chart-box-outline',
            data: 0,
        },
        {
            name: 'Pending',
            icon: 'clock-time-eight-outline',
            status: 'Pending',
            data: pending,
        },
        {
            name: 'To ship',
            icon: 'bike',
            status: 'To Ship',
            data: toShip,
        },
        {
            name: 'Delivered',
            icon: 'truck-fast-outline',
            status: 'Completed',
            data: complete,
        },
        {
            name: 'Review',
            icon: 'chat-processing-outline',
            status: 'Review',
            data: complete,
        },
        {
            name: 'Return',
            icon: 'keyboard-return',
            status: 'Return',
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
                    onPress={() => navigation.navigate('MainScreen')}
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
                    >Orders</Text>
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
                }}
            >
                <Separator height={5} />
                <View
                    style={{
                        paddingHorizontal: 20,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2.4),
                        }}
                    >Your orders</Text>

                </View>
                <Separator height={15} />
                <View
                    style={{
                        paddingHorizontal: 2,
                    }}
                >
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
                                        marginLeft: 38,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <MaterialCommunityIcons name={item.icon} size={26} />
                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsMedium',
                                            fontSize: RFPercentage(1.6),
                                        }}
                                    >{item.name}</Text>
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
                                {
                                    item.data != 0 && <View
                                        style={{
                                            position: 'absolute',
                                            top: 2,
                                            right: 0,
                                            width: 15,
                                            height: 15,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: Colors.DEFAULT_RED,
                                            borderRadius: 15,
                                        }} >
                                        <Text
                                            style={{
                                                color: Colors.DEFAULT_WHITE,
                                                fontFamily: 'PoppinsRegular',
                                                fontSize: RFPercentage(1.5),
                                            }}
                                        >{item.data}</Text>
                                    </View>
                                }
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <Separator height={5} />
            </View >
        )
    };


    function renderFilters() {
        if (selected === 0) {
            return (
                <BuyerFilterOrders />
            )
        }
        else if (selected === 1) {
            return (
                <BuyerFilterPending />
            )
        }
        else if (selected === 2) {
            return (
                <BuyerFilterToShip />
            )
        }
        else if (selected === 3) {
            return (
                <BuyerFilterDelivered />
            )
        }
        else if (selected === 4) {
            return (
                <BuyerFilterReview />
            )
        } else if (selected === 5) {
            return (
                <BuyerFilterReturn />
            )
        }
    }


    return (
        <View style={styles.container} >
            <Status />
            <Separator height={27} />
            {renderTop()}

            {renderCategory()}
            {renderFilters()}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE,
    }
})