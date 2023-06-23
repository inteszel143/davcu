import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Badge } from 'react-native-paper';
import { Colors } from '../../../constants';
import { Ionicons } from 'react-native-vector-icons'
import { useNavigation } from '@react-navigation/native';
const message = require('../../../../assets/Icon/message.png');
import { firebase } from '../../../../config';
export default function Messaging() {

    const navigation = useNavigation();
    const [have, setHave] = useState(false);

    useEffect(() => {
        firebase.firestore()
            .collection('conversation')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().buyerId === firebase.auth().currentUser.uid && documentSnapshot.data().buyerRead == 1) {
                        setHave(true);
                    }
                });
            });
    }, [])


    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('ChatScreen')}
        >
            <Image
                source={message}
                resizeMode='contain'
                style={{
                    width: 23,
                    height: 23,
                }}
            />
            {
                have === true ? <View
                    style={{
                        position: 'absolute',
                        top: 2,
                        right: -2,
                    }}
                >
                    <Badge
                        size={10}
                        style={{
                            backgroundColor: Colors.DEFAULT_RED,
                        }}
                    ></Badge>
                </View>
                    :
                    <></>
            }


        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})