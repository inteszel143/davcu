import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Image, ActivityIndicator, Modal, ScrollView } from 'react-native'

import React, { useEffect, useState } from 'react';
import { Colors, Separator, Status, Display } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { SimpleLineIcons, Ionicons, Feather, Fontisto, MaterialCommunityIcons, AntDesign } from 'react-native-vector-icons';
import numeral from 'numeral';
import { firebase } from '../../../config';
import Messaging from './BuyerConstant/Messaging';
import ShoppingCart from './BuyerConstant/ShoppingCart';

export default function ShippingAddress({ navigation }) {


    const buyerId = firebase.auth().currentUser.uid;
    const [modalVisible, setModalVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const [addressData, setAddressData] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('buyerAddress')
            .orderBy("default", "desc")
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().buyerId === buyerId) {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }
                });
                setAddressData(data);
                setLoading(false);
            });
        return () => { isMounted = false; subscriber() };
    }, []);



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
                    marginTop: 5,
                    paddingVertical: 10,
                    // backgroundColor: Colors.DEFAULT_WHITE,
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
                    >Shipping info</Text>
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



    function renderContent() {
        return (
            <View
                style={{
                    marginTop: 5,
                }}
            >
                {
                    addressData.map((item, i) => (
                        <View
                            key={i}
                            style={{
                                paddingVertical: 20,
                                paddingHorizontal: 15,
                                // backgroundColor: "#FFF5E9",
                                borderWidth: 0.9,
                                borderColor: Colors.LIGHT_GREY2,
                                marginTop: 15,
                                marginHorizontal: 12,
                                backgroundColor: item.default === true ? Colors.DEFAULT_BG : Colors.DEFAULT_WHITE,
                                borderRadius: 6,
                            }}
                        >
                            {/* TOP */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Feather name='map-pin' size={14} color={item.default === true ? Colors.DEFAULT_YELLOW2 : Colors.DEFAULT_BLACK} />
                                <Text
                                    style={{
                                        flex: 1,
                                        // color: Colors.DEFAULT_YELLOW2,
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(2),
                                        marginLeft: 10,
                                    }}
                                >{item.fullName}</Text>
                                {/* <Ionicons name='checkmark-circle-outline' size={23} /> */}

                                <TouchableOpacity
                                    style={{
                                        marginRight: 10,
                                    }}
                                    onPress={() => {
                                        navigation.navigate('BuyerUpdateAddress', {
                                            addressKey: item.key,
                                        })
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsSemiBold',
                                            fontSize: RFPercentage(2),
                                        }}
                                    >Edit</Text>
                                </TouchableOpacity>
                            </View>
                            <Separator height={10} />
                            {/* MIDDLE */}
                            <View>
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsMedium',
                                        fontSize: RFPercentage(1.9),
                                        paddingHorizontal: 20,
                                    }}
                                >(+63){item.phoneNumber.substring(0, 2)}******{item.phoneNumber.substring(8, 11)}</Text>
                            </View>
                            {/* ADDRESS */}
                            <View
                                style={{
                                    paddingRight: 30,
                                    paddingLeft: 20,
                                    marginTop: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsMedium',
                                        fontSize: RFPercentage(1.9),
                                        color: Colors.DARK_SIX,
                                    }}
                                >{item.addressInfo}, {item.barangay}, {item.city}, {item.province}, {item.region}</Text>
                            </View>

                            <Separator height={15} />
                            {/* DEFAULT */}
                            {
                                item.default === true && <View
                                    style={{
                                        width: Display.setWidth(16),
                                        height: Display.setHeight(2.5),
                                        backgroundColor: Colors.DEFAULT_BG2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 15,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsMedium',
                                            fontSize: RFPercentage(1.6),
                                            color: Colors.DEFAULT_GREEN,
                                        }}
                                    >Default</Text>
                                </View>
                            }

                        </View>
                    ))
                }
            </View>
        )
    };

    function renderAdd() {
        return (
            <View
                style={{
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: Display.setWidth(90),
                        height: Display.setHeight(6.5),
                        justifyContent: 'center',
                        borderRadius: 8,
                        borderWidth: 0.8,
                        borderColor: Colors.LIGHT_GREY2,
                        backgroundColor: Colors.DEFAULT_WHITE,
                    }}
                    onPress={() => navigation.navigate('BuyerEditLocation')}
                >
                    <AntDesign name='pluscircleo' size={16} />
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            marginLeft: 10,
                            // color: Colors.DARK_SIX,
                        }}
                    >Add new address</Text>
                </TouchableOpacity>
            </View>
        )
    }




    return (
        <View style={styles.container} >
            <Separator height={27} />
            {renderTop()}
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 50,
                }}
                showsVerticalScrollIndicator={false}
            >
                {renderContent()}
                {renderAdd()}
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