import {useNavigation} from '@react-navigation/native';
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
import {
  RoundedDefaultButton,
  RoundedGreyButton,
  RoundedGreyButton2,
  ThemeButton,
  ThemeButton2,
} from '../../components/Buttons';
import {Input} from '../../components/Input/input';
// import DatePicker from 'react-native-datepicker';
// import DatePicker from '@react-native-community/datetimepicker';
// import DateTimePicker from '@react-native-community/datetimepicker';

import moment from 'moment';
import {UserContext} from '../../../context/UserContext';
import {AuthContoller} from '../../controllers/AuthController';
import PageLoader from '../../components/PageLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressStepBar from '../../components/ProgressStepBar';
import DatePicker from 'react-native-date-picker';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Questionaries = () => {
  const navigation = useNavigation();
  const dt = new Date();
  const [loading, setLoading] = useState(false);
  const maxDate = new Date(dt.setFullYear(dt.getFullYear() - 15));
  const [datePicker, setDatePicker] = useState(false);
  const {getToken, getUser} = useContext(UserContext);
  const userCtx = useContext(UserContext);
  const [disable, setDisable] = useState(true);
  const [check, setCheck] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserDetail();
  }, []);

  useEffect(() => {
    if (active === 0) {
      if (data.name != '') {
        setDisable(false);
      } else {
        setDisable(true);
      }
    } else if (active === 1) {
      if (data.gender != '') {
        setDisable(false);
      } else {
        setDisable(true);
      }
    } else if (active === 2) {
      if (data.dob != '') {
        setDisable(false);
      } else {
        setDisable(true);
      }
    } else {
      setDisable(true);
    }
  }, [check]);

  const getUserDetail = async () => {
    const token = await getToken();
    if (token) {
      const instance = new AuthContoller();
      const result = await instance.profileDetails(token);
      console.log(result?.user?.name, 'ressss');

      if (result?.user?.name && result.user?.gender) {
        navigation.navigate('Drawer');
        setLoading(false);
      } else {
        setLoading(false);
      }
    } else {
      navigation.navigate('Drawer');
    }
  };

  const [active, setActive] = useState(0);
  const questions = [
    'What is your Name?',
    'What is your Gender?',
    'What is your Date of Birth?',
  ];

  const [data, setData] = useState({
    name: '',
    gender: '',
    dob: maxDate,
  });

  const next = async () => {
    if (active === 2) {
      console.log(data, 'data');
      saveData();
    } else {
      setActive(active + 1);
    }
  };

  const saveData = async () => {
    setLoading(true);
    const token = await getToken();
    console.log(data,'dobb');


    const instance = new AuthContoller();
    const result = await instance.profileUpdate(data, token);
    userCtx.setUser(result.user);
    console.log(result, 'result');
    setTimeout(() => {
      navigation.navigate('Drawer');
      setLoading(false);
    },2000)
   
  };

  const setName = name => {
    setData({...data, name: name});
    setCheck(!check);
  };

  function showDatePicker() {
    setDatePicker(true);
  }
  function onDateSelected(value) {
    console.log(value,'value')
    setData({...data, dob: value});
    setCheck(!check);
  }

  return (
    <>
      {loading === true ? (
        <PageLoader loading={loading} />
      ) : (
        <View style={styles.container}>
          <ProgressStepBar total={3} step={active + 1} />


          <KeyboardAvoidingView behavior='padding'>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={{width: width}}>
                <View style={styles.faceBox}>
                  {active > 0 ? (
                    <TouchableOpacity
                      style={styles.backBox}
                      onPress={() => setActive(active - 1)}>
                      <Image source={assets.back} style={styles.backIcon} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.backBox1}></TouchableOpacity>
                  )}

                  <Text style={styles.title}>
                    Hey, Help us with some quick questions
                  </Text>
                  <Image source={assets.qbg} style={styles.logo} />
                  <Text style={styles.label}>{questions[active]}</Text>
                </View>

                <View style={styles.containerBottom}>
                  {active === 0 && (
                    <Input
                      value={data.name}
                      label={'Enter your name'}
                      onChang={setName}
                    />
                  )}
                  {active === 1 && (
                    <View style={styles.answerBox}>
                      <TouchableOpacity
                        onPress={() => setData({...data, gender: 'female'})}
                        style={[
                          styles.answerItem,
                          data.gender === 'female' ? styles.activeAnswer : {},
                        ]}>
                        <Text
                          style={[
                            styles.answerText,
                            data.gender === 'female' ? styles.activeAnswerText : {},
                          ]}>
                          FEMALE
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setData({...data, gender: 'male'})}
                        style={[
                          styles.answerItem,
                          data.gender === 'male' ? styles.activeAnswer : {},
                        ]}>
                        <Text
                          style={[
                            styles.answerText,
                            data.gender === 'male' ? styles.activeAnswerText : {},
                          ]}>
                          MALE
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {active === 2 && (
                    <View style={{position: 'relative'}}>
                      <Text
                        style={{
                          paddingTop: 15,
                          fontSize: 12,
                          color: '#333',
                          marginLeft: 15,
                        }}>
                        BIRTH DATE
                      </Text>
                      <View style={{marginTop: -25}}>
                        <TouchableOpacity
                          style={{
                            height: 50,
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 10,
                            zIndex: 999,
                          }}
                          onPress={() => showDatePicker()}></TouchableOpacity>
                        <Input
                         value={moment(data.dob).format("YYYY-MM-DD")}
                          onChangeText={() => console.log('')}
                          label={' '}
                          disabled={true}
                        />
                      </View>
                     
                    </View>
                  )}

                  {disable === true ? (
                    <RoundedDefaultButton style={styles.button} label={'Next'} />
                  ) : (
                    <ThemeButton
                      style={styles.button}
                      onPress={() => next()}
                      label={'Next'}
                    />
                  )}
                </View>
              </View>
            </ScrollView>
            <DatePicker
              modal
              open={datePicker}
              mode="date"
              date={new Date(data.dob)}
              onConfirm={date => {
                setDatePicker(false);
                onDateSelected(date);
              }}
              onCancel={() => {
                setDatePicker(false);
              }}
            />
          </KeyboardAvoidingView>



          {/* {datePicker && (
            <DateTimePicker
              value={data.dob}
              mode={'date'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              is24Hour={true}
              onChange={onDateSelected}
              maximumDate={maxDate}
              textColor="#333"
            />
          )} */}
        </View>
      )}
    </>
  );
};
export default Questionaries;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    textAlign: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  activeAnswer: {
    backgroundColor: '#E2D8CF',
  },
  logo: {
    width: width - 100,
    height: height - 610,
    alignSelf: 'center',
  },
  answerBox: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    marginTop: 40,
    flexWrap: 'wrap',
  },
  answerItem: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  answerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  otpBox: {
    marginTop: 40,
    width: 250,
  },
  label: {
    color: '#000',
    position: 'absolute',
    bottom: 20,
    fontFamily: 'Gotham-Medium',
    left: 20,
    fontWeight: '700',
    fontSize: 22,
  },
  label1: {
    color: '#000',
    position: 'absolute',
    bottom: 60,
    fontFamily: 'Gotham-Medium',
    left: 20,
    fontSize: 12,
  },
  containerBottom: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputBox: {
    backgroundColor: '#ddd',
    marginTop: 40,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 6,
    padding: 6,
  },
  backBox1: {
    marginTop: 50,
    backgroundColor: '#000',
    width: 80,
    height: 8,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBox: {
    marginTop: 50,
    backgroundColor: '#000',
    width: 42,
    height: 42,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    tintColor: '#fff',
    width: 24,
    height: 24,
  },
  bottomTextBox: {
    marginTop: 20,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bottomText: {
    fontSize: 10,
  },
  bottomTextBold: {
    fontSize: 10,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  faceBox: {
    height: height - 350,
    backgroundColor: '#E2D8CF',
    paddingBottom: 60,
    width: width,
    padding: 20,
  },
  faceImage: {
    width: width,
    height: height / 1.6,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    textTransform: 'uppercase',
    textAlign: 'left',
    fontWeight: '800',
    marginBottom: 10,
    lineHeight: 32,
    color: '#000',
  },
  bold: {
    fontWeight: '700',
  },
  checkImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#563925',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  listText: {
    fontFamily: 'Gill Sans Medium',
    fontSize: 16,
  },
  button: {
    marginTop: 40,
    width: 150,
  },
  listBox: {
    backgroundColor: 'rgba(226,216,207,0.6)',
    padding: 25,
    borderRadius: 20,
    marginTop: -100,
  },
  countryPicker: {
    width: width - 170,
    marginLeft: 5,
    backgroundColor: 'transparent',
    color: '#000000',
    textTransform: 'uppercase',
    fontSize: 16,
    fontFamily: 'Gotham-Medium',
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
});
