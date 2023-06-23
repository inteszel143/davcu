import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import Colors from './Colors';
import Display from './Display';


export default function Animations({ visible = false }) {

    const animation = useRef(null);

    return (
        visible && (
            <View style={styles.container} >
                <Image
                    source={require('../../assets/images/loader.gif')}
                    resizeMode='contain'
                    style={{
                        width: Display.setWidth(100),
                        marginLeft: 13,
                        tintColor: Colors.LIGHT_BROWN,
                    }}
                />
            </View>
        )

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.DEFAULT_WHITE,
    },
});