import { StyleSheet, Text, StatusBar, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, Modal, } from 'react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Colors, Status, Separator, Display } from '../../constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';

import ShoppingCart from './BuyerConstant/ShoppingCart';
import { firebase } from '../../../config';
import ImageView from "react-native-image-viewing";
import numeral from 'numeral';
import RBSheet from "react-native-raw-bottom-sheet";
import StarRating from 'react-native-star-rating-widget';
import DetailsReviews from './BuyerConstant/DetailsReviews';
import getDistance from 'geolib/es/getPreciseDistance';
import haversine from 'haversine-distance'

const heartSelect = require('../../../assets/Icon/selectedHeart.png')
const heart = require('../../../assets/Icon/heart.png')
const store = require('../../../assets/Icon/store.png')
const shareIcon = require('../../../assets/Icon/share.png')
const chatIcon = require('../../../assets/Icon/chatIcon.png')


const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width
export default function ProductDetails({ navigation, route }) {
    const refRBSheet = useRef();
    const { productId, sellerId } = route.params;
    const [productData, setProductData] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [wishList, setWishList] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [enterModal, setEnter] = useState(true);
    const [loading, setLoading] = useState(true);

    // DELIVERY FEE
    const [uLat, setULat] = useState(0);
    const [uLong, setULong] = useState(0);

    const [dLat, setDLat] = useState(0);
    const [dLong, setDLong] = useState(0);


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
                    setLoading(false);
                }
            });
    }, []);

    // GET ADDRESS BUYER
    useEffect(() => {
        firebase.firestore()
            .collection('buyerAddress')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().buyerId === firebase.auth().currentUser.uid && documentSnapshot.data().default === true) {
                        setULat(documentSnapshot.data().latitude);
                        setULong(documentSnapshot.data().longitude);
                    }
                });
            });
    }, []);

    // GET SELLER ADDRESS
    useEffect(() => {
        firebase.firestore()
            .collection('sellers')
            .doc(sellerId)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setDLat(documentSnapshot.data().Latitude);
                    setDLong(documentSnapshot.data().Longitude);
                }
            });
    }, []);

    // METER
    const calculateDistance = () => {
        var distance = getDistance(
            { latitude: uLat, longitude: uLong }, //USER LOCATION
            { latitude: dLat, longitude: dLong }//DESTINATION
        );
        return distance / 370;
    }

    // END METER

    const addBuyerCart = async () => {
        setModalVisible(true);
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const productName = productData.productName;
        const price = productData.productPrice;
        const category = productData.productCategory;
        const imageUrl = productData.imageUrl[0];
        const productStock = productData.productStock;
        const totalSold = productData.totalSold;
        const sellerId = productData.sellerUid;
        const storeName = productData.storeName;
        const itemWeight = productData.itemWeight;
        const selected = 1;
        const deliveryFee = parseFloat(calculateDistance() + 18).toFixed(2);

        const cartData = {
            createdAt: timestamp,
            productId: productId,
            productName: productName,
            price: price,
            category: category,
            quantity: quantity,
            userId: firebase.auth().currentUser.uid,
            imageUrl: imageUrl,
            storeName: storeName,
            sellerId: sellerId,
            productStock: productStock,
            totalSold: totalSold,
            itemWeight: itemWeight,
            deliveryFee: deliveryFee,
            selected: selected,

        }
        try {
            firebase.firestore()
                .collection('buyerCart')
                .where('productId', '==', productId, 'sellerId', '==', firebase.auth().currentUser.uid)
                .get()
                .then(querySnapshot => {
                    let uid = []
                    let oldOne = []
                    querySnapshot.forEach(documentSnapshot => {
                        oldOne.push(documentSnapshot.data().quantity);
                        uid.push(documentSnapshot.id);
                    });
                    if (querySnapshot.size == 1) {
                        let newQuantity = oldOne[0] + quantity;
                        firebase.firestore()
                            .collection('buyerCart')
                            .doc(uid[0])
                            .update({
                                'quantity': newQuantity,
                            }).then(() => {
                                setModalVisible(false);
                            })
                    } else {
                        firebase.firestore()
                            .collection('buyerCart')
                            .add(cartData)
                            .then(() => {
                                setModalVisible(false);
                            })
                            .catch((error) => {
                                alert(error);
                            });
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }

    const onFucking = useCallback((productData, index) => {

        const perform = productData.map((item) => {
            return { uri: item };
        });
        setCurrentIndex(index);
        setViewImage(perform);
        setIsVisible(true);
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
                    fontSize: RFPercentage(2),
                    color: Colors.DEFAULT_WHITE,
                }}
            >
                {imageIndex + 1} / {viewImage.length}
            </Text>

        </View >
    );

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    justifyContent: 'center',
                    alignItems: "center",
                }}
            >
                {EnterModal()}
            </View>
        )
    };

    function EnterModal() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={enterModal}
                onRequestClose={() => {
                    setEnter(!enterModal);
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
    }

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
                    marginTop: 5,
                    paddingVertical: 10,
                    // backgroundColor: Colors.DEFAULT_WHITE,
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
                    ></Text>
                </View>
                <View
                    style={{
                        width: '20%',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {/* SHARE HERE */}
                    <TouchableOpacity>
                        <Image
                            source={shareIcon}
                            resizeMode='contain'
                            style={{
                                width: 24,
                                height: 24,
                            }}
                        />
                    </TouchableOpacity>
                    {/* SHOOPPING CART HERE */}
                    <ShoppingCart />
                </View>
            </View>
        )
    };

    function renderImages() {
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Colors.DEFAULT_WHITE,
                    paddingBottom: 15,
                }}
            >

                <FlatList
                    data={productData.imageUrl}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={{
                            }}
                            onPress={() => {
                                onFucking(productData.imageUrl, index);
                            }}
                        >
                            <Image
                                source={{ uri: item }}
                                resizeMode='contain'
                                style={{
                                    height: Display.setHeight(32),
                                    width: deviceWidth,
                                    alignSelf: 'center',
                                }}
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    width: 32,
                                    height: 19,
                                    bottom: 0,
                                    right: 10,
                                    backgroundColor: Colors.INACTIVE_GREY,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "PoppinsSemiBold",
                                        fontSize: RFPercentage(1.7),
                                        color: Colors.DEFAULT_WHITE,
                                        textAlign: 'center',
                                    }}
                                >{1}/{productData.imageUrl.length}</Text>
                            </View>
                        </TouchableOpacity>

                    )

                    }
                />

                <ImageView
                    images={viewImage}
                    imageIndex={currentIndex}
                    visible={visible}
                    presentationStyle="overFullScreen"
                    animationType='fade'
                    onRequestClose={() => setIsVisible(false)}
                    // onImageIndexChange={(index) => setCurrentIndex(index)} 
                    FooterComponent={FooterComponent}
                />

            </View>
        )
    };

    function renderProductContent() {
        return (
            <View
                style={{
                    paddingVertical: 15,
                    paddingHorizontal: 18,
                }}
            >
                {/* NAME AND HEART */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(3),
                        }}
                    >
                        ₱{numeral(productData.productPrice).format('0,0.00')}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setWishList(!wishList)}
                    >
                        {
                            wishList == true ? <Image
                                source={heartSelect}
                                resizeMode='contain'
                                style={{
                                    width: 22,
                                    height: 22,
                                    tintColor: Colors.DEFAULT_YELLOW2,
                                }}
                            />
                                :
                                <Image
                                    source={heart}
                                    resizeMode='contain'
                                    style={{
                                        width: 22,
                                        height: 22,
                                    }}
                                />
                        }
                    </TouchableOpacity>

                </View>
                {/* NAME */}
                <View
                    style={{
                        marginTop: 5,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsRegular',
                            fontSize: RFPercentage(2.3),
                        }}
                    >{productData.productName}</Text>
                </View>

                {/* RATINGS AND SOLD */}
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 5,
                    }}
                >
                    {
                        productData.rating == 0 ? <></>
                            :
                            <View pointerEvents="none">
                                <StarRating
                                    rating={productData.rating}
                                    starSize={15}
                                    color={Colors.DEFAULT_STAR}
                                    starStyle={{
                                        marginHorizontal: 0.5,
                                    }}
                                />
                            </View>
                    }

                    {
                        productData.rating == 0 ? <></>
                            :
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                    marginLeft: 8,
                                }}
                            >{productData.rating}</Text>
                    }
                    {
                        productData.rating == 0 ? <></>
                            :
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                    marginHorizontal: 5,
                                }}
                            >|</Text>
                    }
                    {
                        productData.totalSold == 0 ? <></>
                            :
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >{productData.totalSold} sold</Text>
                    }
                    {
                        productData.totalSold == 0 ? <></>
                            :
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                    marginHorizontal: 5,
                                }}
                            >|</Text>
                    }
                    {
                        productData.productStock == 0 ? <></>
                            :
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            > {productData.productStock} stocks</Text>
                    }
                </View>


                {/* DESCRIPTION */}
                <View
                    style={{
                        marginTop: 10,
                    }}
                >
                    <Text
                        style={{
                            flex: 1,
                            fontFamily: "PoppinsRegular",
                            fontSize: RFPercentage(1.9),
                        }}
                    >
                        {productData.productDescription}
                    </Text>

                </View>

            </View>
        )
    };

    function renderShopName() {
        return (
            <View
                style={{
                    paddingVertical: 15,
                    paddingHorizontal: 18,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.DEFAULT_BG,
                            borderRadius: 15,
                        }}
                    >
                        <Image
                            source={store}
                            resizeMode='contain'
                            style={{
                                width: 20,
                                height: 20,
                            }}
                        />
                    </View>

                    {/* NAME */}
                    <View
                        style={{
                            flex: 1,
                            marginLeft: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                            }}
                        >{productData.storeName}</Text>
                    </View>

                    <View>
                        <TouchableOpacity
                            style={{
                                height: 30,
                                width: 70,
                                borderWidth: 0.5,
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => navigation.navigate("VisitShop", {
                                sellerId: sellerId,
                                productKey: productId,
                            })}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                }}
                            >Visit</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    };


    function renderProductReview() {

        if (productData.rating == 0) {
            return (
                <></>
            )
        } else {
            return (
                <TouchableOpacity
                    style={{
                        marginTop: 10,
                        paddingHorizontal: 18,
                    }}
                    onPress={() => navigation.navigate('BuyerDiscussion', {
                        productId: productId,
                    })}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                            }}
                        >Customer Review</Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                color: Colors.INACTIVE_GREY,
                            }}
                        >
                            See all
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 5,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                            }}
                        >{productData.rating} / 5</Text>
                        {
                            productData.rating == 0 ? <></>
                                :
                                <View pointerEvents="none"
                                    style={{
                                        marginLeft: 8,
                                    }}
                                >
                                    <StarRating
                                        rating={productData.rating}
                                        starSize={15}
                                        color={Colors.DEFAULT_STAR}
                                        starStyle={{
                                            marginHorizontal: 0.5,
                                        }}
                                    />
                                </View>
                        }

                    </View>
                    <View style={{ height: 0.5, backgroundColor: Colors.LIGHT_GREY2, marginTop: 15, marginHorizontal: 15, }} />
                </TouchableOpacity>
            )
        }
    };

    function renderReviews() {
        return (
            <View>
                <DetailsReviews
                    productId={productId}
                />
            </View>
        )
    }


    function renderComponent() {
        return (
            <View
                style={{}}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={Colors.DARK_ONE}
                    translucent
                />

                <Separator height={20} />

                <FlatList
                    data={productData.imageUrl}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    renderItem={({ item, index }) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 15,
                            }}
                        >
                            <View
                                style={{
                                    padding: 5,
                                }}
                            >
                                <Image
                                    source={{ uri: item }}
                                    resizeMode='contain'
                                    style={{
                                        height: 100,
                                        width: 100,
                                        // marginTop: 5,
                                    }}
                                />
                            </View>

                            {/* PRICE */}
                            <View
                                style={{
                                    flex: 1,
                                    marginLeft: 25,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(2.9),
                                        // color: Colors.DEFAULT_YELLOW2,
                                    }}
                                >₱{numeral(productData.productPrice).format('0,0.00')}</Text>

                                <Separator height={8} />
                                <Text
                                    style={{

                                        fontFamily: 'PoppinsRegular',
                                        fontSize: RFPercentage(1.9),
                                        color: Colors.INACTIVE_GREY,
                                    }}
                                >Available Stock: <Text style={{ color: Colors.DEFAULT_BLACK }} > {productData.productStock} items</Text></Text>
                            </View>


                        </View>

                    )

                    }
                />

                {/* COLOR */}
                {/* SIZE */}

                <Separator height={28} />
                {/* Quantity */}

                <View
                    style={{
                        paddingHorizontal: 15,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsBold',
                            fontSize: RFPercentage(2),
                        }}
                    >Quantity</Text>
                    <Separator height={15} />
                    <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 15,
                        }}
                    >
                        {/* MINUS BUTTON */}
                        <TouchableOpacity
                            style={{
                                width: 35,
                                height: 35,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 0.5,
                                borderColor: Colors.LIGHT_GREY2,
                                borderRadius: 8,
                            }}
                            onPress={() => {
                                if (quantity != 1) {
                                    setQuantity(quantity - 1);
                                } else {
                                    setQuantity(quantity);
                                }
                            }}
                        >
                            <AntDesign name="minus" size={15} />
                        </TouchableOpacity>
                        {/* VALUE QTY */}
                        <View
                            style={{
                                width: 95,
                                height: 35,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: Colors.DEFAULT_BG2,
                                borderRadius: 8,
                                marginHorizontal: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            >{quantity}</Text>
                        </View>
                        {/* PLUS BUTTON */}
                        <TouchableOpacity
                            style={{
                                width: 35,
                                height: 35,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 0.5,
                                borderColor: Colors.LIGHT_GREY2,
                                borderRadius: 8,
                            }}
                            onPress={() => {
                                if (quantity == productData.productStock) {
                                    setQuantity(quantity);
                                } else {
                                    setQuantity(quantity + 1);
                                }
                            }}

                        >
                            <AntDesign name="plus" size={15} />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <View style={{ width: Display.setWidth(100), height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 15, }} /> */}
                <Separator height={40} />
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            addBuyerCart();
                            refRBSheet.current.close();
                        }}
                        style={{
                            width: Display.setWidth(84),
                            height: Display.setHeight(6),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.DEFAULT_YELLOW2,
                            borderRadius: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(2),
                                color: Colors.DEFAULT_WHITE,
                            }}
                        >Confirm</Text>
                    </TouchableOpacity>
                </View>


            </View>
        )
    };


    function renderBottomSheet() {
        return (
            <View>
                <RBSheet
                    ref={refRBSheet}
                    // closeOnDragDown={true}
                    height={350}
                    openDuration={250}
                    closeDuration={250}
                    customStyles={{
                        container: {
                            // flex: 1,
                            // justifyContent: "center",
                            // alignItems: "center",
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }
                    }}
                >
                    {renderComponent()}
                </RBSheet>
            </View>
        )
    };

    function renderBottomButton() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    paddingVertical: 15,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: Display.setWidth(13),
                            height: Display.setHeight(6),
                            borderWidth: 0.5,
                            borderRadius: 30,
                            borderColor: Colors.INACTIVE_GREY,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => navigation.navigate('BuyerChat', {
                            productId: productId,
                            sellerId: productData.sellerUid,
                        })}
                    >
                        <Image
                            source={chatIcon}
                            resizeMode='contain'
                            style={{
                                width: 20,
                                height: 20,
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: Display.setWidth(70),
                            height: Display.setHeight(6),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.DEFAULT_YELLOW2,
                            borderRadius: 22,
                        }}
                        onPress={() => refRBSheet.current.open()}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(2),
                                color: Colors.DEFAULT_WHITE,
                                marginLeft: 8,
                            }}
                        >Add to bag</Text>
                    </TouchableOpacity>

                </View>

            </View>
        )
    };



    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={27} />
            {renderTop()}
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 60,
                }}
                showsVerticalScrollIndicator={false}
            >
                {renderImages()}

                <View
                    style={{
                        flex: 1,
                        backgroundColor: Colors.DEFAULT_WHITE,
                        borderWidth: 0.5,
                        borderColor: Colors.DEFAULT_WHITE,
                        borderTopColor: Colors.LIGHT_GREY2,
                    }}
                >
                    {renderProductContent()}
                    {renderShopName()}
                    {renderProductReview()}
                    {renderReviews()}
                </View>
            </ScrollView>
            {renderBottomSheet()}
            {renderBottomButton()}
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