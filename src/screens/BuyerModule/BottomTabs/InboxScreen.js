import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Display, Separator, General } from '../../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, Feather, Fontisto, Ionicons } from 'react-native-vector-icons';
import moment from 'moment';
import { firebase } from '../../../../config';
const bags = require('../../../../assets/Icon/shoppingBags.png');


export default function InboxScreen({ navigation }) {


  const buyerId = firebase.auth().currentUser.uid;
  const [notifdata, setNotifData] = useState('');

  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const subscriber = firebase.firestore()
      .collection('buyerNotif')
      .orderBy("deliveryDate", 'desc')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().buyerId === buyerId) {
            data.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          }
        });
        setNotifData(data);
        setModalVisible(false);

      });
    return () => { isMounted = false; subscriber() };
  }, []);




  function MessageAlert() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                // flexDirection: 'row',
              }}
            >
              <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
              <Text
                style={{
                  fontFamily: 'PoppinsRegular',
                  fontSize: RFPercentage(2),
                  color: Colors.DEFAULT_WHITE,
                  marginTop: 5,
                }}
              >Loading</Text>
            </View>

          </View>
        </View>
      </Modal>
    )
  };


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
          >Notification</Text>
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

  function renderContent() {
    return (
      <View>

        {
          notifdata.length === 0 ? <View
            style={{
              marginTop: Display.setHeight(35),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons name='bell-alert-outline' size={55} color={Colors.DARK_SIX} />
            <Text
              style={{
                fontFamily: 'PoppinsRegular',
                fontSize: RFPercentage(1.9),
                color: Colors.DARK_SIX,
                marginTop: 10,
              }}
            >No new notification</Text>
          </View>
            :
            <View>

              <FlatList
                data={notifdata}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 20,
                      marginHorizontal: 15,
                      backgroundColor: Colors.DEFAULT_WHITE,
                      borderWidth: 0.5,
                      borderRadius: 8,
                      borderColor: Colors.DEFAULT_WHITE,
                      borderBottomColor: Colors.LIGHT_GREY2,
                      backgroundColor: Colors.DEFAULT_WHITE,
                      marginTop: 10,
                    }}
                    onPress={() => navigation.navigate('BuyerOrders')}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                      }}
                    >
                      {/* IMAGE */}
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          // backgroundColor: Colors.LIGHT_GREY2,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 20,
                          marginLeft: 3,
                          borderWidth: 0.5,
                        }}
                      >
                        <Image
                          source={bags}
                          resizeMode='contain'
                          style={{
                            width: 20,
                            height: 20,
                          }}
                        />
                      </View>

                      {/* DATA    */}
                      <View
                        style={{
                          paddingHorizontal: 5,

                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                            paddingHorizontal: 15,
                          }}
                        >Order Delivered</Text>
                        <Separator height={5} />
                        <Text
                          style={{
                            // flex: 1,
                            fontFamily: 'PoppinsRegular',
                            fontSize: RFPercentage(1.9),
                            paddingHorizontal: 15,
                            paddingRight: 25,
                          }}
                        >
                          Your order
                          <Text style={{ fontFamily: 'PoppinsSemiBold' }} > {item.ProductName} </Text>
                          has been completed & arrived at the destination address (Please rates your order)
                        </Text>
                        <Separator height={10} />
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: 'PoppinsRegular',
                              fontSize: RFPercentage(1.7),
                              color: Colors.INACTIVE_GREY,
                              paddingHorizontal: 15,
                            }}
                          >
                            {moment(item.deliveryDate.toDate()).format('LLL')}
                          </Text>


                        </View>
                      </View>

                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
        }
      </View>
    )
  }

  return (
    <View style={styles.container} >
      {MessageAlert()}
      <Separator height={27} />
      {renderTop()}
      {renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 20,
  },
  modalView: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    borderRadius: 5,
    width: Display.setWidth(45),

    paddingVertical: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})