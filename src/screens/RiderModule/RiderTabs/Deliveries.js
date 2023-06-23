import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../../constants';
import { EvilIcons, Ionicons, Feather } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../../config';
import moment from 'moment';
import numeral from 'numeral';

const storeLogo = require('../../../../assets/images/retail-store-icon.jpg');
const customer = require('../../../../assets/images/businessman.png');
const EmptyOrders = require('../../../../assets/images/needy.png');

const timeIn = require('../../../../assets/Icon/back-in-time.png');

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

export default function Deliveries({ navigation }) {

    const [newOrders, setNewOrders] = useState('');
    const [riderData, setRideData] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('placeOrders')
            .orderBy("orderedDate", 'desc')
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {

                    if (documentSnapshot.data().orderStatus === 'To Ship' || documentSnapshot.data().orderStatus === 'Waiting') {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }

                });
                setNewOrders(data);
                // setLoading(false);

            });
        return () => { isMounted = false; subscriber() };
    }, []);


    //RIDER DATA
    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('Riders')
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot(documentSnapshot => {
                setRideData(documentSnapshot.data());
                setLoading(false);
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);


    function riderTimeIn() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >

                <Image
                    source={timeIn}
                    resizeMode='contain'
                    style={{
                        width: 60,
                        height: 60,
                    }}
                />

                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2.5),
                        color: Colors.DARK_THREE,
                        marginTop: 15,
                        textAlign: 'center',
                        paddingHorizontal: 40,
                    }}
                >We're sorry,</Text>
                <Text
                    style={{
                        fontFamily: 'PoppinsMedium',
                        fontSize: RFPercentage(2),
                        textAlign: 'center',
                        color: Colors.DARK_SIX,
                        paddingHorizontal: 40,
                        marginTop: 4,
                    }}
                >
                    In order to retrieve the relevant data, you need to time-in first
                </Text>

            </View>
        )
    }


    function renderOrders() {
        return (
            newOrders.length === 0 ? <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: deviceHeight / 4,
                }}
            >
                <Image
                    source={EmptyOrders}
                    resizeMode='contain'
                    style={{
                        width: 80,
                        height: 80,
                    }}
                />

                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2.5),
                        color: Colors.DARK_THREE,
                        marginTop: 30,
                        textAlign: 'center',
                        paddingHorizontal: 40,
                    }}
                >We're sorry, </Text>
                <Text
                    style={{
                        fontFamily: 'PoppinsMedium',
                        fontSize: RFPercentage(2),
                        textAlign: 'center',
                        color: Colors.INACTIVE_GREY,
                        paddingHorizontal: 30,
                    }}
                >
                    but we couldn't retrieve any orders at this moment.
                </Text>
            </View>
                :
                <FlatList
                    data={newOrders}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{
                                marginHorizontal: 15,
                                marginTop: 10,
                                borderTopRightRadius: 6,
                                borderTopLeftRadius: 6,
                                backgroundColor: Colors.DEFAULT_WHITE,
                            }}
                            disabled={riderData.validate === 0 ? true : false}
                            onPress={() => navigation.navigate('RiderPickOrder', {
                                orderKey: item.key,
                                sellerId: item.sellerUid,
                                buyerId: item.buyerId,
                            })}
                        >

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    backgroundColor: Colors.SECONDARY_GREEN,
                                    borderTopRightRadius: 6,
                                    borderTopLeftRadius: 6,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(1.8),
                                        color: Colors.DEFAULT_WHITE,
                                    }}
                                >Earn: ₱ {numeral(item.deliveryFee).format('0,0.00')}</Text>
                                <Feather name="maximize" size={14} color={Colors.DEFAULT_WHITE} />
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                }}
                            >
                                <View>
                                    <Image
                                        source={storeLogo}
                                        resizeMode='contain'
                                        style={{
                                            width: 42,
                                            height: 42,
                                        }}
                                    />
                                </View>

                                <View
                                    style={{
                                        flex: 1,
                                        paddingHorizontal: 15,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsSemiBold',
                                            fontSize: RFPercentage(2),
                                            marginLeft: 4,
                                        }}
                                    >
                                        {item.storeName}
                                    </Text>
                                    <Separator height={5} />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Ionicons name='location' size={16} color={Colors.SECONDARY_GREEN} />
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontFamily: 'PoppinsMedium',
                                                fontSize: RFPercentage(1.8),
                                                marginLeft: 5,
                                            }}
                                        >
                                            {item.shopLocation}
                                        </Text>
                                    </View>
                                    <Separator height={10} />
                                </View>
                            </View>
                            <View style={{ borderWidth: 0.3, borderColor: Colors.LIGHT_GREY2, marginHorizontal: 15, }} />

                            {/* Second phase */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                }}
                            >
                                <View
                                    style={{
                                        marginLeft: 4,
                                    }}
                                >
                                    <Image
                                        source={customer}
                                        resizeMode='contain'
                                        style={{
                                            width: 35,
                                            height: 35,
                                        }}
                                    />
                                </View>

                                <View
                                    style={{
                                        flex: 1,
                                        paddingHorizontal: 17,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsSemiBold',
                                            fontSize: RFPercentage(2),
                                            marginLeft: 4,
                                        }}
                                    >
                                        {item.fullName} (Drop-off)
                                    </Text>
                                    <Separator height={5} />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Ionicons name='location' size={16} color={Colors.SECONDARY_GREEN} />
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontFamily: 'PoppinsMedium',
                                                fontSize: RFPercentage(1.8),
                                                marginLeft: 5,
                                            }}
                                        >
                                            {item.shippingAddress}
                                        </Text>
                                    </View>
                                    <Separator height={10} />
                                </View>
                            </View>
                            <View style={{ borderWidth: 0.3, borderColor: Colors.LIGHT_GREY2, marginHorizontal: 15, }} />

                        </TouchableOpacity>

                    )}
                />
        )
    };
    return (
        <View style={styles.container} >
            <Status />

            <Separator height={27} />

            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 20,
                    paddingBottom: 5,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2.7),
                    }}
                >
                    New orders
                </Text>
            </View>
            {
                riderData.ready == 1 ? <View>
                    {renderOrders()}
                </View>
                    :
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {riderTimeIn()}
                    </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})