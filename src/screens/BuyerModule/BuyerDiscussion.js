import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Image, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react';
import { Colors, Separator, Status, Display } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import numeral from 'numeral';
import moment from 'moment';
import ImageView from "react-native-image-viewing";
import StarRating from 'react-native-star-rating-widget';
import { firebase } from '../../../config';

const heart = require('../../../assets/Icon/heart.png');
const profile = require('../../../assets/images/profilepic.png');

export default function BuyerDiscussion({ navigation, route }) {

    const { productId } = route.params;
    const [productData, setProductData] = useState("");
    const [modalVisible, setModalVisible] = useState(true);
    const [comments, setComment] = useState([]);


    // IMAGE VIEWING
    const [visible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState([]);
    const [viewImage, setViewImage] = useState([]);

    useEffect(() => {
        firebase.firestore()
            .collection('allProducts')
            .doc(productId)
            .get()
            .then(documentSnapshot => {
                console.log('Hello world', documentSnapshot.exists);
                if (documentSnapshot.exists) {
                    setProductData(documentSnapshot.data());
                }
            });
    }, []);

    // GET ALL COMMENTS
    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('ratings')
            .orderBy("reviewDate", 'desc')
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().productUid === productId) {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }
                });
                setComment(data);
                setModalVisible(false);

            });
        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);


    const FooterComponent = ({ imageIndex }) => (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
            }}
        >
            <Text
                style={{
                    fontFamily: 'PoppinsSemiBold',
                    fontSize: RFPercentage(1.9),
                    color: Colors.DEFAULT_WHITE,
                }}
            >
                {imageIndex + 1} / {viewImage.length}
            </Text>

        </View >
    );


    const onImageViewing = useCallback((ratingImage, index) => {
        const perform = ratingImage.map((item) => {
            return { uri: item };
        });
        setCurrentIndex(index);
        setViewImage(perform);
        setIsVisible(true);
    }, []);


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
                                // flexDirection: 'row',
                            }}
                        >
                            <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                    marginTop: 5,
                                }}
                            >Loading</Text>
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
                    >Discussion</Text>
                </View>

                <View
                    style={{
                        width: '20%',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >

                </View>
            </View>
        )
    };

    function renderProductContent() {
        return (
            <View>
                <FlatList
                    style={{
                        alignSelf: 'center',
                        marginBottom: 20,
                    }}
                    data={productData.imageUrl}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingHorizontal: 10,
                                width: Display.setWidth(90),
                                borderWidth: 1,
                                borderColor: Colors.LIGHT_GREY2,
                                borderRadius: 10,
                                paddingVertical: 20,
                            }}
                        >
                            <View>
                                <Image
                                    source={{ uri: item }}
                                    resizeMode='contain'
                                    style={{
                                        height: 80,
                                        width: 80,
                                        // marginTop: 5,
                                    }}
                                />
                            </View>

                            {/* NAME */}
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: 10,
                                }}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        flex: 1,
                                        fontFamily: "PoppinsSemiBold",
                                        fontSize: RFPercentage(2),
                                    }}
                                >{productData.productName}</Text>


                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: 2,
                                    }}
                                >
                                    {
                                        productData.rating == 0 ? <></>
                                            :
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <AntDesign name="star" size={12} color={Colors.DEFAULT_STAR} />
                                                <Text
                                                    style={{
                                                        fontFamily: 'PoppinsRegular',
                                                        fontSize: RFPercentage(1.8),
                                                        color: Colors.INACTIVE_GREY,
                                                        marginLeft: 5,
                                                    }}
                                                >{productData.rating}</Text>
                                            </View>
                                    }
                                    {
                                        productData.totalSold == 0 ? <></>
                                            :
                                            <Text
                                                style={{
                                                    fontFamily: 'PoppinsRegular',
                                                    fontSize: RFPercentage(1.8),
                                                    color: Colors.INACTIVE_GREY,
                                                }}
                                            > ( {productData.totalSold} sold ) </Text>
                                    }

                                </View>


                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginTop: 10,
                                    }}
                                >

                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsMedium',
                                            fontSize: RFPercentage(2.2),
                                            // color: Colors.DEFAULT_YELLOW2,
                                        }}
                                    >₱{numeral(productData.productPrice / 2).format('0,0.00')}</Text>
                                    <TouchableOpacity>
                                        <Image
                                            source={heart}
                                            resizeMode='contain'
                                            style={{
                                                width: 20,
                                                height: 20,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </View>
                    )}
                />



            </View>
        )
    };


    function renderReview() {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <FlatList
                    data={comments}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                paddingHorizontal: 15,
                            }}
                        >
                            {/* TOP */}

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >

                                <View
                                    style={{
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Image source={profile}
                                        resizeMode='contain'
                                        style={{
                                            width: 40,
                                            height: 40,
                                        }}
                                    />
                                    <View
                                        style={{
                                            marginLeft: 12,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "PoppinsSemiBold",
                                                fontSize: RFPercentage(2),
                                            }}
                                        >
                                            {item.buyerName}
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: RFPercentage(1.9),
                                                fontFamily: 'PoppinsMedium',
                                                color: Colors.INACTIVE_GREY,
                                            }}
                                        >
                                            {moment(item.reviewDate.toDate()).fromNow()}
                                        </Text>
                                    </View>

                                </View>

                                <Ionicons name="ellipsis-horizontal" size={20} />
                            </View>


                            {/* COMMENT */}
                            <View
                                style={{
                                    marginVertical: 10,
                                    paddingHorizontal: 10,
                                }}
                            >
                                <View pointerEvents="none"
                                    style={{
                                        paddingBottom: 8,
                                    }}
                                >
                                    <StarRating
                                        rating={item.rating}
                                        starSize={15}
                                        color={Colors.DEFAULT_STAR}
                                        starStyle={{
                                            marginHorizontal: 2,
                                        }}
                                    />
                                </View>


                                {
                                    item.comment === "" ? <Text
                                        style={{
                                            fontFamily: 'PoppinsRegular',
                                            fontSize: RFPercentage(2),
                                        }}
                                    >
                                        The product gets a {item.rating}-star rating from the customer
                                    </Text>
                                        :
                                        <Text
                                            style={{
                                                fontFamily: 'PoppinsRegular',
                                                fontSize: RFPercentage(2),
                                            }}
                                        >
                                            {item.comment}
                                        </Text>
                                }
                            </View>

                            {/* IMAGE */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 15,
                                }}
                            >

                                {
                                    item.imageUrl && item.imageUrl.map((items, i) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                onImageViewing(item.imageUrl, i);
                                            }}
                                            key={i}
                                            style={{
                                                marginLeft: 8,
                                            }}
                                        >
                                            <Image
                                                source={{ uri: items }}
                                                resizeMode='contain'
                                                style={{
                                                    height: 90,
                                                    width: 95
                                                }}
                                            />

                                            <ImageView
                                                images={viewImage}
                                                imageIndex={currentIndex}
                                                visible={visible}
                                                presentationStyle="overFullScreen"
                                                animationType='fade'
                                                onRequestClose={() => setIsVisible(false)}
                                                FooterComponent={FooterComponent}
                                            />


                                        </TouchableOpacity>

                                    ))

                                }

                            </View>

                            <View style={{ height: 0.5, backgroundColor: Colors.LIGHT_GREY2, marginBottom: 20, }} />

                        </View>
                    )}
                />
            </View>
        )
    };

    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={27} />

            {renderTop()}
            {renderProductContent()}
            {renderReview()}
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
        width: Display.setWidth(45),
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