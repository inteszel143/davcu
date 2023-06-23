import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Colors,
    Display,
    Separator, Animation, Status, MyCart, Header
} from '../../../constants';

import { Entypo, MaterialIcons, MaterialCommunityIcons, FontAwesome5, AntDesign, Ionicons } from 'react-native-vector-icons';
import numeral from 'numeral';
import { scale } from 'react-native-size-matters';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../../config';
const emptyBox = require('../../../../assets/Icon/magnifying-glass.png');
import { useNavigation } from '@react-navigation/native';

export default function BuyerFilterOrders() {

    const navigation = useNavigation();
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('placeOrders')
            .orderBy("orderedDate", 'desc')
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().buyerId === firebase.auth().currentUser.uid) {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,

                        });
                    }
                });
                setOrderData(data);
                setLoading(false);
            });
        return () => { isMounted = false; subscriber() };
    }, []);


    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.DEFAULT_BG,
                }}
            >
                <View
                    style={{
                        backgroundColor: Colors.DEFAULT_WHITE,
                        paddingVertical: 15,
                        height: Display.setHeight(25),
                        paddingHorizontal: 15,
                        borderRadius: 10,
                        marginTop: 10,
                        marginHorizontal: 8,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: 10,
                                    backgroundColor: Colors.DEFAULT_BG2,
                                }}
                            />

                            <View
                                style={{
                                    width: Display.setWidth(20),
                                    height: Display.setHeight(1.5),
                                    borderRadius: 5,
                                    marginLeft: 5,
                                    backgroundColor: Colors.DEFAULT_BG2,
                                }}
                            />

                        </View>

                        <View
                            style={{
                                width: Display.setWidth(20),
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                    </View>

                    <View
                        style={{
                            marginTop: 15,
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                        <View
                            style={{
                                flex: 1,
                                marginLeft: 15,
                            }}
                        >
                            <View
                                style={{
                                    marginTop: 15,
                                    width: Display.setWidth(55),
                                    height: Display.setHeight(1.5),
                                    borderRadius: 5,
                                    backgroundColor: Colors.DEFAULT_BG2,
                                }}
                            />

                            <View
                                style={{
                                    marginTop: 15,
                                    width: Display.setWidth(55),
                                    height: Display.setHeight(1.5),
                                    borderRadius: 5,
                                    backgroundColor: Colors.DEFAULT_BG2,
                                }}
                            />
                            <View
                                style={{
                                    marginTop: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View
                                    style={{
                                        width: Display.setWidth(20),
                                        height: Display.setHeight(1.5),
                                        borderRadius: 5,
                                        backgroundColor: Colors.DEFAULT_BG2,
                                    }}
                                />

                                <View
                                    style={{
                                        width: Display.setWidth(20),
                                        height: Display.setHeight(1.5),
                                        borderRadius: 5,
                                        backgroundColor: Colors.DEFAULT_BG2,
                                    }}
                                />

                            </View>

                            <View
                                style={{
                                    marginTop: 15,
                                }}
                            >
                                <View
                                    style={{
                                        width: Display.setWidth(40),
                                        height: Display.setHeight(1.5),
                                        borderRadius: 5,
                                        backgroundColor: Colors.DEFAULT_BG2,
                                    }}
                                />
                            </View>
                        </View>

                    </View>

                </View>
                <View
                    style={{
                        backgroundColor: Colors.DEFAULT_WHITE,
                        paddingVertical: 15,
                        height: Display.setHeight(25),
                        paddingHorizontal: 15,
                        borderRadius: 10,
                        marginTop: 10,
                        marginHorizontal: 8,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: 10,
                                    backgroundColor: Colors.DEFAULT_BG2,
                                }}
                            />

                            <View
                                style={{
                                    width: Display.setWidth(20),
                                    height: Display.setHeight(1.5),
                                    borderRadius: 5,
                                    marginLeft: 5,
                                    backgroundColor: Colors.DEFAULT_BG2,
                                }}
                            />

                        </View>

                        <View
                            style={{
                                width: Display.setWidth(20),
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                    </View>

                    <View
                        style={{
                            marginTop: 15,
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                        <View
                            style={{
                                flex: 1,
                                marginLeft: 15,
                            }}
                        >
                            <View
                                style={{
                                    marginTop: 15,
                                    width: Display.setWidth(55),
                                    height: Display.setHeight(1.5),
                                    borderRadius: 5,
                                    backgroundColor: Colors.DEFAULT_BG2,
                                }}
                            />

                            <View
                                style={{
                                    marginTop: 15,
                                    width: Display.setWidth(55),
                                    height: Display.setHeight(1.5),
                                    borderRadius: 5,
                                    backgroundColor: Colors.DEFAULT_BG2,
                                }}
                            />
                            <View
                                style={{
                                    marginTop: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View
                                    style={{
                                        width: Display.setWidth(20),
                                        height: Display.setHeight(1.5),
                                        borderRadius: 5,
                                        backgroundColor: Colors.DEFAULT_BG2,
                                    }}
                                />

                                <View
                                    style={{
                                        width: Display.setWidth(20),
                                        height: Display.setHeight(1.5),
                                        borderRadius: 5,
                                        backgroundColor: Colors.DEFAULT_BG2,
                                    }}
                                />

                            </View>

                            <View
                                style={{
                                    marginTop: 15,
                                }}
                            >
                                <View
                                    style={{
                                        width: Display.setWidth(40),
                                        height: Display.setHeight(1.5),
                                        borderRadius: 5,
                                        backgroundColor: Colors.DEFAULT_BG2,
                                    }}
                                />
                            </View>
                        </View>

                    </View>

                </View>

            </View>
        )
    };



    return (
        <View style={styles.container} >
            {
                orderData.length == 0 ? <View
                    style={{
                        marginTop: Display.setHeight(18),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={emptyBox}
                        resizeMode='contain'
                        style={{
                            width: 90,
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
                    <FlatList
                        style={{
                            height: Display.setHeight(81)
                        }}
                        data={orderData}
                        // showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.DEFAULT_WHITE,
                                    paddingVertical: 15,
                                    paddingHorizontal: 15,
                                    borderRadius: 10,
                                    marginTop: 10,
                                    marginHorizontal: 8,
                                }}
                                onPress={() => {
                                    navigation.navigate('BuyerOrderDetails', {
                                        orderKey: item.key,
                                    })
                                }}
                            >

                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: 5,

                                }} >

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                        <View
                                            style={{
                                                backgroundColor: Colors.LIGHT_GREY,
                                                height: 30,
                                                width: 30,
                                                borderRadius: 30,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <MaterialCommunityIcons name='store-marker-outline' size={16} />
                                        </View>

                                        <Text style={{
                                            fontFamily: 'PoppinsSemiBold',
                                            fontSize: RFPercentage(1.9),
                                            paddingHorizontal: 5,
                                        }} >{item.storeName}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >

                                        <Ionicons name='cube' size={15} />
                                        <Text style={{
                                            fontFamily: 'PoppinsSemiBold',
                                            fontSize: RFPercentage(1.8),
                                            marginLeft: 3,
                                            // color: item.orderStatus === "Completed" ? Colors.DEFAULT_GREEN : Colors.DEFAULT_YELLOW,
                                        }} >{item.orderStatus}</Text>
                                    </View>
                                </View>




                                {
                                    item.orderStatus === 'Completed' && <TouchableOpacity
                                        style={{
                                            borderRadius: 5,
                                            marginTop: 15,
                                            backgroundColor: Colors.DEFAULT_BG,
                                            paddingVertical: 5,
                                            justifyContent: 'center',
                                            paddingHorizontal: 15,
                                        }}
                                        onPress={() => {
                                            navigation.navigate('BuyerOrderStatus', {
                                                orderKey: item.key,
                                            })
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View>
                                                <MaterialCommunityIcons name='truck-fast-outline' size={20} color={Colors.DEFAULT_GREEN} />
                                            </View>

                                            <View
                                                style={{
                                                    flex: 1,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                {
                                                    item.orderedDate && <Text
                                                        style={{
                                                            fontFamily: 'PoppinsSemiBold',
                                                            fontSize: RFPercentage(1.9),
                                                            color: Colors.DEFAULT_GREEN,
                                                        }}
                                                    >{item.orderedDate.toDate().toDateString()} Delivered</Text>
                                                }

                                                <Text
                                                    style={{
                                                        fontFamily: 'PoppinsMedium',
                                                        fontSize: RFPercentage(1.7),
                                                        color: Colors.DARK_SEVEN,
                                                        marginTop: 5,
                                                    }}
                                                >
                                                    The package was delivered!
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <AntDesign name='right' size={13} />
                                            </View>

                                        </View>

                                    </TouchableOpacity>
                                }



                                <View
                                    style={{
                                        flexDirection: 'row',
                                        paddingHorizontal: 5,
                                        marginTop: 20,
                                    }}
                                >

                                    {/* IMAGE */}
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('ProductDetails', {
                                            productId: item.productUid,
                                            sellerId: item.sellerUid,
                                        })}
                                    >
                                        <View>
                                            <Image
                                                source={{ uri: item.imageUrl }}
                                                resizeMode='contain'
                                                style={{
                                                    height: 85,
                                                    width: 85,
                                                }}
                                            />

                                        </View>
                                    </TouchableOpacity>

                                    {/* DATA */}
                                    <View
                                        style={{
                                            flex: 1,
                                            marginLeft: 10,
                                        }}
                                    >

                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontFamily: 'PoppinsMedium',
                                                fontSize: RFPercentage(1.9),
                                            }}
                                        >{item.productName}</Text>

                                        {
                                            item.orderedDate && <Text
                                                style={{
                                                    fontSize: RFPercentage(1.9),
                                                    fontFamily: 'PoppinsSemiBold',
                                                    color: Colors.DARK_SIX,
                                                    paddingVertical: 10,
                                                }}
                                            >{item.orderedDate.toDate().toDateString() + ' - ' + item.orderedDate.toDate().toLocaleTimeString('en-US')}</Text>
                                        }




                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'PoppinsSemiBold',
                                                    fontSize: RFPercentage(1.9),
                                                    // color: Colors.DEFAULT_YELLOW,
                                                }}
                                            >
                                                ₱ {numeral(item.price).format('0,0.00')}
                                            </Text>

                                            <Text
                                                style={{
                                                    fontFamily: 'PoppinsSemiBold',
                                                    fontSize: RFPercentage(1.9),
                                                    marginRight: 10,

                                                }}
                                            >QTY: {item.quantity}</Text>

                                        </View>
                                        <Separator height={15} />
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
                                            >Total: ₱{numeral(item.totalPay).format('0,0.00')}</Text>
                                        </View>
                                    </View>

                                </View>


                            </TouchableOpacity>
                        )}

                    />
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