import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Image, ActivityIndicator, Modal } from 'react-native'

import React, { useEffect, useState } from 'react';
import { Colors, Separator, Status, Display, General } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import { firebase } from '../../../config';
import Messaging from './BuyerConstant/Messaging';
import ShoppingCart from './BuyerConstant/ShoppingCart';

const { width, height } = Dimensions.get('screen');
const cardWidth = width / 2.2;
const ads = require('../../../assets/Icons/ad3.png');


export default function CategoryPage({ navigation }) {


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
                    >Categories</Text>
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


    function renderAdvertise() {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                }}
            >
                <Image
                    source={ads}
                    resizeMode='center'
                    style={{
                        width: Display.setWidth(90),
                        height: 150,
                        borderRadius: 15,
                    }}
                />
            </View>
        )
    }

    function renderCategory() {
        return (
            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        marginTop: 25,
                    }}
                >

                    <TouchableOpacity
                        style={{
                            width: cardWidth,
                            borderWidth: 0.5,
                            borderColor: Colors.LIGHT_GREY2,
                            paddingVertical: 15,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                backgroundColor: '#F9FBFC',
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/images/Icons2/bag.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                }}
                            />
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    marginTop: 5,
                                }}
                            >Bags</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={{
                            width: cardWidth,
                            borderWidth: 0.5,
                            borderColor: Colors.LIGHT_GREY2,
                            paddingVertical: 15,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                backgroundColor: '#F9FBFC',
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/images/Icons2/clothes2.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                }}
                            />
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    marginTop: 5,
                                }}
                            >Costume</Text>
                        </View>
                    </TouchableOpacity>

                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        marginTop: 15,
                    }}
                >

                    <TouchableOpacity
                        style={{
                            width: cardWidth,
                            borderWidth: 0.5,
                            borderColor: Colors.LIGHT_GREY2,
                            paddingVertical: 15,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                backgroundColor: '#F9FBFC',
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/images/Icons2/necklace.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                }}
                            />
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    marginTop: 5,
                                }}
                            >Accessories</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={{
                            width: cardWidth,
                            borderWidth: 0.5,
                            borderColor: Colors.LIGHT_GREY2,
                            paddingVertical: 15,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                backgroundColor: '#F9FBFC',
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/images/Icons2/basket.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                }}
                            />
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    marginTop: 5,
                                }}
                            >Basket</Text>
                        </View>
                    </TouchableOpacity>

                </View>


                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        marginTop: 15,
                    }}
                >

                    <TouchableOpacity
                        style={{
                            width: cardWidth,
                            borderWidth: 0.5,
                            borderColor: Colors.LIGHT_GREY2,
                            paddingVertical: 15,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                backgroundColor: '#F9FBFC',
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/images/Icons2/sneakers.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                }}
                            />
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    marginTop: 5,
                                }}
                            >Footwear</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={{
                            width: cardWidth,
                            borderWidth: 0.5,
                            borderColor: Colors.LIGHT_GREY2,
                            paddingVertical: 15,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                backgroundColor: '#F9FBFC',
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/images/Icons2/easel.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                }}
                            />
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    marginTop: 5,
                                }}
                            >Painting</Text>
                        </View>
                    </TouchableOpacity>

                </View>

            </View>
        )
    }

    return (
        <View style={styles.container} >
            <Status />
            <Separator height={27} />
            {renderTop()}
            {renderAdvertise()}
            {renderCategory()}
        </View >
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
        // margin: 20,
        // backgroundColor: Colors.DEFAULT_WHITE,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 5,
        width: Display.setWidth(50),
        // height: Display.setHeight(15),
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