import { StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SimpleLineIcons, MaterialCommunityIcons, Ionicons } from 'react-native-vector-icons';
import Colors from './Colors';
import Display from './Display';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../config';
import { RFPercentage } from 'react-native-responsive-fontsize';

export default function RiderNotification() {
    const navigation = useNavigation();

    const [notifdata, setNotifData] = useState('');

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('riderNotif')
            .where("delivered", "==", 'No')
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    data.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setNotifData(data);
            });
        return () => { isMounted = false; subscriber() };
    }, []);

    return (
        <View>
            {
                notifdata.length === 0 ? <TouchableOpacity
                    onPress={() => navigation.navigate('RiderNotification')}
                >
                    <Ionicons name='notifications-outline' size={22} />
                </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={() => navigation.navigate('RiderNotification')}
                    >
                        <Ionicons name='notifications-outline' size={24} />
                        <View
                            style={{
                                position: 'absolute',
                                top: 3,
                                right: 2,
                                height: 9,
                                width: 9,
                                backgroundColor: Colors.DEFAULT_RED,
                                borderRadius: 30,
                            }}
                        />
                    </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({})