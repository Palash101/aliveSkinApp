import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
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

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PackageDetail = props => {
  const navigation = useNavigation();
  const {getToken, getUser} = useContext(UserContext);
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const activeColor = ['#f2f2f2', '#ddd', '#babdb2'];
  const activeColor2 = [
    'rgba(225,215,206,1)',
    'rgba(225,215,206,0.4)',
    'rgba(225,215,206,0)',
  ];
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDetail();
    });
    return unsubscribe;
  }, [props.route.params]);
  console.log(item, 'ress');
  const getDetail = async () => {
    setLoading(true)
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
    const result = await instance.purchasePackage(item.id, token);
    console.log(result, 'ressult');
    toast.show(result.msg);
  };

  return (
    <View style={styles.bg}>
      <PageLoader loading={loading} />
      <View  style={styles.bg}>
        <View>
          <View style={{display: 'flex', flexDirection: 'row', marginTop: 0}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Package')}
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
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.category}>{item.bookings} Appointments</Text>

            <View style={[styles.priceBox, {borderColor: '#563925'}]}>
              <Text
                style={[
                  styles.tag,
                  {
                    borderColor: '#563925',
                    color: '#563925',
                    backgroundColor: '#E2D8CF',
                  },
                ]}>
                {item.tag}
              </Text>
              <View style={styles.priceTextBox}>
                <Text style={[styles.price, {color: '#563925'}]}>
                  {item.price} KD
                </Text>
                <Text style={styles.day}>for {item.days} days</Text>
              </View>
              <TouchableOpacity
                style={[styles.cartButton, {backgroundColor: '#563925'}]}
                onPress={() => purchaseNow()}>
                <Text style={styles.cartButtonText}>BUY NOW </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.description}>
              <RenderHtml
                contentWidth={width - 40}
                source={{html: item.description}}
              />
            </View>
          </View>
        </ScrollView>
      </View>
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
