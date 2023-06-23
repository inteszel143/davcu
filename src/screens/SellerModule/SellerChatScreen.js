import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { Colors, Display, Separator, General, Status } from '../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, Feather, Fontisto, Ionicons } from 'react-native-vector-icons';
import moment from 'moment';
import { GiftedChat } from 'react-native-gifted-chat'
import { firebase } from '../../../config';
const manLogo = require('../../../assets/Icon/store.png');
const searchIcon = require('../../../assets/Icon/Search.png');


export default function SellerChatScreen({ navigation, route }) {

    const { conversationKey, buyerName, sellerName, BuyerID } = route.params;

    const sellerUid = firebase.auth().currentUser.uid;
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('messages')
            .orderBy("createdAt", 'desc')
            .onSnapshot(querySnapshot => {
                const messages = [];
                querySnapshot.forEach(doc => {

                    if (doc.data().user.recipient === sellerUid && doc.data().user._id === BuyerID ||
                        doc.data().user.recipient === BuyerID && doc.data().user._id === sellerUid) {
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
        const { _id, createdAt, text, user, } = messages[0]
        firebase.firestore()
            .collection('conversation')
            .doc(conversationKey)
            .set({
                message: text,
                createdAt: timestamp,
                buyerId: BuyerID,
                sellerId: sellerUid,
                user: user,
                buyerRead: 1,
                sellerRead: 0,
            })
            .then(() => {
                firebase.firestore()
                    .collection('messages')
                    .add({ _id, createdAt, text, user })
            })

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
                    onPress={() => navigation.replace('SellerMainScreen')}
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
                    >{buyerName}</Text>
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
                        name: buyerName,
                        recipient: BuyerID,
                        seller: sellerName,
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