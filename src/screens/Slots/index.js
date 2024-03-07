import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
// import Calendar from '../../components/calendar/Calendar';
import {ThemeButton, ThemeButton2} from '../../components/Buttons';
import moment from 'moment';
import {UserContext} from '../../../context/UserContext';
import {VideoController} from '../../controllers/VideoController';
import {ScheduleController} from '../../controllers/ScheduleController';
import {PackageController} from '../../controllers/PackageController';
import PageLoader from '../../components/PageLoader';
import {useToast} from 'react-native-toast-notifications';
import WebView from 'react-native-webview';
import {AuthContoller} from '../../controllers/AuthController';
import {Calendar, LocaleConfig} from 'react-native-calendars';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Slots = () => {
  const activeColor = ['#babdb229', '#babdb254', '#babdb2'];
  const navigation = useNavigation();
  const [selectedSlot, setSelectedSlot] = useState();
  const [selectedPackage, setSelectedPackage] = useState();

  const [selectedDate, setSelectedDate] = useState();
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [allSlots, setAllSots] = useState([]);

  const [packages, setPackages] = useState([]);
  const [globalIndex, setGlobalIndex] = useState(0);
  const {getToken, getUser} = useContext(UserContext);
  const [user, setUser] = useState();
  const [payUrl, setPayUrl] = useState('');
  const [payModal, setPayModal] = useState(false);

  const [selected, setSelected] = useState('');

  // const minDate = moment(new Date()).add(2, 'days');

  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSlots([]);
      setSelected('');
      setSelectedSlot();
      setSelectedPackage();
      getSlots();
      getPackage();
    });
    return unsubscribe;
  }, []);

  const onSelectSlot = val => {
    if (val.status === 'Open') {
      setSelectedSlot(val);
      if (packages[0]?.length > 0 && packages[0]?.bookings > 0) {
        setSelectedPackage(packages[0]);
      }
    } else {
      setSelectedSlot();
    }
  };

  const getSlots = async () => {
    const token = await getToken();

    console.log(token, 'tokennewuser');
    if (token) {
      const instance = new ScheduleController();
      const result = await instance.AllSchedule(token);

      const instance1 = new AuthContoller();
      const result1 = await instance1.profileDetails(token);
      setUser(result1.user);
      setAllSots(result.schedules);
    }
  };

  const getPackage = async () => {
    const token = await getToken();
    if (token) {
      const instance = new PackageController();
      const result = await instance.myPackage(token);
      setPackages(result.packages);
      console.log(result.packages, 'result.packages');
    }
  };

  const onSelectDate = date => {
    console.log(date, 'ddd');
    setLoading(true);
    setSelected(date);
    var dt = moment(date).format('YYYY-MM-DD');

    const filterData = allSlots.filter(item =>
      moment(item.start_date_time, 'YYYY-MM-DD').isSame(dt),
    );
    console.log(allSlots, filterData, 'dttt');

    setSlots(filterData);
    setLoading(false);
  };

  const selectPackage = async item1 => {
    console.log(item1);
    setSelectedPackage(item1);
  };

  const bookAppointMent = async () => {
    const token = await getToken();
    const user = await getUser();
    console.log(user, token, 'useruseruser');
    if (token) {
      setLoading(true);
      const instance = new ScheduleController();
      const result = await instance.bookNow(
        selectedSlot?.id,
        selectedPackage?.id,
        'Package',
        token,
      );
      console.log(result, 'result');
      if (result.status === 'success') {
        toast.show(result.msg);
        navigation.navigate('Chat', {user_id: result.booking.user_id});
        setLoading(false);
      } else {
        toast.show(result.msg);
        setLoading(false);
      }
    }
  };

  const checkout = async () => {
    const token = await getToken();
    const user = await getUser();
    console.log(user, token, 'useruseruser');
    if (token) {
      setLoading(true);
      const instance = new ScheduleController();
      const result = await instance.bookNow(
        selectedSlot?.id,
        '',
        'Payment',
        token,
      );
      console.log(result, 'ressss');
      if (result.status === 'error') {
        toast.show(result.msg);
        setLoading(false);
      } else {
        setPayUrl(result?.checkoutUrl);
        setPayModal(true);
        setLoading(false);
      }
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
      toast.show('Appointment booked successfully.');
      navigation.navigate('home');
      setLoading(false);
    } else if (data.url.includes('app/failed?status=Failed')) {
      setPayModal(false);
      toast.show('Appointment booking has been failed.');
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    return moment(new Date(), 'YYYY-MM-DD').add(2, 'days').format('YYYY-MM-DD');
  };

  const getFutureDate = month => {
    return moment(new Date(), 'YYYY-MM-DD')
      .add(month, 'month')
      .format('YYYY-MM-DD');
  };

  return (
    <>
      <PageLoader loading={loading} />

      <View style={styles.container}>
        <LinearGradient colors={activeColor} style={styles.card1}>
          <View style={{display: 'flex', flexDirection: 'row', marginTop: 50}}>
            <TouchableOpacity
              style={{
                marginLeft: 20,
                backgroundColor: '#000',
                width: 28,
                height: 28,
                alignItems: 'center',
                borderRadius: 5,
                marginBottom: 10,
              }}
              onPress={() => navigation.goBack()}>
              <Image
                source={assets.back}
                style={{width: 16, height: 16, tintColor: '#fff', marginTop: 5}}
              />
            </TouchableOpacity>
            <Text
              style={{
                width: width - 100,
                textAlign: 'center',
                fontSize: 16,
                lineHeight: 28,
                fontWeight: '600',
              }}>
              Appointments
            </Text>
          </View>
          <ScrollView contentContainerStyle={{flex: 1}}>
            <View style={styles.outerBox}>
              {/* <Calendar
                currentDate={moment(new Date()).add(2, 'days')}
                onSelectDate={onSelectDate}
                globalIndex={globalIndex}
              /> */}
              <Calendar
                minDate={getCurrentDate()}
                maxDate={getFutureDate(3)}
                onDayPress={day => {
                  onSelectDate(day.dateString);
                }}
                theme={{
                  selectedDayBackgroundColor: '#5b6952',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#5b6952',
                  arrowColor: '#5b6952',
                }}
                markedDates={{
                  [selected]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedDotColor: 'orange',
                  },
                }}
              />

              {slots?.length ? (
                <>
                  <Text style={styles.avlHeading}>
                    Slots on {moment(selected).format('LL')}
                  </Text>
                  <View style={styles.slots}>
                    {slots
                      .sort(
                        (a, b) =>
                          moment(a.start_date_time).unix() -
                          moment(b.start_date_time).unix(),
                      )
                      .map((item, index) => (
                        <TouchableOpacity
                          style={[
                            selectedSlot?.id === item.id ||
                            item.status === 'Booked'
                              ? styles.selectedSlot
                              : styles.slot,
                            item.status === 'Booked'
                              ? {opacity: 0.3}
                              : {opacity: 1},
                          ]}
                          onPress={() => onSelectSlot(item)}>
                          <Text
                            style={[
                              selectedSlot?.id === item.id ||
                              item.status === 'Booked'
                                ? styles.selectedSlotText
                                : styles.slotText,
                            ]}>
                            {moment(item.start_date_time).format('hh:mm A')}
                          </Text>
                          <Text
                            style={[
                              selectedSlot?.id === item.id ||
                              item.status === 'Booked'
                                ? styles.selectedSlotText
                                : styles.slotText,
                              {textAlign: 'center', fontSize: 10, marginTop: 2},
                            ]}>
                            {item.status}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </>
              ) : (
                <View>
                  <Text style={styles.avlHeading}>No Slots Available</Text>
                </View>
              )}

              {selectedSlot && packages?.length > 0 ? (
                <>
                  {packages[0].bookings === '0' ? 
                  <>
                  {user.type === 'Old' ? <></>:
                   <ThemeButton2
                   onPress={() => navigation.navigate('Package')}
                   style={{marginTop: 50, borderRadius: 5}}
                   label="Purchase Package"
                 />
                }
                </>:
                  (
                    <>
                      <Text style={styles.avlHeading}>Your Package</Text>
                      <View style={styles.packages}>
                        <TouchableOpacity
                          onPress={() => selectPackage(packages[0])}
                          style={
                            selectedPackage?.id === packages[0].id
                              ? styles.packageItemSelected
                              : styles.packageItem
                          }>
                          <Text
                            style={[
                              styles.ptitle,
                              selectedPackage?.id === packages[0].id
                                ? {color: '#fff'}
                                : {},
                            ]}>
                            {packages[0].name}
                          </Text>
                          <Text
                            style={[
                              styles.pappoint,
                              selectedPackage?.id === packages[0].id
                                ? {color: '#fff'}
                                : {},
                            ]}>
                            {packages[0].bookings} bookings left
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </>
              ) : (
                <></>
              )}

              {selectedPackage ? (
                <>
                 {packages[0].bookings > 0 ? (
                <ThemeButton2
                  onPress={bookAppointMent}
                  style={{marginTop: 50, borderRadius: 5}}
                  label="Book Appointment"
                />
                 ):<></>}
                </>
              ) : (
                <>
                  {selectedSlot &&
                  user.type === 'Old' &&
                  (packages?.length === 0 || packages[0].bookings === '0') ? (
                    <ThemeButton2
                      onPress={checkout}
                      style={{marginTop: 50, borderRadius: 5}}
                      label="Proceed to checkout"
                    />
                  ) : (
                    <>
                      {packages?.length === 0 ? (
                        <ThemeButton2
                          onPress={() => navigation.navigate('Package')}
                          style={{marginTop: 50, borderRadius: 5}}
                          label="Purchase Package"
                        />
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </>
              )}
            </View>
          </ScrollView>
        </LinearGradient>

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
    </>
  );
};
export default Slots;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  packageItem: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    justifyContent: 'space-between',
  },
  packageItemSelected: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    justifyContent: 'space-between',
    backgroundColor: '#5b6952',
  },
  packages: {
    marginTop: 10,
  },
  ptitle: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Gill Sans Medium',
  },
  pappoint: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Gill Sans Medium',
  },
  outerBox: {
    padding: 15,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
  },
  card1: {
    flex: 1,
  },
  slots: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 15,
    gap: 10,
  },
  selectedSlot: {
    backgroundColor: '#5b6952',
    padding: 8,
    borderWidth: 1,
    borderColor: '#BBBEB3',
    fontSize: 12,
    borderRadius: 4,
    overflow: 'hidden',
    color: '#fff',
    fontFamily: 'Gotham-Medium',
  },
  slot: {
    backgroundColor: '#fff',
    padding: 8,
    borderWidth: 1,
    borderColor: '#BBBEB3',
    fontSize: 12,
    borderRadius: 4,
    overflow: 'hidden',
    fontFamily: 'Gotham-Medium',
  },

  selectedSlotText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Gotham-Medium',
  },
  slotText: {
    fontSize: 12,
    fontFamily: 'Gotham-Medium',
  },

  activeSot: {
    backgroundColor: '#5b6952',
    color: '#fff',
  },
  avlHeading: {
    fontSize: 14,
    marginTop: 30,
    fontFamily: 'Gill Sans Medium',
  },
});
