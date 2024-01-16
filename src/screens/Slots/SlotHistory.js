import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {IMAGE_BASE} from '../../config/ApiConfig';
import {UserContext} from '../../../context/UserContext';
import {NotificationIcon} from '../../components/NotificationIcon';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {PackageController} from '../../controllers/PackageController';
import {PackageItem} from '../../components/PackageItem';
import {ScheduleController} from '../../controllers/ScheduleController';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SlotHistory = () => {
  const navigation = useNavigation();
  const {getToken, getUser} = useContext(UserContext);
  const activeColor = [
    'rgba(225,215,206,0.2)',
    'rgba(225,215,206,0.5)',
    'rgba(225,215,206,1)',
  ];
  const [data, setData] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBookings();
    });
    return unsubscribe;
  }, []);

  const getBookings = async () => {
    const token = await getToken();
    if (token) {
      const instance = new ScheduleController();
      const result = await instance.allBookings(token);
      const filterData = result.bookings.filter(
        item =>
          moment(item.date).isSame(new Date()) ||
          moment(item.date).isAfter(new Date()),
      );
      setUpcoming(filterData);

      const allData = result.bookings.filter(item =>
        moment(item.date).isBefore(new Date()),
      );
      setData(allData);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={activeColor} style={styles.card1}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
          Appointments
        </Text>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{padding: 10, paddingBottom: 20}}>
               
            <Text style={styles.sectionHeading}>Upcoming Bookings</Text>
            {(upcoming && upcoming.length > 0) ?         
            <>
            {upcoming.map((item, index) => (
            <View style={styles.sectionBox}>
              <View style={styles.bookingBox}>
                <Text style={styles.date}>
                  Date: {moment(item.date).format('DD MMM, YYYY')}
                </Text>
                <Text style={styles.time}>
                  Time: {moment(item.date).format('HH:mm A')}
                </Text>
              </View>
              <Text style={{fontSize:12,alignSelf:'flex-end'}}>{moment(item.date).format('DD MMM @ HH:mm A')}</Text>
            </View>
          ))}
          </>
          :
          <Text style={{fontSize:12,marginVertical:40,textAlign:'center'}}>No upcoming bookings found</Text>
          }

          <Text style={styles.sectionHeading}>Past Bookings</Text>
          {(data && data.length > 0) ?   
          <>
          {data.map((item, index) => (
            <View style={styles.sectionBox}>
              <View style={styles.bookingBox}>
                <Text style={styles.date}>
                  Date: {moment(item.date).format('DD MMM, YYYY')}
                </Text>
                <Text style={styles.time}>
                  Time: {moment(item.date).format('HH:mm A')}
                </Text>
              </View>
              <Text style={{fontSize:12,alignSelf:'flex-end'}}>{moment(item.date).format('DD MMM @ HH:mm A')}</Text>
            </View>
          ))}
          </>
          :
          <Text style={{fontSize:12,marginVertical:40,textAlign:'center'}}>No past bookings found</Text>
          }


        </ScrollView>
      </LinearGradient>
    </View>
  );
};
export default SlotHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookingBox: {
    alignItems:'flex-start'
  },
  bidBox: {
    paddingHorizontal: 10,
  },
  bid: {
    fontFamily: 'Gotham-Medium',
    fontSize: 12,
  },
  date: {
    fontFamily: 'Gotham-Medium',
    textAlign: 'center',
  },
  at: {
    fontFamily: 'Gotham-Medium',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  time: {
    fontFamily: 'Gotham-Medium',
    textAlign: 'center',
    fontSize: 14,
    marginTop:10
  },
  medal: {
    width: 18,
    height: 18,
  },
  social: {
    width: 20,
    height: 20,
  },
  medalText: {
    color: '#fbcc5b',
    fontFamily: 'Gotham-Medium',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 2,
  },
  linkBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  line: {
    height: 1,
    marginVertical: 5,
    backgroundColor: '#ddd',
  },
  linkText: {
    fontFamily: 'Gill Sans Medium',
    fontSize: 16,
  },
  linkNext: {width: 14, height: 14, tintColor: '#888'},
  card1: {
    flex: 1,
  },
  sectionBox: {
    backgroundColor: '#ffffff',
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
  },
  prright: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 130,
  },
  prSection: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  prImage: {
    width: 80,
    height: 80,
    borderRadius: 80,
    marginRight: 10,
  },
  name: {
    fontFamily: 'Gill Sans Medium',
    fontSize: 16,
    lineHeight: 20,
  },
  phone: {
    fontFamily: 'Gotham-Medium',
    lineHeight: 20,
    fontSize: 12,
  },
  back: {
    marginLeft: 20,
    marginTop: 50,
    backgroundColor: '#000',
    width: 28,
    height: 28,
    alignItems: 'center',
    borderRadius: 5,
    position: 'absolute',
    zIndex: 99,
  },
  backImage: {
    width: 16,
    height: 16,
    tintColor: '#fff',
    marginTop: 5,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: 'Gill Sans Medium',
    marginTop:20,
    marginLeft:10
  },
});
