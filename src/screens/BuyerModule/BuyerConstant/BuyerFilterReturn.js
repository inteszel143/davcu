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

export default function BuyerFilterReturn() {

    const [loading, setLoading] = useState(true);

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

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_BG,
    }
})