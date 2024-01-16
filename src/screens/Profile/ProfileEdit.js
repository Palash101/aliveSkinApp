import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  DatePickerIOS,
  Platform,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {
  RoundedDarkButton,
  RoundedDefaultButton,
  ThemeButton,
} from '../../components/Buttons';
import {Input} from '../../components/Input/input';
import DateTimePicker from '@react-native-community/datetimepicker';

import moment from 'moment';
import {UserContext} from '../../../context/UserContext';
import {AuthContoller} from '../../controllers/AuthController';
import PageLoader from '../../components/PageLoader';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {ModalView} from '../../components/ModalView';
import {IMAGE_BASE} from '../../config/ApiConfig';
import DatePicker from 'react-native-date-picker';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProfileEdit = () => {
  const navigation = useNavigation();
  const dt = new Date();
  const [loading, setLoading] = useState(false);
  const maxDate = new Date(dt.setFullYear(dt.getFullYear() - 15));
  const [datePicker, setDatePicker] = useState(false);
  const {getToken, getUser} = useContext(UserContext);
  const userCtx = useContext(UserContext);
  const [disable, setDisable] = useState(true);
  const [check, setCheck] = useState(true);
  const [data, setData] = useState({
    name: '',
    email: '',
    gender: '',
    dob: maxDate,
  });
  const [singleFile, setSingleFile] = useState('');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
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
    const userDetail = await getUser();
    console.log(userDetail, 'userrr');
    setData({
      name: userDetail?.name,
      email: userDetail?.email === null ? '' : userDetail.email,
      gender: userDetail?.gender,
      dob: userDetail?.dob === null ? maxDate : userDetail.dob,
    });
    if (userDetail?.image === '' || userDetail?.image === null) {
    } else {
      setImage(IMAGE_BASE + '/' + userDetail?.image);
    }
  };

  const [active, setActive] = useState(0);

  const next = async () => {
    saveData();
  };

  const saveData = async () => {
    setLoading(true);
    const token = await getToken();
    console.log(token);

    let newData = data;
    if (singleFile?.uri) {
      newData.image = {
        uri: singleFile.uri,
        type: singleFile.type,
        name: singleFile.fileName,
      };
    }

    const instance = new AuthContoller();
    const result = await instance.profileUpdate(newData, token);
    userCtx.setUser(result.user);
    console.log(result, 'result');
    navigation.navigate('Home');
    setLoading(false);
  };

  const setName = name => {
    setData({...data, name: name});
    setCheck(!check);
  };
  const setEmail = email => {
    setData({...data, email: email});
    setCheck(!check);
  };

  function showDatePicker() {
    setDatePicker(true);
  }
  function onDateSelected(value) {
    setData({...data, dob: value});
    setCheck(!check);
  }

  const selectOneFile = async () => {
    setOpen(true);
  };

  const openGallery = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      setOpen(false);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        console.log(response, 'response');
        setImage(imageUri);
        setSingleFile(response.assets ? response.assets[0] : response);
      }
    });
  };

  const openCamera = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, response => {
      setOpen(false);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        console.log(response, 'response');
        setImage(imageUri);
        setSingleFile(response.assets ? response.assets[0] : response);
      }
    });
  };

  return (
    <View style={styles.container}>
      <PageLoader loading={loading} />

      <KeyboardAvoidingView behavior="padding">
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{width: width}}>
            <View style={styles.faceBox}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  marginLeft: 0,
                  marginTop: 40,
                }}>
                <Image
                  source={assets.back}
                  style={{
                    width: 16,
                    height: 16,
                    tintColor: '#000',
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'center',
                  marginTop: -20,
                  fontFamily: 'Gotham-Medium',
                }}>
                Profile
              </Text>

              <TouchableOpacity onPress={() => selectOneFile()}>
                {image == '' || image == null ? (
                  <Image
                    source={assets.profile}
                    style={[styles.prImg, {tintColor: '#888'}]}
                  />
                ) : (
                  <Image source={{uri: image}} style={styles.prImg} />
                )}

                <View style={styles.editBox}>
                  <Image source={assets.edit} style={styles.editIcon} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.containerBottom}>
              <Input value={data.name} label={'NAME'} onChang={setName} />

              <Input value={data.email} label={'Email'} onChang={setEmail} />

              <Text
                style={{
                  marginTop: 20,
                  paddingLeft: 10,
                  paddingBottom: 10,
                  fontSize: 12,
                  color: '#333',
                }}>
                GENDER
              </Text>
              <View style={styles.answerBox}>
                <TouchableOpacity
                  onPress={() => setData({...data, gender: 'Female'})}
                  style={[
                    styles.answerItem,
                    data.gender === 'Female' ? styles.activeAnswer : {},
                  ]}>
                  <Text
                    style={[
                      styles.answerText,
                      data.gender === 'Female' ? styles.activeAnswerText : {},
                    ]}>
                    FEMALE
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setData({...data, gender: 'Male'})}
                  style={[
                    styles.answerItem,
                    data.gender === 'Male' ? styles.activeAnswer : {},
                  ]}>
                  <Text
                    style={[
                      styles.answerText,
                      data.gender === 'Male' ? styles.activeAnswerText : {},
                    ]}>
                    MALE
                  </Text>
                </TouchableOpacity>
              </View>

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

              {disable === true ? (
                <RoundedDefaultButton
                  style={styles.button}
                  onPress={() => console.log()}
                  label={'Next'}
                />
              ) : (
                <ThemeButton
                  style={styles.button}
                  onPress={() => next()}
                  label={'Update'}
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
        <>
          <DateTimePicker
            value={data.dob}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={true}
            onChange={onDateSelected}
            maximumDate={maxDate}
            textColor="#333"
          />

        </>
      )} */}

      <ModalView
        visible={open}
        heading=""
        setVisible={() => setOpen(false)}
        style={{
          height: 'auto',
          marginTop: 260,
          justifyContent: 'flex-end',
          marginBottom: 0,
        }}>
        <View style={{paddingHorizontal: '20%', gap: 20, paddingBottom: 40}}>
          <RoundedDarkButton label="Choose from Device" onPress={openGallery} />
          <RoundedDarkButton label="Open Camera" onPress={openCamera} />
        </View>
      </ModalView>
    </View>
  );
};
export default ProfileEdit;

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
  prImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  editBox: {
    backgroundColor: '#000',
    width: 28,
    height: 28,
    borderRadius: 20,
    padding: 5,
    position: 'absolute',
    right: width / 2 + 10,
    marginTop: 100,
  },
  editIcon: {
    tintColor: '#fff',
    width: 18,
    height: 18,
  },
  activeAnswer: {
    backgroundColor: '#E2D8CF',
  },
  answerBox: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,

    flexWrap: 'wrap',
    marginBottom: 20,
    paddingLeft: 10,
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
    height: 250,
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
    alignSelf: 'center',
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
