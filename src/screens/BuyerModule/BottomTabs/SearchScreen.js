import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Display, Separator, General } from '../../../constants'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import numeral from 'numeral';
import { MaterialCommunityIcons, EvilIcons, Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome } from 'react-native-vector-icons';
import { firebase } from '../../../../config';
const empty = require('../../../../assets/Icon/magnifying-glass.png');
const heart = require('../../../../assets/Icon/heart.png');

export default function SearchScreen({ navigation }) {

  const [filterKeywords, setFilterKeywords] = useState("")
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const subscriber = firebase.firestore()
      .collection('allProducts')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().productStock > 0 && documentSnapshot.data().productStatus === 'Available') {
            data.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          }
        });
        data.sort((a, b) => {
          if (a.rating === b.rating) {
            return b.totalSold - a.totalSold;
          }
          return b.rating - a.rating;
        });
        setProducts(data);
        // setLoading(false);
      });
    return () => {
      isMounted = false;
      subscriber()
    }
  }, []);



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
          >Search</Text>
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

  function renderSearch() {
    return (
      <View
        style={{
          paddingVertical: 5,
          paddingHorizontal: 15,
        }}
      >
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.DARK_TEN,
            paddingVertical: 7,
            width: Display.setWidth(86),
            borderRadius: 25,
            alignSelf: 'center',
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Ionicons name="ios-search-outline" size={20} color={Colors.DARK_SIX} />

            <TextInput
              placeholder='Search for product'
              autoFocus
              value={filterKeywords}
              onChangeText={(filterKeywords) => setFilterKeywords(filterKeywords)}
              style={{
                flex: 1,
                marginLeft: 10,
                fontFamily: "PoppinsMedium",
                fontSize: RFPercentage(2),
              }}
            />

            <TouchableOpacity
              disabled={!filterKeywords ? true : false}
              onPress={() => navigation.navigate('SearchResult', {
                filterKeywords: filterKeywords,
              })}
            >
              <Text
                style={{
                  fontFamily: "PoppinsMedium",
                  fontSize: RFPercentage(2),
                }}
              >
                | Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  };

  function renderData() {
    if (!filterKeywords) {
      return (
        <View
          style={{
            marginTop: 100,
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
    } else {
      return (
        <View
          style={{
            height: Display.setHeight(76),
            marginTop: 10,
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontFamily: "PoppinsSemiBold",
              fontSize: RFPercentage(2),
              color: Colors.INACTIVE_GREY,
            }}
          >
            Products
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >

            {
              products.map((item, i) => {
                if (item.productName.toLowerCase().includes(filterKeywords.toLowerCase())) {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={{
                        marginTop: 25,
                        paddingHorizontal: 2,
                        flexDirection: "row",
                      }}
                      onPress={() => navigation.navigate('ProductDetails', {
                        productId: item.key,
                        sellerId: item.sellerUid,
                      })}
                    >
                      <Image
                        source={{ uri: item.imageUrl[0] }}
                        resizeMode='contain'
                        style={{
                          width: 85,
                          height: 85,
                        }}
                      />

                      <View
                        style={{
                          flex: 1,
                          paddingHorizontal: 15,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "PoppinsRegular",
                            fontSize: RFPercentage(1.9),
                          }}
                        >
                          {item.productName}
                        </Text>

                        {/* SOLD AND RATING */}
                        <View
                          style={{
                            flexDirection: 'row',
                          }}
                        >

                          {
                            item.rating == 0 ? <></>
                              :
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <FontAwesome name='star' size={12} color={Colors.DEFAULT_STAR} style={{ marginBottom: 2 }} />
                                <Text
                                  style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.6),
                                    marginLeft: 3,
                                    marginRight: 10,
                                    color: Colors.DARK_SEVEN,
                                  }}
                                >{item.rating}</Text>
                              </View>
                          }
                          {
                            item.totalSold == 0 ? <></>
                              :
                              <Text
                                style={{
                                  fontFamily: 'PoppinsRegular',
                                  fontSize: RFPercentage(1.6),
                                  color: Colors.DARK_SEVEN,
                                }}
                              >
                                {item.totalSold}sold
                              </Text>
                          }
                        </View>

                        <View
                          style={{
                            marginTop: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "PoppinsMedium",
                              fontSize: RFPercentage(2),
                            }}
                          >
                            ₱{numeral(item.productPrice).format('0,0.00')}
                          </Text>

                          <Image
                            source={heart}
                            resizeMode='contain'
                            style={{
                              width: 18,
                              height: 18,
                              tintColor: Colors.INACTIVE_GREY,
                            }}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                } else if (item.productCategory.toLowerCase().includes(filterKeywords.toLowerCase())) {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={{
                        marginTop: 25,
                        paddingHorizontal: 2,
                        flexDirection: "row",
                      }}
                      onPress={() => navigation.navigate('ProductDetails', {
                        productId: item.key,
                        sellerId: item.sellerUid,
                      })}
                    >
                      <Image
                        source={{ uri: item.imageUrl[0] }}
                        resizeMode='contain'
                        style={{
                          width: 85,
                          height: 85,
                        }}
                      />

                      <View
                        style={{
                          flex: 1,
                          paddingHorizontal: 15,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "PoppinsRegular",
                            fontSize: RFPercentage(1.9),
                          }}
                        >
                          {item.productName}
                        </Text>


                        {/* SOLD AND RATING */}
                        <View

                        >

                          {
                            item.rating === 0 ? <></>
                              :
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <FontAwesome name='star' size={12} color={Colors.DEFAULT_STAR} style={{ marginBottom: 2 }} />
                                <Text
                                  style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.6),
                                    marginLeft: 3,
                                    color: Colors.DARK_SEVEN,
                                  }}
                                >{item.rating}</Text>
                              </View>
                          }
                        </View>

                        <View
                          style={{
                            marginTop: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "PoppinsMedium",
                              fontSize: RFPercentage(2),
                            }}
                          >
                            ₱{numeral(item.productPrice).format('0,0.00')}
                          </Text>

                          <Image
                            source={heart}
                            resizeMode='contain'
                            style={{
                              width: 18,
                              height: 18,
                              tintColor: Colors.INACTIVE_GREY,
                            }}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                }
              })
            }
          </ScrollView>
        </View>
      )
    }

  }

  return (
    <View style={styles.container} >
      <Separator height={27} />
      {renderTop()}
      {renderSearch()}

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