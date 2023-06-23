import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, Modal, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import {
    Colors,
    Display,
    Separator, Status, Header
} from '../../constants';
import { MaterialCommunityIcons, AntDesign, SimpleLineIcons, Ionicons, Feather } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { scale } from 'react-native-size-matters';
import { firebase } from '../../../config';
import numeral from 'numeral';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RBSheet from "react-native-raw-bottom-sheet";
import * as ImagePicker from 'expo-image-picker';
import StarRating from 'react-native-star-rating-widget';
import moment from 'moment';
import ImageView from "react-native-image-viewing";

export default function BuyerReviews({ navigation, route }) {

    const deviceHeight = Dimensions.get('screen').height
    const { productKey, productUid } = route.params;
    const [comments, setComment] = useState('');
    const [totalReview, setTotalReview] = useState('');
    const [loading, setLoading] = useState(true);


    const [isModalVisible, setModalVisible] = useState(false);
    // MODALLLLLLLLLLL
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };


    // IMAGE VIEWING
    const [visible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState([]);
    const [viewImage, setViewImage] = useState([]);


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
                    fontSize: scale(14),
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



    // GET ALL COMMENTS
    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('ratings')
            .orderBy("reviewDate", 'desc')
            .onSnapshot(querySnapshot => {
                const data = [];

                querySnapshot.forEach(documentSnapshot => {

                    if (documentSnapshot.data().productUid === productUid) {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }

                });
                setComment(data);


            });
        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);


    useEffect(() => {
        let isMounted = true;
        firebase.firestore()
            .collection('ratings')
            .where('productUid', '==', productUid)
            .get()
            .then(querySnapshot => {
                setTotalReview(querySnapshot.size);
                setLoading(false);
            });
        // Stop listening for updates when no longer required
        return () => isMounted = false;

    }, []);

    //   COMPUTATION

    const compute = (comments, count) => {
        let sum = 0;
        for (let i = 0; i < comments.length; i++) {
            sum += comments[i].rating;
        }
        return sum / count;
    }

    useEffect(() => {
        let isMounted = true;
        firebase.firestore()
            .collection('allProducts')
            .doc(productUid)
            .update({
                rating: compute(comments, totalReview).toFixed(1),
            });
        // Stop listening for updates when no longer required
        return () => isMounted = false;
    })

    if (loading) {
        return <View
            style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: Colors.DEFAULT_WHITE,
            }}
        >
            <ActivityIndicator size="large" color={Colors.DEFAULT_YELLOW} />
        </View>;
    }


    function renderTopView() {
        return (
            <View
                style={{
                    marginTop: 15,
                    paddingHorizontal: 20,
                }}
            >
                <View
                    style={{
                        backgroundColor: Colors.DEFAULT_BG,
                        paddingVertical: 20,
                        paddingHorizontal: 15,
                        borderRadius: 10,
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* RATE AND STAR */}
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {
                                    comments.length === 0 ? <Text
                                        style={{
                                            fontSize: scale(35),
                                            fontFamily: 'PoppinsSemiBold',
                                        }}
                                    >
                                        0
                                    </Text>
                                        :
                                        <Text
                                            style={{
                                                fontSize: scale(35),
                                                fontFamily: 'PoppinsSemiBold',
                                            }}
                                        >
                                            {compute(comments, totalReview).toFixed(1)}
                                        </Text>
                                }

                                <Text
                                    style={{
                                        fontFamily: 'PoppinsMedium',
                                        fontSize: scale(15),
                                        marginLeft: 2,
                                    }}
                                >
                                    /5
                                </Text>
                            </View>

                            <Text
                                style={{
                                    marginTop: 5,
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    fontSize: scale(15),
                                    color: Colors.DARK_SEVEN,
                                }}
                            >
                                Based on {totalReview} Buyers
                            </Text>

                            {
                                comments.length === 0 ? <View pointerEvents="none"
                                    style={{
                                        marginTop: 10,
                                    }}>
                                    <StarRating
                                        rating={0}
                                        starSize={25}
                                        color={Colors.DEFAULT_YELLOW}
                                        starStyle={{
                                            marginHorizontal: 3,
                                        }}
                                    />
                                </View>
                                    :
                                    <View pointerEvents="none"
                                        style={{
                                            marginTop: 10,
                                        }}
                                    >
                                        <StarRating
                                            rating={compute(comments, totalReview)}
                                            starSize={25}
                                            color={Colors.DEFAULT_YELLOW}
                                            starStyle={{
                                                marginHorizontal: 3,
                                            }}
                                        />
                                    </View>
                            }

                        </View>



                    </View>

                </View>

            </View>
        )
    };

    function addNewReview() {
        return (
            <View
                style={{
                    marginTop: 20,
                    paddingHorizontal: 20,
                }}
            >
                <View style={{ height: 0.5, backgroundColor: Colors.LIGHT_GREY2, marginTop: 10, }} />
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 20,
                    }}
                    onPress={() => {
                        navigation.navigate('BuyerWriteReview', {
                            productKey: productKey,
                            productUid: productUid,
                        });

                    }}
                // onPress={() => navigation.navigate('BuyerWriteReview')}
                >
                    <MaterialCommunityIcons name='chat-plus-outline' size={20} style={{ marginLeft: 5, }} />
                    <Text
                        style={{
                            flex: 1,
                            fontSize: scale(15),
                            // fontWeight: 'bold',
                            fontFamily: 'PoppinsSemiBold',
                            marginLeft: 10,
                        }}
                    >Add Review</Text>

                    <MaterialCommunityIcons name='chevron-right' size={22} color={Colors.DARK_SEVEN} />

                </TouchableOpacity>

                <View style={{ height: 0.5, backgroundColor: Colors.LIGHT_GREY2, marginTop: 20, }} />

            </View>
        )
    };


    function BuyerReviews() {
        return (
            <View
                style={{
                    marginTop: 30,
                    paddingHorizontal: 20,
                }}
            >

                {/* TOP */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(1.9),
                        }}
                    >
                        Product reviews
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <MaterialCommunityIcons name='sort-ascending' size={15} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                marginLeft: 5,
                            }}
                        >
                            All Reviews
                        </Text>

                    </View>


                </View>

                {
                    comments.length === 0 ? <View
                        style={{
                            height: Display.setHeight(10),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: scale(14),
                            }}
                        >No review yet.</Text>
                    </View>
                        :
                        <View>
                            {
                                comments.map((item, i) => (
                                    <View
                                        key={i}
                                        style={{
                                            backgroundColor: Colors.DEFAULT_BG,
                                            paddingVertical: 20,
                                            paddingHorizontal: 15,
                                            borderRadius: 10,
                                            marginTop: 10,
                                        }}
                                    >

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',

                                                }}
                                            >
                                                <Image source={require('../../../assets/images/circleProfile.png')}
                                                    resizeMode='contain'
                                                    style={{
                                                        width: 43,
                                                        height: 43,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        marginLeft: 5,
                                                        paddingHorizontal: 5,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontFamily: 'PoppinsSemiBold',
                                                            fontSize: scale(15),
                                                        }}
                                                    >
                                                        {item.buyerName}
                                                    </Text>
                                                    {
                                                        item.reviewDate === null ? <>

                                                        </>
                                                            :
                                                            <Text
                                                                style={{
                                                                    fontSize: scale(13),
                                                                    fontFamily: 'PoppinsMedium',
                                                                    color: Colors.INACTIVE_GREY,
                                                                }}
                                                            >
                                                                {moment(item.reviewDate.toDate()).fromNow()}
                                                            </Text>
                                                    }
                                                </View>



                                            </View>

                                            {/* STARAN */}

                                            <View pointerEvents="none">
                                                <StarRating
                                                    rating={item.rating}
                                                    starSize={18}
                                                    color={Colors.DEFAULT_YELLOW}
                                                    starStyle={{
                                                        marginHorizontal: 0.5,
                                                    }}
                                                />
                                            </View>

                                        </View>


                                        {/* Comments */}

                                        <View
                                            style={{
                                                marginTop: 15,
                                                paddingHorizontal: 10,
                                            }}
                                        >
                                            {
                                                item.comment === '' ? <Text
                                                    style={{
                                                        fontFamily: 'PoppinsRegular',
                                                        fontSize: scale(14),
                                                        textAlign: 'justify',
                                                        // color: Colors.DARK_SIX,
                                                    }}
                                                >The product gets a {item.rating}-star rating from the customer</Text>
                                                    :
                                                    <Text
                                                        style={{
                                                            fontFamily: 'PoppinsRegular',
                                                            fontSize: scale(14),
                                                            textAlign: 'justify',
                                                            // color: Colors.DARK_SIX,
                                                        }}
                                                    >{item.comment}</Text>
                                            }
                                        </View>


                                        {/* IMAGES */}
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 15,
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


                                    </View>
                                ))
                            }
                        </View>
                }

            </View>
        )
    };


    function MessageAlert() {
        return (
            <Modal
                isVisible={isModalVisible}
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}
            >
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 5,
                    }}
                    onPress={toggleModal}
                >
                    <AntDesign name='close' size={25} color={Colors.DEFAULT_WHITE} />
                </TouchableOpacity>


                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={require('../../../assets/images/resibo.jpg')}
                        resizeMode='center'
                        style={{
                            height: Display.setHeight(80)
                        }}
                    />

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
                    onPress={() => navigation.replace('BuyerMyOrders')}
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
                    >Reviews</Text>
                </View>

                <View
                    style={{
                        width: '20%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    <TouchableOpacity>
                        <Feather name="filter" size={18} style={{ marginRight: 8 }} />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Ionicons name="settings-outline" size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    };


    return (
        <View style={styles.container} >
            <Status />
            <Separator height={27} />
            {renderTop()}
            {/* {MessageAlert()} */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 10,
                }}
            >
                {renderTopView()}
                {addNewReview()}
                {BuyerReviews()}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE
    }
})