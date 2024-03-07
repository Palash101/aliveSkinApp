import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
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
import {UserContext} from '../../../context/UserContext';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {ScheduleController} from '../../controllers/ScheduleController';
import AppointmentCard from '../../components/Card/AppointmentCard';
import {useToast} from 'react-native-toast-notifications';
import PageLoader from '../../components/PageLoader';

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
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBookings();
    });
    return unsubscribe;
  }, []);

  const getBookings = async () => {
    const token = await getToken();
    if (token) {
      console.log(token, 'token');
      const instance = new ScheduleController();
      const result = await instance.allBookings(token);

      const filterData = result.bookings.filter(
        item =>
          moment(item.date).isSame(new Date()) ||
          moment(item.date).isAfter(new Date()),
      );
      setUpcoming(
        filterData.sort(
          (a, b) => moment(a.date).unix() - moment(b.date).unix(),
        ),
      );

      const allData = result.bookings.filter(item =>
        moment(item.date).isBefore(new Date()),
      );
      setData(
        allData.sort((a, b) => moment(a.date).unix() - moment(b.date).unix()),
      );
    }
  };
  const goChat = item => {
    navigation.navigate('Chat', {user_id: item.user_id});
  };

  const Cancel = async item => {
    Alert.alert(
      'Confirm',
      'Are you sure? you want to cancel your appointment.',
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
            const instance = new ScheduleController();
            const result = await instance.cancelOrder(item, token);
            console.log(result, 'resultt');
            toast.show('Your appointment has been canceled successfully');
            getBookings();
            setLoading(false);
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <>
      <PageLoader loading={loading} />
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
            style={{flex: 1, marginTop: 15}}
            contentContainerStyle={{padding: 10, paddingBottom: 20}}>
            <Text style={styles.sectionHeading}>Upcoming Bookings</Text>
            {upcoming && upcoming.length > 0 ? (
              <>
                {upcoming.map((item, index) => (
                  <AppointmentCard
                    item={item}
                    upcoming={true}
                    Cancel={Cancel}
                    goChat={goChat}
                  />
                ))}
              </>
            ) : (
              <Text
                style={{fontSize: 12, marginVertical: 40, textAlign: 'center'}}>
                No upcoming bookings found
              </Text>
            )}

            <Text style={styles.sectionHeading}>Past Bookings</Text>
            {data && data.length > 0 ? (
              <>
                {data.map((item, index) => (
                  <AppointmentCard item={item} upcoming={false} />
                ))}
              </>
            ) : (
              <Text
                style={{fontSize: 12, marginVertical: 40, textAlign: 'center'}}>
                No past bookings found
              </Text>
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    </>
  );
};
export default SlotHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 20,
    marginLeft: 10,
  },
});
