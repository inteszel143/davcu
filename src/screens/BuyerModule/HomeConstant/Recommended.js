import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons, FontAwesome, AntDesign, Ionicons } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Colors } from '../../../constants'
import { firebase } from '../../../../config'
import numeral from 'numeral';
import { useNavigation } from '@react-navigation/native';

const heart = require('../../../../assets/Icon/heart.png');

const { width, height } = Dimensions.get('screen');
const cardWidth = width / 2.1;
export default function Recommended() {
    const navigation = useNavigation();

    const buyerId = firebase.auth().currentUser.uid;
    const [recommend, setRecommend] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('allProducts')
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().productStock > 0 && documentSnapshot.data().productStatus === 'Available' && documentSnapshot.data().totalSold >= 1) {
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
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        width: cardWidth,
                        backgroundColor: '#F3F6F9',
                        marginLeft: 12,
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

                </View>
                <View
                    style={{
                        width: cardWidth,
                        marginLeft: 12,
                        borderTopRightRadius: 5,
                        backgroundColor: '#F3F6F9',
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

                </View>
            </View>
        )
    }

    return (
        <View>
            <FlatList
                data={recommend}
                horizontal
                showsHorizontalScrollIndicator={false}

                renderItem={({ item }) => (
                    <View
                        style={{
                            marginVertical: 10,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.DEFAULT_WHITE,
                                width: cardWidth,
                                marginLeft: 12,
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
                            onPress={() => navigation.navigate('ProductDetails', {
                                productId: item.key,
                            })}
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

const styles = StyleSheet.create({})