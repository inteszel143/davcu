import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useFonts } from 'expo-font';
import { Colors, Status, Display, Separator } from '../constants';
import { MaterialCommunityIcons, Ionicons, Feather } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const buyerIcon = require('../../assets/Icon/deal.png');
const sellerIcon = require('../../assets/Icon/location.png');
const deliveryIcon = require('../../assets/Icon/delivery-man.png');


export default function SelectType({ navigation }) {

    const [initializing, setInitializing] = useState(false);
    const [user, setUser] = useState();

    const [fontsLoaded] = useFonts({
        'PoppinsMedium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'PoppinsBold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'PoppinsLight': require('../../assets/fonts/Poppins-Light.ttf'),
        'PoppinsRegular': require('../../assets/fonts/Poppins-Regular.ttf'),
        'PoppinsThin': require('../../assets/fonts/Poppins-Thin.ttf'),
        'PoppinsBlack': require('../../assets/fonts/Poppins-Black.ttf'),
        'PoppinsExtraBold': require('../../assets/fonts/Poppins-ExtraBold.ttf'),
        'PoppinsExtraLight': require('../../assets/fonts/Poppins-ExtraLight.ttf'),
        'PoppinsSemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
        'RRegular': require('../../assets/fonts/RobotoSerif-Regular.ttf'),
        'RSemiBold': require('../../assets/fonts/RobotoSerif-SemiBold.ttf'),
        'RMedium': require('../../assets/fonts/RobotoSerif-Medium.ttf'),
        'RThin': require('../../assets/fonts/RobotoSerif-Thin.ttf'),

    })

    if (!fontsLoaded) {
        return null;
    };


    function renderBuyer() {
        return (
            <View
                style={{
                    marginTop: 8,
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.DEFAULT_WHITE,
                        borderRadius: 10,
                        marginHorizontal: 15,

                        shadowColor: Colors.DARK_ONE,
                        shadowOpacity: 0.30,
                        shadowRadius: 2.62,
                        elevation: 4,

                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 20,
                    }}
                    onPress={() => navigation.navigate('BuyerLogin')}
                >
                    <Image
                        source={buyerIcon}
                        resizeMode='contain'
                        style={{
                            width: 50,
                            height: 50,
                        }}
                    />

                    <Text
                        style={{
                            marginTop: 10,
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2.6),
                        }}
                    >
                        Buyer
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(1.8),
                            textAlign: 'center',
                            paddingHorizontal: 30,
                            color: Colors.INACTIVE_GREY,
                        }}
                    >
                        Best for, retail industry, looking to purchase, online marketplace
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(1.9),
                            color: Colors.DEFAULT_YELLOW2,
                        }}
                    >
                        Next
                    </Text>


                </TouchableOpacity>
            </View>
        )
    }

    function renderSeller() {
        return (
            <View
                style={{
                    marginTop: 15,
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.DEFAULT_WHITE,
                        borderRadius: 12,
                        marginHorizontal: 15,

                        shadowColor: Colors.DARK_ONE,
                        shadowOpacity: 0.30,
                        shadowRadius: 2.62,
                        elevation: 4,

                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 20,
                    }}
                    onPress={() => navigation.navigate('SellerLogin')}
                >
                    <Image
                        source={sellerIcon}
                        resizeMode='contain'
                        style={{
                            width: 50,
                            height: 50,
                        }}
                    />

                    <Text
                        style={{
                            marginTop: 10,
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2.6),
                        }}
                    >
                        Business
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(1.8),
                            textAlign: 'center',
                            paddingHorizontal: 30,
                            color: Colors.INACTIVE_GREY,
                        }}
                    >
                        Best for brands, retailers, organization, and service providers
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(1.9),
                            color: Colors.DEFAULT_YELLOW2,
                        }}
                    >
                        Next
                    </Text>

                </TouchableOpacity>
            </View>
        )
    };
    function renderDelivery() {
        return (
            <View
                style={{
                    marginTop: 15,
                    paddingBottom: 15,
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.DEFAULT_WHITE,
                        borderRadius: 10,
                        marginHorizontal: 12,

                        shadowColor: Colors.DARK_ONE,
                        shadowOpacity: 0.30,
                        shadowRadius: 2.62,
                        elevation: 4,

                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 20,
                    }}
                    onPress={() => navigation.navigate('RiderLogin')}
                >
                    <Image
                        source={deliveryIcon}
                        resizeMode='contain'
                        style={{
                            width: 55,
                            height: 55,
                        }}
                    />

                    <Text
                        style={{
                            marginTop: 10,
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2.6),
                        }}
                    >
                        Rider
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(1.8),
                            textAlign: 'center',
                            paddingHorizontal: 30,
                            color: Colors.DARK_SEVEN,
                        }}
                    >
                        Best for, Postal Services, Courier Services, transporting products
                    </Text>

                    <Text
                        style={{
                            marginTop: 5,
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(1.9),
                            color: Colors.DEFAULT_YELLOW2,
                        }}
                    >
                        Next
                    </Text>

                </TouchableOpacity>
            </View>
        )
    };



    return (
        <SafeAreaView eAreaView style={styles.container} >
            <Status />
            <Separator height={30} />

            <View
                style={{
                    marginTop: 15,
                    paddingHorizontal: 20,
                }}
            >
                <MaterialCommunityIcons name="close" size={22} />
            </View>

            <View
                style={{
                    marginTop: 15,
                    paddingHorizontal: 30,
                }}
            >
                <Text
                    style={{
                        fontFamily: "PoppinsSemiBold",
                        fontSize: RFPercentage(2.5),
                    }}
                >
                    Select an account type
                </Text>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Separator height={10} />
                {/* BUYER */}

                {renderBuyer()}
                {renderSeller()}
                {renderDelivery()}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE,
    }
})