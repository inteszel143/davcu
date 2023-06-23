import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput, BackHandler, Modal, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Colors, Display, Separator, Status,
} from '../../constants';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { firebase } from '../../../config';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function BuyerCreateAccount({ navigation }) {
    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true })
        return () => backHandler.remove();
    }, []);

    //TOOLS
    const [showButton, setShowButton] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    // DAATA
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);

    // NOTIFICATION
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();


    useEffect(() => {
        const isDisabled = !firstName || !lastName || !email || !email.match(/\S+@\S+\.\S+/) || !password || !confirmPassword || password != confirmPassword;
        setShowButton(isDisabled);
    }, [firstName, lastName, email, password, confirmPassword]);



    React.useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                navigation.navigate('BuyerPhoneNumber');
            }
        });
        return unsubscribe;
    }, []);



    const registerUser = () => {
        setModalVisible(true);
        const status = "active";
        setTimeout(() => {
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    firebase.firestore().collection('users')
                        .doc(firebase.auth().currentUser.uid)
                        .set({
                            firstName,
                            lastName,
                            email,
                            expoPushToken,
                            status,
                        }).then(() => {
                            setModalVisible(true);
                        })
                })
                .catch((error) => {
                    Alert.alert(error.message);
                    setModalVisible(true);
                })
        }, 2000)
    };





    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            // console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }
        return token;
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
                            placeholder='John'
                            onChangeText={(firstName) => setFirstName(firstName)}
                            autoCapitalize='words'
                            autoCorrect={false}
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
                            placeholder='Doe'
                            onChangeText={(lastName) => setLastName(lastName)}
                            autoCapitalize='words'
                            autoCorrect={false}
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
                            secureTextEntry={isConfirmPasswordShow ? false : true}
                            style={{
                                flex: 1,
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                        />
                        <MaterialCommunityIcons
                            name={isConfirmPasswordShow ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color={Colors.DARK_SIX}
                            onPress={() => setIsConfirmPasswordShow(!isConfirmPasswordShow)}
                        />
                    </View>

                </View>





                <Separator height={15} />

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

    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Separator height={70} />
                <View
                    style={{
                        paddingHorizontal: 15,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsBold',
                            fontSize: RFPercentage(3),
                        }}
                    >
                        Create New Buyer Account
                    </Text>

                    {/* SUBTITLE */}
                    <Text
                        style={{
                            fontFamily: 'PoppinsRegular',
                            fontSize: RFPercentage(1.9),
                            color: Colors.INACTIVE_GREY,
                            marginLeft: 2,
                        }}
                    >
                        Create an accounts so you can discover new native products.
                    </Text>
                </View>

                {dataFields()}
                {renderTermNCondition()}


                {/* BUTTON */}
                <Separator height={20} />
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
                    onPress={registerUser}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
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
                    </View>
                </TouchableOpacity>

                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >

                    <Separator height={10} />
                    <TouchableOpacity
                        style={{
                            width: Display.setWidth(85),
                            height: Display.setHeight(4),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => navigation.navigate('BuyerLogin')}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.8),
                            }}
                        >
                            Already have an account? <Text style={{ color: Colors.DEFAULT_YELLOW2 }} > Sign in</Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.DEFAULT_WHITE
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