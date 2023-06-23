import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Display, Separator, General, Status } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, Feather, Fontisto, Ionicons } from 'react-native-vector-icons';
import moment from 'moment';
import { Badge } from 'react-native-paper';
import { firebase } from '../../../config';
const manLogo = require('../../../assets/Icon/store.png');
const searchIcon = require('../../../assets/Icon/Search.png');
export default function ChatScreen({ navigation }) {



    const buyerId = firebase.auth().currentUser.uid;
    const [message, setMessage] = useState([]);
    const [sellerInfo, setSellerInfo] = useState('');
    const [loading, setLoading] = useState(true);
   
    const [modalVisible, setModalVisible] = useState(true);

    //Buyer ChatMates !
    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('conversation')
            .orderBy("createdAt", "desc")
            .onSnapshot(querySnapshot => {
                const data = [];

                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().buyerId === buyerId) {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }
                });
                setMessage(data);
                setModalVisible(false);

            });
        return () => { isMounted = false; subscriber() };
    }, []);

    const onClickUpdate = async (convoId) => {
        try {
            await firebase.firestore()
                .collection('conversation')
                .doc(convoId)
                .update({
                    buyerRead: 0,
                })
                .then(() => {
                    console.log('User updated!');
                });
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
                    >Chat</Text>
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


    function renderSearch() {
        return (
            <View
                style={{
                    marginTop: 5,
                    alignSelf: 'center',
                }}
            >
                <View
                    style={{
                        width: Display.setWidth(86),
                        paddingVertical: 7,
                        borderWidth: 0.5,
                        borderColor: Colors.INACTIVE_GREY,
                        borderRadius: 25,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 16,
                        }}
                    >
                        <Image
                            source={searchIcon}
                            resizeMode='contain'
                            style={{
                                width: 26,
                                height: 26,
                            }}
                        />

                        <Text
                            style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: RFPercentage(2),
                                marginLeft: 10,
                            }}
                        >
                            Search
                        </Text>

                    </View>

                </View>

            </View>
        )
    };


    function renderData() {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                {
                    message.length === 0 ? <View
                        style={{
                            marginTop: Display.setHeight(30),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <MaterialCommunityIcons name='message-alert-outline' size={55} color={Colors.DARK_SIX} />
                        <Text
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(2),
                                color: Colors.DARK_SIX,
                                marginTop: 5,
                            }}
                        >No new message</Text>
                    </View>
                        :
                        <FlatList
                            data={message}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (

                                <TouchableOpacity
                                    style={{
                                        marginTop: 15,
                                        paddingHorizontal: 15,
                                        paddingVertical: 25,
                                        marginHorizontal: 10,
                                        borderWidth: 0.5,
                                        borderColor: Colors.DEFAULT_WHITE,
                                        borderBottomColor: Colors.LIGHT_GREY2,
                                        backgroundColor: Colors.DEFAULT_WHITE,

                                    }}
                                    onPress={() => {
                                        onClickUpdate(item.key);
                                        navigation.replace('ChatScreenMessage', {
                                            conversationKey: item.key,
                                            sellerName: item.user.seller,
                                            sellerUid: item.sellerId,
                                        });
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            // alignItems: 'center',
                                        }}
                                    >

                                        <View
                                            style={{
                                                width: 40,
                                                height: 40,
                                                // backgroundColor: Colors.LIGHT_GREY2,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 20,
                                                borderWidth: 0.5,
                                                // borderColor: Colors.DEFAULT_YELLOW2,
                                            }}
                                        >
                                            <Image
                                                source={manLogo}
                                                resizeMode='contain'
                                                style={{
                                                    height: 17,
                                                    width: 17,
                                                    // tintColor: Colors.DEFAULT_YELLOW2,
                                                }}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flex: 1,
                                                paddingHorizontal: 10,
                                                marginLeft: 12,
                                            }}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    fontFamily: 'PoppinsSemiBold',
                                                    fontSize: RFPercentage(1.9),
                                                }}
                                            >{item.user.seller}</Text>
                                            {/* <Separator height={5} /> */}
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    fontFamily: 'PoppinsMedium',
                                                    fontSize: RFPercentage(1.8),
                                                    marginTop: 5,
                                                    color: Colors.DARK_SIX,
                                                }}
                                            >{item.message}

                                            </Text>
                                        </View>

                                        <View
                                            style={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 0,
                                            }}
                                        >
                                            {
                                                item.createdAt && <Text
                                                    style={{
                                                        fontFamily: 'PoppinsMedium',
                                                        fontSize: RFPercentage(1.7),
                                                        color: Colors.DARK_SEVEN,
                                                    }}
                                                >{moment(item.createdAt.toDate()).startOf('hour').fromNow()}</Text>
                                            }
                                            {
                                                item.buyerRead == 1 ? <Badge
                                                    style={{
                                                        backgroundColor: Colors.DEFAULT_RED,
                                                    }}
                                                    size={14}
                                                >1</Badge>
                                                    :
                                                    <></>
                                            }

                                        </View>

                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                }
            </View>
        )
    }


    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={27} />
            {renderTop()}
            {renderSearch()}
            {renderData()}
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