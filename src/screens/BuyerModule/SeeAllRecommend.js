import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Image, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Colors, Separator, Status, Display } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import numeral from 'numeral';
import { firebase } from '../../../config';
import Messaging from './BuyerConstant/Messaging';
import ShoppingCart from './BuyerConstant/ShoppingCart';

const { width, height } = Dimensions.get('screen');
const cardWidth = width / 2.1;
const heart = require('../../../assets/Icon/heart.png');
export default function SeeAllRecommend({ navigation }) {

    const buyerId = firebase.auth().currentUser.uid;
    const [recommend, setRecommend] = useState('');
    const [newRecommend, setNewRecommend] = useState('');
    const [lastCheck, setLastCheck] = useState('');

    const [modalVisible, setModalVisible] = useState(true);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('allProducts')
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
        return () => {
            isMounted = false;
            subscriber()
        }
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
                        {/* <Text style={styles.modalText} >Success ! you have added a new shipping address.</Text> */}
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
                    >Recommended</Text>
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
                                    margin: '1%',
                                    borderTopRightRadius: 5,
                                    borderTopLeftRadius: 5,
                                    shadowColor: Colors.INACTIVE_GREY,
                                    shadowOffset: {
                                        width: 1,
                                        height: 0,
                                    },
                                    shadowOpacity: 0.20,
                                    shadowRadius: 1.41,
                                    elevation: 2,
                                }}
                            >

                                {/* PRODUCT IMAGE */}
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingVertical: 5,
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.imageUrl[0] }}
                                        resizeMode='center'
                                        style={{
                                            width: cardWidth,
                                            height: 140,
                                            // borderTopLeftRadius: 2,
                                            // borderTopRightRadius: 2,
                                        }}
                                    />
                                </View>


                                {/* CONTENT */}
                                <View
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 10,
                                    }}
                                >
                                    {/* NAME */}
                                    <View
                                        style={{

                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                width: '80%',
                                                fontFamily: 'PoppinsMedium',
                                                fontSize: RFPercentage(1.8),
                                            }}
                                        >{item.productName}</Text>

                                        <TouchableOpacity>
                                            <Image
                                                source={heart}
                                                resizeMode='contain'
                                                style={{
                                                    width: 18,
                                                    height: 18,
                                                }}
                                            />
                                        </TouchableOpacity>

                                    </View>


                                    {/* PRICE */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginTop: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'PoppinsSemiBold',
                                                fontSize: RFPercentage(2),
                                            }}
                                        >
                                            ₱{numeral(item.productPrice).format('0,0.00')}
                                        </Text>

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


                                    </View>
                                </View>


                            </TouchableOpacity>
                        </View>
                    )}
                />
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