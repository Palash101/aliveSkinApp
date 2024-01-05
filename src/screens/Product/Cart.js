import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
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
import ProductCard from '../../components/Card/ProductCard';
import {ProductContoller} from '../../controllers/ProductController';
import {UserContext} from '../../../context/UserContext';
import {IMAGE_BASE} from '../../config/ApiConfig';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import {DarkButton, ThemeButton, ThemeButton2} from '../../components/Buttons';
import {AddToCart, GetCartData} from '../../services/AddToCart';
import {Badge} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageLoader from '../../components/PageLoader';
import {useToast} from 'react-native-toast-notifications';
import {ModalView} from '../../components/ModalView';
import {useStripe} from '@stripe/stripe-react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Cart = props => {
  const [items, setItems] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const {getToken, getUser} = useContext(UserContext);
  const toast = useToast();

  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [pincode, setPincode] = useState();
  const [phone, setPhone] = useState();
  const [code, setCode] = useState('+91');
  const [addressModal, setAddressModal] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState('');
  const [countryPicker, setCountryPicker] = useState(false);

  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      // initializePaymentSheet();
      getItems();
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

  const submitPayment = async () => {
    const token = await getToken();
    if (address && phone && pincode && state && city) {
      if (token) {
        const newdata = new FormData();
        newdata.append('products', JSON.stringify(items));
        newdata.append('address', address);
        newdata.append('phone', code + phone);
        newdata.append('pincode', pincode);
        newdata.append('state', state);
        newdata.append('city', city);

        console.log(newdata, 'newdata');

        setLoading(true);
        const instance = new ProductContoller();
        const result = await instance.checkout(newdata, token);
        console.log(result, 'resulllll');
        if (result.status === 'error') {
          setLoading(false);
          toast.show(result.msg);
        } else {
          const {paymentIntent, ephemeralKey, customer} = result;
          setLoading(false);
          return {
            paymentIntent,
            ephemeralKey,
            customer,
          };

          // toast.show(result.msg);
          // navigation.navigate('home');
        }
      } else {
        setLoading(false);
        toast.show('Please login');
      }
    } else {
      toast.show('Please enter address details.');
    }
  };

  const fetchPaymentSheetParams = async () => {
    const token = await getToken();
    if (address && phone && pincode && state && city) {
      if (token) {
        const newdata = new FormData();

        newdata.append('products', JSON.stringify(items));
        newdata.append('name', name);
        newdata.append('address', address);
        newdata.append('phone', code + phone);
        newdata.append('pincode', pincode);
        newdata.append('state', state);
        newdata.append('city', city);

        console.log(newdata, 'newdata');

        setLoading(true);
        const instance = new ProductContoller();
        const result = await instance.checkout(newdata, token);
        console.log(result, 'resulllll');

        if (result.status === 'error') {
          toast.show(result.msg);
          setLoading(false);
        } else {
          return result;
        }
      } else {
        setLoading(false);
        toast.show('Please login');
      }
    } else {
      toast.show('Please enter address details.');
    }

    // const instance = new ProductContoller();
    // const response = await instance.checkout(items, token);
    // console.log(response, 'resulllll');

    // const {paymentIntent, ephemeralKey, customer} = await response.json();

    // return {
    //   paymentIntent,
    //   ephemeralKey,
    //   customer,
    // };
  };

  const initializePaymentSheet = async () => {
    const {customer, ephemeralKey, paymentIntent, publishableKey} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Alive Skin',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Monika',
      },
    });
    if (!error) {
      setLoading(true);
      const {error} = await presentPaymentSheet();
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
        setLoading(false);
      } else {
        Alert.alert('Success', 'Your order is confirmed!');
      }
    }
  };

  const openPaymentSheet = async () => {
    initializePaymentSheet();
    // const {error} = await presentPaymentSheet();
    // if (error) {
    //   Alert.alert(`Error code: ${error.code}`, error.message);
    // } else {
    //   Alert.alert('Success', 'Your order is confirmed!');
    // }
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

  return (
    <View style={styles.bg}>
      <PageLoader loading={loading} />
      <TouchableOpacity
        onPress={() => navigation.navigate('Product')}
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
                    <Text style={styles.itemqty}>{item.actualPrice} KD</Text>
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
                onPress={() => setAddressModal(true)}>
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

      <ModalView
        visible={addressModal}
        setVisible={() => setAddressModal(false)}
        heading={'Enter Address Details'}>
        <View style={{paddingHorizontal: 10}}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputBox}>
            <TextInput
              value={name}
              label={'Full name'}
              onChangeText={setName}
              placeholder="Full Name"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Address</Text>
          <View style={styles.inputBox}>
            <TextInput
              value={address}
              label={'Address'}
              onChangeText={setAddress}
              placeholder="Address"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>State</Text>
          <View style={styles.inputBox}>
            <TextInput
              value={state}
              label={'State'}
              onChangeText={setState}
              placeholder="State"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>City</Text>
          <View style={styles.inputBox}>
            <TextInput
              value={city}
              label={'City'}
              onChangeText={setCity}
              placeholder="City"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Pincode</Text>
          <View style={styles.inputBox}>
            <TextInput
              value={pincode}
              label={'Pincode'}
              onChangeText={setPincode}
              placeholder="Pincode"
              style={styles.input}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputBox}>
            <TouchableOpacity
              style={styles.codeInput}
              onPress={() => setCountryPicker(true)}>
              <Text style={styles.codeText}>
                {selectedFlag} {code}
              </Text>
              <Image
                source={assets.chevron}
                style={{width: 14, height: 14, marginTop: 10}}
              />
            </TouchableOpacity>
            <TextInput
              value={phone}
              label={'PHONE NUMBER'}
              onChangeText={setPhone}
              placeholder="Enter mobile number"
              keyboardType={'numeric'}
              style={styles.countryPicker}
            />
          </View>

          <TouchableOpacity
            style={[styles.cartButton, {width: width - 50, marginTop: 50}]}
            onPress={() => openPaymentSheet()}>
            <Image source={assets.cart} style={styles.cartImage} />
            <Text style={styles.cartButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </ModalView>
    </View>
  );
};
export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 6,
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
    fontSize: 16,
    fontFamily: 'Gotham-Book',
  },
  countryPicker: {
    width: width - 170,
    marginLeft: 5,
    backgroundColor: 'transparent',
    color: '#000000',
    textTransform: 'uppercase',
    fontSize: 16,
    fontFamily: 'Gotham-Book',
  },
  codeInput: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 32,
    width: 85,
    borderRadius: 6,
    paddingHorizontal: 5,
  },
  codeText: {
    fontSize: 16,
    marginTop: 7,
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
    display: 'flex',
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
