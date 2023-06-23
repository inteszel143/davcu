import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, SafeAreaView, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Display, Separator, General, Status } from '../../../constants'
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons'
import { Badge } from 'react-native-paper';
// import { useNavigation } from '@react-navigation/native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const Logo = require('../../../../assets/images/icon.png');
import ShoppingCart from '../BuyerConstant/ShoppingCart';
import Messaging from '../BuyerConstant/Messaging';
import { Recommended, AllProducts, TopProducts, RecommededNew } from '../HomeConstant';
import { firebase } from '../../../../config';

const delivered = require('../../../../assets/Icon/success.png');

export default function HomeScreen({ navigation }) {

  const [buyerData, setBuyerData] = useState('');
  const buyerId = firebase.auth().currentUser.uid;
  const [modalVisible, setModalVisible] = useState(false);

  // BUYERDATA
  useEffect(() => {
    firebase.firestore()
      .collection('users')
      .doc(buyerId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setBuyerData(documentSnapshot.data());
        }
      });
  }, []);

  // RENDER RATE
  // useEffect(() => {
  //   firebase.firestore()
  //     .collection('placeOrders')
  //     .where("buyerId", "==", firebase.auth().currentUser.uid)
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot.forEach(documentSnapshot => {
  //         if (documentSnapshot.data().rated == 0 && documentSnapshot.data().orderStatus === "Completed") {
  //           setModalVisible(true);
  //         }
  //       });
  //     });
  // }, []);


  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 27,
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            source={Logo}
            resizeMode='contain'
            style={{
              width: 30,
              height: 30,
            }}
          />
          <Text
            style={{
              fontSize: RFPercentage(2.5),
              fontFamily: 'PoppinsBold',
              marginLeft: 5,
            }}
          >
            Hi ! {buyerData.firstName}
          </Text>
        </View>


        <View
          style={{
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


  function renderCategories() {
    return (
      <View
        style={{
          // backgroundColor: Colors.DEFAULT_GREEN,
          paddingVertical: 15,
        }}
      >
        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontFamily: 'PoppinsBold',
              fontSize: RFPercentage(2),
              color: Colors.DARK_TWO,
            }}
          >Categories</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CategoryPage')}
          >
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: RFPercentage(1.9),
                color: Colors.DARK_SIX,
              }}
            >See all</Text>
          </TouchableOpacity>
        </View>

        <Separator height={10} />
        {/* DATA HERE */}
        <FlatList
          data={General.Category}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                paddingHorizontal: 5,
                paddingVertical: 2,
                marginLeft: 10,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('CategoryScreen', {
                  category: item.name,
                })
              }}
            >

              {/* IMAGE */}
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: '#F9FBFC',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={item.image}
                  resizeMode='contain'
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />

              </View>

              {/* NAME */}
              <View
                style={{
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'PoppinsSemiBold',
                    fontSize: RFPercentage(1.7),
                  }}
                >{item.name}</Text>
              </View>

            </TouchableOpacity>
          )}
        />


      </View>
    )
  };

  // function renderRecommendedProducts() {
  //   return (
  //     <View
  //       style={{
  //         paddingVertical: 15,
  //       }}
  //     >
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'space-between',
  //           paddingHorizontal: 15,
  //         }}
  //       >
  //         <Text
  //           style={{
  //             fontFamily: 'PoppinsSemiBold',
  //             fontSize: RFPercentage(2),
  //           }}
  //         >Recommended</Text>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate('SeeAllRecommend')}
  //         >
  //           <Text
  //             style={{
  //               fontFamily: 'PoppinsMedium',
  //               fontSize: RFPercentage(1.9),
  //               color: Colors.DARK_SIX,
  //             }}
  //           >See all</Text>
  //         </TouchableOpacity>
  //       </View>

  //       <Recommended />
  //     </View>
  //   )
  // };

  // function renderTopProducts() {
  //   return (
  //     <View>
  //       <TopProducts />
  //     </View>
  //   )
  // };


  // function renderAllProducts() {
  //   return (
  //     <View
  //       style={{
  //         marginTop: 15,
  //       }}
  //     >
  //       <AllProducts />
  //     </View>
  //   )
  // }

  function recommendNew() {
    return (
      <View
        style={{
          marginTop: 15,
        }}
      >
        <RecommededNew />
      </View>
    )
  };

  function otherProducts() {
    return (
      <View
        style={{
          alignSelf: 'center',
          marginTop: 25,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontFamily: 'PoppinsBold',
              fontSize: RFPercentage(2),
              color: Colors.DARK_TWO,
            }}
          >Daily Discover</Text>

          <TouchableOpacity>
            <MaterialCommunityIcons name="align-horizontal-right" size={18} />
          </TouchableOpacity>
        </View>
        <AllProducts />
      </View>
    )
  }

  function MessageAlert() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.DARK_ONE}
          translucent
        />
        <View style={styles.centeredView}>
          <View style={styles.modalView} >
            {/* IMAGE */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={delivered}
                resizeMode="contain"
                style={{
                  width: 50,
                  height: 50,
                }}
              />
            </View>


            {/* WORDINGS */}

            <View
              style={{
                paddingHorizontal: 30,
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'PoppinsMedium',
                  fontSize: RFPercentage(2),
                  textAlign: 'center',
                }}
              >Your item has been successfully delivered</Text>
            </View>

            {/* BUTTON */}
            <View
              style={{
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  width: Display.setWidth(50),
                  height: Display.setHeight(5),
                  backgroundColor: Colors.DEFAULT_WHITE,
                  borderWidth: 0.5,
                  borderColor: Colors.SECONDARY_GREEN,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.replace('BuyerMyOrders');
                }}
              >
                <Text
                  style={{
                    fontFamily: 'PoppinsSemiBold',
                    color: Colors.SECONDARY_GREEN,
                    fontSize: RFPercentage(1.9),
                  }}
                >Rate now</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: Display.setHeight(28),
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 0.9,
            borderColor: Colors.LIGHT_GREY2,
          }}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <MaterialCommunityIcons name="close" size={18} color={Colors.DEFAULT_WHITE} />
        </TouchableOpacity> */}
        </View>

      </Modal>
    )
  };

  return (
    <View style={styles.container} >
      <Status />
      {MessageAlert()}
      {renderHeader()}
      <ScrollView>
        {renderCategories()}
        {/* {renderRecommendedProducts()}
        {renderTopProducts()}
        {renderAllProducts()} */}
        {recommendNew()}
        {otherProducts()}
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
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  modalView: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 8,
    width: Display.setWidth(85),
    paddingVertical: 25,
    alignItems: 'center',
  },
})