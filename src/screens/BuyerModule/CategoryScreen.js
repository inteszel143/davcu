import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Image, Modal, ActivityIndicator } from 'react-native'

import React, { useEffect, useState } from 'react';
import { Colors, Display, Separator, Status } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import numeral from 'numeral';
import { firebase } from '../../../config';
import Messaging from './BuyerConstant/Messaging';
import ShoppingCart from './BuyerConstant/ShoppingCart';

const { width, height } = Dimensions.get('screen');
const cardWidth = width / 2.1;
const heart = require('../../../assets/Icon/heart.png');

const empty = require('../../../assets/Icon/magnifying-glass.png');

export default function CategoryScreen({ navigation, route }) {

    const { category } = route.params;
    const buyerId = firebase.auth().currentUser.uid;
    const [recommend, setRecommend] = useState('');
    const [loading, setLoading] = useState(true);
    const [newRecommend, setNewRecommend] = useState('');
    const [lastCheck, setLastCheck] = useState('');

    const [modalVisible, setModalVisible] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('allProducts')
            .where("productCategory", "==", category)
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().productStock > 0 && documentSnapshot.data().productStatus === 'Available') {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }
                });
                data.sort((a, b) => {
                    if (a.rating === b.rating) {
                        return b.totalSold - a.totalSold;
                    }
                    return b.rating - a.rating;
                });
                setRecommend(data);
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
                                flexDirection: 'row',
                            }}
                        >
                            <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                    marginLeft: 8,
                                }}
                            >Loading...</Text>
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
                    >{category}</Text>
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


    function renderData() {
        return (
            <View
                style={{
                    alignSelf: 'center',
                }}
            >
                {
                    recommend.length == 0 ? <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 180,
                        }}
                    >
                        <Image
                            source={empty}
                            resizeMode='contain'
                            style={{
                                width: 90,
                                height: 90,
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
                            numColumns={2}
                            data={recommend}
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        marginTop: 5,
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: Colors.DEFAULT_WHITE,
                                            width: cardWidth,
                                            margin: '0.5%',
                                            borderTopLeftRadius: 8,
                                            borderTopRightRadius: 8,
                                            // shadowColor: Colors.INACTIVE_GREY,
                                            // shadowOffset: {
                                            //     width: 1,
                                            //     height: 0,
                                            // },
                                            // shadowOpacity: 0.20,
                                            // shadowRadius: 1.41,
                                            // elevation: 2,
                                        }}
                                        onPress={() => navigation.navigate('ProductDetails', {
                                            productId: item.key,
                                            sellerId: item.sellerUid,
                                        })}
                                    >

                                        {/* PRODUCT IMAGE */}
                                        <Image
                                            source={{ uri: item.imageUrl[0] }}
                                            resizeMode='center'
                                            style={{
                                                width: cardWidth,
                                                height: 135,
                                            }}
                                        />


                                        {/* CONTENT */}
                                        <View
                                            style={{
                                                paddingHorizontal: 8,
                                                marginTop: 8,
                                            }}
                                        >
                                            {/* NAME */}
                                            <Text
                                                numberOfLines={2}
                                                style={{
                                                    fontFamily: 'PoppinsMedium',
                                                    fontSize: RFPercentage(1.8),
                                                }}
                                            >{item.productName}</Text>

                                            <Separator height={3} />
                                            {/* PRICE */}
                                            <Text
                                                style={{
                                                    fontFamily: 'PoppinsSemiBold',
                                                    fontSize: RFPercentage(2),
                                                    // color: Colors.DEFAULT_ORANGE,
                                                }}
                                            >
                                                ₱{numeral(item.productPrice).format('0,0.00')}
                                            </Text>
                                            <Separator height={3} />
                                            {/* RATE AND SOLD */}
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {
                                                        item.rating === 0 ? <></>
                                                            :
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <FontAwesome name='star' size={12} color={Colors.DEFAULT_STAR} style={{ marginBottom: 2 }} />
                                                                <Text
                                                                    style={{
                                                                        fontFamily: 'PoppinsMedium',
                                                                        fontSize: RFPercentage(1.6),
                                                                        marginLeft: 3,
                                                                        color: Colors.DARK_SEVEN,
                                                                    }}
                                                                >{item.rating}</Text>
                                                            </View>
                                                    }
                                                    {
                                                        item.rating === 0 ? <></>
                                                            :
                                                            <View
                                                                style={{
                                                                    width: 1,
                                                                    height: 10,
                                                                    backgroundColor: Colors.LIGHT_GREY2,
                                                                    marginHorizontal: 5,
                                                                }}
                                                            ></View>
                                                    }


                                                    <Text
                                                        style={{
                                                            fontFamily: 'PoppinsMedium',
                                                            fontSize: RFPercentage(1.5),
                                                            color: Colors.DARK_SEVEN,
                                                        }}
                                                    >{item.totalSold} sold</Text>
                                                </View>
                                            </View>
                                            <Separator height={6} />


                                        </View>


                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                }
            </View>
        )
    }



    return (
        <View style={styles.container} >
            <Status />
            <Separator height={27} />
            {renderTop()}
            {renderData()}
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
    },
    modalView: {
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 5,
        width: Display.setWidth(50),
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