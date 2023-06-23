import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, FlatList, Modal } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status
} from '../../constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Entypo, Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';

import { firebase } from '../../../config';
import * as ImagePicker from 'expo-image-picker';


export default function RiderConfirmDrop({ navigation, route }) {

    const { orderKey, buyerId } = route.params;
    const [modalVisible, setModalVisible] = useState(false);

    const [image, setImage] = useState(null);






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
                .collection('placeOrders')
                .doc(orderKey)
                .update({
                    proof: downloadURL,
                })
                .then(() => {
                    setModalVisible(false);
                    navigation.navigate('DeliverySuccess', {
                        orderKey: orderKey,
                        buyerId: buyerId,

                    })
                });

        }, 2000)
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

    function renderPhoto() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    marginTop: 10,
                    paddingVertical: 15,
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
                        Proof of Drop-Off
                    </Text>

                    <TouchableOpacity
                        onPress={openCamera}
                    >
                        {
                            image === null ? <Text
                                style={{
                                    fontFamily: "PoppinsSemiBold",
                                    fontSize: RFPercentage(2),
                                    color: Colors.SECONDARY_GREEN,
                                }}
                            >Add Photo</Text>
                                :
                                <Text
                                    style={{
                                        fontFamily: "PoppinsSemiBold",
                                        fontSize: RFPercentage(2),
                                        color: Colors.SECONDARY_GREEN,
                                    }}
                                >Retry Photo</Text>
                        }
                    </TouchableOpacity>

                </View>

                <Text
                    style={{
                        fontFamily: 'PoppinsRegular',
                        fontSize: RFPercentage(1.8),
                        color: Colors.DARK_SIX,
                        marginTop: 10,
                    }}
                >
                    Add a photo as proof of drop-off
                </Text>

            </View>
        )
    }

    function renderResult() {
        return (
            <View
                style={{
                    paddingHorizontal: 15,
                    marginTop: 15,
                    paddingVertical: 15,
                    marginHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor: Colors.DEFAULT_WHITE,
                }}
            >
                {
                    image === null ? <View
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
                                height: Display.setHeight(60),
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                style={{
                                    width: Display.setWidth(80),
                                    height: Display.setHeight(58),
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
                        backgroundColor: image == null ? Colors.LIGHT_GREEN : Colors.SECONDARY_GREEN,
                        borderRadius: 4,
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
                    >Confirm Drop-off</Text>
                </TouchableOpacity>

            </View>
        )
    }

    return (
        <View style={styles.container} >
            <Status />
            <Header title={'Confirm Drop-off'} />
            {MessageAlert()}
            {renderPhoto()}
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