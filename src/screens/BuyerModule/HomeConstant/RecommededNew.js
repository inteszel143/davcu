import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons, FontAwesome, AntDesign, Ionicons } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Colors, Display, Separator } from '../../../constants'
import { firebase } from '../../../../config'
import numeral from 'numeral';
import { useNavigation } from '@react-navigation/native';

const heart = require('../../../../assets/Icon/heart.png');

const { width, height } = Dimensions.get('screen');
const cardWidth = width / 2.2;

export default function RecommededNew() {
    const navigation = useNavigation();

    const buyerId = firebase.auth().currentUser.uid;
    const [recommend, setRecommend] = useState([]);
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




    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsBold',
                        fontSize: RFPercentage(2),
                        color: Colors.DARK_TWO,
                    }}
                >Recommendation</Text>

                <TouchableOpacity>
                    <MaterialCommunityIcons name="view-grid-outline" size={20} color={Colors.INACTIVE_GREY} />
                </TouchableOpacity>
            </View>


            {/* DATA HERE */}
            {
                loading ? <View
                    style={{
                        marginTop: 10,
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
                    :
                    <FlatList
                        data={recommend}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.DEFAULT_WHITE,
                                    width: cardWidth,
                                    marginLeft: 15,
                                    borderTopRightRadius: 5,
                                    borderTopLeftRadius: 5,
                                }}
                                onPress={() => navigation.navigate('ProductDetails', {
                                    productId: item.key,
                                    sellerId: item.sellerUid,
                                })}
                            >

                                {/* PRODUCT IMAGE */}
                                {/* <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingVertical: 5,
                                    }}
                                >

                                </View> */}
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
                        )}
                    />
                // <View
                //     style={{
                //         marginTop: 10,
                //         flex: 1,
                //         flexDirection: 'row',
                //         flexWrap: 'wrap',
                //         alignItems: 'flex-start',
                //         justifyContent: 'center',
                //     }}
                // >
                //     {
                //         recommend.map((item, i) => (
                //             <TouchableOpacity
                //                 key={i}
                //                 style={{
                //                     backgroundColor: Colors.DEFAULT_WHITE,
                //                     width: cardWidth,
                //                     margin: '1.3%',
                //                     borderTopRightRadius: 5,
                //                     borderTopLeftRadius: 5,
                //                     // shadowColor: Colors.INACTIVE_GREY,
                //                     // shadowOffset: {
                //                     //     width: 1,
                //                     //     height: 0,
                //                     // },
                //                     // shadowOpacity: 0.20,
                //                     // shadowRadius: 1.41,
                //                     // elevation: 2,
                //                 }}
                //                 onPress={() => navigation.navigate('ProductDetails', {
                //                     productId: item.key,
                //                     sellerId: item.sellerUid,
                //                 })}
                //             >

                //                 {/* PRODUCT IMAGE */}
                //                 {/* <View
                //                     style={{
                //                         justifyContent: 'center',
                //                         alignItems: 'center',
                //                         paddingVertical: 5,
                //                     }}
                //                 >

                //                 </View> */}
                //                 <Image
                //                     source={{ uri: item.imageUrl[0] }}
                //                     resizeMode='center'
                //                     style={{
                //                         width: cardWidth,
                //                         height: 135,
                //                     }}
                //                 />
                //                 {/* CONTENT */}
                //                 <View
                //                     style={{
                //                         paddingHorizontal: 8,
                //                         marginTop: 8,
                //                     }}
                //                 >
                //                     {/* NAME */}
                //                     <Text
                //                         numberOfLines={2}
                //                         style={{
                //                             fontFamily: 'PoppinsMedium',
                //                             fontSize: RFPercentage(1.8),
                //                         }}
                //                     >{item.productName}</Text>

                //                     <Separator height={3} />
                //                     {/* PRICE */}
                //                     <Text
                //                         style={{
                //                             fontFamily: 'PoppinsSemiBold',
                //                             fontSize: RFPercentage(2),
                //                             // color: Colors.DEFAULT_ORANGE,
                //                         }}
                //                     >
                //                         ₱{numeral(item.productPrice).format('0,0.00')}
                //                     </Text>
                //                     <Separator height={3} />
                //                     {/* RATE AND SOLD */}
                //                     <View
                //                         style={{
                //                             flexDirection: 'row',
                //                             alignItems: 'center',
                //                         }}
                //                     >
                //                         <View
                //                             style={{
                //                                 flexDirection: 'row',
                //                                 alignItems: 'center',
                //                             }}
                //                         >
                //                             {
                //                                 item.rating === 0 ? <></>
                //                                     :
                //                                     <View
                //                                         style={{
                //                                             flexDirection: 'row',
                //                                             alignItems: 'center',
                //                                         }}
                //                                     >
                //                                         <FontAwesome name='star' size={12} color={Colors.DEFAULT_STAR} style={{ marginBottom: 2 }} />
                //                                         <Text
                //                                             style={{
                //                                                 fontFamily: 'PoppinsMedium',
                //                                                 fontSize: RFPercentage(1.6),
                //                                                 marginLeft: 3,
                //                                                 color: Colors.DARK_SEVEN,
                //                                             }}
                //                                         >{item.rating}</Text>
                //                                     </View>
                //                             }
                //                             {
                //                                 item.rating === 0 ? <></>
                //                                     :
                //                                     <View
                //                                         style={{
                //                                             width: 1,
                //                                             height: 10,
                //                                             backgroundColor: Colors.LIGHT_GREY2,
                //                                             marginHorizontal: 5,
                //                                         }}
                //                                     ></View>
                //                             }


                //                             <Text
                //                                 style={{
                //                                     fontFamily: 'PoppinsMedium',
                //                                     fontSize: RFPercentage(1.5),
                //                                     color: Colors.DARK_SEVEN,
                //                                 }}
                //                             >{item.totalSold} sold</Text>
                //                         </View>
                //                     </View>
                //                     <Separator height={6} />


                //                 </View>


                //             </TouchableOpacity>
                //         ))
                //     }
                // </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({})