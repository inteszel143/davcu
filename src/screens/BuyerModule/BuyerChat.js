import {
    StyleSheet, Text, View, TextInput,
    ScrollView, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from 'react-native';
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { Colors, Separator, Status, Display, Header } from '../../constants'
import { Entypo, SimpleLineIcons, Ionicons, MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { GiftedChat } from 'react-native-gifted-chat'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { firebase } from '../../../config';

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

export default function BuyerChat({ navigation, route }) {

    const { productId, sellerId } = route.params;
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sellerData, setSellerData] = useState("");
    const [buyer, setBuyer] = useState("");
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const buyerId = firebase.auth().currentUser.uid;
    // SELLER DATA
    useEffect(() => {
        firebase.firestore()
            .collection('sellers')
            .doc(sellerId)
            .onSnapshot(documentSnapshot => {
                setSellerData(documentSnapshot.data());
            });
    }, []);

    //Buyer Data !
    useEffect(() => {
        firebase.firestore()
            .collection('users')
            .doc(buyerId)
            .onSnapshot(documentSnapshot => {
                setBuyer(documentSnapshot.data());
            });
    }, []);


    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('messages')
            .orderBy("createdAt", 'desc')
            .onSnapshot(querySnapshot => {
                const messages = [];
                querySnapshot.forEach(doc => {

                    if (doc.data().user.recipient === sellerId && doc.data().user._id === buyerId ||
                        doc.data().user.recipient === buyerId && doc.data().user._id === sellerId) {
                        messages.push({
                            _id: doc.id,
                            text: doc.data().text,
                            createdAt: doc.data().createdAt.toDate(),
                            user: {
                                _id: doc.data().user._id,
                                name: doc.data().user.name,
                            },
                            sent: true,
                            isTyping: true
                        });
                    }

                });
                setMessages(messages);
                setLoading(false);
            });
        return () => { isMounted = false; subscriber() };
    }, []);



    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const conversationId = buyerId + sellerId;
        const { _id, createdAt, text, user, } = messages[0]
        firebase.firestore()
            .collection('messages')
            .add({ _id, createdAt, text, user })
            .then(() => {
                firebase.firestore()
                    .collection('conversation')
                    .doc(conversationId)
                    .get()
                    .then(documentSnapshot => {
                        console.log('User exists: ', documentSnapshot.exists);
                        if (documentSnapshot.exists) {
                            firebase.firestore()
                                .collection('conversation')
                                .doc(conversationId)
                                .update({
                                    createdAt: timestamp,
                                    message: text,
                                }).then(() => {
                                    console.log("Hello World");
                                });
                        } else {
                            firebase.firestore()
                                .collection('conversation')
                                .doc(conversationId)
                                .set({
                                    message: text,
                                    createdAt: timestamp,
                                    buyerId: buyerId,
                                    sellerId: sellerId,
                                    user: user,
                                    buyerRead: 0,
                                    sellerRead: 1,
                                }).then(() => {
                                    console.log("Hello World");
                                })
                        }
                    });
            });

    }, []);

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
                    >{sellerData.shopName}</Text>
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


    return (
        <View style={styles.container} >
            <Status />
            <Separator height={27} />
            {renderTop()}


            <View
                style={{
                    flex: 1,
                }}
            >
                <GiftedChat
                    textInputStyle={{
                        fontFamily: "PoppinsMedium",
                        fontSize: RFPercentage(2),
                    }}
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: firebase.auth().currentUser.uid,
                        name: buyer.firstName + ' ' + buyer.lastName,
                        recipient: sellerId,
                        seller: sellerData.shopName,
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE,
    }
})