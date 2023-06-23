import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Display, Separator, Status } from '../../../constants';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import { firebase } from '../.././../../config';
const profileImg = require('../../../../assets/Icon/profileImage.jpg');
const shoppingBag = require('../../../../assets/Icon/shoppingBags.png');

export default function SellerProfile({ navigation }) {

  const [modalVisible, setModalVisible] = useState(false);
  const sellerId = firebase.auth().currentUser.uid;
  const [sellerData, setSellerData] = useState("");
  const [loadingModal, setLoadingModal] = useState(true);


  useEffect(() => {
    const subscriber = firebase.firestore()
      .collection('sellers')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(documentSnapshot => {
        setSellerData(documentSnapshot.data());
        setLoadingModal(false);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const handleSignOut = () => {
    firebase.auth()
      .signOut()
      .then(() => {
        navigation.navigate('SellerLogin');
      })
      .catch(error => Alert.alert(error.message))
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
  };

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

  function renderImage() {
    return (
      <View
        style={{
          marginTop: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {
          sellerData.profileUrl ? <Image
            source={{ uri: sellerData.profileUrl }}
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
          {sellerData.fullName}
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
          onPress={() => navigation.navigate("SellerEditProfile")}
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
  function renderLanguage() {
    return (
      <View
        style={{
          marginTop: 32,
          paddingHorizontal: 25,
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
          marginTop: 50,
          paddingHorizontal: 25,
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
          paddingHorizontal: 25,
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
          paddingHorizontal: 25,
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
      <Status />
      {LoadingScreen()}
      {MessageAlert()}
      <Separator height={27} />
      {renderImage()}
      {renderMember()}
      {renderLanguage()}
      {helpCenter()}
      {renderLogout()}
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