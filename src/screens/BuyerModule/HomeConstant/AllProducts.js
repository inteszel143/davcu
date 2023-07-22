import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { MaterialCommunityIcons, FontAwesome, AntDesign, Ionicons } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Colors, Separator, Display } from '../../../constants'
import { firebase } from '../../../../config'
import { useNavigation } from '@react-navigation/native';
import numeral from 'numeral';
const heart = require('../../../../assets/Icon/heart.png');
const { width, height } = Dimensions.get('screen');
const cardWidth = width / 2.2;

const AllProducts = () => {
    const navigation = useNavigation();
    const buyerId = firebase.auth().currentUser.uid;
    const [forYou, setForYou] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('allProducts')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const data = []
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().productStock > 0 && documentSnapshot.data().productStatus === 'Available') {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        })
                    }
                });
                setForYou(data);
                setLoading(false);
            });
        return () => { isMounted = false; subscriber() };
    }, []);

    if (loading) {
        return (
            <View
                style={{
                    marginTop: 15,
                    flex: 1,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: 'center',
                    }}
                >

                    <View
                        style={{
                            paddingLeft: 11,
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
                        marginTop: 20,
                        flexDirection: "row",
                        alignItems: 'center',
                    }}
                >

                    <View
                        style={{
                            paddingLeft: 11,
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
                        marginTop: 20,
                        flexDirection: "row",
                        alignItems: 'center',
                    }}
                >

                    <View
                        style={{
                            paddingLeft: 11,
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
        )
    };

    return (
        <View>

            {/* DATA HERE */}


            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    marginTop: 10,
                }}
            >
                {
                    forYou.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={{
                                backgroundColor: Colors.DEFAULT_WHITE,
                                width: cardWidth,
                                margin: '1.2%',
                                borderTopRightRadius: 5,
                                borderTopLeftRadius: 5,
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
                                    height: 140,
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
                    ))
                }
            </View>
        </View>
    )
}

export default memo(AllProducts)

const styles = StyleSheet.create({})