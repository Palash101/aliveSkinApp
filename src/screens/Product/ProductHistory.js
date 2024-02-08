import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {UserContext} from '../../../context/UserContext';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {ScheduleController} from '../../controllers/ScheduleController';
import {ProductContoller} from '../../controllers/ProductController';
import {ModalView} from '../../components/ModalView';
import {useToast} from 'react-native-toast-notifications';
import PageLoader from '../../components/PageLoader';
import {useNavigation} from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProductHistory = props => {
  const navigation = useNavigation();
  const {getToken, getUser} = useContext(UserContext);
  const activeColor = [
    'rgba(225,215,206,0.2)',
    'rgba(225,215,206,0.5)',
    'rgba(225,215,206,1)',
  ];
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [textBox, setTextBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const toast = useToast();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setOpen(false);
      getBookings();
    });
    return unsubscribe;
  }, []);

  const getBookings = async () => {
    const token = await getToken();
    if (token) {
      setLoading(true);
      const instance = new ProductContoller();
      const result = await instance.productHistory(token);
      setData(result.orders);
      setLoading(false);
    }
  };

  const selectItem = item => {
    setSelectedItem(item);
    setOpen(true);
  };
  const cancel = async () => {
    if (note) {
      Alert.alert(
        'Confirm',
        'Are you sure? you want to delete your account.',
        [
          {
            text: 'No',
            onPress: () => {},
          },
          {
            text: 'Yes',
            onPress: async () => {
              setLoading(true);
              const token = await getToken();
              const instance = new ProductContoller();
              const result = await instance.cancelOrder(
                note,
                selectedItem.id,
                token,
              );
              console.log(result, 'resultt');
              toast.show('Your order has been canceled successfully');
              setOpen(false);
              getBookings();
              setLoading(false);
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      toast.show('Please enter cancellation note.');
    }
  };

  const goBack = () => {
    console.log(props.route?.params?.back,'back')
    if (props.route?.params?.back) {
      navigation.navigate('products');
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <PageLoader loading={loading} />
      <View style={styles.container}>
        <LinearGradient colors={activeColor} style={styles.card1}>
          <TouchableOpacity
            onPress={() => goBack()}
            style={{
              marginLeft: 15,
              marginTop: 60,
            }}>
            <Image
              source={assets.back}
              style={{width: 16, height: 16, tintColor: '#000', marginTop: 5}}
            />
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: 'center',
              marginTop: -20,
              fontFamily: 'Gotham-Medium',
            }}>
            My Orders
          </Text>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{padding: 10, paddingBottom: 20}}>
            {data.map((item, index) => (
              <View style={styles.sectionBox}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 16,
                        fontFamily: 'Gotham-Medium',
                      }}>
                      Order Value {item.price}KD
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 16,
                        fontFamily: 'Gotham-Medium',
                      }}>
                      Total Items {item.cart.items.length}
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => selectItem(item)}
                      style={styles.detail}>
                      <Text style={styles.detailText}>Details</Text>
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.status,
                        {
                          backgroundColor:
                            item?.status === 'Pending' ? '#ffc107' : 'black',
                        },
                      ]}>
                      {item?.status}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderTopWidth: 1,
                    borderColor: '#f2f2f2',
                    marginTop: 5,
                    paddingTop: 5,
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 12}}>
                    Order Id - {item.order_ref}
                  </Text>
                  <Text style={{fontSize: 12}}>
                    {moment(item.created_at).format('DD MMM @ HH:mm A')}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>

        <ModalView
          visible={open}
          setVisible={() => setOpen(false)}
          style={{
            height: 'auto',
            marginTop: 260,
            justifyContent: 'flex-end',
          }}
          heading={'Order Details'}>
          {selectedItem && selectedItem?.cart ? (
            <>
              <View style={styles.sectionBox1}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 20,
                        fontFamily: 'Gotham-Medium',
                        marginBottom: 5,
                      }}>
                      Order Id {selectedItem?.order_ref}KD
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 20,
                        fontFamily: 'Gotham-Medium',
                      }}>
                      Order Value {selectedItem?.price}KD
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.status,
                        {
                          backgroundColor:
                            selectedItem?.status === 'Pending'
                              ? '#ffc107'
                              : 'black',
                        },
                      ]}>
                      {selectedItem?.status}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.cartItem, {backgroundColor: '#f2f2f2'}]}>
                <View style={styles.itemTitleBox}>
                  <Text style={[styles.itemTitle, {marginLeft: 22}]}>
                    Cart Items
                  </Text>
                </View>
                <View style={styles.itemQtyBox}>
                  <Text style={[styles.itemqty]}>Qty</Text>
                </View>
                <View style={styles.itemPriceBox}>
                  <Text style={[styles.itemqty]}>Price</Text>
                </View>
                <View style={styles.itemTotalBox}>
                  <Text style={[styles.itemTotal, , {paddingRight: 10}]}>
                    Total
                  </Text>
                </View>
              </View>
              <FlatList
                data={selectedItem?.cart?.items}
                pagingEnabled
                decelerationRate={'normal'}
                renderItem={({item}, key) => (
                  <View style={styles.cartItem}>
                    <View style={styles.itemTitleBox}>
                      <TouchableOpacity
                        TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ProductDetails', {
                            item: {
                              id: item.product_id,
                            },
                          })
                        }>
                        <Text style={styles.itemTitle}>{item?.itemName}</Text>
                        <Text style={styles.itemCat}>{item.category}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.itemQtyBox}>
                      <Text style={styles.itemqty}>{item.quantity}</Text>
                    </View>
                    <View style={styles.itemPriceBox}>
                      <Text style={styles.itemqty}>{item.price} KD</Text>
                    </View>
                    <View style={styles.itemTotalBox}>
                      <Text style={styles.itemTotal}>{item.total} KD</Text>
                    </View>
                  </View>
                )}
              />
              <View style={styles.cartItem}>
                <View style={styles.itemTitleBox}>
                  <Text style={styles.itemTitle}></Text>
                </View>
                <View style={styles.itemQtyBox}>
                  <Text style={styles.itemqty}></Text>
                </View>
                <View style={styles.itemPriceBox}>
                  <Text style={styles.itemqty}>Total</Text>
                </View>
                <View style={styles.itemTotalBox}>
                  <Text style={styles.itemTotal}>{selectedItem?.price} KD</Text>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: 10,
                  fontFamily: 'Gotham-Medium',
                }}>
                Address
              </Text>
              <View style={styles.addressBox}>
                <Text style={styles.addHding}>
                  {selectedItem.name} , {selectedItem.phone}
                </Text>
                <Text style={styles.addDet}>
                  {selectedItem.house_no}, {selectedItem.address},{' '}
                  {selectedItem.landmark}, {selectedItem.city},{' '}
                  {selectedItem.state} - {selectedItem.pincode}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: 10,
                  fontFamily: 'Gotham-Book',
                }}>
                Payment Status - {selectedItem.payment_status}
              </Text>

              {selectedItem.status === 'Pending' ? (
                <>
                  {textBox === true ? (
                    <>
                      <View style={styles.inputBox}>
                        <TextInput
                          value={note}
                          label={'Enter note'}
                          onChangeText={setNote}
                          placeholder="Enter note"
                          style={styles.input}
                          multiline={true}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => cancel()}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setTextBox(true)}>
                      <Text style={styles.cancelText}>Cancel Order</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  {selectedItem.notes && selectedItem.status === 'Cancelled' ? (
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 20,
                        marginTop: 10,
                        fontFamily: 'Gotham-Book',
                      }}>
                      Cancellation Note - {selectedItem.notes}
                    </Text>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </ModalView>
      </View>
    </>
  );
};
export default ProductHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hr: {
    height: 1,
    backgroundColor: '#f2f2f2',
    marginVertical: 10,
  },
  inputBox: {
    backgroundColor: '#ddd',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 6,
    padding: 3,
    marginBottom: 10,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 60,
    right: 20,
  },
  input: {
    width: width - 170,
    marginLeft: 5,
    paddingVertical: 5,
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Gotham-Book',
    height: 60,
  },
  cancelBtn: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#000',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  cancelText: {
    color: '#fff',
    fontFamily: 'Gotham-Medium',
  },
  addressBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
  },
  addHding: {
    fontFamily: 'Gotham-Medium',
    lineHeight: 16,
    fontSize: 12,
  },
  addDet: {
    fontFamily: 'Gotham-Book',
    fontSize: 12,
    lineHeight: 14,
  },
  detail: {},
  detailText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontFamily: 'Gotham-Book',
    marginBottom: 5,
  },
  status: {
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontFamily: 'Gotham-Medium',
  },
  cartItem: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 5,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
    width: width - 30,
  },
  card1: {
    flex: 1,
  },
  sectionBox: {
    backgroundColor: '#ffffff',
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  sectionBox1: {
    paddingVertical: 10,
    borderTopColor: '#f2f2f2',
    borderTopWidth: 1,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: 'Gill Sans Medium',
    marginTop: 20,
    marginLeft: 10,
  },
  itemQtyBox: {
    width: 40,
    paddingLeft: 10,
  },
  itemPriceBox: {
    width: 50,
  },
  itemTotalBox: {
    width: 70,
  },

  itemTitle: {
    fontSize: 12,
    width: width - 250,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily: 'Gotham-Light',
  },
  itemCat: {
    fontSize: 10,
    lineHeight: 16,
    fontFamily: 'Gotham-Light',
  },
  itemqty: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
    fontFamily: 'Gotham-Light',
  },
  itemTotal: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
    fontFamily: 'Gotham-Medium',
  },
  totalText: {
    fontFamily: 'Gill Sans Medium',
    fontSize: 16,
  },
});
