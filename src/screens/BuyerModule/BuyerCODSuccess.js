import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Separator, Status, Display } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome, Ionicons, Feather, AntDesign, MaterialCommunityIcons } from 'react-native-vector-icons';
import moment from 'moment/moment';
import numeral from 'numeral';
import { firebase } from '../../../config';
const paypal = require('../../../assets/Icon/check.jpg');

export default function BuyerCODSuccess({ navigation, route }) {

    const { amount, numberTrans } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let transactionNumber = '';

    const [addressData, setAddressData] = useState("");
    const [loading, setLoading] = useState(true);





    // GET ADDRESS
    useEffect(() => {
        firebase.firestore()
            .collection('buyerAddress')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().buyerId === firebase.auth().currentUser.uid && documentSnapshot.data().default === true) {
                        setAddressData(documentSnapshot.data());
                        setLoading(false);
                    }
                });
            });
    }, []);




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
    }


    const navigateHome = () => {
        setModalVisible(true);
        try {
            setTimeout(() => {
                setModalVisible(false);
                navigation.replace('MainScreen');
            }, 3000)

        } catch (error) {
            console.log(error)
        }
    }

    function renderButton() {
        return (
            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    paddingBottom: 40,

                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.SECONDARY_GREEN,
                        width: Display.setWidth(90),
                        height: Display.setHeight(6.2),
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={navigateHome}
                >
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2),
                            color: Colors.DEFAULT_WHITE,
                        }}
                    >Back to dashboard</Text>
                </TouchableOpacity>

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
                                // flexDirection: 'row',
                            }}
                        >
                            <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                            <Text
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                    marginTop: 10,
                                }}
                            >Please wait</Text>
                        </View>

                    </View>
                </View>
            </Modal>
        )
    };

    return (
        <View style={styles.container} >
            {MessageAlert()}
            <Separator height={27} />


            <View
                style={{
                    marginTop: 50,
                }}
            >
                <Image
                    source={paypal}
                    resizeMode='contain'
                    style={{
                        width: 120,
                        height: 120,
                    }}
                />
            </View>

            <View
                style={{
                    paddingHorizontal: 40,
                    paddingVertical: 15,
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontFamily: "PoppinsMedium",
                        fontSize: RFPercentage(2.8),
                        textAlign: 'center',
                        paddingVertical: 10,
                    }}
                >
                    Your order has been placed. Thank you
                </Text>
            </View>


            <View
                style={{
                    marginTop: 40,
                    width: Display.setWidth(90),
                    paddingVertical: 25,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    backgroundColor: Colors.DEFAULT_BG2,
                }}
            >

                {/* ADDRESS */}
                <View>
                    <Text
                        style={{
                            fontFamily: "PoppinsSemiBold",
                            fontSize: RFPercentage(2),
                            color: Colors.DARK_SIX,
                        }}
                    >
                        Shipping Address
                    </Text>

                    <View>
                        <Text
                            style={{
                                marginTop: 15,
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2),
                                color: Colors.DARK_SIX,
                            }}
                        >
                            {addressData.fullName}
                        </Text>

                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2),
                                color: Colors.DARK_SIX,
                                marginVertical: 3,
                            }}
                        >
                            +63 {addressData.phoneNumber}
                        </Text>

                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2),
                                color: Colors.DARK_SIX,
                            }}
                        >
                            {addressData.addressInfo + " " + addressData.barangay + " " + addressData.city + " " + addressData.province + " " + addressData.region}
                        </Text>
                    </View>
                </View>


                <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 20, }} />

                {/* SUB TOTAL */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >

                    <View>
                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2.2),
                                color: Colors.DARK_SIX,
                            }}
                        >
                            Amount:
                        </Text>

                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2.2),
                                color: Colors.DARK_SIX,
                                marginTop: 10,
                            }}
                        >
                            Transaction Date:
                        </Text>

                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2.2),
                                color: Colors.DARK_SIX,
                                marginTop: 10,
                            }}
                        >
                            Transaction ID:
                        </Text>


                    </View>

                    <View>
                        <Text
                            style={{
                                fontFamily: "PoppinsSemiBold",
                                fontSize: RFPercentage(2.2),
                                color: Colors.DARK_SIX,
                                textAlign: 'right',
                            }}
                        >
                            ₱ {numeral(amount).format('0,0.00')}
                        </Text>

                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2.2),
                                color: Colors.DARK_SIX,
                                marginTop: 10,
                                textAlign: 'right',
                            }}
                        >
                            {moment(new Date()).format('LL')}
                        </Text>


                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(2.2),
                                color: Colors.DARK_SIX,
                                marginTop: 10,
                                textAlign: 'right',
                            }}
                        >
                            {numberTrans}
                        </Text>


                    </View>

                </View>
                {/* END SUB TOTAL */}

            </View>


            {renderButton()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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