import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'
import Colors from './Colors'

export default function Status() {
  return (
    <View>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.DEFAULT_WHITE}
        translucent
        style="auto"
      />
    </View>
  )
}

const styles = StyleSheet.create({})