import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, StatusBar, ActivityIndicator, Modal } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status, MyCart, General
} from '../../constants';
import numeral from 'numeral';
import { MaterialCommunityIcons, AntDesign, Fontisto, Ionicons, Entypo } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';
import moment from 'moment';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function SellerUpdateDocs({ navigation }) {

    const sellerId = firebase.auth().currentUser.uid;
    const [sellerData, setSellerData] = useState('');
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);



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

    // GET SELLER INFO
    useEffect(() => {
        firebase.firestore()
            .collection('sellers')
            .doc(sellerId)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setSellerData(documentSnapshot.data());
                    setLoading(false);
                }
            });
    }, []);


    async function handleUploadPhoto() {
        setModalVisible(true);
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = firebase.storage().ref();
        const fileName = `${Date.now()}.jpg`;
        const fileRef = storageRef.child(`/Randoms/${fileName}`);
        await fileRef.put(blob);

        const downloadURL = await fileRef.getDownloadURL();

        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        setTimeout(() => {
            firebase.firestore()
                .collection('sellers')
                .doc(sellerId)
                .update({
                    IdURL: downloadURL,
                })
                .then(() => {
                    firebase.firestore()
                        .collection('sellers')
                        .doc(sellerId)
                        .update({
                            returnComment: firebase.firestore.FieldValue.delete(),
                        })
                        .then(() => {
                            setModalVisible(false);
                            navigation.navigate('SellerMainScreen');
                        });

                });

        }, 2000)
    };


    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                <ActivityIndicator size={'large'} color={Colors.DEFAULT_YELLOW2} />
            </View>
        )
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
                                flexDirection: 'row',
                            }}
                        >
                            <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                    marginLeft: 8,
                                }}
                            >Uploading...</Text>
                        </View>
                        {/* <Text style={styles.modalText} >Success ! you have added a new shipping address.</Text> */}
                    </View>
                </View>


            </Modal>
        )
    };




    function renderComment() {
        return (
            <View
                style={{
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                    marginHorizontal: 15,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    borderRadius: 8,
                }}
            >

                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2),
                    }}
                >Admin Comment</Text>

                <Text
                    style={{
                        fontFamily: 'PoppinsRegular',
                        fontSize: RFPercentage(2),
                        paddingHorizontal: 5,
                        marginTop: 10,
                    }}
                >- {sellerData.returnComment}
                </Text>

            </View>
        )
    };

    function renderResult() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    marginTop: 10,
                    paddingVertical: 20,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2),
                        }}
                    >
                        Add image here.
                    </Text>

                    <TouchableOpacity
                        style={{
                            marginRight: 5,
                        }}
                        onPress={openCamera}
                    >
                        {
                            image == null ? <Text
                                style={{
                                    fontFamily: "PoppinsSemiBold",
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_YELLOW2,
                                }}
                            >Add Photo</Text>
                                :
                                <Text
                                    style={{
                                        fontFamily: "PoppinsSemiBold",
                                        fontSize: RFPercentage(2),
                                        color: Colors.DEFAULT_YELLOW2,
                                    }}
                                >Retry Photo</Text>
                        }
                    </TouchableOpacity>

                </View>
                <Separator height={15} />

                {
                    image == null ? <View
                        style={{
                            borderWidth: 2,
                            borderColor: Colors.LIGHT_GREY2,
                            borderStyle: 'dashed',
                            height: Display.setHeight(40),
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <MaterialCommunityIcons name="file-image-remove-outline" size={30} color={Colors.INACTIVE_GREY} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                color: Colors.INACTIVE_GREY,
                            }}
                        >No image</Text>
                    </View>
                        :
                        <View
                            style={{
                                borderWidth: 2,
                                borderColor: Colors.LIGHT_GREY2,
                                borderStyle: 'dashed',
                                height: Display.setHeight(50),
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                style={{
                                    width: Display.setWidth(80),
                                    height: Display.setHeight(48),
                                    borderRadius: 8,
                                }}
                                source={{ uri: image }}
                                resizeMode='cover'
                            />
                        </View>
                }


            </View>
        )
    };


    function renderButton() {
        return (
            <View
                style={{
                    alignSelf: 'center',
                    marginTop: 30,
                }}
            >
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: Display.setWidth(86),
                        height: Display.setHeight(6.2),
                        backgroundColor: image == null ? Colors.LIGHT_YELLOW : Colors.DEFAULT_YELLOW2,
                        borderRadius: 5,
                    }}
                    disabled={image == null ? true : false}
                    onPress={handleUploadPhoto}

                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2.2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Submit Image</Text>
                </TouchableOpacity>

            </View>
        )
    }


    return (
        <View style={styles.container} >
            <Status />
            <Header title={'Add new info'} />
            {MessageAlert()}
            <Separator height={13} />
            {renderComment()}
            {renderResult()}
            {renderButton()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: Display.setWidth(50),
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
        marginTop: 9,
        marginBottom: 10,
        color: Colors.DEFAULT_WHITE,
        textAlign: 'center',
        fontFamily: 'PoppinsSemiBold',
        fontSize: RFPercentage(2.4),
        paddingHorizontal: 30,
    },
    CameraContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capturedPhoto: {
        width: '100%',
        aspectRatio: 0.9,
    },
    buttonContainer: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
})