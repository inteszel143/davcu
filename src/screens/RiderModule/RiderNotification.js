import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status, MyCart, General
} from '../../constants';
import numeral from 'numeral';
import { MaterialCommunityIcons, AntDesign, Fontisto, Ionicons } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';
import moment from 'moment';

export default function RiderNotification({ navigation }) {



    const [notifdata, setNotifData] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('riderNotif')
            .where("delivered", "==", 'No')
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    data.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
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


    function renderTop() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    paddingTop: 15,
                    paddingBottom: 8,
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left-thin" size={25} />
                </TouchableOpacity>
                <Text
                    style={{
                        fontFamily: "PoppinsSemiBold",
                        fontSize: RFPercentage(2.5),
                    }}
                >Notifications</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('BuyerSearch')}
                >
                    <Ionicons name="ellipsis-vertical" size={18} />
                </TouchableOpacity>
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
                                            paddingHorizontal: 20,
                                            paddingVertical: 25,
                                            marginHorizontal: 8,
                                            backgroundColor: Colors.DEFAULT_WHITE,
                                            borderWidth: 0.5,
                                            borderRadius: 5,
                                            borderColor: Colors.DEFAULT_WHITE,
                                            borderBottomColor: Colors.LIGHT_GREY2,
                                            backgroundColor: Colors.DEFAULT_WHITE,
                                            marginTop: 8,
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
                                                    borderColor: Colors.SECONDARY_GREEN,
                                                }}
                                            >
                                                <Fontisto name="bell-alt" size={15} color={Colors.DEFAULT_GREEN} />
                                            </View>

                                            {/* DATA    */}
                                            <View
                                                style={{
                                                    paddingHorizontal: 8,

                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'PoppinsSemiBold',
                                                        fontSize: RFPercentage(1.9),
                                                        paddingHorizontal: 15,
                                                    }}
                                                >New ready to ship order</Text>
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
                                                    Seller have new ready to ship orders. You can
                                                    <Text style={{ fontFamily: 'PoppinsSemiBold', color: Colors.SECONDARY_GREEN }} > Earn ₱{numeral(item.earn).format('0,0.00')} </Text>
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
                                                        {moment(item.toShipDate.toDate()).format('LLL')}
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
            <Separator height={27} />
            {renderTop()}
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