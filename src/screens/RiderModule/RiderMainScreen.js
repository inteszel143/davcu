import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import { Colors } from '../../constants';

import { RiderHome, Deliveries, History, RiderProfile } from './RiderTabs';
import { RFPercentage } from 'react-native-responsive-fontsize';

export default function RiderMainScreen() {
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
            <Tab.Screen name="Dashboard" component={RiderHome}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/dashboard.png')}
                                resizeMode='contain'
                                style={{
                                    width: 22,
                                    height: 22,
                                    tintColor: focused ? Colors.SECONDARY_GREEN : null,
                                }}
                            />

                        </View>
                    )
                }}
            />
            <Tab.Screen name="Deliveries" component={Deliveries}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/rider.png')}
                                resizeMode='contain'
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: focused ? Colors.SECONDARY_GREEN : null,
                                }}
                            />
                        </View>
                    )
                }}
            />
            <Tab.Screen name="History" component={History}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/Icon/history.png')}
                                resizeMode='contain'
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: focused ? Colors.SECONDARY_GREEN : null,
                                }}
                            />
                        </View>
                    )
                }}
            />

            <Tab.Screen name="Profile" component={RiderProfile}
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
                                    tintColor: focused ? Colors.SECONDARY_GREEN : null,
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