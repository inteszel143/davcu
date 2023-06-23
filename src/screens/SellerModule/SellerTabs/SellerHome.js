import { StyleSheet, StatusBar, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, BackHandler, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  Colors,
  Display,
  Separator, Animations, Header, Status, SellerNotification
} from '../../../constants';

import { MaterialCommunityIcons, FontAwesome5, Ionicons, AntDesign } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { firebase } from '../../../../config';
import numeral from 'numeral';
import moment from 'moment/moment';
export default function SellerHome({ navigation }) {

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true })
    return () => backHandler.remove();
  }, []);

  const [totalProducts, setTotalProducts] = useState(0);
  const [archive, setArchive] = useState(0);

  const [shopData, setShopData] = useState('');
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalCancel, setTotalCancel] = useState(0);

  const [toShip, setTotalShip] = useState(0)
  const [complete, setComplete] = useState(0)

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);

  const [newOrders, setNewOrders] = useState('');
  const [isToday, setToday] = useState('');
  const sellerID = firebase.auth().currentUser.uid;

  const currentData = moment(new Date()).format('LL');

  useEffect(() => {
    let isMounted = true;
    const subscriber = firebase.firestore()
      .collection('placeOrders')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().sellerUid === firebase.auth().currentUser.uid) {
            data.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          }

        });
        setNewOrders(data);
      });
    return () => { isMounted = false; subscriber() };
  }, []);

  //GET TODAY
  useEffect(() => {
    let isMounted = true;
    const subscriber = firebase.firestore()
      .collection('placeOrders')
      .where("sellerUid", "==", firebase.auth().currentUser.uid)
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().deliveryDate === null) {
            setToday('');
          } else {
            if (moment(documentSnapshot.data().orderedDate.toDate()).format('LL') === currentData) {
              data.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            }
          }

        });
        setToday(data);
      });
    return () => { isMounted = false; subscriber() };
  }, []);

  // PENDING ORDERS
  useEffect(() => {

    firebase.firestore()
      .collection('placeOrders')
      .where('sellerUid', '==', sellerID)
      .where('orderStatus', "in", ['Pending', 'Process'])
      .get()
      .then(querySnapshot => {
        setTotalOrders(querySnapshot.size);

      });
  }, []);
  // TO SHIP ORDERS
  useEffect(() => {

    firebase.firestore()
      .collection('placeOrders')
      .where('sellerUid', '==', sellerID)
      .where('orderStatus', "in", ['To Ship', 'Waiting', 'Pickup', 'On the way'])
      .get()
      .then(querySnapshot => {
        setTotalShip(querySnapshot.size);

      });

  }, []);
  // COMPLETE ORDERS
  useEffect(() => {

    firebase.firestore()
      .collection('placeOrders')
      .where('sellerUid', '==', sellerID)
      .where('orderStatus', "==", 'Completed')
      .get()
      .then(querySnapshot => {
        setComplete(querySnapshot.size);
        setLoading(false);
      });
  }, []);
  // //SELLER DATA
  useEffect(() => {
    const subscriber = firebase.firestore()
      .collection('sellers')
      .doc(sellerID)
      .onSnapshot(documentSnapshot => {
        setShopData(documentSnapshot.data());
        // setLoading(false);
      });

    // Stop listening for updates when no longer required
    return () => {
      subscriber()
    };
  }, []);

  // ALL PRODUCTS
  useEffect(() => {
    firebase.firestore()
      .collection('allProducts')
      .where('sellerUid', '==', sellerID)
      .where('productStatus', "==", 'Available')
      .get()
      .then(querySnapshot => {
        setTotalProducts(querySnapshot.size);

      });
  }, []);

  //ARCHIVE
  useEffect(() => {
    firebase.firestore()
      .collection('allProducts')
      .where('sellerUid', '==', sellerID)
      .where('productStatus', "==", 'Not Available')
      .get()
      .then(querySnapshot => {
        setArchive(querySnapshot.size);
      });
  }, []);

  //TOTAL EARN
  const totalEarn = (arrayData) => {
    try {
      let sum = 0;
      for (let i = 0; i < arrayData.length; i++) {
        sum += parseFloat(arrayData[i].price * arrayData[i].quantity + parseFloat(arrayData[i].deliveryFee));
      }
      return sum;
    } catch (error) {
      console.log(error);
    }
  };

  const todayEarn = (arrayData) => {
    try {
      let sum = 0;
      for (let i = 0; i < arrayData.length; i++) {
        sum += parseFloat(arrayData[i].price * arrayData[i].quantity + parseFloat(arrayData[i].deliveryFee));
      }
      return sum;
    } catch (error) {
      console.log(error);
    }
  };



  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.DEFAULT_WHITE,
        }}
      >
        {MessageAlert()}
      </View>
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


  function renderNewHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 25,
          paddingBottom: 10,
          backgroundColor: Colors.DEFAULT_WHITE,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >

          <MaterialCommunityIcons name='store-outline' size={22} />
          {
            shopData.shopName && <Text
              style={{
                fontFamily: 'PoppinsSemiBold',
                fontSize: RFPercentage(2.3),
                marginLeft: 10,
              }}
            >{shopData.shopName}</Text>
          }

        </View>

        {/* NOTIFICATION HERE */}
        <SellerNotification />


      </View>
    )
  };
  function renderReturn() {
    return (
      <View
        style={{
          marginTop: 20,
          paddingVertical: 20,
          paddingHorizontal: 25,
          marginHorizontal: 20,
          backgroundColor: Colors.DEFAULT_WHITE,
          borderRadius: 8,
          borderWidth: 0.5,
          borderColor: Colors.DEFAULT_RED,
        }}
      >

        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <MaterialCommunityIcons name="information-outline" size={22} color={Colors.DEFAULT_RED} />
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              paddingHorizontal: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: RFPercentage(1.9),
                textAlign: 'justify',
                color: Colors.DARK_SIX,
              }}
            >
              We hereby acknowledge that your documents did not meet the necessary requirements for our app. Please update or read a reason provided to our administrator as to why your documents were returned.
            </Text>
          </View>

        </View>

        <Separator height={8} />

        <TouchableOpacity
          style={{
            width: Display.setWidth(25),
            paddingVertical: 7,
            borderWidth: 0.5,
            borderColor: Colors.DEFAULT_RED,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('SellerUpdateDocs')}
        >
          <Text
            style={{
              fontFamily: 'PoppinsSemiBold',
              fontSize: RFPercentage(1.7),
              color: Colors.DEFAULT_RED,
            }}
          >Update now</Text>
        </TouchableOpacity>

      </View>
    )
  };
  function renderTopContent() {
    if (shopData.validate == 1) {
      return (
        <></>
      )
    } else {
      return (
        <View
          style={{
            marginTop: 20,
            paddingVertical: 30,
            paddingHorizontal: 18,
            marginHorizontal: 20,
            backgroundColor: Colors.DEFAULT_WHITE,
            borderRadius: 4,
            shadowColor: "#000",
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
          }}
        >

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                backgroundColor: '#E5F6DF',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}
            >
              <AntDesign name='filetext1' size={18} color={Colors.DEFAULT_GREEN} />
            </View>


            <View
              style={{
                flex: 1,
                marginLeft: 8,
                paddingHorizontal: 15,
              }}
            >

              <Text
                style={{
                  fontFamily: 'PoppinsSemiBold',
                  fontSize: RFPercentage(2),
                }}
              >Verifying Documents</Text>
              <Text
                style={{
                  fontFamily: 'PoppinsRegular',
                  fontSize: RFPercentage(1.8),
                  color: Colors.DARK_SEVEN,
                  marginTop: 5,
                }}
              >
                Verify your information to make your products visible to buyers.
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'PoppinsSemiBold',
                  fontSize: RFPercentage(2),
                  color: Colors.DEFAULT_YELLOW,
                }}
              >Verifying</Text>

            </View>
          </View>

        </View>
      )
    }
  }

  function renderEarnings() {
    return (
      <View
        style={{
          marginTop: 20,
          paddingVertical: 30,
          borderWidth: 0.8,
          borderColor: Colors.LIGHT_GREY2,
          backgroundColor: Colors.DEFAULT_WHITE,
          borderRadius: 10,
          marginHorizontal: 15,
          // shadowColor: "#000",
          // shadowOpacity: 0.23,
          // shadowRadius: 2.62,
          // elevation: 4,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >


          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: "PoppinsSemiBold",
                fontSize: RFPercentage(2.4),
                marginBottom: 8,
              }}
            >
              {newOrders.length}
            </Text>
            <Ionicons name="cube-sharp" size={15} color={Colors.DEFAULT_STAR} />
            <Text
              style={{
                fontFamily: "PoppinsMedium",
                fontSize: RFPercentage(1.7),
                color: Colors.DARK_SIX,
                marginTop: 10,
                textAlign: 'center',
              }}
            >
              Total {'\n'} Orders
            </Text>
          </View>


          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: "PoppinsSemiBold",
                fontSize: RFPercentage(2.4),
                marginBottom: 8,
              }}
            >
              ₱{numeral(todayEarn(isToday)).format('0,0.00')}
            </Text>
            <FontAwesome5 name="coins" size={15} color={Colors.DEFAULT_STAR} />
            <Text
              style={{
                fontFamily: "PoppinsMedium",
                fontSize: RFPercentage(1.7),
                color: Colors.DARK_SIX,
                marginTop: 10,
                textAlign: 'center',
              }}
            >
              Today's {'\n'} Earnings
            </Text>
          </View>







          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: "PoppinsSemiBold",
                fontSize: RFPercentage(2.4),
                marginBottom: 8,
              }}
            >
              ₱{numeral(totalEarn(newOrders)).format('0,0.00')}
            </Text>
            <Ionicons name="card" size={15} color={Colors.DEFAULT_STAR} />
            <Text
              style={{
                fontFamily: "PoppinsMedium",
                fontSize: RFPercentage(1.7),
                color: Colors.DARK_SIX,
                marginTop: 10,
                textAlign: 'center',
              }}
            >
              Total {'\n'} Revenue
            </Text>
          </View>

        </View>
      </View>
    )
  };


  function renderNewOrders() {
    return (
      <TouchableOpacity
        style={{
          marginTop: 15,
          marginHorizontal: 15,
          paddingHorizontal: 10,
          paddingVertical: 20,
          backgroundColor: Colors.DEFAULT_WHITE,
          borderRadius: 4,
          borderWidth: 0.8,
          borderColor: Colors.LIGHT_GREY2,
          // shadowColor: "#000",
          // shadowOpacity: 0.23,
          // shadowRadius: 2.62,
          // elevation: 4,

        }}
        onPress={() => navigation.navigate('SellerOrders')}
      // onPress={() => navigation.navigate('SellerNewOrders')}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons name='briefcase-clock-outline' size={16}
              color={Colors.DARK_THREE}
              style={{
                marginBottom: 2,
              }}
            />
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: RFPercentage(2),
                marginLeft: 10,
                color: Colors.DARK_THREE,
              }}
            >Orders</Text>
          </View>

          <View>
            <MaterialCommunityIcons name='chevron-right' size={25} color={Colors.DARK_SEVEN} />
          </View>

        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 15,
            paddingHorizontal: 15,
            marginTop: 10,
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'PoppinsSemiBold',
                fontSize: RFPercentage(3),
                color: totalOrders === 0 ? Colors.DEFAULT_BLACK : Colors.DEFAULT_RED,
              }}
            >{totalOrders}</Text>
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: RFPercentage(1.9),
                color: Colors.DARK_TEN,
                marginTop: 5,
              }}
            >Pending</Text>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >

            <Text
              style={{
                fontFamily: 'PoppinsSemiBold',
                fontSize: RFPercentage(3),
                color: totalCancel === 0 ? Colors.DEFAULT_BLACK : Colors.DEFAULT_RED,
              }}
            >{totalCancel}</Text>
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: RFPercentage(1.9),
                color: Colors.DARK_TEN,
                marginTop: 5,
              }}
            >Cancelled</Text>
          </View>


          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'PoppinsSemiBold',
                fontSize: RFPercentage(3),
                color: complete === 0 ? Colors.DEFAULT_BLACK : Colors.DEFAULT_GREEN,
              }}
            >{complete}</Text>
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: RFPercentage(1.9),
                color: Colors.DARK_TEN,
                marginTop: 5,
              }}
            >Delivered</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  };
  function renderNewProducts() {
    return (
      <TouchableOpacity
        style={{
          marginTop: 15,
          marginBottom: 10,
          marginHorizontal: 15,
          backgroundColor: Colors.DEFAULT_WHITE,
          borderRadius: 4,
          borderWidth: 0.8,
          borderColor: Colors.LIGHT_GREY2,
          // shadowColor: "#000",
          // shadowOpacity: 0.23,
          // shadowRadius: 2.62,
          // elevation: 4,
          paddingHorizontal: 10,
          paddingVertical: 20,
        }}
        disabled={shopData.validate === 0 ? true : false}
        onPress={() => navigation.navigate('SellerProducts')}
      >

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons name='briefcase-variant-outline' size={17}
              color={Colors.DARK_THREE}
              style={{
                marginBottom: 2,
              }}
            />

            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: RFPercentage(2),
                marginLeft: 10,
                color: Colors.DARK_THREE,
              }}
            >Products</Text>
          </View>

          <View>
            <MaterialCommunityIcons name='chevron-right' size={25} color={Colors.DARK_SEVEN} />
          </View>

        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 10,
            paddingVertical: 15,
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'PoppinsSemiBold',
                fontSize: RFPercentage(3),
              }}
            >{totalProducts}</Text>
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: RFPercentage(1.9),
                color: Colors.DARK_TEN,
                marginTop: 8,
              }}
            >All Products</Text>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'PoppinsSemiBold',
                fontSize: RFPercentage(3),
              }}
            >{archive}</Text>
            <Text
              style={{
                fontFamily: 'PoppinsMedium',
                fontSize: RFPercentage(1.9),
                color: Colors.DARK_TEN,
                marginTop: 8,
              }}
            >Archive</Text>
          </View>

        </View>


      </TouchableOpacity>
    )
  };

  return (
    <View style={styles.container} >
      <Status />
      <Separator height={27} />
      {renderNewHeader()}
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {
          shopData.returnComment ? <View>
            {renderReturn()}
          </View>
            :
            <View>
              {renderTopContent()}
            </View>
        }
        {renderEarnings()}
        {renderNewOrders()}
        {renderNewProducts()}
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