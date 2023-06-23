import { StyleSheet, Text, View, Dimensions, ActivityIndicator, TouchableOpacity, ScrollView, Image, FlatList, StatusBar, Modal, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, Separator, Status, Display } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import numeral from 'numeral';
import { FontAwesome, Ionicons, Feather, AntDesign, MaterialCommunityIcons } from 'react-native-vector-icons';
import { firebase } from '../../../config';
import paypalApi from '../../apis/paypalApi'


const paypal = require('../../../assets/Icon/paypal.png');
const COD = require('../../../assets/Icon/COD.png');

const maps = require('../../../assets/images/maps.gif');
const deviceWidth = Dimensions.get('window').width
export default function OrderSummary({ navigation }) {

    const [selectedItem, setSelectedItem] = useState([])
    const [modalVisible, setModalVisible] = useState(true);
    const [modalPop, setModalPop] = useState(false);
    const [loading, setLoading] = useState(true)
    const [isSelected, setSelected] = useState(0);
    const buyerId = firebase.auth().currentUser.uid;
    const [addressData, setAddressData] = useState("");

    // PAYPAL URL
    const [paypalUrl, setPaypalUrl] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const method = [
        {
            id: 1,
            name: "Cash on delivery",
            img: COD,
        },
        {
            id: 2,
            name: "Paypal",
            img: paypal
        }
    ]


    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('buyerCart')
            .orderBy("createdAt", 'desc')
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().userId === firebase.auth().currentUser.uid && documentSnapshot.data().selected == 1) {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }
                });
                setSelectedItem(data);
                // setLoading(false);
            });
        return () => { isMounted = false; subscriber() };
    }, []);

    // GET ADDRESS
    useEffect(() => {
        firebase.firestore()
            .collection('buyerAddress')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().buyerId === buyerId && documentSnapshot.data().default === true) {
                        setAddressData(documentSnapshot.data());
                        setLoading(false);
                    }
                });
            });
    }, []);




    const numberTrans = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let transactionNumber = '';
        for (let i = 0; i < 16; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            transactionNumber += characters.charAt(randomIndex);
        };
        return transactionNumber;
    };


    // CALCULATION

    const shippingFee = (deliveryFee, weight, qty) => {
        let sum = 0;
        let total = 0;

        sum = parseFloat(weight) * qty;
        if (sum >= 1) {
            total = parseFloat(deliveryFee) + 100;
        } else {
            total = deliveryFee;
        }
        return total;
    };

    const deliveryFee = (arrayData) => {
        let sum = 0;
        let total = 0;

        for (let i = 0; i < arrayData.length; i++) {
            // sum += parseFloat(arrayData[i].deliveryFee);
            sum += parseFloat(arrayData[i].itemWeight) * arrayData[i].quantity;

            if (sum >= 1) {
                total += parseFloat(arrayData[i].deliveryFee) + 100;
            } else {
                total += parseFloat(arrayData[i].deliveryFee);
            }
        }
        return total;
    };
    const subTotal = (arrayData) => {
        let sum = 0;
        for (let i = 0; i < arrayData.length; i++) {
            sum += arrayData[i].price * arrayData[i].quantity + deliveryFee(arrayData);
        }
        return sum;
    };

    const getAdditionalFee = (arrayData) => {
        let sum = 0;
        for (let i = 0; i < arrayData.length; i++) {
            sum += arrayData[i].quantity * parseFloat(arrayData[i].itemWeight);
        }
        return sum;
    };

    const additionFee = (arrayData) => {
        let sum = 0;
        if (getAdditionalFee(arrayData) >= 1) {
            sum += getAdditionalFee(arrayData) * 25;
        } else {
            sum += 0;
        }
        return sum;
    };
    const getVat = (arrayData) => {
        let sum = 0;
        sum = 0.05 * subTotal(arrayData);
        return sum;
    };

    const totalPay = (arrayData) => {
        let sum = 0;
        sum = subTotal(arrayData) + getVat(arrayData);
        return sum;
    };

    const totalPayIndividual = (price, qty, deliveryFee, weight) => {
        let sum = 0;
        let total = 0;
        let individual = 0;
        let vat = 0;
        let overAll = 0;
        sum = parseFloat(weight) * qty;
        if (sum >= 1) {
            total = parseFloat(deliveryFee) + 100;
        } else {
            total = deliveryFee;
        }
        individual = price * qty + parseFloat(total);
        vat = individual * 0.05;
        overAll = individual + vat;
        return parseFloat(overAll).toFixed(2);
    };

    const individualVat = (price, qty, deliveryFee, weight) => {
        let sum = 0;
        let total = 0;
        let individual = 0;
        let vat = 0;

        sum = parseFloat(weight) * qty;
        if (sum >= 1) {
            total = parseFloat(deliveryFee) + 100;
        } else {
            total = deliveryFee;
        }
        individual = price * qty + parseFloat(total);
        vat = individual * 0.05;
        return vat;
    }

    // END OF CALCULATION

    const items = selectedItem.map(item => {
        return {
            name: item.productName,
            description: "Handmade Products",
            quantity: item.quantity,
            unit_amount: {
                currency_code: "PHP",
                value: parseFloat(totalPayIndividual(item.price, item.quantity, item.deliveryFee, item.itemWeight)).toFixed(2)
            }
        }
    })

    // ORDER SUBMIT

    let orderDetail = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                // "items": [
                //     {
                //         "name": "T-Shirt",
                //         "description": "Green XL",
                //         "quantity": "1",
                //         "unit_amount": {
                //             "currency_code": "PHP",
                //             "value": totalPay(selectedItem)
                //         }
                //     }
                // ],
                "items": items,
                "amount": {
                    "currency_code": "PHP",
                    "value": parseFloat(totalPay(selectedItem)).toFixed(2),
                    "breakdown": {
                        "item_total": {
                            "currency_code": "PHP",
                            "value": parseFloat(totalPay(selectedItem)).toFixed(2)
                        }
                    }
                }
            }
        ],
        "application_context": {
            "return_url": "https://example.com/return",
            "cancel_url": "https://example.com/cancel"
        }
    };

    const onPressPaypal = async () => {
        setModalPop(true);
        try {
            const token = await paypalApi.generateToken()
            // console.log(token);
            setAccessToken(token);
            const res = await paypalApi.createOrder(token, orderDetail)

            // console.log(res);
            if (!!res?.links) {
                const findUrl = res.links.find(data => data?.rel == "approve");
                // console.log("URL:", findUrl);
                const orderId = Math.floor(Math.random() * 99999999999 + 100000000000);
                const timestamp = firebase.firestore.FieldValue.serverTimestamp();
                const phoneNumber = addressData.phoneNumber;
                const fullName = addressData.fullName;
                const address = addressData.addressInfo + " " + addressData.barangay + " " + addressData.city + " " + addressData.province + " " + addressData.region;
                const amount = totalPay(selectedItem);

                try {
                    for (let i = 0; i < selectedItem.length; i++) {
                        console.log(shippingFee(selectedItem[i].deliveryFee, selectedItem[i].itemWeight, selectedItem[i].quantity));
                        await firebase.firestore()
                            .collection('placeOrders')
                            .add({
                                orderedDate: timestamp,
                                orderID: orderId,
                                productUid: selectedItem[i].productId,
                                productName: selectedItem[i].productName,
                                category: selectedItem[i].category,
                                price: selectedItem[i].price,
                                quantity: selectedItem[i].quantity,
                                imageUrl: selectedItem[i].imageUrl,
                                buyerId: selectedItem[i].userId,
                                deliveryFee: shippingFee(selectedItem[i].deliveryFee, selectedItem[i].itemWeight, selectedItem[i].quantity),
                                paymentMethod: 'Paypal',
                                orderStatus: 'Pending',
                                rated: 0,
                                fullName: fullName,
                                phoneNumber: phoneNumber,
                                shippingAddress: address,
                                sellerUid: selectedItem[i].sellerId,
                                storeName: selectedItem[i].storeName,
                                totalVat: parseFloat(individualVat(selectedItem[i].price, selectedItem[i].quantity, selectedItem[i].deliveryFee, selectedItem[i].itemWeight)).toFixed(2),
                                totalPay: parseFloat(totalPayIndividual(selectedItem[i].price, selectedItem[i].quantity, selectedItem[i].deliveryFee, selectedItem[i].itemWeight)).toFixed(2),
                            }).then(() => {
                                setModalPop(false);
                                navigation.navigate('PaypalPayment', {
                                    paypalUrl: findUrl.href,
                                    token: token,
                                    totalPay: totalPay(selectedItem),
                                });
                                firebase.firestore()
                                    .collection('allProducts')
                                    .doc(selectedItem[i].productId)
                                    .update({
                                        productStock: selectedItem[i].productStock - selectedItem[i].quantity,
                                        totalSold: selectedItem[i].totalSold + selectedItem[i].quantity,
                                    })
                                    .then(() => {
                                        firebase.firestore()
                                            .collection('sellerNotif')
                                            .add({
                                                productName: selectedItem[i].productName,
                                                deliveryDate: timestamp,
                                                buyerId: selectedItem[i].userId,
                                                sellerId: selectedItem[i].sellerId,
                                            })
                                    });
                            }).then(() => {
                                firebase.firestore()
                                    .collection('buyerCart')
                                    .doc(selectedItem[i].key)
                                    .delete()
                                    .then(() => {
                                        console.log('Deleting.. ' + i);
                                    })
                            })
                            .catch((error) => {
                                alert(error);
                            });

                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };


    const submitOrders = async () => {
        setModalPop(true);
        const orderId = Math.floor(Math.random() * 99999999999 + 100000000000);
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const phoneNumber = addressData.phoneNumber;
        const fullName = addressData.fullName;
        const address = addressData.addressInfo + " " + addressData.barangay + " " + addressData.city + " " + addressData.province + " " + addressData.region;
        const amount = totalPay(selectedItem);
        try {
            for (let i = 0; i < selectedItem.length; i++) {
                console.log(shippingFee(selectedItem[i].deliveryFee, selectedItem[i].itemWeight, selectedItem[i].quantity));
                await firebase.firestore()
                    .collection('placeOrders')
                    .add({
                        orderedDate: timestamp,
                        orderID: orderId,
                        productUid: selectedItem[i].productId,
                        productName: selectedItem[i].productName,
                        category: selectedItem[i].category,
                        price: selectedItem[i].price,
                        quantity: selectedItem[i].quantity,
                        imageUrl: selectedItem[i].imageUrl,
                        buyerId: selectedItem[i].userId,
                        deliveryFee: shippingFee(selectedItem[i].deliveryFee, selectedItem[i].itemWeight, selectedItem[i].quantity),
                        paymentMethod: 'Cash on delivery',
                        orderStatus: 'Pending',
                        rated: 0,
                        fullName: fullName,
                        phoneNumber: phoneNumber,
                        shippingAddress: address,
                        sellerUid: selectedItem[i].sellerId,
                        storeName: selectedItem[i].storeName,
                        totalVat: parseFloat(individualVat(selectedItem[i].price, selectedItem[i].quantity, selectedItem[i].deliveryFee, selectedItem[i].itemWeight)).toFixed(2),
                        totalPay: parseFloat(totalPayIndividual(selectedItem[i].price, selectedItem[i].quantity, selectedItem[i].deliveryFee, selectedItem[i].itemWeight)).toFixed(2),
                    }).then(() => {
                        setModalPop(false);
                        navigation.navigate("BuyerCODSuccess", {
                            amount: amount,
                            numberTrans: numberTrans(),
                        });
                        firebase.firestore()
                            .collection('allProducts')
                            .doc(selectedItem[i].productId)
                            .update({
                                productStock: selectedItem[i].productStock - selectedItem[i].quantity,
                                totalSold: selectedItem[i].totalSold + selectedItem[i].quantity,
                            })
                            .then(() => {
                                firebase.firestore()
                                    .collection('sellerNotif')
                                    .add({
                                        productName: selectedItem[i].productName,
                                        deliveryDate: timestamp,
                                        buyerId: selectedItem[i].userId,
                                        sellerId: selectedItem[i].sellerId,
                                    })
                            });
                    }).then(() => {
                        firebase.firestore()
                            .collection('buyerCart')
                            .doc(selectedItem[i].key)
                            .delete()
                            .then(() => {
                                console.log('Deleting.. ' + i);
                            })
                    })
                    .catch((error) => {
                        alert(error);
                    });

            }


        } catch (error) {
            console.log(error)
        }
    }


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

    function PopModal() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalPop}
                onRequestClose={() => {
                    setModalPop(!modalPop);
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
                    >Orders</Text>
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

    function renderShipping() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                    }}
                >
                    Shipping Address
                </Text>
                <TouchableOpacity
                    style={{
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.navigate('ShippingAddress')}
                >
                    {/* IMAGE */}
                    <Image
                        source={maps}
                        resizeMode='contain'
                        style={{
                            width: 80,
                            height: 80,
                        }}
                    />
                    {/* NAME */}
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(2),
                            }}
                        >{addressData.fullName}</Text>

                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(1.9),
                                marginVertical: 3,
                            }}
                        >
                            +63 {addressData.phoneNumber}
                        </Text>

                        <Text
                            style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: RFPercentage(1.8),

                            }}
                        >
                            {addressData.addressInfo + " " + addressData.barangay + " " + addressData.city + " " + addressData.province + " " + addressData.region}
                        </Text>
                    </View>
                    {/* ICONS */}
                    <Ionicons name="chevron-forward" size={18} color={Colors.INACTIVE_GREY} />
                </TouchableOpacity>

            </View>
        )
    };

    function renderProduct() {
        return (
            <View
                style={{
                    paddingHorizontal: 18,
                }}
            >
                {
                    selectedItem.map((item, i) => (
                        <View
                            style={{
                                marginTop: 15,
                            }}
                            key={i}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <MaterialCommunityIcons name="check-decagram" size={15} color={Colors.SECONDARY_GREEN} />
                                <Text
                                    style={{
                                        marginLeft: 10,
                                        fontFamily: "PoppinsSemiBold",
                                        fontSize: RFPercentage(1.9),
                                    }}
                                >{item.storeName}</Text>
                            </View>

                            {/* PRODUCT */}
                            <View
                                style={{
                                    paddingVertical: 10,
                                    flexDirection: 'row',
                                }}
                            >
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    resizeMode='contain'
                                    style={{
                                        width: 85,
                                        height: 85,
                                    }}
                                />
                                {/* NAME */}
                                <View
                                    style={{
                                        flex: 1,
                                        paddingHorizontal: 13,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: RFPercentage(1.9),
                                            fontFamily: 'PoppinsSemiBold',
                                            color: Colors.DARK_THREE,
                                            letterSpacing: 0.1,
                                        }}
                                    >{item.productName}</Text>

                                    <Text
                                        style={{
                                            fontFamily: "PoppinsRegular",
                                            fontSize: RFPercentage(1.9),
                                            color: Colors.INACTIVE_GREY,
                                            marginVertical: 5,
                                        }}
                                    >
                                        {item.category}
                                    </Text>

                                    {/* PRICE */}
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
                                        >₱{numeral(item.price).format('0,0.00')}</Text>
                                        <Text
                                            style={{
                                                fontFamily: 'PoppinsSemiBold',
                                                fontSize: RFPercentage(1.9),
                                                color: Colors.INACTIVE_GREY,
                                            }}
                                        >x{item.quantity}</Text>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 15,
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsRegular',
                                            fontSize: RFPercentage(1.6),
                                            color: Colors.DARK_SIX,
                                        }}
                                    >Subtotal:</Text>
                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsRegular',
                                            fontSize: RFPercentage(1.6),
                                            color: Colors.DARK_SIX,
                                            marginTop: 5,
                                        }}
                                    >Shipping Fee:</Text>

                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsRegular',
                                            fontSize: RFPercentage(1.6),
                                            color: Colors.DARK_SIX,
                                            marginTop: 5,
                                        }}
                                    >Vat(5%):</Text>

                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsMedium',
                                            fontSize: RFPercentage(1.6),
                                            marginTop: 5,
                                        }}
                                    >Total:</Text>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsMedium',
                                            fontSize: RFPercentage(1.6),
                                            color: Colors.DARK_SIX,
                                            textAlign: 'right',
                                        }}
                                    >₱{numeral(item.price * item.quantity).format('0,0.00')}</Text>

                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsMedium',
                                            fontSize: RFPercentage(1.6),
                                            color: Colors.DARK_SIX,
                                            textAlign: 'right',
                                            marginTop: 5,
                                        }}
                                    >₱{numeral(shippingFee(item.deliveryFee, item.itemWeight, item.quantity)).format('0,0.00')}</Text>
                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsMedium',
                                            fontSize: RFPercentage(1.6),
                                            color: Colors.DARK_SIX,
                                            textAlign: 'right',
                                            marginTop: 5,
                                        }}
                                    >₱{numeral(individualVat(item.price, item.quantity, item.deliveryFee, item.itemWeight)).format('0,0.00')}</Text>

                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsMedium',
                                            fontSize: RFPercentage(1.6),
                                            textAlign: 'right',
                                            marginTop: 5,
                                        }}
                                    >₱{numeral(totalPayIndividual(item.price, item.quantity, item.deliveryFee, item.itemWeight)).format('0,0.00')}</Text>
                                </View>
                            </View>

                            <View style={{ height: 0.5, backgroundColor: Colors.LIGHT_GREY2, marginTop: 15 }} />
                        </View>
                    ))
                }
            </View>
        )
    };
    function renderPaymentMethod() {
        return (
            <View
                style={{
                    marginTop: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                    }}
                >
                    Payment Method
                </Text>

                {
                    method.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={{
                                paddingHorizontal: 10,
                                marginTop: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            onPress={() => setSelected(i)}
                        >
                            <Image
                                source={item.img}
                                resizeMode='contain'
                                style={{
                                    width: 27,
                                    height: 27,
                                }}
                            />
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(2),
                                    }}
                                >{item.name}</Text>
                            </View>
                            <Ionicons
                                name={isSelected == i ? "radio-button-on" : "radio-button-off-sharp"}
                                color={isSelected == i ? Colors.DEFAULT_YELLOW2 : Colors.INACTIVE_GREY}
                                size={18}
                            />
                        </TouchableOpacity>
                    ))
                }
            </View>
        )
    };
    function renderSummary() {
        return (
            <View
                style={{
                    marginTop: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                    }}
                >
                    Order summary
                </Text>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 5,
                    }}
                >

                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                textAlign: 'left',
                                color: Colors.DARK_SEVEN,
                            }}
                        >Subtotal</Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                marginTop: 10,
                                textAlign: 'left',
                                color: Colors.DARK_SEVEN,
                            }}
                        >Delivery Fee </Text>

                        {/* <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                marginTop: 10,
                                textAlign: 'left',
                                color: Colors.DARK_SEVEN,
                            }}
                        >Additional Fee(Delivery)</Text> */}

                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                marginTop: 10,
                                textAlign: 'left',
                                color: Colors.DARK_SEVEN,
                            }}
                        >Total vat(5%) </Text>

                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                marginTop: 10,
                                textAlign: 'left',
                            }}
                        >Total </Text>
                    </View>

                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                textAlign: 'right',
                                color: Colors.DARK_THREE,
                            }}
                        >₱ {numeral(subTotal(selectedItem)).format('0,0.00')}</Text>
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                textAlign: 'right',
                                marginTop: 10,
                                color: Colors.DARK_THREE,
                            }}
                        >₱ {numeral(deliveryFee(selectedItem)).format('0,0.00')}</Text>


                        {/* <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                textAlign: 'right',
                                marginTop: 10,
                                color: Colors.DARK_THREE,
                            }}
                        >₱{numeral(additionFee(selectedItem)).format('0,0.00')}</Text> */}

                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                textAlign: 'right',
                                marginTop: 10,
                                color: Colors.DARK_THREE,
                            }}
                        >₱ {numeral(getVat(selectedItem)).format('0,0.00')}</Text>

                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                marginTop: 10,
                                textAlign: 'right',
                            }}
                        >₱ {numeral(totalPay(selectedItem)).format('0,0.00')} </Text>

                    </View>

                </View>

            </View>
        )
    };

    function renderTerms() {
        return (
            <View
                style={{
                    marginTop: 5,
                    backgroundColor: Colors.DEFAULT_BG,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                }}
            >
                <Text
                    style={{
                        textAlign: 'justify',
                        fontFamily: 'PoppinsRegular',
                        fontSize: RFPercentage(1.8),
                        color: Colors.DARK_SIX
                    }}
                >
                    <Text style={{ fontFamily: 'PoppinsMedium', color: Colors.DEFAULT_BLACK }} >By placing an order, </Text>
                    you agree to the
                    <Text style={{ fontFamily: 'PoppinsMedium', color: Colors.DEFAULT_BLACK }} > Davcu app Terms and Condition, </Text>
                    and acknowledge that you have read the Davcu Privacy Policy.</Text>
            </View>
        )
    };


    function renderNewBottom() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: deviceWidth,
                    paddingVertical: 8,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    borderWidth: 0.9,
                    borderColor: Colors.DEFAULT_WHITE,
                    borderTopColor: Colors.DEFAULT_BG2,
                }}
            >


                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 8,
                        paddingHorizontal: 25,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >Total({selectedItem.length} items)</Text>
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >Php {numeral(totalPay(selectedItem)).format('0,0.00')}</Text>
                </View>

                {
                    isSelected == 0 ? <TouchableOpacity
                        style={{
                            width: Display.setWidth(86),
                            height: Display.setHeight(6.2),
                            borderRadius: 10,
                            backgroundColor: Colors.DEFAULT_YELLOW2,
                            alignSelf: "center",
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 15,
                        }}
                        onPress={submitOrders}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(2.1),
                                color: Colors.DEFAULT_WHITE,
                            }}
                        >Place an order</Text>
                    </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={{
                                width: Display.setWidth(86),
                                height: Display.setHeight(6.2),
                                borderRadius: 10,
                                backgroundColor: Colors.DEFAULT_YELLOW2,
                                alignSelf: "center",
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 15,
                            }}

                            onPress={onPressPaypal}
                        >
                            <Text
                                style={{
                                    fontFamily: "PoppinsSemiBold",
                                    fontSize: RFPercentage(2.1),
                                    color: Colors.DEFAULT_WHITE,
                                }}
                            >Place an order</Text>
                        </TouchableOpacity>
                }
            </View >
        )
    };

    return (
        <View style={styles.container} >
            <Status />
            {PopModal()}
            <Separator height={27} />
            {renderTop()}
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 102,
                }}
                showsVerticalScrollIndicator={false}
            >
                {renderShipping()}
                {renderProduct()}
                {renderPaymentMethod()}
                {renderSummary()}
                {renderTerms()}
            </ScrollView>
            {renderNewBottom()}
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
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 5,
        width: Display.setWidth(45),

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