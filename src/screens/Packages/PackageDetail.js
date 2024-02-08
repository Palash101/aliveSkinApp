import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {useNavigation} from '@react-navigation/native';
import {PackageController} from '../../controllers/PackageController';
import {UserContext} from '../../../context/UserContext';
import LinearGradient from 'react-native-linear-gradient';
import RenderHtml from 'react-native-render-html';
import {useToast} from 'react-native-toast-notifications';
import PageLoader from '../../components/PageLoader';
import WebView from 'react-native-webview';
import {Modal} from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PackageDetail = props => {
  const navigation = useNavigation();
  const {getToken, getUser} = useContext(UserContext);
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [payUrl, setPayUrl] = useState('');
  const [payModal, setPayModal] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDetail();
    });
    return unsubscribe;
  }, [props.route.params]);

  const getDetail = async () => {
    setLoading(true);
    const instance = new PackageController();
    const token = await getToken();
    const result = await instance.packageDetail(
      props.route.params.item.id,
      token,
    );
    setItem(result.package);
    setLoading(false);
  };

  const purchaseNow = async () => {
    const instance = new PackageController();
    const token = await getToken();
    if (token) {
      const result = await instance.purchasePackage(item.id, token);
      return result;
    } else {
      toast.show('Please login for purchase package.');
    }
  };

  const openPaymentSheet = async () => {
    const token = await getToken();
    if (token) {
      const paymentUrl = await purchaseNow();
      console.log(paymentUrl, 'payurl');
      setPayUrl(paymentUrl?.checkoutUrl);
      setPayModal(true);
      setLoading(false);
    } else {
      toast.show('Please login for purchase package.');
    }
  };

  const getUserToken = async () => {
    return await getToken();
  };

  const checkResponse = data => {
    console.log(data.url);
    if (data.url.includes('payment/app/success')) {
      setLoading(true);
      setPayModal(false);
      toast.show('Package purchased successfully.');
      navigation.navigate('Profile',{back: true});
      setLoading(false);
    } else if (data.url.includes('failed')) {
      toast.show('Order has been failed.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.bg}>
      <PageLoader loading={loading} />
      <View style={styles.bg}>
        <View>
          <View style={{display: 'flex', flexDirection: 'row', marginTop: 0}}>
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
          </View>
        </View>
        <ScrollView style={{flex: 1}}>
          <View style={styles.content}>
            <Text style={styles.title}>{item?.name}</Text>
            <Text style={styles.category}>{item?.bookings} Appointments</Text>

            <View style={[styles.priceBox, {borderColor: '#563925'}]}>
              {item?.tag ? (
                <Text
                  style={[
                    styles.tag,
                    {
                      borderColor: '#563925',
                      color: '#563925',
                      backgroundColor: '#E2D8CF',
                    },
                  ]}>
                  {item?.tag}
                </Text>
              ) : (
                <></>
              )}
              <View style={styles.priceTextBox}>
                <Text style={[styles.price, {color: '#563925'}]}>
                  {item?.price} KD
                </Text>
                <Text style={styles.day}>for {item?.days} days</Text>
              </View>
              <TouchableOpacity
                style={[styles.cartButton, {backgroundColor: '#563925'}]}
                onPress={() => openPaymentSheet()}>
                <Text style={styles.cartButtonText}>BUY NOW </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.description}>
              <RenderHtml
                contentWidth={width - 40}
                source={{html: item?.description}}
              />
            </View>
          </View>
        </ScrollView>
      </View>

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
export default PackageDetail;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#fff',
  },
  priceBox: {
    borderWidth: 2,
    width: width - 40,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    margin: 20,
    marginTop: 40,
  },
  tag: {
    borderWidth: 2,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 12,
    lineHeight: 18,
    textTransform: 'uppercase',
    marginTop: -22,
    fontWeight: '600',
    color: '#fff',
    overflow: 'hidden',
    fontFamily: 'Gill Sans Medium',
  },
  priceTextBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  price: {
    color: '#563925',
    fontWeight: '800',
    fontSize: 32,
    marginTop: 10,
    marginRight: 10,
    fontFamily: 'Gotham-Medium',
  },
  day: {
    paddingTop: 20,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Gill Sans Medium',
  },
  videoCardbg: {
    flex: 1,
    padding: 10,
    height: 220,
  },
  itemHeading: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    fontFamily: 'Gill Sans Medium',
  },
  para: {
    fontSize: 12,
    color: '#000',
    fontWeight: '400',
    marginVertical: 10,
    fontFamily: 'Gill Sans Medium',
  },

  title: {
    color: '#000',
    fontWeight: '600',
    fontSize: 24,
    marginLeft: 15,
    marginTop: 10,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Gill Sans Medium',
  },
  category: {
    color: '#000',
    lineHeight: 20,
    fontSize: 16,
    marginTop: 5,
    marginLeft: 15,
    textAlign: 'center',
    fontFamily: 'Gill Sans Medium',
  },
  descText: {
    fontSize: 12,
  },

  description: {
    // borderWidth: 2,
    // padding: 10,
    // borderRadius: 10,
    // borderColor: '#563925',
    width: width - 40,
    marginHorizontal: 20,
  },
  modalBox1: {
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop: 0,
  },
  footer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerPrice: {
    color: '#563925',
    fontWeight: '800',
    fontSize: 16,
  },
  footerPrice2: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  cartButton: {
    padding: 10,
    display: 'flex',
    backgroundColor: '#563925',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  cartButtonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Gill Sans Medium',
  },
});
