import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, FlatList, Alert } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../../constants';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import * as Location from 'expo-location';
import { EvilIcons, Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { scale } from 'react-native-size-matters';
import { firebase } from '../../../../config';
import numeral from 'numeral';
import moment from 'moment/moment';
const deviceHeight = Dimensions.get('window').height
const outOfStock = require('../../../../assets/images/needy.png');


export default function History({ navigation }) {

    const [newOrders, setNewOrders] = useState('');

    const riderID = firebase.auth().currentUser.uid;
    const [loading, setLoading] = useState(true);
    const [isToday, setToday] = useState('');
    const [todayCollected, setTodayCollected] = useState('');
    const currentData = moment(new Date()).format('LL');


    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('placeOrders')
            .orderBy("deliveryDate", 'desc')
            .onSnapshot(querySnapshot => {

                const data = [];

                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().riderID === riderID && documentSnapshot.data().orderStatus === 'Completed') {
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


    //GET TODAY
    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('placeOrders')
            .where("riderID", "==", firebase.auth().currentUser.uid)
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().deliveryDate === null) {
                        setToday('');
                    } else {
                        if (moment(documentSnapshot.data().deliveryDate.toDate()).format('LL') === currentData && documentSnapshot.data().orderStatus === 'Completed') {
                            data.push({
                                ...documentSnapshot.data(),
                                key: documentSnapshot.id,
                            });
                        }
                    }

                });
                setToday(data);
            });
        return () => { isMounted = false; subscriber() };
    }, []);

    // TOTAL COLLECTED
    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('placeOrders')
            .where("riderID", "==", firebase.auth().currentUser.uid)
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().deliveryDate === null) {
                        setTodayCollected('');
                    } else {
                        if (moment(documentSnapshot.data().deliveryDate.toDate()).format('LL') === currentData && documentSnapshot.data().orderStatus === 'Completed' && documentSnapshot.data().paymentMethod === "Cash on delivery") {
                            data.push({
                                ...documentSnapshot.data(),
                                key: documentSnapshot.id,
                            });
                        }
                    }
                });
                setTodayCollected(data);
            });
        return () => { isMounted = false; subscriber() };
    }, []);


    const totalEarn = (arrayData) => {
        try {
            let sum = 0;
            for (let i = 0; i < arrayData.length; i++) {
                sum += parseFloat(arrayData[i].deliveryFee);
            }
            return sum;
        } catch (error) {
            console.log(error);
        }
    };

    const totalCollected = (arrayData) => {
        try {
            let sum = 0;
            for (let i = 0; i < arrayData.length; i++) {
                sum += parseFloat(arrayData[i].totalPay);
            }
            return sum;
        } catch (error) {
            console.log(error);
        }
    }

    if (loading) {
        return <View
            style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: Colors.DEFAULT_WHITE,
            }}
        >
            <ActivityIndicator size="large" color={Colors.SECONDARY_GREEN} />
        </View>;
    };


    function renderDate() {
        return (
            <View
                style={{
                    paddingVertical: 20,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    marginTop: 10,
                    marginHorizontal: 10,
                    borderRadius: 8,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: 'space-around',
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons name="calendar-outline" size={20} />
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(2.3),
                            }}
                        >{moment().format('LL')}</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsBold",
                                fontSize: RFPercentage(2),
                                color: Colors.DEFAULT_GREEN,
                            }}
                        >Today</Text>
                    </View>

                </View>

            </View>
        )
    }


    function renderTopInfo() {
        return (
            <View
                style={{
                    paddingVertical: 20,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    marginTop: 15,
                    marginHorizontal: 10,
                    borderRadius: 8,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >

                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(1.8),
                                color: Colors.DARK_SIX,
                                marginBottom: 5,
                            }}
                        >
                            Deliveries
                        </Text>
                        <MaterialCommunityIcons name="briefcase-check" size={20} />
                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(2.4),
                                marginTop: 5,
                            }}
                        >
                            {isToday.length}
                        </Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(1.8),
                                color: Colors.DARK_SIX,
                                marginBottom: 5,
                            }}
                        >
                            Earnings
                        </Text>

                        <MaterialCommunityIcons name="credit-card-check-outline" size={20} />

                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(2.4),
                                marginTop: 5,
                            }}
                        >₱{numeral(totalEarn(isToday)).format('0,0.00')}
                        </Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(1.8),
                                color: Colors.DARK_SIX,
                                marginBottom: 5,
                            }}
                        >
                            Collected
                        </Text>

                        <MaterialCommunityIcons name="hand-coin" size={20} />

                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(2.4),
                                marginTop: 5,
                            }}
                        >
                            ₱{numeral(totalCollected(todayCollected)).format('0,0.00')}
                        </Text>
                    </View>

                </View>
            </View>
        )
    };


    function renderAllDelivery() {
        return (
            <View
                style={{
                    flex: 1,
                    paddingVertical: 20,
                    paddingHorizontal: 15,
                    marginHorizontal: 10,
                    borderRadius: 5,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    marginTop: 15,
                }}
            >

                <Text
                    style={{
                        fontFamily: "PoppinsSemiBold",
                        fontSize: RFPercentage(2),
                    }}
                >
                    All Deliveries
                </Text>

                {
                    newOrders.length == 0 ? <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {/* RENDER IMAGE */}
                        <View
                            style={{
                                marginTop: deviceHeight / 6,
                            }}
                        >
                            <Image
                                source={outOfStock}
                                resizeMode='contain'
                                style={{
                                    width: 50,
                                    height: 50,
                                    tintColor: Colors.INACTIVE_GREY,
                                }}
                            />
                        </View>

                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 40,
                                marginTop: 15,
                            }}
                        >

                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >
                                No! delivered history
                            </Text>

                        </View>

                    </View>
                        :
                        <FlatList
                            data={newOrders}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        paddingHorizontal: 5,
                                    }}
                                >
                                    <View
                                        style={{
                                            marginTop: 20,
                                            flexDirection: "row",
                                        }}
                                    >
                                        <Ionicons name="card-outline" size={18} />
                                        <View
                                            style={{
                                                flex: 1,
                                                marginLeft: 15,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: "PoppinsSemiBold",
                                                    fontSize: RFPercentage(1.9),
                                                }}
                                            >{item.key}(#{item.orderID})</Text>
                                            <Text
                                                style={{
                                                    fontFamily: "PoppinsRegular",
                                                    fontSize: RFPercentage(1.7),
                                                    color: Colors.DARK_SIX,
                                                    marginTop: 5,
                                                }}
                                            >
                                                Finished at {moment(item.deliveryDate.toDate()).startOf('hour').fromNow()}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY2, marginTop: 15, }} />
                                </View>


                            )}

                        />

                }


            </View>
        )
    }



    return (
        <View style={styles.container} >
            <Status />
            {/* <Separator height={27} /> */}

            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 40,
                    paddingBottom: 5,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2.7),
                    }}
                >
                    History
                </Text>
            </View>

            {renderDate()}
            {renderTopInfo()}

            {renderAllDelivery()}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})