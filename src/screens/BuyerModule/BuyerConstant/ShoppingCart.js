import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../../../constants'
import { Badge } from 'react-native-paper';
const Bag = require('../../../../assets/Icon/shoppingBags.png');
import { firebase } from '../../../../config';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
export default function ShoppingCart() {

    const navigation = useNavigation();

    const [productData, setProductData] = useState('');
    const buyerId = firebase.auth().currentUser.uid;

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('buyerCart')
            .orderBy("createdAt", 'desc')
            .onSnapshot(querySnapshot => {
                const data = [];
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().userId === buyerId) {
                        data.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }

                });
                setProductData(data);
            });
        return () => { isMounted = false; subscriber() };
    }, []);


    return (
        <TouchableOpacity
            style={{
                marginLeft: 14,
            }}
            onPress={() => navigation.navigate('BuyerShoppingBag')}
        >
            <Image
                source={Bag}
                resizeMode='contain'
                style={{
                    width: 26,
                    height: 26,
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    top: 3,
                    right: -2,
                }}
            >
                {
                    productData.length == 0 ? <></>
                        :
                        <Badge
                            size={12}
                            style={{
                                backgroundColor: Colors.DEFAULT_RED,
                                fontSize: 8,
                            }}
                        >{productData.length}</Badge>
                }

            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})