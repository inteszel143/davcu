import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
    Colors,
    Display,
    Separator, Animations, Header, Status, RiderNotification
} from '../../../constants';
import moment from 'moment';
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../../config';
const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


export default function RiderHome({ navigation }) {

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true })
        return () => backHandler.remove();
    }, [])

    const riderID = firebase.auth().currentUser.uid;
    const [modalVisible, setModalVisible] = useState(false);

    // NEW HERE
    const [time, setTime] = useState(new Date());
    const [riderData, setRideData] = useState('');
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [loadingButton, setLoadingButton] = useState(false);
    const [timeTime, setTimeTime] = useState(new Date());

    //RIDER DATA
    useEffect(() => {
        firebase.firestore()
            .collection('Riders')
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot(documentSnapshot => {
                setRideData(documentSnapshot.data());
                setTimeTime(documentSnapshot.data().timeIn);
                setLoading(false);
            });
    }, []);

    const currentData = moment(new Date()).format('LL');


    // GET TOTAL DELIVERED
    useEffect(() => {
        let isMounted = true;
        firebase.firestore()
            .collection('placeOrders')
            .where("riderID", "==", riderID)
            .where("orderStatus", "==", 'Completed')
            .get()
            .then(querySnapshot => {
                setTotal(querySnapshot.size);
            });
        return () => { isMounted = false; };
    }, []);

    // TIME
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleUpdateRider = async () => {
        setLoadingButton(true);
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        try {
            await firebase.firestore()
                .collection('Riders')
                .doc(firebase.auth().currentUser.uid)
                .update({
                    ready: 1,
                    timeIn: timestamp,
                })
                .then(() => {
                    setModalVisible(false);
                    setLoadingButton(false);
                });
        } catch (error) {
            console.log(error);
        }
    }



    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        // const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    const getCurrentMonth = () => {
        const date = new Date();
        const monthNames = date.toLocaleString('en-US', { month: 'long' }).split(' ');
        return monthNames[1];
    };

    const getCurrentDay = () => {
        const date = new Date();
        const monthNames = date.toLocaleString('en-US', { month: 'long' }).split(' ');
        return monthNames[2];
    };

    const getCurrentDayName = () => {
        const date = new Date();
        const monthNames = date.toLocaleString('en-US', { month: 'long' }).split(' ');
        return monthNames[0];
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
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 15,
                            }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <AntDesign name="close" size={20} color={Colors.DEFAULT_WHITE} />
                        </TouchableOpacity>
                        <View
                            style={{
                                marginTop: 10,
                                alignItems: 'center',
                            }}
                        >

                            <Image
                                source={require('../../../../assets/Icon/questionFilled.png')}
                                resizeMode='contain'
                                style={{
                                    width: 50,
                                    height: 50,
                                    tintColor: Colors.DEFAULT_WHITE,
                                }}
                            />

                            <Text
                                style={{
                                    marginTop: 10,
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2),
                                    color: Colors.DEFAULT_WHITE,
                                    paddingHorizontal: 30,
                                    textAlign: 'center',
                                }}
                            >Are you sure ? you're now ready to accept orders?</Text>
                        </View>

                        {/* BUTTON */}
                        <View
                            style={{
                                marginTop: 20,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    paddingHorizontal: 30,
                                    paddingVertical: 6,
                                    borderWidth: 1,
                                    borderColor: Colors.DEFAULT_WHITE,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={handleUpdateRider}
                            >

                                <Text
                                    style={{
                                        fontFamily: "PoppinsMedium",
                                        fontSize: RFPercentage(1.9),
                                        color: Colors.DEFAULT_WHITE,
                                    }}
                                >Confirm</Text>
                                {
                                    loadingButton && <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} style={{ marginLeft: 5, }} />
                                }

                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        )
    };

    function renderNewHeader() {
        return (
            <View>
                {/* <Separator height={27} /> */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingTop: 40,
                        paddingVertical: 18,
                        backgroundColor: Colors.DEFAULT_WHITE,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >

                        <MaterialCommunityIcons name='bike-fast' size={21} />

                        <Text
                            style={{
                                fontFamily: 'PoppinsBold',
                                fontSize: RFPercentage(2.5),
                                marginLeft: 8,
                            }}
                        >{riderData.fullName}</Text>
                    </View>


                    <RiderNotification />

                </View>
            </View>
        )
    };
    function readyToDeliver() {
        return (
            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                    paddingBottom: 10,
                }}
            >
                <View
                    style={{
                        width: Display.setWidth(95),
                        // height: Display.setHeight(6),
                        borderRadius: 3,
                        paddingVertical: 4,
                        justifyContent: "space-between",
                        backgroundColor: riderData.validate == 0 ? Colors.DEFAULT_RED : Colors.SECONDARY_GREEN,
                        alignSelf: 'center',
                        paddingHorizontal: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <View>
                        {
                            riderData.validate == 0 ? <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2.1),
                                    color: Colors.DEFAULT_WHITE,
                                }}
                            >
                                Waiting for validation
                            </Text>
                                :
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: RFPercentage(2.1),
                                        color: Colors.DEFAULT_WHITE,
                                    }}
                                >
                                    Account verified
                                </Text>
                        }


                        {
                            riderData.validate == 0 ? <Text
                                style={{
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: RFPercentage(1.7),
                                    color: Colors.DEFAULT_WHITE,
                                }}
                            >
                                You're not ready yet
                            </Text>
                                :
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsRegular',
                                        fontSize: RFPercentage(1.7),
                                        color: Colors.DEFAULT_WHITE,
                                    }}
                                >
                                    You're good to go
                                </Text>
                        }


                    </View>

                    <View>
                        <MaterialCommunityIcons name={riderData.validate == 0 ? 'information' : 'check-decagram'} size={20} color={Colors.DEFAULT_WHITE} />
                    </View>

                </View>
            </View>
        )
    };
    function renderReturn() {
        return (
            <View
                style={{
                    paddingVertical: 20,
                    paddingHorizontal: 25,
                    marginHorizontal: 20,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    borderRadius: 8,
                    borderWidth: 0.5,
                    borderColor: Colors.DEFAULT_RED,
                }}
            >

                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <MaterialCommunityIcons name="information-outline" size={22} color={Colors.DEFAULT_RED} />
                    <View
                        style={{
                            flex: 1,
                            marginLeft: 10,
                            paddingHorizontal: 5,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "PoppinsRegular",
                                fontSize: RFPercentage(1.9),
                                textAlign: 'justify',
                                color: Colors.DARK_SIX,
                            }}
                        >
                            We hereby acknowledge that your documents did not meet the necessary requirements for our app. Please update or read a reason provided to our administrator as to why your documents were returned.
                        </Text>
                    </View>

                </View>

                <Separator height={8} />

                <TouchableOpacity
                    style={{
                        width: Display.setWidth(25),
                        paddingVertical: 7,
                        borderWidth: 0.5,
                        borderColor: Colors.DEFAULT_RED,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.navigate('RiderUpdateDocs')}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(1.7),
                            color: Colors.DEFAULT_RED,
                        }}
                    >Update now</Text>
                </TouchableOpacity>

            </View>
        )
    }
    function renderCenter() {
        return (
            <View
                style={{
                    paddingVertical: 20,
                    paddingHorizontal: 25,
                    marginHorizontal: 20,
                    backgroundColor: Colors.DEFAULT_WHITE,
                    borderRadius: 10,
                }}
            >

                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    {/* DATE */}
                    <View
                        style={{
                            backgroundColor: Colors.LIGHT_GREY,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 10,
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                color: Colors.DEFAULT_RED,
                                textAlign: 'center',
                            }}
                        >{getCurrentMonth()}</Text>

                        <Text
                            style={{
                                fontFamily: 'PoppinsBold',
                                fontSize: RFPercentage(3.4),
                                textAlign: 'center',
                            }}
                        >
                            {getCurrentDay()}
                        </Text>

                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                            }}
                        >
                            {getCurrentDayName()}
                        </Text>
                    </View>

                    {/* TIME */}
                    <View
                        style={{
                            flex: 1,
                            marginLeft: 30,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: RFPercentage(3),
                            }}
                        >
                            {formatTime(time)}
                            {/* {moment(formatTime(time)).format('LT')} */}
                        </Text>

                        <Text
                            style={{
                                fontFamily: "PoppinsMedium",
                                fontSize: RFPercentage(1.9),
                                color: Colors.INACTIVE_GREY,
                                marginBottom: 10,
                            }}
                        >
                            Davao City
                        </Text>




                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >

                            <MaterialCommunityIcons
                                name={riderData.ready == 1 ? "check-decagram" : "checkbox-blank-circle"} size={18}
                                color={riderData.ready == 1 ? Colors.SECONDARY_GREEN : Colors.DEFAULT_RED} />

                            {
                                riderData.ready == 1 ? <Text
                                    style={{
                                        fontFamily: "PoppinsMedium",
                                        fontSize: RFPercentage(1.9),
                                        marginLeft: 5,
                                        color: Colors.INACTIVE_GREY,
                                    }}
                                >
                                    Ongoing
                                </Text>
                                    :
                                    <Text
                                        style={{
                                            fontFamily: "PoppinsMedium",
                                            fontSize: RFPercentage(1.9),
                                            marginLeft: 5,
                                            color: Colors.INACTIVE_GREY,
                                        }}
                                    >
                                        Not ready
                                    </Text>
                            }



                        </View>



                    </View>

                    {/* STATUS */}

                    <View
                        style={{
                            marginTop: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'PoppinsBold',
                                fontSize: RFPercentage(2.2),
                            }}
                        >Time-in</Text>

                        {
                            riderData.ready == 1 ? <View>
                                {
                                    riderData.timeIn === null ? <Text
                                        style={{
                                            fontFamily: "PoppinsSemiBold",
                                            fontSize: RFPercentage(2.1),
                                            color: Colors.DARK_SIX,
                                            marginTop: 10,
                                        }}
                                    >
                                        -- . --
                                    </Text> :
                                        <Text
                                            style={{
                                                fontFamily: "PoppinsSemiBold",
                                                fontSize: RFPercentage(2.1),
                                                color: Colors.DARK_SIX,
                                                marginTop: 10,
                                            }}
                                        >
                                            {moment(riderData.timeIn.toDate()).format('LT')}
                                        </Text>
                                }
                            </View>
                                :
                                <Text
                                    style={{
                                        fontFamily: "PoppinsSemiBold",
                                        fontSize: RFPercentage(2.1),
                                        color: Colors.DARK_SIX,
                                        marginTop: 10,
                                    }}
                                >
                                    -- . --
                                </Text>
                        }



                    </View>

                </View>


                <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY2, marginTop: 25, }} />



                {/* SETTINGS */}
                {
                    riderData.ready == 0 && <View>
                        <View
                            style={{
                                marginTop: 10,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "PoppinsMedium",
                                    fontSize: RFPercentage(1.8),
                                    color: Colors.INACTIVE_GREY,
                                }}
                            >Settings </Text>
                            <Ionicons name="information-circle-outline" size={16} color={Colors.DEFAULT_RED} />
                        </View>

                        <View
                            style={{
                                marginTop: 15,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "PoppinsBold",
                                    fontSize: RFPercentage(2.3),
                                }}
                            >
                                Ready accept orders
                            </Text>

                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                            >
                                <View
                                    style={{
                                        borderWidth: 1,
                                        justifyContent: 'center',
                                        borderColor: Colors.INACTIVE_GREY,
                                        width: Display.setWidth(16),
                                        height: Display.setHeight(4),
                                        borderRadius: 15,
                                    }}
                                >
                                    <View style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 15,
                                        marginLeft: 3,
                                        backgroundColor: Colors.INACTIVE_GREY,
                                    }} />
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                }



            </View>
        )
    };




    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            {renderNewHeader()}
            {readyToDeliver()}

            {/* <Separator height={13} />
            {renderReturn()} */}
            {
                riderData.returnComment && <View>
                    <Separator height={13} />
                    {renderReturn()}
                </View>
            }
            <Separator height={15} />
            {renderCenter()}
            {/* <Separator height={13} />
            {renderToday()} */}

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
        width: Display.setWidth(84),

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
    },
})