import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, StatusBar, TextInput, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from 'expo-image-picker';
import { Colors, Display, Separator, General, Status } from '../../constants'
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import AllProducts from './SellerProducts/AllProducts';
import ArchiveProducts from './SellerProducts/ArchiveProducts';

export default function SellerProducts({ navigation }) {

    const [isAllSelected, setallSelected] = useState(true)
    const [isArchiveSelected, setArchiveSelected] = useState(false);

    const category = [
        {
            name: 'All',
            //icon: 'chart-box-outline',
            data: 0,
        },
        {
            name: 'Archive',
            // icon: 'clock-time-eight-outline',
            //status: 'Pending',
            data: 0,
        },

    ];

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
                    onPress={() => navigation.replace('SellerMainScreen')}
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
                    >My Products</Text>
                </View>

                <View
                    style={{
                        width: '20%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SellerAddProducts')}
                    >
                        {/* <Ionicons name="settings-outline" size={20} /> */}
                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(2),
                                color: Colors.DEFAULT_YELLOW2,
                            }}
                        >
                            Add
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };


    function renderChoices() {
        return (
            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 5,
                        }}
                        onPress={() => {
                            setallSelected(true);
                            setArchiveSelected(false);
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2),
                                paddingBottom: 10,
                            }}
                        >
                            All
                        </Text>

                        {
                            isAllSelected ? <View
                                style={{
                                    width: '100%',
                                    height: 1.5,
                                    backgroundColor: Colors.DEFAULT_YELLOW2,
                                }}
                            />
                                :
                                <></>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 5,
                        }}
                        onPress={() => {
                            setallSelected(false);
                            setArchiveSelected(true);
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2),
                                paddingBottom: 10,
                            }}
                        >
                            Archive
                        </Text>
                        {
                            isArchiveSelected ? <View
                                style={{
                                    width: '100%',
                                    height: 1.5,
                                    backgroundColor: Colors.DEFAULT_YELLOW2,
                                }}
                            />
                                :
                                <></>
                        }
                    </TouchableOpacity>

                </View>


            </View>
        )
    };

    function renderData() {
        if (isAllSelected === true) {
            return (
                <AllProducts />
            )
        } else {
            return (
                <ArchiveProducts />
            )
        }
    }

    return (
        <View style={styles.container} >
            <Status />
            <Separator height={27} />
            {renderTop()}
            {renderChoices()}
            {renderData()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE,
    }
})