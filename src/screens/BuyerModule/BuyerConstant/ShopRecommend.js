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

export default function ShopRecommend({ sellerUid }) {



    const navigation = useNavigation();
    const [productData, setProductData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('allProducts')
            .orderBy("totalSold", "desc")
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().sellerUid === sellerUid && documentSnapshot.data().productStock > 0 && documentSnapshot.data().productStatus === 'Available') {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }
                });
                setProductData(data);
                setLoading(false);
            });
        return () => { isMounted = false; subscriber() };
    }, []);

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
        <View style={styles.container} >
            <Separator height={10} />
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                }}
            >
                {
                    productData.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={{
                                backgroundColor: Colors.DEFAULT_WHITE,
                                width: cardWidth,
                                margin: '1.2%',
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                            }}
                            onPress={() => navigation.replace('ProductDetails', {
                                productId: item.key,
                                sellerId: item.sellerUid,
                            })}
                        >
                            {/* IMAGES */}

                            <Image
                                source={{ uri: item.imageUrl[0] }}
                                resizeMode='center'
                                style={{
                                    width: cardWidth,
                                    height: 135,
                                    // borderTopLeftRadius: 2,
                                    // borderTopRightRadius: 2,
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: Colors.DEFAULT_BG2,
    },
})