import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status, MyCart, General
} from '../../constants';
import { MaterialCommunityIcons, AntDesign, Fontisto } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';
import moment from 'moment';

export default function SellerNotification({ navigation }) {


    const sellerId = firebase.auth().currentUser.uid;
    const [notifdata, setNotifData] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('sellerNotif')
            .orderBy("deliveryDate", 'desc')
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().sellerId === sellerId) {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }
                });
                setNotifData(data);
                setLoading(false);

            });
        return () => { isMounted = false; subscriber() };
    }, []);


    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                <ActivityIndicator size={'large'} color={Colors.DEFAULT_YELLOW2} />
            </View>
        )
    };


    function renderHeader() {
        return (
            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                    borderWidth: 0.5,
                    borderColor: Colors.LIGHT_GREY2,
                }}
            >
                <Separator height={32} />
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 13,
                        paddingVertical: 8,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            alignItems: "center",
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <AntDesign name='arrowleft' size={22} style={{ marginBottom: 3 }} />
                    </TouchableOpacity>

                    <View
                        style={{
                            marginLeft: 6,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2.6),
                            }}
                        >Notifications</Text>
                    </View>
                    <View
                        style={{
                            height: 22,
                            width: 22,
                        }}
                    >

                    </View>
                </View>

            </View>
        )
    };

    function renderContent() {
        return (
            <View>


                {
                    notifdata.length === 0 ? <View
                        style={{
                            marginTop: Display.setHeight(35),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <MaterialCommunityIcons name='bell-alert-outline' size={55} color={Colors.DARK_SIX} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: RFPercentage(1.9),
                                color: Colors.DARK_SIX,
                                marginTop: 10,
                            }}
                        >No new notification</Text>
                    </View>
                        :
                        <View>
                            <FlatList
                                data={notifdata}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={{
                                            paddingHorizontal: 15,
                                            paddingVertical: 20,
                                            marginHorizontal: 15,
                                            backgroundColor: Colors.DEFAULT_WHITE,
                                            borderWidth: 0.5,
                                            borderRadius: 8,
                                            borderColor: Colors.DEFAULT_WHITE,
                                            borderBottomColor: Colors.LIGHT_GREY2,
                                            backgroundColor: Colors.DEFAULT_WHITE,
                                            marginTop: 10,
                                        }}
                                    // onPress={() => navigation.navigate('BuyerOrders')}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                            }}
                                        >
                                            {/* IMAGE */}
                                            <View
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    // backgroundColor: Colors.LIGHT_GREY2,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 20,
                                                    marginLeft: 3,
                                                    borderWidth: 0.5,
                                                    borderColor: Colors.DEFAULT_YELLOW2,
                                                }}
                                            >
                                                <Fontisto name="bell-alt" size={15} color={Colors.DEFAULT_YELLOW2} />
                                            </View>

                                            {/* DATA    */}
                                            <View
                                                style={{
                                                    paddingHorizontal: 5,

                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'PoppinsSemiBold',
                                                        fontSize: RFPercentage(2),
                                                        paddingHorizontal: 15,
                                                    }}
                                                >You have new order</Text>
                                                <Separator height={5} />
                                                <Text
                                                    style={{
                                                        // flex: 1,
                                                        fontFamily: 'PoppinsRegular',
                                                        fontSize: RFPercentage(1.9),
                                                        paddingHorizontal: 15,
                                                        paddingRight: 25,
                                                    }}
                                                >
                                                    Customer have been placed an ordered.
                                                    <Text style={{ fontFamily: 'PoppinsSemiBold' }} > {item.productName} </Text>
                                                    (Please check order detail's now)
                                                </Text>
                                                <Separator height={10} />
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontFamily: 'PoppinsRegular',
                                                            fontSize: RFPercentage(1.7),
                                                            color: Colors.INACTIVE_GREY,
                                                            paddingHorizontal: 15,
                                                        }}
                                                    >
                                                        {moment(item.deliveryDate.toDate()).format('LLL')}
                                                    </Text>


                                                </View>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                }

            </View>
        )
    }


    return (
        <View style={styles.container} >
            <Status />
            {renderHeader()}

            {renderContent()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE,
    }
})