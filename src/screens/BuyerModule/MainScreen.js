import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import { Colors } from '../../constants';

import { firebase } from '../../../config';
import { Badge } from 'react-native-paper';
import HomeScreen from './BottomTabs/HomeScreen';
import SearchScreen from './BottomTabs/SearchScreen';
import WishListPage from './BottomTabs/WishListPage';
import InboxScreen from './BottomTabs/InboxScreen';
import ProfileScreen from './BottomTabs/ProfileScreen';

export default function MainScreen() {

    const BuyerID = firebase.auth().currentUser.uid;
    const [notif, setNotif] = useState(null);
    const [profileNotif, setProfileNotif] = useState("")

    useEffect(() => {
        firebase.firestore()
            .collection('buyerNotif')
            .where("buyerId", "==", BuyerID)
            .get()
            .then(querySnapshot => {
                setNotif(querySnapshot.size);
            });
    }, []);

    //    Completed Orders
    useEffect(() => {
        firebase.firestore()
            .collection('placeOrders')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().buyerId === firebase.auth().currentUser.uid && documentSnapshot.data().rated == 0 && documentSnapshot.data().orderStatus === 'Completed') {
                        setProfileNotif(documentSnapshot.data());
                    }
                });
            });
    }, [])


    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: Colors.DEFAULT_WHITE,
                    height: 60,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    borderTopWidth: 0,
                }
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/homeMage.png')}
                                resizeMode='contain'
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: focused ? Colors.DEFAULT_YELLOW2 : null,
                                }}
                            />

                        </View>
                    )
                }}
            />
            <Tab.Screen name="Search" component={SearchScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/Search.png')}
                                resizeMode='contain'
                                style={{
                                    width: 30,
                                    height: 30,
                                    tintColor: focused ? Colors.DEFAULT_YELLOW2 : null,
                                }}
                            />
                        </View>
                    )
                }}
            />
            <Tab.Screen name="Wishlist" component={WishListPage}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/heart.png')}
                                resizeMode='contain'
                                style={{
                                    width: 22,
                                    height: 22,
                                    tintColor: focused ? Colors.DEFAULT_YELLOW2 : null,
                                }}
                            />
                        </View>
                    )
                }}
            />
            <Tab.Screen name="Notification" component={InboxScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/notification.png')}
                                resizeMode='contain'
                                style={{
                                    width: 30,
                                    height: 30,
                                    tintColor: focused ? Colors.DEFAULT_YELLOW2 : null,
                                }}
                            />
                            {
                                notif == 0 ? <></>
                                    :
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: 5,
                                            right: 5,
                                        }}
                                    >
                                        <Badge
                                            size={10}
                                            style={{
                                                backgroundColor: Colors.DEFAULT_RED,
                                            }}
                                        />
                                    </View>
                            }

                        </View>
                    )
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/User.png')}
                                resizeMode='contain'
                                style={{
                                    width: 30,
                                    height: 30,
                                    tintColor: focused ? Colors.DEFAULT_YELLOW2 : null,
                                }}
                            />
                            {
                                profileNotif.length == 0 ? <></>
                                    :
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: 5,
                                            right: 3,
                                        }}
                                    >
                                        <Badge
                                            size={10}
                                            style={{
                                                backgroundColor: Colors.DEFAULT_RED,
                                            }}
                                        />
                                    </View>
                            }

                        </View>
                    )
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({})