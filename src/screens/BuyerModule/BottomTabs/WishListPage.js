import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Display, Separator, General } from '../../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import numeral from 'numeral';
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import { firebase } from '../../../../config';
const empty = require('../../../../assets/Icon/magnifying-glass.png');
const heart = require('../../../../assets/Icon/heart.png');

export default function WishListPage() {


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
        // onPress={() => navigation.goBack()}
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
          >Wishlist</Text>
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
  function renderData() {
    return (
      <View
        style={{
          marginTop: 170,
          alignItems: 'center',
        }}
      >
        <Image
          source={empty}
          resizeMode='contain'
          style={{
            width: 90,
            height: 80,
          }}
        />
        <Text
          style={{
            fontFamily: 'PoppinsSemiBold',
            fontSize: RFPercentage(2.6),
            marginTop: 25,
          }}
        >
          No result found
        </Text>
        <Text
          style={{
            fontFamily: 'PoppinsRegular',
            fontSize: RFPercentage(1.9),
            paddingHorizontal: 50,
            textAlign: 'center',
            marginTop: 8,
            color: Colors.INACTIVE_GREY,
          }}
        >
          "We're sorry, but there are no available items at the moment."
        </Text>

      </View>
    )
  }

  return (
    <View style={styles.container} >
      <Separator height={27} />
      {renderTop()}
      {renderData()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DEFAULT_WHITE,
  }
})