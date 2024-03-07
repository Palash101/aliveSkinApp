import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {ThemeButton2} from '../../components/Buttons';
import {CountryPicker} from 'react-native-country-codes-picker';
import {OtpInput} from 'react-native-otp-entry';
import {UserContext} from '../../../context/UserContext';
import auth from '@react-native-firebase/auth';
import {AuthContoller} from '../../controllers/AuthController';
import PageLoader from '../../components/PageLoader';
import {useToast} from 'react-native-toast-notifications';
import {SafeAreaView} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Login = () => {
  const navigation = useNavigation();
  const [countryPicker, setCountryPicker] = useState(false);
  const [phone, setPhone] = useState('');
  const [selectedFlag, setSelectedFlag] = useState('');
  const [code, setCode] = useState('+346');
  const [otpView, setOtpView] = useState(false);
  const [otp, setOTP] = useState();
  const userCtx = useContext(UserContext);
  const {setAuth} = useContext(UserContext);
  const {setToken} = useContext(UserContext);
  const [confirmation, setConfirmation] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const loginClick = async () => {
    if (phone) {
      setLoading(true);
      try {
        const result = await auth().signInWithPhoneNumber(code + phone);
        // Save the confirmation result for later use
        console.log(result, 'login');
        setConfirmation(result);
        setOtpView(true);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.show('invalid phone number');
        setLoading(false);
        // Handle error
      }
    }
  };

  const verifyOtp = async () => {
    if (otp && otp.length === 6) {
      setLoading(true);
      try {
        const result = await confirmation.confirm(otp);
        console.log(result);
        const instance = new AuthContoller();
        const responce = await instance.login(code + phone, result.user.uid);
        console.log(responce, 'responce');
        setLoading(false);
        userCtx.setUser(responce.user);
        setToken(responce.token);
        setAuth(true);
        navigation.navigate('Questionaries');
      } catch (error) {
        setLoading(false);
        toast.show('incorrect OTP');
        // Handle error (e.g., incorrect OTP)
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <PageLoader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {otpView === true ? (
          <View style={{width: width}}>
            <View style={styles.faceBox}>
              <TouchableOpacity
                style={styles.backBox}
                onPress={() => setOtpView(false)}>
                <Image source={assets.back} style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.title}>Verify your mobile number</Text>
              <Image source={assets.enter_otp} style={styles.logo} />
              <Text style={styles.label}>
                We have sent a 6-digit code to your mobile number{' '}
                {code + ' ' + phone}
              </Text>
            </View>

            <View style={styles.containerBottom}>
              <View style={styles.otpBox}>
                <OtpInput
                  numberOfDigits={6}
                  focusColor="#161415"
                  onTextChange={text => setOTP(text)}
                  theme={{
                    inputsContainerStyles: {
                      height: 24,
                      backgroundColor: '#ddd',
                    },
                  }}
                />
              </View>

              <ThemeButton2
                style={styles.button}
                onPress={() => verifyOtp()}
                label={'Proceed'}
              />
              <View style={styles.bottomTextBox}>
                <Text style={styles.bottomText}>
                  By proceeding, you consent to share your information with
                  Alive Skin and agree to Alive Skin's{' '}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Terms')}>
                    <Text style={styles.bottomTextBold}>Privacy Policy</Text>
                  </TouchableOpacity>
                  <Text style={styles.bottomText}> and </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Terms')}>
                    <Text style={styles.bottomTextBold}>Terms of Service</Text>
                  </TouchableOpacity>
                </Text>
               
              </View>
            </View>
          </View>
        ) : (
          <View style={{width: width}}>
            <View style={styles.faceBox}>
              <TouchableOpacity
                style={styles.backBox}
                onPress={() => navigation.navigate('Welcome')}>
                <Image source={assets.back} style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.title}>Start your healthy skin journey</Text>
              <Image source={assets.mobile_enter} style={styles.logo} />
              <Text style={styles.label}>
                Enter your mobile number to log in
              </Text>
            </View>

            <View style={styles.containerBottom}>
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

              <ThemeButton2
                style={styles.button}
                onPress={() => loginClick()}
                label={'Proceed'}
              />
              <View style={styles.bottomTextBox}>
                <Text style={styles.bottomText}>
                  By proceeding, you consent to share your information with
                  Alive Skin and agree to Alive Skin's{' '}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Terms')}>
                    <Text style={styles.bottomTextBold}>Privacy Policy</Text>
                  </TouchableOpacity>
                  <Text style={styles.bottomText}> and </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Terms')}>
                    <Text style={styles.bottomTextBold}>Terms of Service</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('Drawer')}
          style={{marginTop: 20, alignSelf: 'center'}}>
          <Text style={{fontFamily: 'Gotham-Medium'}}>Skip Now</Text>
        </TouchableOpacity>

        <CountryPicker
          show={countryPicker}
          pickerButtonOnPress={item => {
            setSelectedFlag(item.flag);
            setCode(item.dial_code);
            setCountryPicker(false);
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default Login;

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
    flex: 1,
  },
  logo: {
    width: width - 50,
    height: height - 610,
    alignSelf: 'center',
  },
  otpBox: {
    marginTop: 40,
    width: width - 50,
  },
  label: {
    color: '#000',
    position: 'absolute',
    bottom: 12340,
    fontFamily: 'Gotham-Medium',
    left: 20,
  },
  containerBottom: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputBox: {
    backgroundColor: '#ddd',
    marginTop: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 6,
    padding: 6,
  },
  backBox: {
    marginTop: 50,
    backgroundColor: '#000',
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    tintColor: '#fff',
    width: 16,
    height: 16,
  },
  bottomTextBox: {
    marginTop: 20,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bottomText: {
    fontSize: 12,
    fontFamily: 'Gill Sans Medium',
    lineHeight: 16,
  },
  bottomTextBold: {
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: 'Gill Sans Medium',
  },
  faceBox: {
    height: height - 350,
    backgroundColor: '#fff',
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
    fontWeight: '600',
    marginBottom: 10,
    lineHeight: 32,
    color: '#000',
    fontFamily: 'Gill Sans Medium',
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
    width: '100%',
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
