import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, Animated, TextInput, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Status
} from '../../../constants';
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../../../config';
import numeral from 'numeral';
import moment from 'moment';

export default function SellerPendingOrders() {
    const navigation = useNavigation();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const deviceHeight = Dimensions.get('window').height

    const [loading, setLoading] = useState(true);
    const [newOrders, setNewOrders] = useState('');
    const userId = firebase.auth().currentUser.uid;


    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('placeOrders')
            .orderBy("orderedDate", 'asc')
            .onSnapshot(querySnapshot => {
                const data = [];

                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().sellerUid === userId) {
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


    if (loading) {
        return <View
            style={{
                flex: 1,
                alignItems: "center",
            }}
        >
            <ActivityIndicator size="small" color={Colors.DEFAULT_YELLOW2} />
        </View>;
    };

    return (
        <View style={styles.container} >
            <Status />
            {
                newOrders.length == 0 ? <View
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
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: Colors.DEFAULT_WHITE,
                                        paddingVertical: 15,
                                        marginHorizontal: 2,
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
                                                // alignItems: "center",
                                            }}
                                        >
                                            {/* <Ionicons name="list-outline" size={13} /> */}
                                            <Text
                                                style={{
                                                    fontFamily: 'PoppinsSemiBold',
                                                    fontSize: RFPercentage(1.8),
                                                    marginLeft: 5,
                                                }}
                                            >
                                                {item.orderStatus}
                                            </Text>
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

                                                {item.confirmed == 0 ? <View
                                                    style={{
                                                        height: 20,
                                                        width: 40,
                                                        backgroundColor: Colors.DEFAULT_YELLOW,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: 5,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: Colors.DEFAULT_WHITE,
                                                            fontSize: RFPercentage(2),
                                                        }}
                                                    >New</Text>
                                                </View>
                                                    :
                                                    <></>
                                                }
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

                                </TouchableOpacity>
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
    }
})