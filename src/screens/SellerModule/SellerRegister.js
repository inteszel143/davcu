import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Button, TextInput, Dimensions, ScrollView, ActivityIndicator, Alert, BackHandler, Modal } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Colors, Display, Separator, Status,
} from '../../constants';
import { MaterialCommunityIcons, AntDesign, Ionicons, Entypo } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from 'expo-image-picker';

import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle, Overlay } from 'react-native-maps';
import * as Location from 'expo-location';
import RBSheet from "react-native-raw-bottom-sheet";
import { firebase } from '../../../config';

export default function SellerRegister({ navigation }) {
    const refRBSheet = useRef();
    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true })
        return () => backHandler.remove();
    }, []);

    // TOOLS
    const [modalVisible, setModalVisible] = useState(false);
    const [showButton, setShowButton] = useState(true);

    // SELLER DATA
    const [shopName, setShopName] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);

    //PASSWORD
    const [isPasswordShow, setIsPasswordShow] = useState(false)
    const [isCPassword, setIsCPassword] = useState(false);


    useEffect(() => {
        const isDisabled = !shopName || !fullName || !phoneNumber || !email || !email.match(/\S+@\S+\.\S+/) || !password ||
            phoneNumber.length != 10 || image === null || password != confirmPassword;
        setShowButton(isDisabled);
    }, [shopName, fullName, phoneNumber, email, password, confirmPassword, image]);


    React.useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                navigation.navigate('SellerPhoneAuth', {
                    phoneNumber: phoneNumber,
                });
            }
        });
        return unsubscribe;
    }, []);


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


    const registerSeller = async () => {
        try {
            setModalVisible(true);
            const response = await fetch(image);
            const blob = await response.blob();
            // Upload the photo to Firebase Storage
            const storageRef = firebase.storage().ref();
            const fileName = `${Date.now()}.jpg`;
            const fileRef = storageRef.child(`/DeliveryID's/${fileName}`);
            await fileRef.put(blob);

            // Get the photo URL from Firebase Storage and store it in Firestore
            const downloadURL = await fileRef.getDownloadURL();
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();

            setTimeout(() => {
                firebase.auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        firebase.firestore().collection('sellers')
                            .doc(firebase.auth().currentUser.uid)
                            .set({
                                shopName: shopName,
                                fullName: fullName,
                                phoneNumber: phoneNumber,
                                email: email,
                                createAt: timestamp,
                                IdURL: downloadURL,
                                validate: 0,

                            }).then(() => {
                                setModalVisible(false);
                            })
                    }).catch((error) => {
                        Alert.alert(error.message);
                        setModalVisible(false);
                    })
            }, 2000)


        } catch (error) {
            console.log(error);
        }
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

    function dataFields() {
        return (
            <View
                style={{
                    paddingHorizontal: 20,
                }}
            >
                <Separator height={15} />
                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2),
                    }}
                >Personal Information</Text>

                <Separator height={15} />
                {/* TEXTINPUT */}
                <View
                    style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        width: Display.setWidth(85),
                        height: Display.setHeight(6),
                        borderRadius: 5,
                        paddingHorizontal: 15,
                        backgroundColor: Colors.DEFAULT_BG,
                    }}
                >
                    {/* FULL NAME */}
                    <View>
                        <TextInput
                            placeholder='Your Shop Name'
                            onChangeText={(shopName) => setShopName(shopName)}
                            autoCapitalize='words'
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                        />
                    </View>

                </View>


                <Separator height={15} />
                {/* TEXTINPUT */}
                <View
                    style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        width: Display.setWidth(85),
                        height: Display.setHeight(6),
                        borderRadius: 5,
                        paddingHorizontal: 15,
                        backgroundColor: Colors.DEFAULT_BG,
                    }}
                >
                    {/* FULL NAME */}
                    <View>
                        <TextInput
                            placeholder='Full Name'
                            onChangeText={(fullName) => setFullName(fullName)}
                            autoCapitalize='words'
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                        />
                    </View>

                </View>



                <Separator height={15} />
                {/* TEXTINPUT */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: "center",
                        alignSelf: 'center',
                        width: Display.setWidth(85),
                        height: Display.setHeight(6),
                        borderRadius: 5,
                        paddingHorizontal: 15,
                        backgroundColor: Colors.DEFAULT_BG,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(2),
                        }}
                    >+63 | </Text>

                    {/* FULL NAME */}
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <TextInput
                            placeholder='9284856233'
                            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                            keyboardType='numeric'
                            maxLength={10}
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                        />
                    </View>

                </View>



                <Separator height={15} />
                {/* TEXTINPUT */}
                <View
                    style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        width: Display.setWidth(85),
                        height: Display.setHeight(6),
                        borderRadius: 5,
                        paddingHorizontal: 15,
                        backgroundColor: Colors.DEFAULT_BG,
                    }}
                >
                    {/* EMAIL*/}
                    <View>
                        <TextInput
                            placeholder='johndoe@gmail.com'
                            keyboardType="email-address"
                            onChangeText={(email) => setEmail(email)}
                            textContentType="emailAddress"
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                        />
                    </View>

                </View>



                <Separator height={15} />
                <View
                    style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        width: Display.setWidth(85),
                        height: Display.setHeight(6),
                        borderRadius: 5,
                        paddingHorizontal: 15,
                        backgroundColor: Colors.DEFAULT_BG,
                    }}
                >
                    {/* FULL NAME */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TextInput
                            placeholder='Password'
                            onChangeText={(password) => setPassword(password)}
                            secureTextEntry={isPasswordShow ? false : true}
                            style={{
                                flex: 1,
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                        />
                        <MaterialCommunityIcons
                            name={isPasswordShow ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color={Colors.DARK_SIX}
                            onPress={() => setIsPasswordShow(!isPasswordShow)}
                        />
                    </View>

                </View>



                <Separator height={15} />
                <View
                    style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        width: Display.setWidth(85),
                        height: Display.setHeight(6),
                        paddingHorizontal: 15,
                        borderRadius: 5,
                        backgroundColor: Colors.DEFAULT_BG,
                    }}
                >
                    {/* FULL NAME */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TextInput
                            placeholder='Confirm Password'
                            onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                            secureTextEntry={isCPassword ? false : true}
                            style={{
                                flex: 1,
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                        />
                        <MaterialCommunityIcons
                            name={isCPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color={Colors.DARK_SIX}
                            onPress={() => setIsCPassword(!isCPassword)}
                        />
                    </View>

                </View>





                <Separator height={15} />

            </View>
        )
    };


    function sellerBusinessPermit() {
        return (
            <View
                style={{
                    paddingHorizontal: 20,
                    marginTop: 15,
                }}
            >

                <Text
                    style={{
                        fontFamily: 'PoppinsSemiBold',
                        fontSize: RFPercentage(2),
                    }}
                >Business Permit</Text>
                <Text
                    style={{
                        fontFamily: 'PoppinsRegular',
                        fontSize: RFPercentage(1.8),
                        color: Colors.INACTIVE_GREY,
                        textAlign: 'justify',
                        marginBottom: 15,
                    }}
                >
                    Please make sure that file must cleared scanned images so that it can be easily validated.
                </Text>

                {
                    image === null ? <TouchableOpacity
                        onPress={() => refRBSheet.current.open()}
                        style={{
                            height: Display.setHeight(30),
                            width: Display.setWidth(85),
                            alignSelf: 'center',
                            borderStyle: 'dashed',
                            borderWidth: 1.5,
                            borderColor: Colors.LIGHT_GREY2,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}
                        >
                            <Ionicons name='cloud-upload-outline' size={30} color={Colors.DARK_THREE} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.9),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >
                                No images
                            </Text>
                        </View>
                    </TouchableOpacity>

                        :
                        <View
                            style={{
                                paddingVertical: 10,
                                height: Display.setHeight(50),
                                width: Display.setWidth(85),
                                alignSelf: 'center',
                                borderWidth: 1.5,
                                borderStyle: 'dashed',
                                borderColor: Colors.LIGHT_GREY2,
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image
                                style={{
                                    width: Display.setWidth(80),
                                    flex: 1,
                                    aspectRatio: 2,
                                }}
                                source={{ uri: image }}
                                resizeMode='contain'
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                }}
                                onPress={() => refRBSheet.current.open()}
                            >
                                <MaterialCommunityIcons name='camera-flip' size={28} color={Colors.DEFAULT_WHITE} />
                            </TouchableOpacity>

                        </View>
                }

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
    function renderTermNCondition() {
        return (
            <View
                style={{
                    marginTop: 15,
                    paddingHorizontal: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsMedium',
                        fontSize: RFPercentage(1.8),
                    }}
                >
                    By continuing, you agree to the
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            color: Colors.DEFAULT_YELLOW2,
                        }}
                    > Terms of Service </Text>
                    and
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            color: Colors.DEFAULT_YELLOW2,
                        }}
                    > Privacy Policy.</Text>
                </Text>
            </View>
        )
    };





    function renderButtonBottom() {
        return (
            <View
                style={{
                    alignSelf: 'center',
                    paddingBottom: 15,
                    marginTop: 10,
                }}
            >

                <TouchableOpacity
                    style={{
                        width: Display.setWidth(85),
                        height: Display.setHeight(6),
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: showButton ? Colors.LIGHT_YELLOW : Colors.DEFAULT_YELLOW2,
                        borderRadius: 10,
                    }}
                    disabled={showButton}
                    onPress={registerSeller}

                >
                    <Text
                        style={{
                            color: Colors.DEFAULT_WHITE,
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >
                        Create Account
                    </Text>
                </TouchableOpacity>
                <Separator height={10} />

                <TouchableOpacity
                    onPress={() => navigation.navigate('SellerLogin')}
                    style={{
                        alignSelf: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsMedium',
                            fontSize: RFPercentage(1.8),
                        }}
                    >
                        Already have an account? <Text style={{ color: Colors.DEFAULT_YELLOW2 }} > Login</Text>
                    </Text>
                </TouchableOpacity>
                <Separator height={10} />
            </View>
        )
    };

    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={60} />

            <View
                style={{
                    paddingHorizontal: 18,
                }}
            >
                <Text
                    style={{
                        fontFamily: 'PoppinsBold',
                        fontSize: RFPercentage(3.2),
                    }}
                >
                    Create New Seller Account
                </Text>
            </View>


            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {dataFields()}
                {sellerBusinessPermit()}
                {renderTermNCondition()}
                {renderBottomSheet()}
                {renderButtonBottom()}
            </ScrollView>
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