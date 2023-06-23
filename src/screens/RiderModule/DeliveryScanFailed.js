import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../constants';
import { MaterialCommunityIcons, SimpleLineIcons, FontAwesome5 } from 'react-native-vector-icons';
import Modal from "react-native-modal";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { scale } from 'react-native-size-matters';
import { firebase } from '../../../config';
import numeral from 'numeral';
const { width } = Dimensions.get('screen');

const FAILED = require('../../../assets/images/FAILED.jpg');


export default function DeliveryScanFailed({ navigation, route }) {

    const { productID, orderKey, buyerID } = route.params;


    function renderBottom() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    style={{
                        width: Display.setWidth(90),
                        height: Display.setHeight(6),
                        backgroundColor: Colors.SECONDARY_GREEN,
                        justifyContent: 'center',
                        alignItems: "center",
                        borderRadius: 5,
                    }}
                    onPress={() => {
                        navigation.replace('DeliveryScan', {
                            productID: productID,
                            orderKey: orderKey,
                            buyerID: buyerID,

                        });
                    }}

                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <MaterialCommunityIcons name='line-scan' size={15} color={Colors.DEFAULT_WHITE} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                                color: Colors.DEFAULT_WHITE,
                                marginLeft: 8,
                            }}
                        >
                            Re-scan
                        </Text>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container} >
            <Status />

            {/* RENDER IMAGE */}
            <View>
                <Image
                    source={FAILED}
                    resizeMode='contain'
                    style={{
                        width: Display.setWidth(65),
                        height: Display.setHeight(55),
                    }}
                />
            </View>


            {/* RENDER CONTENT */}
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 25,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(3),
                    }}
                >
                    Oopss.. !
                </Text>
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(3),
                    }}
                >
                    Something went wrong.
                </Text>

                <Separator height={15} />

                <Text
                    style={{
                        fontFamily: 'PoppinsMedium',
                        fontSize: RFPercentage(2.2),
                        color: Colors.INACTIVE_GREY,
                        textAlign: 'center',
                    }}
                >
                    We encountered an error during the scan and it was unsuccessful.
                </Text>

            </View>




            {renderBottom()}


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: Colors.DEFAULT_WHITE,
    }
})