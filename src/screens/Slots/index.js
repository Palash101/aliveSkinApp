import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Calendar from '../../components/calendar/Calendar';
import {ThemeButton, ThemeButton2} from '../../components/Buttons';
import moment from 'moment';
import {UserContext} from '../../../context/UserContext';
import {VideoController} from '../../controllers/VideoController';
import {ScheduleController} from '../../controllers/ScheduleController';
import {PackageController} from '../../controllers/PackageController';
import PageLoader from '../../components/PageLoader';
import {useToast} from 'react-native-toast-notifications';

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
  const {getToken} = useContext(UserContext);

  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onSelectDate(moment(), 0);
      setGlobalIndex(0);
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
    } else {
      setSelectedSlot();
    }
  };

  const getSlots = async () => {
    const token = await getToken();
    console.log(token, 'token');
    if (token) {
      const instance = new ScheduleController();
      const result = await instance.AllSchedule(token);
      setAllSots(result.schedules);

      var dt = moment().format('YYYY-MM-DD');
      const filterData = result.schedules.filter(item =>
        moment(item.start_date_time, 'YYYY-MM-DD').isSame(dt),
      );
      console.log(filterData, 'filterDatafilterData');
      setSlots(filterData);
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

  const onSelectDate = (date, i) => {
    console.log(date, 'ddd');
    setLoading(true);
    var dt = moment(date).format('YYYY-MM-DD');

    const filterData = allSlots.filter(item =>
      moment(item.start_date_time, 'YYYY-MM-DD').isSame(dt),
    );
    setGlobalIndex(i);
    setSlots(filterData);
    setLoading(false);
  };

  const selectPackage = async item1 => {
    console.log(item1);
    setSelectedPackage(item1);
  };

  const bookAppointMent = async () => {
    const token = await getToken();
    console.log(token, 'token');
    if (token) {
      setLoading(true);
      const instance = new ScheduleController();
      const result = await instance.bookNow(
        selectedSlot?.id,
        selectedPackage?.id,
        token,
      );
      console.log(result, 'result');
      if (result.status === 'success') {
        toast.show(result.msg);
        navigation.navigate('home')
        setLoading(false);
      } else {
        toast.show(result.msg);
        setLoading(false);
      }
    }
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
              }}
              onPress={() => navigation.navigate('Home')}>
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
              <Calendar onSelectDate={onSelectDate} globalIndex={globalIndex} />

              {slots?.length ? (
                <>
                  <Text style={styles.avlHeading}>Available Slots</Text>
                  <View style={styles.slots}>
                    {slots?.map((item, index) => (
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
                          {moment(item.start_date_time).format('HH:mm A')}
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

              {selectedSlot && (
                <>
                  <Text style={styles.avlHeading}>Select Package</Text>
                  <View style={styles.packages}>
                    {packages?.map((item1, index) => (
                      <TouchableOpacity
                        onPress={() => selectPackage(item1)}
                        style={
                          selectedPackage?.id === item1.id
                            ? styles.packageItemSelected
                            : styles.packageItem
                        }>
                        <Text
                          style={[
                            styles.ptitle,
                            selectedPackage?.id === item1.id
                              ? {color: '#fff'}
                              : {},
                          ]}>
                          {item1.name}
                        </Text>
                        <Text
                          style={[
                            styles.pappoint,
                            selectedPackage?.id === item1.id
                              ? {color: '#fff'}
                              : {},
                          ]}>
                          {item1.bookings} bookings left
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {selectedPackage && (
                <ThemeButton2
                  onPress={bookAppointMent}
                  style={{marginTop: 50, borderRadius: 5}}
                  label="Book Appointment"
                />
              )}
            </View>
          </ScrollView>
        </LinearGradient>
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
    backgroundColor: '#6A6C61',
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
    backgroundColor: '#6A6C61',
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
    backgroundColor: '#6A6C61',
    color: '#fff',
  },
  avlHeading: {
    fontSize: 14,
    marginTop: 30,
    fontFamily: 'Gill Sans Medium',
  },
});
