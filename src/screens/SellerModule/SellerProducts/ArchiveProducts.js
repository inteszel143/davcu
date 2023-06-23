import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, StatusBar, Dimensions, Modal, } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Colors,
    Display,
    Separator, Status,
} from '../../../constants';
import numeral from 'numeral';
import { MaterialCommunityIcons, AntDesign, Ionicons } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../../config';
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";

export default function ArchiveProducts() {
    const navigation = useNavigation();
    const refRBSheet = useRef();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalProductID, setModalProductID] = useState('');
    const userId = firebase.auth().currentUser.uid;
    const [productData, setProductData] = useState('');
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('allProducts')
            .orderBy("createdAt", 'desc')
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().sellerUid === userId && documentSnapshot.data().productStatus === 'Not Available') {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }
                });
                setProductData(data);
                setLoading(false);

            });
        return () => subscriber();
    }, []);

    if (loading) {
        return <View
            style={{
                flex: 1,
            }}
        >
            <ActivityIndicator size="small" color={Colors.DEFAULT_YELLOW2} />
        </View>;
    };


    // RESTORE

    const restoreProduct = async (productKey) => {
        setModalVisible(true);
        try {
            await firebase.firestore()
                .collection('allProducts')
                .doc(productKey)
                .update({
                    productStatus: 'Available',
                })
                .then(() => {
                    setModalVisible(false);
                });
        } catch (error) {
            console.log(error);
        }

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
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
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
                    }}>
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
                            >Restoring</Text>
                        </View>

                    </View>
                </View>


            </Modal>
        )
    };

    function renderComponent() {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={Colors.DARK_ONE}
                    translucent
                />


                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current.close();
                        setTimeout(() => {
                            restoreProduct(modalProductID)
                            // navigation.replace('SellerUpdateProduct', {
                            //     docKey: modalProductID,
                            // });
                        }, 500)
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >Restore Product</Text>
                </TouchableOpacity>

                <View style={{ width: Display.setWidth(100), height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 15, }} />

                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current.close();
                        setTimeout(() => {
                            toggleModalDelete()
                        }, 1000)
                        setTimeout(() => {
                            deleteProduct(modalProductID);
                        }, 3000)

                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_RED,
                        }}
                    >Permanent delete</Text>
                </TouchableOpacity>

            </View>
        )
    };




    function renderBottomSheet() {
        return (
            <View>
                <RBSheet
                    ref={refRBSheet}
                    height={130}
                    openDuration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center",
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        }
                    }}
                >
                    {renderComponent()}
                </RBSheet>
            </View>
        )
    }


    return (
        <View style={styles.container} >
            {renderBottomSheet()}
            {MessageAlert()}
            {
                productData.length === 0 ?
                    <View
                        style={{
                            marginTop: Display.setHeight(16),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={require('../../../../assets/images/emptycart2.png')}
                            resizeMode='contain'
                            style={{
                                width: 170,
                                height: 170,
                            }}
                        />

                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                                color: Colors.DARK_THREE
                            }}
                        >No Product Found</Text>
                    </View>

                    :
                    <FlatList
                        data={productData}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: Colors.DEFAULT_WHITE,
                                    paddingVertical: 15,
                                    marginHorizontal: 10,
                                    borderWidth: 0.8,
                                    borderColor: Colors.DEFAULT_WHITE,
                                    borderBottomColor: Colors.LIGHT_GREY2,
                                    paddingBottom: 15,
                                    marginTop: 8,
                                    borderRadius: 5,
                                }}
                                // onPress={() => {
                                //     navigation.replace('SellerViewProduct', {
                                //         docKey: item.key,
                                //     });

                                // }}
                                onPress={() => {
                                    refRBSheet.current.open();
                                    setModalProductID(item.key);
                                }}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: 10,
                                }} >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'PoppinsSemiBold',
                                                fontSize: RFPercentage(1.8),
                                            }}
                                        >SKU: {item.SKU}</Text>
                                    </View>


                                    <TouchableOpacity
                                        onPress={() => {
                                            refRBSheet.current.open();
                                            setModalProductID(item.key);
                                        }}
                                    // onPress={() => {
                                    //     setModalProductID(item.key);
                                    //     toggleModal();
                                    // }}
                                    >
                                        <MaterialCommunityIcons name='dots-horizontal' size={22} />
                                    </TouchableOpacity>

                                </View>


                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingHorizontal: 10,

                                    }}
                                >
                                    <Image
                                        source={{ uri: item.imageUrl[0] }}
                                        resizeMode='contain'
                                        style={{
                                            height: Display.setHeight(15),
                                            width: Display.setWidth(25),
                                        }}
                                    />

                                    {/* </View> */}

                                    <View
                                        style={{
                                            flex: 1,
                                            paddingHorizontal: 15,
                                        }}
                                    >
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontFamily: 'PoppinsMedium',
                                                fontSize: RFPercentage(1.9),
                                                color: Colors.DARK_THREE,
                                            }}
                                        >{item.productName}</Text>

                                        <Separator height={20} />

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {/* PRICE */}
                                            <Text
                                                style={{
                                                    fontFamily: 'PoppinsSemiBold',
                                                    fontSize: RFPercentage(2),
                                                }}
                                            >
                                                ₱{numeral(item.productPrice).format('0,0.00')}

                                            </Text>

                                            {/* PRICE */}
                                            <Text
                                                style={{
                                                    fontFamily: 'PoppinsMedium',
                                                    fontSize: RFPercentage(1.8),
                                                    justifyContent: 'flex-end',
                                                    color: Colors.DARK_THREE,
                                                }}
                                            >
                                                Items sold: <Text style={{ fontFamily: 'PoppinsSemiBold', }} >{item.totalSold}</Text>

                                            </Text>

                                        </View>

                                    </View>
                                </View>
                                <Separator height={8} />
                                <View
                                    style={{
                                        borderRadius: 5,
                                        backgroundColor: Colors.DEFAULT_BG,
                                        paddingVertical: 8,
                                        marginHorizontal: 15,
                                        justifyContent: 'center',
                                        paddingHorizontal: 15,
                                    }}
                                >
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
                                            <View>
                                                <MaterialCommunityIcons name='alpha-s-box-outline' size={16} color={Colors.DARK_SEVEN} />
                                            </View>

                                            <View
                                                style={{
                                                    marginLeft: 8,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'PoppinsSemiBold',
                                                        fontSize: RFPercentage(1.8),
                                                    }}
                                                >Total Stock:
                                                    <Text style={{ fontSize: RFPercentage(1.9), }} > {item.productStock}</Text>
                                                </Text>
                                            </View>

                                        </View>
                                        {
                                            item.productStock <= 15 && <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Ionicons name='alert-circle-outline' size={16} color={Colors.DEFAULT_RED} />
                                                <Text
                                                    style={{
                                                        marginLeft: 5,
                                                        fontFamily: 'PoppinsMedium',
                                                        fontSize: RFPercentage(1.8),
                                                        color: Colors.DEFAULT_RED,
                                                    }}
                                                >Low Stock</Text>
                                                {/* <MaterialCommunityIcons name='check-decagram' size={18} color={Colors.DEFAULT_GREEN} /> */}
                                            </View>
                                        }
                                    </View>

                                </View>
                            </TouchableOpacity>
                        )
                        }
                    />

            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    modalView: {
        margin: 20,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 5,
        width: Display.setWidth(80),
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
    modalText: {
        color: Colors.DEFAULT_WHITE,
        textAlign: 'center',
        fontFamily: 'PoppinsSemiBold',
        fontSize: RFPercentage(2.2),
        paddingHorizontal: 40,
    },
})