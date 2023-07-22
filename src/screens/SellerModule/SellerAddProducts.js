import { StyleSheet, StatusBar, View, Image, Text, TouchableOpacity, Dimensions, TextInput, Keyboard, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from 'expo-image-picker';
import { Colors, Display, Separator, General, Status } from '../../constants'
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RBSheet from "react-native-raw-bottom-sheet";

import { firebase } from '../../../config';

export default function SellerAddProducts({ navigation }) {
    const refRBSheet = useRef();

    const [image, setImage] = useState([])
    const [urls, setUrls] = useState([]);

    const [confirm, setConfirm] = useState(false);

    // DATA

    const [storeName, setStoreName] = useState('')

    const [productCategory, setProductCategory] = useState('')
    const [productName, setProductName] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productStock, setProductStock] = useState(0)
    const [itemWeight, setItemWeight] = useState('')

    // TOOLS
    const [categoryError, setCategoryError] = useState(null)
    const [showButton, setShowButton] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [confirmModal, setConfirmModal] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);

    useEffect(() => {
        const isDisabled = !productName || !productDescription || !productPrice || !productStock || !itemWeight || productCategory === '' || image.length < 1;
        setShowButton(isDisabled);
    }, [productCategory, productName, productDescription, productPrice, productStock, itemWeight, image]);


    //SELLER INFO
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            firebase.firestore()
                .collection('sellers')
                .doc(firebase.auth().currentUser.uid).get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setStoreName(snapshot.data().shopName);
                    }
                })
        }
        return () => { isMounted = false; };
    }, []);



    const uploadImage = async () => {
        setModalVisible(true);
        try {
            for (let step = 0; step < image.length; step++) {
                const uploadUri = image[step];
                let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
                const response = await fetch(uploadUri);
                const blob = await response.blob();
                const storageRef = firebase.storage().ref().child(`/productImages/${filename}`)
                const snapshot = storageRef.put(blob);
                snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    () => {
                        setUploading(true)
                    },
                    (error) => {
                        setUploading(false)
                        console.log(error)
                        blob.close()
                        return
                    },
                    async () => {
                        await snapshot.snapshot.ref.getDownloadURL()
                            .then((url) => {
                                setUploading(false)
                                console.log(url)
                                setUrls((urls) => urls.concat(url));
                                blob.close()
                                return url
                            })
                        setModalVisible(false);
                        setConfirmModal(true)
                    })
            }
        } catch (error) {
            console.log(error);
        }
    };


    const publishProduct = async () => {
        setLoadingButton(true);
        const SKU = Math.floor(Math.random() * 99999999999 + 100000000000);
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const productStatus = 'Available';
        const productData = {
            productName: productName,
            productDescription: productDescription,
            productPrice: productPrice,
            productStock: productStock,
            productCategory: productCategory,
            itemWeight: itemWeight,
            createdAt: timestamp,
            imageUrl: urls,
            sellerUid: firebase.auth().currentUser.uid,
            storeName: storeName,
            SKU: SKU,
            totalSold: 0,
            rating: 0,
            viewed: 0,
            productStatus: productStatus,
        }
        try {
            await firebase.firestore()
                .collection('allProducts')
                .add(productData)
                .then(() => {
                    setUrls([]);
                    setImage([]);
                    setConfirmModal(false);
                    navigation.replace('SellerProducts');
                    setLoadingButton(false);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const removeImage = () => {
        setImage(image.slice(0, image.length - 1));
        setConfirm(false);

    };
    const openCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
        });

        if (!result.cancelled) {
            // setImage(result.uri);
            setImage((images) => images.concat(result.uri));
        }
    };
    const openPickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        // const source = {uri: result.uri};
        // console.log(source);
        // setImage(source);

        if (!result.cancelled) {
            // setImage([...image, result.uri]);
            // setImage(result.uri ? [result.uri] : result.selected);
            setImage((images) => images.concat(result.uri));
            // setImage(result.uri);
        }
    };

    function ConfirmAlert() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={confirmModal}
                onRequestClose={() => {
                    setConfirmModal(!confirmModal);
                }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.8)',
                        borderRadius: 5,
                        width: Display.setWidth(85),
                        paddingVertical: 20,
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
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/wright.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    marginBottom: 10,
                                    tintColor: Colors.DEFAULT_YELLOW2,
                                }}
                            />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(2.3),
                                    color: Colors.DEFAULT_WHITE,
                                    paddingHorizontal: 40,
                                    textAlign: 'center',
                                }}
                            >Item has been added successfully.</Text>
                        </View>

                        <TouchableOpacity
                            style={{
                                marginTop: 15,
                                borderWidth: 1,
                                borderColor: Colors.DEFAULT_WHITE,
                                borderRadius: 5,
                                paddingHorizontal: 16,
                                paddingVertical: 5,
                            }}
                            onPress={publishProduct}
                        >
                            {
                                loadingButton ? <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                                    :
                                    <Text
                                        style={{
                                            fontFamily: "PoppinsRegular",
                                            fontSize: RFPercentage(1.9),
                                            color: Colors.DEFAULT_WHITE,
                                        }}
                                    >Confirm</Text>
                            }
                        </TouchableOpacity>


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
                            <ActivityIndicator size={'small'} color={Colors.DEFAULT_YELLOW2} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                    marginTop: 6,
                                }}
                            >Please wait</Text>
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
                    onPress={() => navigation.replace('SellerProducts')}
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
                    >Add new product</Text>
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
    function renderImage() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    marginTop: 10,
                }}
            >

                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                        color: Colors.DARK_SIX,
                    }}
                >Add product images </Text>
                <Text
                    style={{
                        fontFamily: 'PoppinsMedium',
                        fontSize: RFPercentage(1.8),
                        color: Colors.INACTIVE_GREY,
                        padding: 5,
                    }}
                >Add up to <Text style={{ color: Colors.DEFAULT_YELLOW2 }}>three images. </Text>The first image is your product's cover image, which will be highlighted everywhere.</Text>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 15,
                    }}
                >
                    {
                        image.map((img, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={removeImage}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 10,
                                        width: 90,
                                        height: 80,
                                        borderWidth: 1,
                                        borderRadius: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderColor: Colors.LIGHT_GREY,
                                    }}
                                >

                                    <Image source={{ uri: img }}
                                        resizeMode='contain'
                                        style={{
                                            width: 80,
                                            height: 70,
                                        }}
                                    />
                                    <View
                                        style={{
                                            position: 'absolute',
                                        }}
                                    >
                                        <MaterialCommunityIcons name='delete-circle' size={28} color={Colors.DEFAULT_WHITE} />
                                    </View>

                                </View>

                            </TouchableOpacity>
                        ))
                    }

                    {
                        image.length != 3 && <TouchableOpacity
                            style={{
                                width: 90,
                                height: 80,
                                borderWidth: 1,
                                borderStyle: 'dashed',
                                borderRadius: 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: Colors.INACTIVE_GREY,
                            }}
                            onPress={() => refRBSheet.current.open()}
                        // onPress={pickImage}
                        >
                            <Ionicons name='cloud-upload-outline' size={23} />
                        </TouchableOpacity>
                    }

                </View>

            </View>
        )
    };
    function renderCategory() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    marginTop: 20,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                        color: Colors.DARK_SIX,
                    }}
                >Select product category </Text>

                <View
                    style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                    }}
                >

                    {/* BAGS */}
                    <TouchableOpacity
                        style={{
                            borderRadius: 5,
                            borderWidth: 0.9,
                            borderColor: productCategory == 'Bags' ? Colors.DEFAULT_YELLOW2 : Colors.LIGHT_GREY2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 90,
                            height: 80,
                            backgroundColor: '#F9F9F9',
                        }}
                        onPress={() => {
                            setProductCategory('Bags');
                            setCategoryError(null);
                        }}
                    >
                        {
                            productCategory == 'Bags' && <Ionicons name='checkmark-circle-sharp' size={18} color={Colors.DEFAULT_YELLOW}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                }} />
                        }

                        <Image
                            source={require('../../../assets/images/Icons2/bag.png')}
                            resizeMode='contain'
                            style={{
                                width: 35,
                                height: 35,
                            }}
                        />
                        <Separator height={2} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.7),
                                color: Colors.DARK_SIX,
                            }}
                        >
                            Bags
                        </Text>
                    </TouchableOpacity>


                    {/* TRIBAL */}
                    <TouchableOpacity
                        style={{
                            borderRadius: 5,
                            borderWidth: 0.9,
                            borderColor: productCategory == 'Costume' ? Colors.DEFAULT_YELLOW2 : Colors.LIGHT_GREY2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 90,
                            height: 80,
                            backgroundColor: '#F9F9F9',
                        }}
                        onPress={() => {
                            setProductCategory('Tribal Costume');
                            setCategoryError(null);
                        }}
                    >
                        {
                            productCategory == 'Tribal Costume' && <Ionicons name='checkmark-circle-sharp' size={18} color={Colors.DEFAULT_YELLOW}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                }} />
                        }

                        <Image
                            source={require('../../../assets/images/Icons2/t-shirt.png')}
                            resizeMode='contain'
                            style={{
                                width: 35,
                                height: 35,
                            }}
                        />
                        <Separator height={2} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.7),
                                color: Colors.DARK_SIX,
                            }}
                        >
                            Tribal Costume
                        </Text>
                    </TouchableOpacity>
                    {/* END TRIBAL */}


                    {/* ACCESSORIES */}
                    <TouchableOpacity
                        style={{
                            borderRadius: 5,
                            borderWidth: 0.9,
                            borderColor: productCategory == 'Accessories' ? Colors.DEFAULT_YELLOW2 : Colors.LIGHT_GREY2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 90,
                            height: 80,
                            backgroundColor: '#F9F9F9',
                        }}
                        onPress={() => {
                            setProductCategory('Accessories');
                            setCategoryError(null);
                        }}
                    >
                        {
                            productCategory == 'Accessories' && <Ionicons name='checkmark-circle-sharp' size={18} color={Colors.DEFAULT_YELLOW}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                }} />
                        }

                        <Image
                            source={require('../../../assets/images/Icons2/necklace.png')}
                            resizeMode='contain'
                            style={{
                                width: 35,
                                height: 35,
                            }}
                        />
                        <Separator height={2} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.7),
                                color: Colors.DARK_SIX,
                            }}
                        >
                            Accessories
                        </Text>
                    </TouchableOpacity>
                    {/* END OF ACCESSORIES */}

                </View>

                {/* SECOND PHASESE */}
                <Separator height={12} />
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                    }}
                >
                    {/* BAGS */}
                    <TouchableOpacity
                        style={{
                            borderRadius: 5,
                            borderWidth: 0.9,
                            borderColor: productCategory == 'Basket' ? Colors.DEFAULT_YELLOW2 : Colors.LIGHT_GREY2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 90,
                            height: 80,
                            backgroundColor: '#F9F9F9',
                        }}
                        onPress={() => {
                            setProductCategory('Basket');
                            setCategoryError(null);
                        }}
                    >
                        {
                            productCategory == 'Basket' && <Ionicons name='checkmark-circle-sharp' size={18} color={Colors.DEFAULT_YELLOW}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                }} />
                        }

                        <Image
                            source={require('../../../assets/images/Icons2/basket.png')}
                            resizeMode='contain'
                            style={{
                                width: 35,
                                height: 35,
                            }}
                        />
                        <Separator height={2} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.7),
                                color: Colors.DARK_SIX,
                            }}
                        >
                            Basket
                        </Text>
                    </TouchableOpacity>
                    {/* TRIBAL */}
                    <TouchableOpacity
                        style={{
                            borderRadius: 5,
                            borderWidth: 0.9,
                            borderColor: productCategory == 'Footwear' ? Colors.DEFAULT_YELLOW2 : Colors.LIGHT_GREY2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 90,
                            height: 80,
                            backgroundColor: '#F9F9F9',
                        }}
                        onPress={() => {
                            setProductCategory('Footwear');
                            setCategoryError(null);
                        }}
                    >
                        {
                            productCategory == 'Footwear' && <Ionicons name='checkmark-circle-sharp' size={18} color={Colors.DEFAULT_YELLOW}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                }} />
                        }

                        <Image
                            source={require('../../../assets/images/Icons2/sneakers.png')}
                            resizeMode='contain'
                            style={{
                                width: 35,
                                height: 35,
                            }}
                        />
                        <Separator height={2} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.7),
                                color: Colors.DARK_SIX,
                            }}
                        >
                            Footwear
                        </Text>
                    </TouchableOpacity>
                    {/* END TRIBAL */}

                    {/* ACCESSORIES */}
                    <TouchableOpacity
                        style={{
                            borderRadius: 5,
                            borderWidth: 0.9,
                            borderColor: productCategory == 'Wallet' ? Colors.DEFAULT_YELLOW2 : Colors.LIGHT_GREY2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 90,
                            height: 80,
                            backgroundColor: '#F9F9F9',

                        }}
                        onPress={() => {
                            setProductCategory('Wallet');
                            setCategoryError(null);
                        }}
                    >
                        {
                            productCategory == 'Wallet' && <Ionicons name='checkmark-circle-sharp' size={18} color={Colors.DEFAULT_YELLOW}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                }} />
                        }

                        <Image
                            source={require('../../../assets/images/Icons2/wallet.png')}
                            resizeMode='contain'
                            style={{
                                width: 35,
                                height: 35,
                            }}
                        />
                        <Separator height={2} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.7),
                                color: Colors.DARK_SIX,
                            }}
                        >
                            Wallet
                        </Text>
                    </TouchableOpacity>
                    {/* END OF ACCESSORIES */}


                </View>


            </View>
        )
    };
    function renderDetails() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    marginTop: 20,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                        color: Colors.DARK_SIX,
                    }}
                >Product name</Text>

                <View
                    style={{
                        flex: 1,
                        paddingVertical: 5,
                        borderRadius: 4,
                        paddingHorizontal: 15,
                        borderWidth: 0.5,
                        marginTop: 5,
                        justifyContent: 'center',
                        borderColor: Colors.INACTIVE_GREY,
                    }}
                >
                    <TextInput
                        placeholder='Enter product name'
                        underlineColorAndroid='transparent'
                        onChangeText={(productName) => setProductName(productName)}
                        multiline={true}
                        numberOfLines={3}
                        style={{
                            textAlignVertical: 'top',
                            fontSize: RFPercentage(2),
                            fontFamily: 'PoppinsMedium',
                            paddingTop: 10,
                        }}
                    />
                </View>

                {/* DESCRIPTION */}

                <Text
                    style={{
                        marginTop: 20,
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                        color: Colors.DARK_SIX,
                    }}
                >Product Description</Text>

                <View
                    style={{
                        flex: 1,
                        paddingVertical: 5,
                        borderRadius: 4,
                        paddingHorizontal: 15,
                        borderWidth: 0.5,
                        marginTop: 5,
                        justifyContent: 'center',
                        borderColor: Colors.INACTIVE_GREY,
                    }}
                >
                    <TextInput
                        placeholder='Type something ...'
                        underlineColorAndroid='transparent'
                        onChangeText={(productDescription) => setProductDescription(productDescription)}
                        multiline={true}
                        numberOfLines={4}
                        style={{
                            textAlignVertical: 'top',
                            fontSize: RFPercentage(2),
                            fontFamily: 'PoppinsMedium',
                            paddingTop: 10,
                        }}
                    />
                </View>



                {/* PRICE */}
                <Text
                    style={{
                        marginTop: 20,
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                        color: Colors.DARK_SIX,
                    }}
                >Product Price</Text>

                <View
                    style={{
                        flex: 1,
                        paddingVertical: 5,
                        borderRadius: 4,
                        paddingHorizontal: 15,
                        borderWidth: 0.5,
                        marginTop: 5,
                        justifyContent: 'center',
                        borderColor: Colors.INACTIVE_GREY,
                    }}
                >
                    <TextInput
                        placeholder='Enter product price'
                        underlineColorAndroid='transparent'
                        onChangeText={(productPrice) => setProductPrice(productPrice)}
                        autoCapitalize='words'
                        autoComplete='off'
                        autoCorrect={false}
                        keyboardType='numeric'
                        multiline={true}
                        numberOfLines={2}
                        style={{
                            textAlignVertical: 'top',
                            fontSize: RFPercentage(2),
                            fontFamily: 'PoppinsMedium',
                            paddingTop: 10,
                        }}
                    />
                </View>


                {/* STOCKS */}
                <Text
                    style={{
                        marginTop: 20,
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                        color: Colors.DARK_SIX,
                    }}
                >Product Stock</Text>

                <View
                    style={{
                        flex: 1,
                        paddingVertical: 5,
                        borderRadius: 4,
                        paddingHorizontal: 15,
                        borderWidth: 0.5,
                        marginTop: 5,
                        justifyContent: 'center',
                        borderColor: Colors.INACTIVE_GREY,
                    }}
                >
                    <TextInput
                        placeholder='Enter product stocks'
                        onChangeText={(productStock) => setProductStock(productStock)}
                        underlineColorAndroid='transparent'
                        autoCapitalize='words'
                        autoComplete='off'
                        autoCorrect={false}
                        keyboardType='numeric'
                        multiline={true}
                        numberOfLines={2}
                        style={{
                            textAlignVertical: 'top',
                            fontSize: RFPercentage(2),
                            fontFamily: 'PoppinsMedium',
                            paddingTop: 10,
                        }}
                    />
                </View>

                {/* WEIGHT */}

                <Text
                    style={{
                        marginTop: 20,
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(1.9),
                        color: Colors.DARK_SIX,
                    }}
                >Product Weight <Text style={{ fontSize: RFPercentage(1.6) }} >(per pc.)</Text> </Text>


                <View
                    style={{
                        flex: 1,
                        paddingVertical: 5,
                        borderRadius: 4,
                        paddingHorizontal: 15,
                        borderWidth: 0.5,
                        marginTop: 5,
                        justifyContent: 'center',
                        borderColor: Colors.INACTIVE_GREY,
                    }}
                >
                    <TextInput
                        placeholder='Weight/kg '
                        onChangeText={(itemWeight) => setItemWeight(itemWeight)}
                        underlineColorAndroid='transparent'
                        autoCapitalize='words'
                        autoComplete='off'
                        autoCorrect={false}
                        keyboardType='numeric'
                        multiline={true}
                        numberOfLines={2}
                        style={{
                            textAlignVertical: 'top',
                            fontSize: RFPercentage(2),
                            fontFamily: 'PoppinsMedium',
                            paddingTop: 10,
                        }}
                    />
                </View>

            </View>
        )
    }
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
                        openCamera();
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >Camera</Text>
                </TouchableOpacity>

                <View style={{ width: Display.setWidth(100), height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 15, }} />

                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current.close();
                        openPickImage();
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >Gallery</Text>
                </TouchableOpacity>

            </View>
        )
    };
    function renderBottomSheet() {
        return (
            <View>
                <RBSheet
                    ref={refRBSheet}
                    height={110}
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
    };


    function renderButton() {
        return (
            <View
                style={{
                    marginTop: 25,
                }}
            >
                <TouchableOpacity
                    style={{
                        width: Display.setWidth(90),
                        height: Display.setHeight(6.2),
                        backgroundColor: showButton ? Colors.LIGHT_YELLOW : Colors.DEFAULT_YELLOW2,
                        alignSelf: 'center',
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    disabled={showButton}
                    onPress={uploadImage}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >
                        Publish Product
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container} >
            <Status />
            {ConfirmAlert()}
            {MessageAlert()}
            {renderBottomSheet()}
            <Separator height={27} />
            {renderTop()}
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 40,
                }}

            >
                {renderImage()}
                {renderCategory()}
                {renderDetails()}
                {renderButton()}
            </KeyboardAwareScrollView>

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