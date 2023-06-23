import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, Modal, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    Colors,
    Display,
    Separator, Status, Header
} from '../../constants';
import { MaterialCommunityIcons, AntDesign, SimpleLineIcons, Ionicons, Feather } from 'react-native-vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { scale } from 'react-native-size-matters';
import { firebase } from '../../../config';
import numeral from 'numeral';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RBSheet from "react-native-raw-bottom-sheet";
import * as ImagePicker from 'expo-image-picker';
import StarRating from 'react-native-star-rating-widget';

export default function BuyerWriteReview({ navigation, route }) {
    const refRBSheet = useRef();
    const { productKey, productUid } = route.params;
    const [uploading, setUploading] = useState(false);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
    const [confirmButton, setConfirmButton] = useState(false);

    // DATA
    const [data, setData] = useState("");
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState([]);
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const subscriber = firebase.firestore()
            .collection('placeOrders')
            .doc(productKey)
            .onSnapshot(documentSnapshot => {
                setData(documentSnapshot.data());
                setLoading(false);
            });

        return () => { isMounted = false; subscriber() };
    }, []);


    const openCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
        });

        if (!result.cancelled) {
            // setImage(result.uri);
            setImage((images) => images.concat(result.uri));
        }
    };
    const openPickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        // const source = {uri: result.uri};
        // console.log(source);
        // setImage(source);

        if (!result.cancelled) {
            // setImage([...image, result.uri]);
            // setImage(result.uri ? [result.uri] : result.selected);
            setImage((images) => images.concat(result.uri));
            // setImage(result.uri);
        }
    };
    const removeImage = () => {
        setImage(image.slice(0, image.length - 1));
        setConfirm(false);

    };
    const uploadImage = async () => {
        setLoadingButton(true);
        try {
            for (let step = 0; step < image.length; step++) {
                const uploadUri = image[step];
                let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
                const response = await fetch(uploadUri);
                const blob = await response.blob();
                const storageRef = firebase.storage().ref().child(`/ratingImages/${filename}`)
                const snapshot = storageRef.put(blob);
                snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    () => {
                        setUploading(true)
                    },
                    (error) => {
                        setUploading(false)
                        console.log(error)
                        blob.close()
                        return
                    },
                    async () => {
                        await snapshot.snapshot.ref.getDownloadURL()
                            .then((url) => {
                                setUploading(false)
                                console.log(url)
                                setUrls((urls) => urls.concat(url));
                                blob.close()
                                return url
                            })
                        setLoadingButton(false);
                        setModalVisible(true);
                    })
            }
        } catch (error) {
            console.log(error);
        }
    };
    const addReview = async () => {
        setConfirmButton(true);
        const buyerUid = firebase.auth().currentUser.uid;
        const buyerName = data.fullName;
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();

        const reviewData = {
            reviewDate: timestamp,
            productUid: data.productUid,
            rating: rating,
            comment: comment,
            buyerUid: buyerUid,
            buyerName: buyerName,
            imageUrl: urls,
        }

        await firebase.firestore()
            .collection('ratings')
            .add(reviewData)
            .then(() => {
                setUrls([]);
                setImage([]);

                firebase.firestore()
                    .collection('placeOrders')
                    .doc(productKey)
                    .update({
                        rated: 1,
                    }).then(() => {
                        setModalVisible(false);
                        setConfirmButton(false);
                        navigation.replace('BuyerReviews', {
                            productKey: productKey,
                            productUid: productUid,
                        });
                    })
            })
            .catch((error) => {
                alert(error);
            });

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
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor={Colors.DARK_ONE}
                        translucent
                    />
                    <View style={styles.modalView}>

                        <View>
                            <Text
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(2.4),
                                }}
                            >
                                How was the product?
                            </Text>
                        </View>
                        <Separator height={15} />
                        <View
                            style={{
                                alignSelf: 'center',
                            }}
                        >
                            <StarRating
                                rating={rating}
                                onChange={setRating}
                                starSize={29}
                                enableHalfStar={false}
                                starStyle={{
                                    marginHorizontal: 4,
                                }}
                            />
                        </View>

                        <Separator height={15} />
                        <TouchableOpacity
                            style={{
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginHorizontal: 30,
                                paddingHorizontal: 40,
                                height: Display.setHeight(5.4),
                                borderWidth: 0.5,
                                borderColor: Colors.DEFAULT_YELLOW2,
                            }}
                            onPress={addReview}
                        >
                            {
                                confirmButton === true ? <ActivityIndicator size="small" color={Colors.DEFAULT_YELLOW2} />
                                    :
                                    <Text
                                        style={{
                                            fontFamily: 'PoppinsSemiBold',
                                            fontSize: RFPercentage(1.9),
                                            color: Colors.DEFAULT_YELLOW2,

                                        }}
                                    >Continue</Text>
                            }
                        </TouchableOpacity>

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
                    onPress={() => navigation.goBack()}
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
                    >Write review</Text>
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
    function renderSummary() {
        return (
            <View
                style={{
                    backgroundColor: Colors.DEFAULT_WHITE,
                    borderWidth: 0.5,
                    borderColor: Colors.LIGHT_GREY2,
                    marginHorizontal: 15,
                    paddingVertical: 20,
                    borderRadius: 4,
                    paddingHorizontal: 20,
                    marginTop: 5,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        // alignItems: 'center',
                    }}
                >
                    <View>
                        <Image source={{ uri: data.imageUrl }}
                            resizeMode='contain'
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 10,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            flex: 1,
                            marginLeft: 12,
                            paddingHorizontal: 5,
                            marginTop: 10,
                        }}
                    >
                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: 'PoppinsMedium',
                                fontSize: RFPercentage(1.9),
                            }}
                        >{data.productName}</Text>

                        <View
                            style={{
                                marginTop: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text
                                numberOfLines={2}
                                style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: RFPercentage(1.9),
                                }}
                            >₱ {numeral(data.price).format('0,0.00')}</Text>


                            <Text
                                numberOfLines={2}
                                style={{
                                    fontFamily: 'PoppinsMedium',
                                    fontSize: RFPercentage(1.8),
                                }}
                            >QTY: {data.quantity}</Text>

                        </View>

                    </View>

                </View>

            </View>
        )
    };
    function renderWriteReview() {
        return (
            <View
                style={{
                    marginTop: 30,
                    paddingHorizontal: 20,
                }}
            >
                <View>
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >
                        Write your Review
                    </Text>
                </View>
                <Separator height={10} />
                <TextInput
                    placeholder='Say something what did you like or dislike about this product?'
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(comment) => setComment(comment)}
                    style={{
                        textAlignVertical: 'top',
                        paddingTop: 10,
                        borderWidth: 0.5,
                        borderColor: Colors.DEFAULT_WHITE,
                        borderBottomColor: Colors.LIGHT_GREY2,
                        fontFamily: 'PoppinsRegular',
                        fontSize: RFPercentage(1.9),
                    }}
                />
            </View>
        )
    };
    function renderImage() {
        return (
            <View
                style={{
                    marginTop: 30,
                    paddingHorizontal: 20,
                }}
            >
                <View>
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >
                        Add Images
                    </Text>
                </View>

                <View
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 5,
                        }}
                    >
                        {
                            image.map((img, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={removeImage}
                                >
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginLeft: 10,
                                        }}
                                    >
                                        <Image source={{ uri: img }} resizeMode='contain'
                                            style={{
                                                width: 80,
                                                height: 80,
                                            }}
                                        />
                                        <View
                                            style={{
                                                position: 'absolute',
                                            }}
                                        >
                                            <MaterialCommunityIcons name='delete-circle' size={28} color={Colors.DEFAULT_WHITE} />
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            ))
                        }
                        {image.length != 3 && <TouchableOpacity

                            onPress={() => refRBSheet.current.open()}
                            style={{
                                marginLeft: 10,
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 80,
                                    height: 80,
                                    backgroundColor: Colors.LIGHT_GREY,
                                }}
                            >
                                <Ionicons name='camera-outline' size={22} />

                            </View>
                        </TouchableOpacity>}
                    </View>

                </View>

            </View>
        )
    };
    function renderComponent() {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={Colors.DARK_ONE}
                    translucent
                />


                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current.close();
                        openCamera();
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >Camera</Text>
                </TouchableOpacity>

                <View style={{ width: Display.setWidth(100), height: 1, backgroundColor: Colors.LIGHT_GREY2, marginVertical: 15, }} />

                <TouchableOpacity
                    onPress={() => {
                        refRBSheet.current.close();
                        openPickImage();
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: RFPercentage(2),
                        }}
                    >Gallery</Text>
                </TouchableOpacity>

            </View>
        )
    };
    function renderBottomSheet() {
        return (
            <View>
                <RBSheet
                    ref={refRBSheet}
                    height={110}
                    openDuration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center",
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        }
                    }}
                >
                    {renderComponent()}
                </RBSheet>
            </View>
        )
    };

    function renderBottom() {
        return (
            <View
                style={{
                    marginTop: Display.setHeight(26),
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.DEFAULT_YELLOW2,
                        width: Display.setWidth(88),
                        height: Display.setHeight(6.2),
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                    }}
                    onPress={uploadImage}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        {
                            loadingButton === true ? <ActivityIndicator size={'small'} color={Colors.DEFAULT_WHITE} />
                                :
                                <Text
                                    style={{
                                        color: Colors.DEFAULT_WHITE,
                                        fontSize: RFPercentage(2),
                                        fontFamily: 'PoppinsSemiBold',
                                    }}
                                >Submit Review</Text>
                        }

                    </View>
                </TouchableOpacity>


            </View>
        )
    };

    return (
        <View style={styles.container} >
            <Status />
            {MessageAlert()}
            <Separator height={27} />
            <KeyboardAwareScrollView>
                {renderTop()}
                {renderSummary()}
                {renderWriteReview()}
                {renderImage()}
                {renderBottomSheet()}
                {renderBottom()}
            </KeyboardAwareScrollView>
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
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
    },
    modalView: {
        // backgroundColor: 'rgba(52, 52, 52, 0.8)',
        backgroundColor: Colors.DEFAULT_WHITE,
        borderRadius: 8,
        width: Display.setWidth(85),

        paddingVertical: 25,
        alignItems: 'center',
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
    },
})