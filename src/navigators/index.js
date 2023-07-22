import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SelectType } from '../screens';
import {
    BuyerLogin, BuyerForgotPassword, BuyerForgotEmailSent,
    BuyerCreateAccount, BuyerPhoneNumber, MainScreen,
    SeeAllRecommend, SeeTopProducts, CategoryScreen, CategoryPage, ProductDetails, BuyerDiscussion,
    BuyerShoppingBag, OrderSummary, ShippingAddress, BuyerEditLocation, BuyerUpdateAddress, SearchResult,
    ChatScreen, BuyerChat, ChatScreenMessage, EditProfile, PaypalPayment, PaypalReceipt, GCashPayment, BuyerCODSuccess,
    BuyerMyOrders, BuyerOrderDetails, BuyerOrderStatus, VisitShop, BuyerWriteReview, BuyerReviews, BuyerSetupLocation,
    TestScreen, BuyerAddName, BuyerAddEmail, BuyerAddLocation, FilterRecommend
} from '../screens/BuyerModule';

import {
    SellerLogin, SellerRegister, SellerPhoneAuth, SellerMainScreen, SellerNotification, SellerEditProfile,
    SellerChatScreen, SellerUpdateDocs, SellerProducts, SellerUpdateProduct, SellerAddProducts, SellerOrders,
    SellerInvoice, SellerArrangeShipment, SellerStoreLocation,
} from '../screens/SellerModule';


import {
    RiderLogin, RiderRegister, 
    // FaceRecognition, RiderPhoneAuth, RiderMainScreen, RiderUpdateDocs, RiderNotification,
    // RiderEditProfile, RiderPickOrder, RiderToVendor, RiderPickupOrder, DeliveryScan, DeliveryScanFailed, DeliveryClaimSuccess,
    // RiderDropOff, RiderConfirmDrop, DeliverySuccess,
} from "../screens/RiderModule";

const Stack = createStackNavigator();

export default function index() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} >
                <Stack.Screen name="SelectType" component={SelectType} options={{ gestureEnabled: false }} />

                {/* BUYER */}
                <Stack.Screen name="BuyerLogin" component={BuyerLogin} options={{ gestureEnabled: false }} />
                <Stack.Screen name="BuyerForgotPassword" component={BuyerForgotPassword} options={{ gestureEnabled: false }} />
                <Stack.Screen name="BuyerForgotEmailSent" component={BuyerForgotEmailSent} options={{ gestureEnabled: false }} />
                <Stack.Screen name="BuyerCreateAccount" component={BuyerCreateAccount} options={{ gestureEnabled: false }} />
                <Stack.Screen name="BuyerPhoneNumber" component={BuyerPhoneNumber} options={{ gestureEnabled: false }} />
                {/* ---- */}
                {/* <Stack.Screen name="BuyerLocation" component={BuyerLocation} options={{ gestureEnabled: false }} /> */}
                <Stack.Screen name="MainScreen" component={MainScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="SeeAllRecommend" component={SeeAllRecommend} />
                <Stack.Screen name="SeeTopProducts" component={SeeTopProducts} />
                <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
                <Stack.Screen name="CategoryPage" component={CategoryPage} />
                <Stack.Screen name="ProductDetails" component={ProductDetails} />
                <Stack.Screen name="BuyerDiscussion" component={BuyerDiscussion} />
                <Stack.Screen name="BuyerShoppingBag" component={BuyerShoppingBag} />
                <Stack.Screen name="OrderSummary" component={OrderSummary} />
                <Stack.Screen name="ShippingAddress" component={ShippingAddress} />
                <Stack.Screen name="BuyerEditLocation" component={BuyerEditLocation} />
                <Stack.Screen name="BuyerUpdateAddress" component={BuyerUpdateAddress} />
                <Stack.Screen name="SearchResult" component={SearchResult} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="BuyerChat" component={BuyerChat} />
                <Stack.Screen name="ChatScreenMessage" component={ChatScreenMessage} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="PaypalPayment" component={PaypalPayment} />
                <Stack.Screen name="PaypalReceipt" component={PaypalReceipt} />
                <Stack.Screen name="BuyerCODSuccess" component={BuyerCODSuccess} />
                <Stack.Screen name="BuyerMyOrders" component={BuyerMyOrders} />
                <Stack.Screen name="BuyerOrderDetails" component={BuyerOrderDetails} />
                <Stack.Screen name="BuyerOrderStatus" component={BuyerOrderStatus} />
                <Stack.Screen name="VisitShop" component={VisitShop} />
                <Stack.Screen name="BuyerWriteReview" component={BuyerWriteReview} />
                <Stack.Screen name="BuyerReviews" component={BuyerReviews} />
                <Stack.Screen name="BuyerSetupLocation" component={BuyerSetupLocation} />
                <Stack.Screen name="BuyerAddName" component={BuyerAddName} />
                <Stack.Screen name="BuyerAddEmail" component={BuyerAddEmail} />
                <Stack.Screen name="BuyerAddLocation" component={BuyerAddLocation} />
                <Stack.Screen name="FilterRecommend" component={FilterRecommend} />



                <Stack.Screen name="TestScreen" component={TestScreen} />
                <Stack.Screen name="GCashPayment" component={GCashPayment} />
                {/* END BUYER */}


                {/* SELLER START */}
                <Stack.Screen name="SellerLogin" component={SellerLogin} options={{ gestureEnabled: false }} />
                <Stack.Screen name="SellerRegister" component={SellerRegister} options={{ gestureEnabled: false }} />
                <Stack.Screen name="SellerPhoneAuth" component={SellerPhoneAuth} options={{ gestureEnabled: false }} />

                <Stack.Screen name="SellerMainScreen" component={SellerMainScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="SellerChatScreen" component={SellerChatScreen} />
                <Stack.Screen name="SellerNotification" component={SellerNotification} />
                <Stack.Screen name="SellerEditProfile" component={SellerEditProfile} />
                <Stack.Screen name="SellerUpdateDocs" component={SellerUpdateDocs} />
                <Stack.Screen name="SellerProducts" component={SellerProducts} />
                <Stack.Screen name="SellerAddProducts" component={SellerAddProducts} />
                <Stack.Screen name="SellerUpdateProduct" component={SellerUpdateProduct} />
                <Stack.Screen name="SellerOrders" component={SellerOrders} />
                <Stack.Screen name="SellerInvoice" component={SellerInvoice} />
                <Stack.Screen name="SellerArrangeShipment" component={SellerArrangeShipment} />
                <Stack.Screen name="SellerStoreLocation" component={SellerStoreLocation} />

                {/* SELLER END */}


                {/* RIDER START */}
                <Stack.Screen name="RiderLogin" component={RiderLogin} options={{ gestureEnabled: false }} />
                <Stack.Screen name="RiderRegister" component={RiderRegister} options={{ gestureEnabled: false }} />
                {/* <Stack.Screen name="RiderPhoneAuth" component={RiderPhoneAuth} options={{ gestureEnabled: false }} />
                <Stack.Screen name="FaceRecognition" component={FaceRecognition} options={{ gestureEnabled: false }} />
                <Stack.Screen name="RiderMainScreen" component={RiderMainScreen} options={{ gestureEnabled: false }} />

                <Stack.Screen name="RiderUpdateDocs" component={RiderUpdateDocs} />
                <Stack.Screen name="RiderNotification" component={RiderNotification} />
                <Stack.Screen name="RiderEditProfile" component={RiderEditProfile} />
                <Stack.Screen name="RiderPickOrder" component={RiderPickOrder} />
                <Stack.Screen name="RiderToVendor" component={RiderToVendor} />
                <Stack.Screen name="RiderPickupOrder" component={RiderPickupOrder} />
                <Stack.Screen name="DeliveryScan" component={DeliveryScan} />
                <Stack.Screen name="DeliveryScanFailed" component={DeliveryScanFailed} />
                <Stack.Screen name="DeliveryClaimSuccess" component={DeliveryClaimSuccess} />
                <Stack.Screen name="RiderDropOff" component={RiderDropOff} />
                <Stack.Screen name="RiderConfirmDrop" component={RiderConfirmDrop} />
                <Stack.Screen name="DeliverySuccess" component={DeliverySuccess} /> */}
                {/* RIDER END */}


            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({})