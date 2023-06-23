import { StyleSheet, Text, View, Dimensions, ActivityIndicator, TouchableOpacity, Image, FlatList, StatusBar, Modal, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, Separator, Status, Display } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import numeral from 'numeral';
import { FontAwesome, Ionicons, Feather, AntDesign, MaterialCommunityIcons } from 'react-native-vector-icons';
import { firebase } from '../../../config';

const empty = require('../../../assets/Icon/magnifying-glass.png');

export default function BuyerShoppingBag({ navigation }) {



    const [productData, setProductData] = useState([]);

    const [selectedItem, setSelectedItem] = useState([])
    const [modalVisible, setModalVisible] = useState(true);
    const [loading, setLoading] = useState(true)

    const [isAlertModal, setAlertModal] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('buyerCart')
            .orderBy("createdAt", 'desc')
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().userId === firebase.auth().currentUser.uid) {
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
            });
        return () => { isMounted = false; subscriber() };
    }, []);

    const handleButtonClick = () => {
        setAlertModal(true);
        setTimeout(() => {
            setAlertModal(false);
        }, 1500);
    };

    // SELECTED
    const nowSelected = async (cartId) => {
        try {
            await firebase.firestore()
                .collection('buyerCart')
                .doc(cartId)
                .update({
                    selected: 1,
                })
                .then(() => {
                    console.log('User updated!');
                });
        } catch (error) {
            console.log(error);
        }
    };

    const notSelected = async (cartId) => {
        try {
            await firebase.firestore()
                .collection('buyerCart')
                .doc(cartId)
                .update({
                    selected: 0,
                })
                .then(() => {
                    console.log('User updated!');
                });
        } catch (error) {
            console.log(error);
        }
    };


    // DELETE
    const deleteCart = async (cartId) => {
        try {
            await firebase.firestore()
                .collection('buyerCart')
                .doc(cartId)
                .delete()
                .then(() => {
                    console.log('User deleted!');
                });
        } catch (error) {
            console.log(error);
        }
    }

    //CALCULATION
    const incrementQuantity = async (oldQ, key) => {
        let newQuantity = oldQ + 1;

        try {
            await firebase.firestore()
                .collection('buyerCart')
                .doc(key)
                .get()
                .then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        if (documentSnapshot.data().productStock == oldQ) {

                        } else {
                            firebase.firestore()
                                .collection('buyerCart')
                                .doc(key)
                                .update({
                                    'quantity': newQuantity,
                                })
                        }
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }
    const decrementQuantity = (oldQ, key) => {
        let newQuantity = oldQ - 1;

        if (oldQ == 1) {

        } else {
            firebase.firestore()
                .collection('buyerCart')
                .doc(key)
                .update({
                    'quantity': newQuantity,
                })
        }
    };


    // TOTAL ITEM
    const subTotal = (selectedItem) => {
        try {
            let sum = 0;
            for (let i = 0; i < selectedItem.length; i++) {
                sum += selectedItem[i].price * selectedItem[i].quantity;
            }
            return sum;
        } catch (error) {
            console.log(error);
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


    function AlertModal() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAlertModal}
                onRequestClose={() => {
                    setAlertModal(!isAlertModal);
                }}>
                <View style={{
                    alignItems: 'center',
                }}>
                    <View style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.8)',
                        borderRadius: 5,
                        width: Display.setWidth(80),
                        paddingVertical: 10,
                        alignItems: 'center',
                    }}>
                        <View
                            style={{
                                // flexDirection: 'row',
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                }}
                            >Select product to checkout</Text>
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
                    >Shopping cart ({productData.length})</Text>
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
                {
                    productData.length == 0 ? <></>
                        :
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                            }}
                        >

                            <View
                                style={{
                                    width: Display.setWidth(20),
                                    height: Display.setHeight(6),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsMedium',
                                        fontSize: RFPercentage(2),
                                        color: Colors.INACTIVE_GREY,
                                    }}
                                >Total Item</Text>
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(2.5),
                                    }}
                                >
                                    ₱ {numeral(subTotal(selectedItem)).format('0,0.00')}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={{
                                    width: Display.setWidth(48),
                                    height: Display.setHeight(6),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: Colors.DEFAULT_YELLOW2,
                                    borderRadius: 4,
                                }}
                                onPress={() => {
                                    if (selectedItem.length === 0) {
                                        handleButtonClick();
                                    } else {
                                        navigation.navigate('OrderSummary')
                                    }
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(2),
                                        color: Colors.DEFAULT_WHITE,
                                    }}
                                >Checkout ({selectedItem.length})</Text>
                            </TouchableOpacity>

                        </View>
                }



            </View>
        )
    };


    function renderItems() {
        return (
            <View>
                {
                    productData.length == 0 ? <View
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
                            style={{
                                height: Display.setHeight(84),
                            }}
                            data={productData}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <View
                                    style={{
                                        paddingHorizontal: 18,
                                        paddingVertical: 10,
                                    }}
                                >
                                    {/* TOP */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {
                                            item.selected === 0 ? <TouchableOpacity
                                                onPress={() => nowSelected(item.key)}
                                            >
                                                <Ionicons
                                                    name="radio-button-off"
                                                    color={Colors.INACTIVE_GREY}
                                                    size={18}
                                                />
                                            </TouchableOpacity>
                                                :
                                                <TouchableOpacity
                                                    onPress={() => notSelected(item.key)}
                                                >
                                                    <Ionicons
                                                        name="radio-button-on"
                                                        color={Colors.DEFAULT_YELLOW2}
                                                        size={18}
                                                    />
                                                </TouchableOpacity>
                                        }
                                        <Text
                                            style={{
                                                flex: 1,
                                                fontFamily: 'PoppinsSemiBold',
                                                fontSize: RFPercentage(1.9),
                                                marginLeft: 10,
                                            }}
                                        >{item.storeName}</Text>

                                        <TouchableOpacity
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 15,
                                                backgroundColor: Colors.DEFAULT_BG,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={() => deleteCart(item.key)}
                                        >
                                            <MaterialCommunityIcons name="delete-empty-outline" size={15} />
                                        </TouchableOpacity>
                                    </View>

                                    {/* MID */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingVertical: 20,
                                        }}
                                    >
                                        {
                                            item.selected === 0 ? <TouchableOpacity
                                                style={{
                                                    marginRight: 10,
                                                }}
                                                onPress={() => nowSelected(item.key)}
                                            >
                                                <Ionicons
                                                    name="radio-button-off"
                                                    color={Colors.INACTIVE_GREY}
                                                    size={18}
                                                />
                                            </TouchableOpacity>
                                                :
                                                <TouchableOpacity
                                                    style={{
                                                        marginRight: 10,
                                                    }}
                                                    onPress={() => notSelected(item.key)}
                                                >
                                                    <Ionicons
                                                        name="radio-button-on"
                                                        color={Colors.DEFAULT_YELLOW2}
                                                        size={18}
                                                    />
                                                </TouchableOpacity>
                                        }


                                        <Image
                                            source={{ uri: item.imageUrl }}
                                            resizeMode='contain'
                                            style={{
                                                width: 90,
                                                height: 90,
                                            }}
                                        />
                                        <View
                                            style={{
                                                flex: 1,
                                                marginLeft: 10,
                                                paddingHorizontal: 8,
                                            }}
                                        >
                                            <Text
                                                numberOfLines={2}
                                                style={{
                                                    fontSize: RFPercentage(1.9),
                                                    fontFamily: 'PoppinsMedium',
                                                }}
                                            >{item.productName}</Text>

                                            {/* STOCKS */}
                                            <Text
                                                style={{
                                                    fontFamily: 'PoppinsMedium',
                                                    fontSize: RFPercentage(1.8),
                                                    color: Colors.DARK_SEVEN,
                                                }}
                                            >Stocks {item.productStock}
                                                {/* {parseFloat((item.itemWeight))} */}
                                            </Text>


                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingTop: 5,
                                                }}
                                            >
                                                {/* PRICE */}
                                                <Text
                                                    style={{
                                                        fontSize: RFPercentage(2),
                                                        fontFamily: 'PoppinsSemiBold',
                                                        // color: Colors.DEFAULT_YELLOW2
                                                    }}
                                                >₱ {numeral(item.price).format('0,0.00')}</Text>

                                                {/* PLUS AND MINUS BUTTON */}
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    {/* MINUS BUTTON */}
                                                    <TouchableOpacity
                                                        style={{
                                                            width: 22,
                                                            height: 22,
                                                            borderWidth: 0.5,
                                                            borderRadius: 2,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',

                                                        }}
                                                        onPress={() => {
                                                            let x = item.quantity;
                                                            let n = item.key;
                                                            decrementQuantity(x, n);
                                                        }}
                                                    >
                                                        <AntDesign name="minus" size={13} />


                                                    </TouchableOpacity>

                                                    {/* QUANTITY */}

                                                    <View
                                                        style={{
                                                            width: 38,
                                                            height: 25,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontFamily: 'PoppinsSemiBold',
                                                                fontSize: RFPercentage(2),
                                                                textAlign: 'center'
                                                            }} >
                                                            {item.quantity}
                                                        </Text>
                                                    </View>

                                                    <TouchableOpacity
                                                        style={{
                                                            width: 22,
                                                            height: 22,
                                                            borderWidth: 0.5,
                                                            borderRadius: 2,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',

                                                        }}
                                                        onPress={() => {
                                                            let q = item.quantity;
                                                            let y = item.key;
                                                            incrementQuantity(q, y);
                                                        }}
                                                    >
                                                        <AntDesign name="plus" size={14} />


                                                    </TouchableOpacity>
                                                </View>

                                            </View>

                                        </View>
                                    </View>

                                    <View style={{ height: 0.7, backgroundColor: Colors.LIGHT_GREY2, marginTop: 15, marginBottom: 1, }} />

                                </View>
                            )
                            }
                        />
                }
            </View >
        )
    }



    return (
        <View style={styles.container} >
            <Status />
            {AlertModal()}
            <Separator height={27} />
            {renderTop()}
            {renderItems()}
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