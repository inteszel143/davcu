import { StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SimpleLineIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import Colors from './Colors';
import Display from './Display';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../config';


export default function HomeCart() {


    const navigation = useNavigation();

    const [productData, setProductData] = useState('');
    const [loading, setLoading] = useState(true);
    const buyerId = firebase.auth().currentUser.uid;


    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('orders')
            .orderBy("createdAt", 'desc')
            .onSnapshot(querySnapshot => {
                const data = [];

                querySnapshot.forEach(documentSnapshot => {

                    if (documentSnapshot.data().userUid === buyerId) {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }

                });
                setProductData(data);
                setLoading(false);

            });
        return () => { isMounted = false; subscriber() };
    }, []);


    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('BuyerCart')}
        >
            <View style={{
                height: 40, width: 40,
                justifyContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
            }} >
                {/* <MaterialIcons name='shopping-bag' size={30} color={Colors.DEFAULT_YELLOW} /> */}
                {/* <Ionicons name='cart-outline' size={25} /> */}
                <SimpleLineIcons name='bag' size={21} color={Colors.DEFAULT_WHITE} />
                {productData.length === 0 ? <></> : <View
                    style={{
                        position: 'absolute',
                        backgroundColor: Colors.DEFAULT_RED,
                        width: 8,
                        height: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 30,
                        borderColor: Colors.DEFAULT_WHITE,
                        top: 12,
                        right: 8,
                    }}
                >
                    {/* <Text style={{ 
                        color: Colors.DEFAULT_WHITE, 
                        fontSize: scale(11), 
                        fontFamily: 'PoppinsRegular',
                        textAlign: 'center',
                        }} >{productData.length}</Text> */}
                </View>}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})