import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, Status, Display, Separator } from '../../../constants';
import { Ionicons, FontAwesome } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../../../config';
import numeral from 'numeral';
import { scale } from 'react-native-size-matters';
const { width } = Dimensions.get('screen');
const cardWidth = width / 2.2;

export default function ShopArrival() {

    const [loading, setLoading] = useState(true);
    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                <View
                    style={{
                        marginTop: 10,
                        flexDirection: "row",
                        alignItems: 'center',
                    }}
                >

                    <View
                        style={{
                            paddingLeft: 2,
                        }}
                    >
                        {/* TOP */}
                        <View
                            style={{
                                width: cardWidth,
                                height: Display.setHeight(15),
                                backgroundColor: Colors.DEFAULT_BG2,
                                borderRadius: 10,
                            }}
                        />
                        <View
                            style={{
                                marginTop: 10,
                                width: cardWidth - 10,
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                        <View
                            style={{
                                marginTop: 10,
                                width: cardWidth - 40,
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                        <View
                            style={{
                                marginTop: 10,
                                width: Display.setWidth(20),
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            paddingLeft: 10,
                        }}
                    >
                        {/* TOP */}
                        <View
                            style={{
                                width: cardWidth,
                                height: Display.setHeight(15),
                                backgroundColor: Colors.DEFAULT_BG2,
                                borderRadius: 10,
                            }}
                        />
                        <View
                            style={{
                                marginTop: 10,
                                width: cardWidth - 10,
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                        <View
                            style={{
                                marginTop: 10,
                                width: cardWidth - 40,
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                        <View
                            style={{
                                marginTop: 10,
                                width: Display.setWidth(20),
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />
                    </View>

                </View>

                <View
                    style={{
                        marginTop: 25,
                        flexDirection: "row",
                        alignItems: 'center',
                    }}
                >

                    <View
                        style={{
                            paddingLeft: 2,
                        }}
                    >
                        {/* TOP */}
                        <View
                            style={{
                                width: cardWidth,
                                height: Display.setHeight(15),
                                backgroundColor: Colors.DEFAULT_BG2,
                                borderRadius: 10,
                            }}
                        />
                        <View
                            style={{
                                marginTop: 10,
                                width: cardWidth - 10,
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                        <View
                            style={{
                                marginTop: 10,
                                width: cardWidth - 40,
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                        <View
                            style={{
                                marginTop: 10,
                                width: Display.setWidth(20),
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            paddingLeft: 10,
                        }}
                    >
                        {/* TOP */}
                        <View
                            style={{
                                width: cardWidth,
                                height: Display.setHeight(15),
                                backgroundColor: Colors.DEFAULT_BG2,
                                borderRadius: 10,
                            }}
                        />
                        <View
                            style={{
                                marginTop: 10,
                                width: cardWidth - 10,
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                        <View
                            style={{
                                marginTop: 10,
                                width: cardWidth - 40,
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />

                        <View
                            style={{
                                marginTop: 10,
                                width: Display.setWidth(20),
                                height: Display.setHeight(1.5),
                                borderRadius: 5,
                                backgroundColor: Colors.DEFAULT_BG2,
                            }}
                        />
                    </View>

                </View>


            </View>
        );
    };

    return (
        <View>
            <Text>ShopArrival</Text>
        </View>
    )
}

const styles = StyleSheet.create({})