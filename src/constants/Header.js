import { StyleSheet, Text, View, StatusBar, Image, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons, Ionicons, Entypo, AntDesign } from 'react-native-vector-icons';
import Separator from './Separator';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';
import Colors from './Colors';

export default function Header({ title }) {

  const navigation = useNavigation();
  return (
    <View style={styles.container} >
      <Separator height={37} />


      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 13,
          paddingVertical: 6,
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name='arrowleft' size={22} style={{ marginBottom: 3 }} />
        </TouchableOpacity>

        <View
          style={{
            marginLeft: 15,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'PoppinsSemiBold',
              fontSize: RFPercentage(2.5),
            }}
          >{title}</Text>
        </View>
        <View
          style={{
            height: 22,
            width: 38,
          }}
        >

        </View>
      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.DEFAULT_WHITE,

  }
})