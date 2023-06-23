import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, StatusBar, TextInput, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Colors, Display, Separator, General, Status } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from 'expo-image-picker';

import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import { firebase } from '../../../config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import RBSheet from "react-native-raw-bottom-sheet";
const defaultProfile = require('../../../assets/Icon/profileImage.jpg');

export default function SellerEditProfile({ navigation }) {



    const refRBSheet = useRef();
    const sellerId = firebase.auth().currentUser.uid;
    const [loading, setLoading] = useState(true);
    const [sellerData, setSellerData] = useState("")
    const [modalVisible, setModalVisible] = useState(false);

    //DATA
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [storeLocation, setStoreLocation] = useState('');
    const [shopName, setShopName] = useState('');
    const [image, setImage] = useState(null);



    // GET SELLER INFO
    useEffect(() => {
        const subscriber = firebase.firestore()
            .collection('sellers')
            .doc(sellerId)
            .onSnapshot(documentSnapshot => {
                setSellerData(documentSnapshot.data());

                setFullName(documentSnapshot.data().fullName);
                setEmail(documentSnapshot.data().email);
                setMobileNumber(documentSnapshot.data().phoneNumber);
                setStoreLocation(documentSnapshot.data().storeLocation);
                setShopName(documentSnapshot.data().shopName);
                setLoading(false);
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }, []);


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
            </View>
        );
    };


    const openCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
        });

        if (!result.cancelled) {
            setImage(result.uri);
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
            // setImage((images) => images.concat(result.uri));
            setImage(result.uri);
        }
    };


    const handleUpdate = async () => {
        try {
            setModalVisible(true);
            const response = await fetch(image);
            const blob = await response.blob();

            // Upload the photo to Firebase Storage
            const storageRef = firebase.storage().ref();
            const fileName = `${Date.now()}.jpg`;
            const fileRef = storageRef.child(`/sellerId's/${fileName}`);
            await fileRef.put(blob);

            // Get the photo URL from Firebase Storage and store it in Firestore
            const downloadURL = await fileRef.getDownloadURL();

            await firebase.firestore()
                .collection('sellers')
                .doc(firebase.auth().currentUser.uid)
                .update({
                    profileUrl: downloadURL,
                })
                .then(() => {
                    setModalVisible(false);
                    navigation.goBack();
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
                    >Edit Profile</Text>
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


    function renderProfile() {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                }}
            >
                <View>

                    <View>
                        {
                            image != null ? <Image
                                source={{ uri: image }}
                                resizeMode='contain'
                                style={{
                                    width: 140,
                                    height: 140,
                                    borderRadius: 70,
                                }}
                            />
                                :
                                <View>
                                    {
                                        sellerData.profileUrl ? <Image
                                            source={{ uri: sellerData.profileUrl }}
                                            resizeMode='contain'
                                            style={{
                                                width: 140,
                                                height: 140,
                                                borderRadius: 70,
                                            }}
                                        />
                                            :
                                            <Image
                                                source={defaultProfile}
                                                resizeMode='contain'
                                                style={{
                                                    width: 140,
                                                    height: 140,
                                                    borderRadius: 70,
                                                }}
                                            />
                                    }

                                </View>
                        }
                    </View>


                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            bottom: 3,
                            right: 10,
                            width: 30,
                            height: 30,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.DEFAULT_BG,
                        }}
                        onPress={() => refRBSheet.current.open()}
                    >
                        <Ionicons name='camera-outline' size={20} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    };


    function renderContent() {
        return (
            <View
                style={{
                    marginTop: 20,
                    paddingHorizontal: 20,
                }}
            >
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                >

                    <Separator height={15} />

                    <View>
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                color: Colors.INACTIVE_GREY,
                            }}
                        >Full Name</Text>

                        <View
                            style={{
                                borderWidth: 0.5,
                                paddingVertical: 5,
                                paddingHorizontal: 5,
                                borderColor: Colors.DEFAULT_WHITE,
                                borderBottomColor: Colors.INACTIVE_GREY,
                                marginHorizontal: 5,
                            }}
                        >
                            <TextInput
                                defaultValue={fullName}
                                onChangeText={(fullName) => setFullName(fullName)}
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            />
                        </View>
                    </View>



                    <Separator height={15} />

                    <View>
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                color: Colors.INACTIVE_GREY,
                            }}
                        >Email address</Text>

                        <View
                            style={{
                                borderWidth: 0.5,
                                paddingVertical: 5,
                                paddingHorizontal: 5,
                                borderColor: Colors.DEFAULT_WHITE,
                                borderBottomColor: Colors.INACTIVE_GREY,
                                marginHorizontal: 5,
                            }}
                        >
                            <TextInput
                                defaultValue={email}
                                onChangeText={(email) => setEmail(email)}
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            />
                        </View>
                    </View>
                    <Separator height={15} />

                    <View>
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                color: Colors.INACTIVE_GREY,
                            }}
                        >Mobile number</Text>

                        <View
                            style={{
                                borderWidth: 0.5,
                                paddingVertical: 5,
                                paddingHorizontal: 5,
                                borderColor: Colors.DEFAULT_WHITE,
                                borderBottomColor: Colors.INACTIVE_GREY,
                                marginHorizontal: 5,
                            }}
                        >
                            <TextInput
                                defaultValue={mobileNumber}
                                onChangeText={(mobileNumber) => setMobileNumber(mobileNumber)}
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            />
                        </View>
                    </View>
                    <Separator height={15} />


                    <View>
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                color: Colors.INACTIVE_GREY,
                            }}
                        >Shop name</Text>

                        <View
                            style={{
                                borderWidth: 0.5,
                                paddingVertical: 5,
                                paddingHorizontal: 5,
                                borderColor: Colors.DEFAULT_WHITE,
                                borderBottomColor: Colors.INACTIVE_GREY,
                                marginHorizontal: 5,
                            }}
                        >
                            <TextInput
                                defaultValue={shopName}
                                onChangeText={(shopName) => setShopName(shopName)}
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            />
                        </View>
                    </View>
                    <Separator height={15} />


                    <View>
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(1.9),
                                color: Colors.INACTIVE_GREY,
                            }}
                        >Shop Location</Text>

                        <View
                            style={{
                                borderWidth: 0.5,
                                paddingVertical: 5,
                                paddingHorizontal: 5,
                                borderColor: Colors.DEFAULT_WHITE,
                                borderBottomColor: Colors.INACTIVE_GREY,
                                marginHorizontal: 5,
                            }}
                        >
                            <Text
                                style={{
                                    textAlignVertical: 'top',
                                    paddingTop: 5,
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                }}
                            >
                                {storeLocation}
                            </Text>
                        </View>
                    </View>
                    <Separator height={15} />


                </KeyboardAwareScrollView>

                <Separator height={20} />


            </View>
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



    function renderBottom() {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: Display.setHeight(4),
                }}
            >
                <TouchableOpacity
                    style={{
                        width: Display.setWidth(84),
                        height: Display.setHeight(6),
                        backgroundColor: Colors.DEFAULT_YELLOW2,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={handleUpdate}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Save changes</Text>
                </TouchableOpacity>
            </View>
        )
    };




    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={27} />
            {renderTop()}
            {renderProfile()}
            {renderContent()}
            {renderBottomSheet()}
            {renderBottom()}
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