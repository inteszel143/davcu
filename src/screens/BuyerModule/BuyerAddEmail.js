import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Colors, Display, Separator, Status } from '../../constants'
import { MaterialCommunityIcons, Ionicons, Feather, AntDesign } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../config';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function BuyerAddEmail({ navigation, route }) {

    const { mobileNumber } = route.params;
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [isPasswordShow, setIsPasswordShow] = useState(false)
    const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false)

    // TOOLS
    const [showButton, setShowButton] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // NOTIFICATION
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();



    useEffect(() => {
        const isDisabled = !email || !email.match(/\S+@\S+\.\S+/) || !password || !confirmPassword || password != confirmPassword;
        setShowButton(isDisabled);
    }, [email, password, confirmPassword]);


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





    React.useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                navigation.replace('BuyerAddName');
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
                            email,
                            mobileNumber,
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

    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={30} />

            <TouchableOpacity
                style={{
                    marginTop: 25,
                    paddingHorizontal: 20,
                }}
            // onPress={() => navigation.replace('BuyerLogin')}
            >
                <MaterialCommunityIcons name="close" size={22} />
            </TouchableOpacity>

            {/* TITLE */}
            <View
                style={{
                    marginTop: 25,
                    paddingHorizontal: 30,
                }}
            >
                <Text
                    style={{
                        fontFamily: "PoppinsSemiBold",
                        fontSize: RFPercentage(2.6),
                    }}
                >
                    Your email and password
                </Text>
            </View>


            {/* SUBTITLE */}
            <View
                style={{
                    marginTop: 8,
                    paddingHorizontal: 31,
                }}
            >
                <Text
                    style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: RFPercentage(1.9),
                        color: Colors.INACTIVE_GREY,
                    }}
                >
                    When you try to access our app, make sure to use this for the login process.
                </Text>
            </View>

            {/* EMAIL */}
            <View
                style={{
                    marginTop: 15,
                    paddingHorizontal: 30,
                }}
            >
                <View
                    style={{
                        borderWidth: 0.5,
                        paddingVertical: 5,
                        borderBottomColor: Colors.INACTIVE_GREY,
                        borderColor: Colors.DEFAULT_WHITE,
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <TextInput
                        placeholder='Email'
                        onChangeText={(email) => setEmail(email)}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoFocus
                        style={{
                            flex: 1,
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(2),
                        }}
                    />

                </View>

            </View>
            {/* ERROR EMAIL */}
            {/* {
                emailError && <View
                    style={{
                        marginTop: 5,
                        paddingHorizontal: 35,
                        flexDirection: "row",
                    }}
                >
                    <Ionicons name="warning-outline" size={14} color={Colors.DEFAULT_RED} />
                    <Text
                        style={{
                            fontFamily: "PoppinsRegular",
                            fontSize: RFPercentage(1.8),
                            color: Colors.DEFAULT_RED,
                            marginLeft: 8,
                        }}
                    >Invalid email.*</Text>
                </View>
            } */}


            {/* PASSWORD */}
            <View
                style={{
                    marginTop: 20,
                    paddingHorizontal: 30,
                }}
            >
                <View
                    style={{
                        borderWidth: 0.5,
                        paddingVertical: 5,
                        borderBottomColor: Colors.INACTIVE_GREY,
                        borderColor: Colors.DEFAULT_WHITE,
                        paddingHorizontal: 10,
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
                            fontFamily: "PoppinsMedium",
                            fontSize: RFPercentage(2),
                        }}
                    />
                    <MaterialCommunityIcons
                        name={isPasswordShow ? 'eye-outline' : 'eye-off-outline'}
                        size={18}
                        color={Colors.DARK_SIX}
                        onPress={() => setIsPasswordShow(!isPasswordShow)}
                    />
                </View>
            </View>
            {/* ERROR PASSWORD */}
            {/* <View
                style={{
                    marginTop: 5,
                    paddingHorizontal: 35,
                    flexDirection: "row",
                }}
            >
                <Ionicons name="warning-outline" size={14} color={Colors.DEFAULT_RED} />
                <Text
                    style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: RFPercentage(1.8),
                        color: Colors.DEFAULT_RED,
                        marginLeft: 8,
                    }}
                >Password to short.*</Text>
            </View> */}


            {/* CONFIRM PASSWORD */}
            <View
                style={{
                    marginTop: 20,
                    paddingHorizontal: 30,
                }}
            >
                <View
                    style={{
                        borderWidth: 0.5,
                        paddingVertical: 5,
                        borderBottomColor: Colors.INACTIVE_GREY,
                        borderColor: Colors.DEFAULT_WHITE,
                        paddingHorizontal: 10,
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
                        size={18}
                        color={Colors.DARK_SIX}
                        onPress={() => setIsConfirmPasswordShow(!isConfirmPasswordShow)}
                    />

                </View>
            </View>

            {/* ERROR CONFIRM PASSWORD */}
            {/* <View
                style={{
                    marginTop: 5,
                    paddingHorizontal: 35,
                    flexDirection: "row",
                }}
            >
                <Ionicons name="warning-outline" size={14} color={Colors.DEFAULT_RED} />
                <Text
                    style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: RFPercentage(1.8),
                        color: Colors.DEFAULT_RED,
                        marginLeft: 8,
                    }}
                >Password not match.*</Text>
            </View> */}


            {/* BUTTOM */}
            <Separator height={50} />
            <View
                style={{
                    paddingHorizontal: 30,
                    alignSelf: 'flex-end',
                }}
            >
                <TouchableOpacity
                    style={{
                        width: 55,
                        height: 55,
                        borderRadius: 26,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: showButton ? Colors.DEFAULT_BG : Colors.DEFAULT_YELLOW2,
                    }}
                    disabled={showButton}
                    onPress={registerUser}
                >
                    <AntDesign
                        name="arrowright"
                        size={20}
                        color={showButton ? Colors.DARK_SEVEN : Colors.DEFAULT_WHITE} />
                </TouchableOpacity>
            </View>

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