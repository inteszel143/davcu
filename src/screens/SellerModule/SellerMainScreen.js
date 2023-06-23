import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import { Colors } from '../../constants';
import { Badge } from 'react-native-paper';
import { SellerHome, SellerMessage, SellerProfile } from './SellerTabs';
import { firebase } from '../../../config'
export default function SellerMainScreen() {



    const [notif, setNotif] = useState(null);

    useEffect(() => {
        firebase.firestore()
            .collection('buyerNotif')
            .where("sellerId", "==", firebase.auth().currentUser.uid)
            .get()
            .then(querySnapshot => {
                setNotif(querySnapshot.size);
            });
    }, []);


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
            <Tab.Screen name="Home" component={SellerHome}
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
            <Tab.Screen name="Search" component={SellerMessage}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/message.png')}
                                resizeMode='contain'
                                style={{
                                    width: 22,
                                    height: 22,
                                    tintColor: focused ? Colors.DEFAULT_YELLOW2 : null,
                                }}
                            />
                            {
                                notif == 0 ? <></>
                                    :
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
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

            <Tab.Screen name="Profile" component={SellerProfile}
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
                        </View>
                    )
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({})