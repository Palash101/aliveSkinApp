import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {ProductContoller} from '../../controllers/ProductController';
import {UserContext} from '../../../context/UserContext';
import {IMAGE_BASE} from '../../config/ApiConfig';
import {Modal} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageLoader from '../../components/PageLoader';
import {useToast} from 'react-native-toast-notifications';
import {ModalView} from '../../components/ModalView';
import WebView from 'react-native-webview';

import useKeyboardHeight from 'react-native-use-keyboard-height';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Cart = props => {
  const [items, setItems] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const {getToken, getUser} = useContext(UserContext);
  const toast = useToast();
  const keyboardHeight = useKeyboardHeight();

  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [pincode, setPincode] = useState();
  const [phone, setPhone] = useState();
  const [code, setCode] = useState('+91');
  const [houseNo, setHouseNo] = useState();
  const [landmark, setLandmark] = useState();
  const [editId, setEditId] = useState();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const [addNew, setAddNew] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState('');
  const [countryPicker, setCountryPicker] = useState(false);
  const [payUrl, setPayUrl] = useState('');
  const [payModal, setPayModal] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPayModal(false);
      setAddressModal(false);
      setPayUrl(false);
      setLoading(true);
      getItems();
      getAllAdress();
    });
    return unsubscribe;
  }, []);

  const getItems = async () => {
    AsyncStorage.getItem('CartData', (err, result) => {
      console.log(result, 'resultresult');
      if (result) {
        setItems(JSON.parse(result));
        let totalPrice = 0;
        JSON.parse(result).map(item => {
          totalPrice = totalPrice + item.total;
        });
        setTotal(totalPrice);
      }
    });

    setLoading(false);
  };

  const fetchPaymentSheetParams = async () => {
    const token = await getToken();
    const user = await getUser()
    if (selectedAddress) {
      // if (token) {
      const newdata = new FormData();

      newdata.append('products', JSON.stringify(items));
      newdata.append('name', selectedAddress.name);
      newdata.append('address', selectedAddress.address);
      newdata.append('phone', selectedAddress.phone);
      newdata.append('pincode', selectedAddress.pincode);
      newdata.append('state', selectedAddress.state);
      newdata.append('city', selectedAddress.city);
      newdata.append('house_no', selectedAddress.house_no);
      newdata.append('landmark', selectedAddress.land_mark);
      if(token){
        console.log(user,'useruser')
        newdata.append('user_id', user.id);
      }

      console.log(newdata, 'newdata');

      setLoading(true);
      const instance = new ProductContoller();
      const result = await instance.checkout(newdata);
      console.log(result, 'resulllll');

      if (result.status === 'error') {
        toast.show(result.msg);
        setLoading(false);
      } else {
        return result;
      }
      // } else {
       //  setLoading(false);
      //   toast.show('Please login');
      // }
    } else {
      toast.show('Please select address.');
    }
  };

  const openPaymentSheet = async () => {
    const paymentUrl = await fetchPaymentSheetParams();
    console.log(paymentUrl, 'payurl');
    setPayUrl(paymentUrl?.checkoutUrl);
    setAddressModal(false);
    setPayModal(true);
    setLoading(false);
  };

  const deleteItem = async product => {
    console.log(product, 'productproduct');
    const filterData = items.filter(i => i.productId !== product.productId);
    setItems(filterData);
    let totalPrice = 0;
    filterData.map(item => {
      totalPrice = totalPrice + item.total;
    });
    setTotal(totalPrice);
    AsyncStorage.setItem('CartData', JSON.stringify(filterData));
  };

  const getAllAdress = async () => {
    const token = await getToken();
    if (token) {
      const instance = new ProductContoller();
      const result = await instance.allAddress(token);
      console.log(result, 'result.address');
      setAddresses(result.address);
      setAddNew(false);
    }
  };

  const add = async () => {
    const token = await getToken();
    if (token) {
      setLoading(true);
      if (
        name &&
        phone &&
        pincode &&
        city &&
        state &&
        houseNo &&
        address &&
        landmark
      ) {
        const formdata = new FormData();
        formdata.append('name', name);
        formdata.append('phone', code + phone);
        formdata.append('pincode', pincode);
        formdata.append('city', city);
        formdata.append('state', state);
        formdata.append('house_no', houseNo);
        formdata.append('address', address);
        formdata.append('land_mark', landmark);

        const instance = new ProductContoller();
        if (editId) {
          const result = await instance.updateAddress(formdata, editId, token);
        } else {
          const result = await instance.addAddress(formdata, token);
        }
        getAllAdress();
        clearForm();
        setLoading(false);
      } else {
        toast.show('Please fill all details');
      }
    } else {
      if (
        name &&
        phone &&
        pincode &&
        city &&
        state &&
        houseNo &&
        address &&
        landmark
      ) {
        setSelectedAddress({
          name: name,
          address: address,
          phone: code + phone,
          pincode: pincode,
          city: city,
          state: state,
          house_no: houseNo,
          land_mark: landmark,
        });
      } else {
        toast.show('Please fill all details');
      }
    }
  };

  const cancelAddress = async item => {
    const token = await getToken();
    if (token) {
      setLoading(true);
      const instance = new ProductContoller();
      const result = await instance.deleteAddress(item.id, token);
      console.log(result, 'resultresult');
      getAllAdress();
      setLoading(false);
      toast.show('Address deleted successfully.');
    }
  };

  const clearForm = () => {
    setName();
    setPhone();
    setPincode();
    setCity();
    setState();
    setHouseNo();
    setAddress();
    setLandmark();
  };

  const callEdit = item => {
    setEditId(item.id);
    setAddNew(true);
    setName(item.name);
    setPhone(item.phone);
    setPincode(item.pincode);
    setCity(item.city);
    setState(item.state);
    setHouseNo(item.house_no);
    setAddress(item.address);
    setLandmark(item.land_mark);
  };

  const back = () => {
    setAddNew(false);
    setEditId();
  };

  const getUserToken = async () => {
    return await getToken();
  };

  const checkResponse = data => {
    console.log(data.url);
    if (data.url.includes('success')) {
      // const url1 = data.url.split('?')[1];
      // const url2 = url1.split('&')[0];
      // const status = url2.split('=')[1];
      // console.log(status, 'status');
      //  if (status === 'Paid') {
      setLoading(true);
      AsyncStorage.removeItem('CartData');
      setPayModal(false);
      //setTimeout(() => {
      toast.show('Order placed successfully.');
      navigation.navigate('ProductHistory');
      setLoading(false);
      //     }, 2000);
      //   } else {
      //     setPayModal(false);
      //     navigation.navigate('Product');
      //     toast.show('Payment has been ' + status);
      //   }
    } else if (data.url.includes('failed')) {
      toast.show('Order has been failed.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.bg}>
      <PageLoader loading={loading} />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          marginLeft: 10,
          marginTop: 55,
        }}>
        <Image
          source={assets.back}
          style={{width: 16, height: 16, tintColor: '#000', marginTop: 5}}
        />
      </TouchableOpacity>

      {items?.length ? (
        <>
          <ScrollView style={{flex: 1, padding: 15, marginTop: 10}}>
            <View style={styles.cartItem}>
              <View style={styles.itemTitleBox}>
                <Text style={[styles.itemTitle, {marginLeft: 22}]}>
                  Cart Items
                </Text>
              </View>
              <View style={styles.itemQtyBox}>
                <Text
                  style={[styles.itemqty, {fontFamily: 'Gill Sans Medium'}]}>
                  Qty
                </Text>
              </View>
              <View style={styles.itemPriceBox}>
                <Text
                  style={[styles.itemqty, {fontFamily: 'Gill Sans Medium'}]}>
                  Price
                </Text>
              </View>
              <View style={styles.itemTotalBox}>
                <Text
                  style={[
                    styles.itemTotal,
                    ,
                    {fontFamily: 'Gill Sans Medium'},
                  ]}>
                  Total
                </Text>
              </View>
            </View>
            <FlatList
              data={items}
              pagingEnabled
              decelerationRate={'normal'}
              renderItem={({item}, key) => (
                <View style={styles.cartItem}>
                  <View style={styles.itemTitleBox}>
                    <TouchableOpacity
                      onPress={() => deleteItem(item)}
                      style={{marginTop: 10, paddingRight: 10}}>
                      <Image
                        source={assets.trash}
                        style={{width: 14, height: 14, tintColor: '#888'}}
                      />
                    </TouchableOpacity>
                    <Image
                      source={{uri: IMAGE_BASE + item.itemImage}}
                      style={styles.itemImage}
                    />
                    <TouchableOpacity
                      TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductDetails', {
                          item: {
                            id: item.productId,
                            name: item.itemName,
                            images: [{image: item.itemImage}],
                          },
                        })
                      }>
                      <Text style={styles.itemTitle}>{item.itemName}</Text>
                      <Text style={styles.itemCat}>{item.category}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemQtyBox}>
                    <Text style={styles.itemqty}>{item.quantity}</Text>
                  </View>
                  <View style={styles.itemPriceBox}>
                    <Text style={styles.itemqty}>{item.price} KD</Text>
                    {item.actualPrice ? (
                      <Text style={styles.footerPrice2}>
                        {item.actualPrice} KD
                      </Text>
                    ) : (
                      <></>
                    )}
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
                <Text style={styles.itemTotal}>{total} KD</Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerPrice}>Total</Text>
              <Text style={styles.totalText}>{total} KD</Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => {
                  setAddNew(false);
                  setAddressModal(true);
                }}>
                <Image source={assets.cart} style={styles.cartImage} />
                <Text style={styles.cartButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <TouchableOpacity
          style={[
            styles.cartButton,
            {alignSelf: 'center', marginTop: height / 2 - 70},
          ]}
          onPress={() => navigation.navigate('Product')}>
          <Text style={styles.cartButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={addressModal}
        onDismiss={() => setAddressModal(false)}
        style={{
          height: 'auto',
          marginTop: 260,
          justifyContent: 'flex-end',
          marginBottom: keyboardHeight,
        }}>
        <View style={styles.modalBox}>
          <View style={styles.titleHeading}>
            <Text style={styles.titleText}>
              {selectedAddress ? 'Selected Address' : 'Select Address'}
            </Text>
          </View>

          <KeyboardAvoidingView behavior="padding">
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingBottom: 150,
              }}>
              {selectedAddress ? (
                <View style={{paddingHorizontal: 10}}>
                  <TouchableOpacity style={styles.addressBox}>
                    <Text style={styles.addHding}>
                      {selectedAddress.name} , {selectedAddress.phone}
                    </Text>
                    <Text style={styles.addDet}>
                      {selectedAddress.house_no}, {selectedAddress.address},{' '}
                      {selectedAddress.landmark}, {selectedAddress.city},{' '}
                      {selectedAddress.state} - {selectedAddress.pincode}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setAddNew(false);
                      setSelectedAddress();
                    }}
                    style={styles.addBtn}>
                    <Text style={styles.addText}>+ Add Another Address</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.cartButton,
                      {width: width - 50, marginTop: 10},
                    ]}
                    onPress={() => openPaymentSheet()}>
                    <Image source={assets.cart} style={styles.cartImage} />
                    <Text style={styles.cartButtonText}>Checkout</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {addNew ? (
                    <View style={{paddingHorizontal: 10}}>
                      <View style={styles.inputBox}>
                        <TextInput
                          value={name}
                          label={'Full name'}
                          onChangeText={setName}
                          placeholder="Full Name"
                          style={styles.input}
                        />
                      </View>

                      <View style={styles.inputBox}>
                        <TouchableOpacity
                          style={styles.codeInput}
                          onPress={() => setCountryPicker(true)}>
                          <Text style={styles.codeText}>
                            {selectedFlag} {code}
                          </Text>
                          <Image
                            source={assets.chevron}
                            style={{width: 14, height: 14, marginTop: 5}}
                          />
                        </TouchableOpacity>
                        <TextInput
                          value={phone}
                          label={'PHONE NUMBER'}
                          onChangeText={setPhone}
                          placeholder="Enter mobile number"
                          keyboardType={'numeric'}
                          returnKeyType="done"
                          style={styles.countryPicker}
                        />
                      </View>

                      <Text style={styles.label}>Address</Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={[styles.inputBox, {width: '48%'}]}>
                          <TextInput
                            value={state}
                            label={'State'}
                            onChangeText={setState}
                            placeholder="State"
                            style={[styles.input]}
                          />
                        </View>

                        <View style={[styles.inputBox, {width: '48%'}]}>
                          <TextInput
                            value={city}
                            label={'City'}
                            onChangeText={setCity}
                            placeholder="City"
                            style={styles.input}
                          />
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={[styles.inputBox, {width: '48%'}]}>
                          <TextInput
                            value={pincode}
                            label={'Pincode'}
                            onChangeText={setPincode}
                            placeholder="Pincode"
                            style={styles.input}
                            keyboardType="numeric"
                            returnKeyType="done"
                          />
                        </View>
                        <View style={[styles.inputBox, {width: '48%'}]}>
                          <TextInput
                            value={houseNo}
                            label={'House No.'}
                            onChangeText={setHouseNo}
                            placeholder="House No."
                            style={styles.input}
                          />
                        </View>
                      </View>
                      <View style={styles.inputBox}>
                        <TextInput
                          value={address}
                          label={'Address'}
                          onChangeText={setAddress}
                          placeholder="Address"
                          style={styles.input}
                        />
                      </View>
                      <View style={styles.inputBox}>
                        <TextInput
                          value={landmark}
                          label={'Landmark'}
                          onChangeText={setLandmark}
                          placeholder="Landmark"
                          style={styles.input}
                        />
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.cartButton,
                          {width: width - 50, marginTop: 10},
                        ]}
                        onPress={() => add()}>
                        <Text style={styles.cartButtonText}>Save</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => back()}
                        style={{alignSelf: 'center', marginTop: 20}}>
                        <Text
                          style={{fontFamily: 'Gotham-Medium', fontSize: 12}}>
                          Back
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{paddingHorizontal: 10, paddingTop: 10}}>
                      {addresses?.map((item, index) => (
                        <View style={styles.addressBox}>
                          <TouchableOpacity
                            onPress={() => cancelAddress(item)}
                            style={styles.removeBtn}>
                            <Text style={styles.removeText}>x</Text>
                          </TouchableOpacity>
                          <Text style={styles.addHding}>
                            {item.name} , {item.phone}
                          </Text>
                          <Text style={styles.addDet}>
                            {item.house_no}, {item.address}, {item.landmark},{' '}
                            {item.city}, {item.state} - {item.pincode}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 10,
                              gap: 10,
                              justifyContent: 'space-between',
                            }}>
                            <TouchableOpacity
                              onPress={() => setSelectedAddress(item)}
                              style={styles.addressBtn}>
                              <Text style={styles.addBtnText}>Select</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => callEdit(item)}
                              style={styles.addressBtn}>
                              <Text style={styles.addBtnText}>Edit</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}

                      <TouchableOpacity
                        onPress={() => setAddNew(true)}
                        style={styles.addBtn}>
                        <Text style={styles.addText}>+ Add New Address</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal
        visible={payModal}
        onDismiss={() => setPayModal(false)}
        style={{height: 'auto'}}>
        <View style={styles.modalBox1}>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderColor: '#161415',
              marginTop: 70,
            }}>
            <TouchableOpacity onPress={() => setPayModal(false)}>
              <Image
                source={assets.back}
                style={{width: 16, height: 16, marginLeft: 15, marginTop: 15}}
              />
            </TouchableOpacity>

            <Text
              style={{
                padding: 15,
                fontSize: 16,
                color: '#161415',
                fontFamily: 'Gotham-Medium',
                textAlign: 'center',
              }}>
              PAY
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={{
              bottom: 0,
              height: height,
              backgroundColor: '#f9f9f9',
            }}>
            <WebView
              source={{
                uri: payUrl,
                headers: {
                  Authorization: 'Bearer ' + getUserToken(),
                  Accept: 'application/json',
                },
              }}
              onNavigationStateChange={data => checkResponse(data)}
              startInLoadingState={true}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};
export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerPrice2: {
    color: '#333',
    fontWeight: '600',
    fontSize: 12,
    textDecorationLine: 'line-through',
    paddingLeft: 10,
  },
  modalBox: {
    paddingTop: Platform.OS === 'ios' ? 30 : 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    bottom: -40,
    left: 0,
    right: 0,
    height: 500,
  },
  titleHeading: {
    flexDirection: 'row',
  },
  titleText: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    fontSize: 14,
    color: '#161415',
    fontFamily: 'Gill Sans Medium',
    textTransform: 'uppercase',
  },
  modalContent: {
    paddingBottom: 20,
  },
  removeBtn: {
    position: 'absolute',
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderWidth: 1,
    right: -5,
    marginTop: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  removeText: {
    color: '#333',
    fontSize: 14,
    alignSelf: 'center',
    fontWeight: '600',
  },
  addressBtn: {
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 20,
    width: width / 2 - 40,
  },
  addBtnText: {
    fontSize: 12,
    textAlign: 'center',
  },
  addressBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalBox1: {
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop: 0,
  },
  addBtn: {alignSelf: 'center', marginBottom: 10},
  addText: {
    fontFamily: 'Gotham-Medium',
    lineHeight: 16,
    fontSize: 12,
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
  label: {
    fontFamily: 'Gotham-Book',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
    marginTop: 5,
  },
  inputBox: {
    backgroundColor: '#ddd',
    marginTop: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 6,
    padding: 3,
    marginBottom: 10,
  },
  cartItem: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
    width: width - 30,
  },
  input: {
    width: width - 170,
    marginLeft: 5,
    paddingVertical: 5,
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Gotham-Book',
  },
  countryPicker: {
    width: width - 170,
    marginLeft: 5,
    backgroundColor: 'transparent',
    color: '#000000',
    textTransform: 'uppercase',
    fontSize: 12,
    fontFamily: 'Gotham-Book',
  },
  codeInput: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 26,
    width: 65,
    borderRadius: 6,
    paddingHorizontal: 5,
  },
  codeText: {
    fontSize: 12,
    marginTop: 5,
  },
  itemTitleBox: {
    width: width - 200,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  itemImage: {
    width: 38,
    height: 38,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
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
    fontFamily: 'Gotham-Light',
  },
  itemTotal: {
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'Gotham-Medium',
  },
  totalText: {
    fontFamily: 'Gill Sans Medium',
    fontSize: 16,
  },
  footer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyButton: {
    padding: 10,
    backgroundColor: '#563925',
    width: width / 2 - 30,
    textAlign: 'center',
    borderRadius: 20,
  },
  cartButton: {
    padding: 10,
    backgroundColor: '#563925',
    flexDirection: 'row',
    width: width / 2 - 10,
    justifyContent: 'center',
    borderRadius: 20,
  },
  cartImage: {
    width: 16,
    height: 16,
    tintColor: '#fff',
    marginRight: 10,
  },
  buyButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  },
  cartButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Gill Sans Medium',
  },
  footerPrice: {
    color: '#563925',
    fontSize: 16,
    fontFamily: 'Gill Sans Medium',
  },
  bg: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
