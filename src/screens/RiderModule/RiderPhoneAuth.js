import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, Image, Text, View, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import { Entypo, Ionicons } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';
import { Colors, Display, Separator } from '../../constants';


export default function RiderPhoneAuth({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);

    const riderId = firebase.auth().currentUser.uid;

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }


    const takePicture = async () => {
        if (camera) {
            const photo = await camera.takePictureAsync();
            setCapturedImage(photo.uri);
        }
    };

    let camera;


    async function handleUploadPhoto() {
        setModalVisible(true)
        const response = await fetch(capturedImage);
        const blob = await response.blob();

        //UPLOAD IMAGE
        const storageRef = firebase.storage().ref();
        const fileName = `${Date.now()}.jpg`;
        const fileRef = storageRef.child(`/DeliveryID's/${fileName}`);
        await fileRef.put(blob);
        // Get the photo URL from Firebase Storage and store it in Firestore
        const downloadURL = await fileRef.getDownloadURL();

        firebase.firestore()
            .collection('Riders')
            .doc(riderId)
            .update({
                riderImage: downloadURL,
            })
            .then(() => {
                navigation.navigate('RiderMainScreen');
                setModalVisible(false);
            });
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
                                alignItems: 'center',
                                marginTop: 10,
                            }}
                        >
                            <ActivityIndicator size={'small'} color={Colors.DEFAULT_YELLOW2} />
                            <Text
                                style={{
                                    fontSize: RFPercentage(2),
                                    fontFamily: 'PoppinsMedium',
                                    // color: Colors.DEFAULT_WHITE,
                                    marginLeft: 8,
                                }}
                            >
                                Uploading . . .
                            </Text>
                        </View>

                        <Separator height={10} />
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                // paddingHorizontal: 15,
                            }}
                        >

                        </View>
                    </View>
                </View>


            </Modal>
        )
    };



    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.DARK_ONE}
                translucent
            />
            {MessageAlert()}
            {
                capturedImage ? (
                    <View
                        style={{
                            flex: 1,
                            // justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 30,
                        }}
                    >
                        <Separator height={50} />
                        <Text
                            style={{
                                fontSize: RFPercentage(2.2),
                                fontFamily: 'PoppinsBold',
                                textAlign: 'center',

                            }}
                        >Check quality</Text>
                        <View style={{ width: 50, height: 1, backgroundColor: Colors.DEFAULT_YELLOW2 }} />
                        <Separator height={30} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: RFPercentage(1.9),
                                color: Colors.INACTIVE_GREY,
                                textAlign: 'center',
                            }}
                        >
                            Once you submit this image, you won't be able to make any changes. Are you sure you want to proceed?
                        </Text>
                        <Separator height={35} />
                        <Image
                            source={{ uri: capturedImage }}
                            resizeMode='contain'
                            style={{
                                height: 300,
                                width: 300,
                                borderRadius: 150,
                            }}
                        />
                        <Separator height={20} />
                        {/* <View
                            style={{
                                // paddingHorizontal: 30,
                            }}
                        >
                           
                            <Separator height={10} />

                        </View> */}

                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                backgroundColor: Colors.DEFAULT_WHITE,
                                height: '20%',
                                flex: 1,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: Display.setWidth(86),
                                    height: Display.setHeight(6.2),
                                    backgroundColor: Colors.DEFAULT_WHITE,
                                    borderRadius: 10,
                                    borderWidth: 0.5,
                                    borderColor: Colors.LIGHT_GREY2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => setCapturedImage(null)}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Ionicons name="camera" size={19} />
                                    <Text
                                        style={{
                                            fontSize: RFPercentage(1.9),
                                            fontFamily: 'PoppinsSemiBold',
                                            marginLeft: 8,
                                        }}
                                    >Take a new photo</Text>
                                </View>
                            </TouchableOpacity>

                            <Separator height={18} />

                            <TouchableOpacity
                                style={{
                                    width: Display.setWidth(86),
                                    height: Display.setHeight(6.2),
                                    backgroundColor: Colors.DEFAULT_YELLOW2,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={handleUploadPhoto}
                            >
                                <Text
                                    style={{
                                        fontSize: RFPercentage(1.9),
                                        fontFamily: 'PoppinsSemiBold',
                                        color: Colors.DEFAULT_WHITE,
                                    }}
                                >Submit Image</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
                    :
                    <Camera
                        ref={(ref) => {
                            camera = ref;
                        }}
                        type={Camera.Constants.Type.front}
                        style={styles.camera}
                    >
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                backgroundColor: Colors.DEFAULT_WHITE,
                                height: '50%',

                            }}
                        >

                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 30,
                                alignSelf: 'center',
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderWidth: 1,
                                    borderRadius: 30,
                                    borderColor: Colors.DEFAULT_WHITE,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={takePicture}>
                                <Entypo name='camera' size={35} color={Colors.DEFAULT_WHITE} />
                            </TouchableOpacity>
                        </View>

                    </Camera>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_BG,
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 10,
    },
    text: {
        fontSize: 18,
        color: '#fff',
    },
    capturedImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 20,
    },
    modalView: {
        margin: 20,
        backgroundColor: Colors.DEFAULT_WHITE,
        // backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 5,
        width: Display.setWidth(80),
        height: Display.setHeight(8),
        justifyContent: 'center',
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

});