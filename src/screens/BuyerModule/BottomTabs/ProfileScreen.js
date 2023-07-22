import { FlatList, Image, StyleSheet, Text, ScrollView, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Display, Separator, General } from '../../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Badge } from 'react-native-paper'
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import Messaging from '../BuyerConstant/Messaging';
import ShoppingCart from '../BuyerConstant/ShoppingCart';
import { firebase } from '../../../../config';
const profileImg = require('../../../../assets/Icon/profileImage.jpg');
const shoppingBag = require('../../../../assets/Icon/shoppingBags.png');
export default function ProfileScreen({ navigation }) {

  const [modalVisible, setModalVisible] = useState(false);
  const [loadingModal, setLoadingModal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [buyerData, setBuyerData] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    const subscriber = firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(documentSnapshot => {
        setBuyerData(documentSnapshot.data());
        setLoading(false);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  //    Completed Orders
  useEffect(() => {
    firebase.firestore()
      .collection('placeOrders')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().buyerId === firebase.auth().currentUser.uid && documentSnapshot.data().rated == 0 && documentSnapshot.data().orderStatus === 'Completed') {
            setNote(documentSnapshot.data());
          }
        });
      });
  }, [])


  const handleSignOut = () => {
    firebase.auth()
      .signOut()
      .then(() => {
        navigation.navigate('BuyerLogin');
      })
      .catch(error => Alert.alert(error.message))
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: 'center',
          backgroundColor: Colors.DEFAULT_WHITE,

        }}
      >
        {LoadingScreen()}
      </View>
    );
  };

  function LoadingScreen() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={loadingModal}
        onRequestClose={() => {
          setLoadingModal(!loadingModal);
        }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
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
          }}>
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
  }

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
            <Text style={styles.modalText} >Are you sure ! you want to Logout?</Text>

            <Separator height={12} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                style={{
                  paddingHorizontal: 25,
                  paddingVertical: 5,
                  borderRadius: 5,
                  borderWidth: 0.5,
                  marginRight: 10,
                  borderColor: Colors.LIGHT_GREY,
                }}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text
                  style={{
                    fontFamily: 'PoppinsMedium',
                    fontSize: RFPercentage(2),
                    color: Colors.LIGHT_GREY,
                  }}
                >Cancel</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={{
                  paddingHorizontal: 25,
                  paddingVertical: 5,
                  borderRadius: 5,
                  borderWidth: 0.5,
                  backgroundColor: Colors.DEFAULT_RED,
                  borderColor: Colors.DEFAULT_RED,
                }}
                onPress={() => {
                  handleSignOut();
                  setModalVisible(!modalVisible)
                }}
              >
                <Text
                  style={{
                    fontFamily: 'PoppinsSemiBold',
                    color: Colors.DEFAULT_WHITE,
                    fontSize: RFPercentage(2),
                  }}
                >Logout</Text>
              </TouchableOpacity>
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
          marginTop: 5,
          paddingVertical: 10,
          // backgroundColor: Colors.DEFAULT_WHITE,
        }}
      >
        <TouchableOpacity
          style={{
            width: '20%',
          }}
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
          >Profile</Text>
        </View>
        <View
          style={{
            width: '20%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {/* MESSAGIN HERE */}
          <Messaging />
          {/* SHOOPPING CART HERE */}
          <ShoppingCart />
        </View>
      </View>
    )
  };
  function renderImage() {
    return (
      <View
        style={{
          marginTop: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {
          buyerData.profileUrl ? <Image
            source={{ uri: buyerData.profileUrl }}
            resizeMode='contain'
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
            }}
          />
            :
            <Image
              source={profileImg}
              resizeMode='contain'
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
              }}
            />
        }

        <Text
          style={{
            fontFamily: 'PoppinsSemiBold',
            fontSize: RFPercentage(2.2),
            marginTop: 10,
          }}
        >
          {buyerData.firstName + " " + buyerData.lastName}
        </Text>

        <TouchableOpacity
          style={{
            marginTop: 10,
            width: Display.setWidth(40),
            paddingVertical: 10,
            borderWidth: 0.5,
            borderRadius: 4,
            borderColor: Colors.INACTIVE_GREY,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text
            style={{
              fontFamily: 'PoppinsMedium',
              fontSize: RFPercentage(1.9),
            }}
          >
            Edit profile
          </Text>
        </TouchableOpacity>

      </View>
    )
  };
  function renderMyOrdersButton() {
    return (
      <View
        style={{
          marginTop: 45,
          paddingHorizontal: 22,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('BuyerMyOrders')}
        >
          <Image
            source={shoppingBag}
            resizeMode='contain'
            style={{
              width: 23,
              height: 23,
            }}
          />
          <Text
            style={{
              flex: 1,
              fontFamily: 'PoppinsMedium',
              fontSize: RFPercentage(2),
              marginLeft: 15,
            }}
          >
            My Orders
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {
              note.length == 0 ? <></>
                :
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.DEFAULT_RED, marginRight: 5, }} />
            }
            <Ionicons name="chevron-forward" size={18} color={Colors.INACTIVE_GREY} />

          </View>
        </TouchableOpacity>
        {/* <View style={{ height: 0.5, backgroundColor: Colors.LIGHT_GREY2, marginTop: 15, }} /> */}
      </View>
    )
  };
  function renderShippingAddress() {
    return (
      <View
        style={{
          marginTop: 32,
          paddingHorizontal: 22,
        }}
      >

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('ShippingAddress')}
        >
          <Ionicons name="location-outline" size={22} />
          <Text
            style={{
              flex: 1,
              fontFamily: 'PoppinsMedium',
              fontSize: RFPercentage(2),
              marginLeft: 15,
            }}
          >
            Shipping address
          </Text>

          <Ionicons name="chevron-forward" size={18} color={Colors.INACTIVE_GREY} />
        </TouchableOpacity>
        {/* <View style={{ height: 0.5, backgroundColor: Colors.LIGHT_GREY2, marginTop: 15, }} /> */}
      </View>
    )
  };
  function renderLanguage() {
    return (
      <View
        style={{
          marginTop: 32,
          paddingHorizontal: 22,
        }}
      >

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="language" size={22} />
          <Text
            style={{
              flex: 1,
              fontFamily: 'PoppinsMedium',
              fontSize: RFPercentage(2),
              marginLeft: 15,
            }}
          >
            Language
          </Text>

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <Text
              style={{
                fontFamily: 'PoppinsRegular',
                fontSize: RFPercentage(2),
                color: Colors.INACTIVE_GREY,
                marginRight: 5,
              }}
            >
              English
            </Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.INACTIVE_GREY} />
          </View>

        </TouchableOpacity>
        {/* <View style={{ height: 0.5, backgroundColor: Colors.LIGHT_GREY2, marginTop: 15, }} /> */}
      </View>
    )
  };
  function renderMember() {
    return (
      <View
        style={{
          marginTop: 32,
          paddingHorizontal: 22,
        }}
      >

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="medal-outline" size={22} />
          <Text
            style={{
              flex: 1,
              fontFamily: 'PoppinsMedium',
              fontSize: RFPercentage(2),
              marginLeft: 15,
            }}
          >
            Member Status
          </Text>

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <Text
              style={{
                fontFamily: 'PoppinsRegular',
                fontSize: RFPercentage(2),
                color: Colors.INACTIVE_GREY,
                marginRight: 5,
              }}
            >
              Good Member
            </Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.INACTIVE_GREY} />
          </View>

        </TouchableOpacity>
        {/* <View style={{ height: 0.5, backgroundColor: Colors.LIGHT_GREY2, marginTop: 15, }} /> */}
      </View>
    )
  };
  function helpCenter() {
    return (
      <View
        style={{
          marginTop: 32,
          paddingHorizontal: 22,
        }}
      >

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="md-fitness-outline" size={22} />
          <Text
            style={{
              flex: 1,
              fontFamily: 'PoppinsMedium',
              fontSize: RFPercentage(2),
              marginLeft: 15,
            }}
          >
            Help Center
          </Text>

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <Ionicons name="chevron-forward" size={18} color={Colors.INACTIVE_GREY} />
          </View>

        </TouchableOpacity>
        {/* <View style={{ height: 0.5, backgroundColor: Colors.LIGHT_GREY2, marginTop: 15, }} /> */}
      </View>
    )
  };
  function renderLogout() {
    return (
      <View
        style={{
          marginTop: 30,
          paddingHorizontal: 22,
        }}
      >

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="exit-outline" size={22} color={Colors.DEFAULT_RED} />
          <Text
            style={{
              flex: 1,
              fontFamily: 'PoppinsMedium',
              fontSize: RFPercentage(2),
              color: Colors.DEFAULT_RED,
              marginLeft: 15,
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>

      </View>
    )
  };


  return (
    <View style={styles.container} >
      {MessageAlert()}
      <Separator height={27} />
      {renderTop()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 35,
        }}
      >
        {renderImage()}
        {renderMyOrdersButton()}
        {renderShippingAddress()}

        {renderMember()}
        {renderLanguage()}
        {helpCenter()}
        {renderLogout()}
      </ScrollView>
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
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    borderRadius: 5,
    width: Display.setWidth(80),
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
  modalText: {
    color: Colors.DEFAULT_WHITE,
    textAlign: 'center',
    fontFamily: 'PoppinsSemiBold',
    fontSize: RFPercentage(2.2),
    paddingHorizontal: 40,
  },
})