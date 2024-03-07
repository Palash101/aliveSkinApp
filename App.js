import React, {useCallback, useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ScreenNavigationStack from './src/navigation/ScreenNavigation';
import {ToastProvider} from 'react-native-toast-notifications';
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AuthNavigationStack from './src/navigation/AuthNavigation';
import UserProvider, {UserConsumer} from './context/UserContext';
import {StripeProvider} from '@stripe/stripe-react-native';
import messaging from '@react-native-firebase/messaging';
import {notificationListener, requestUserPermission} from './src/utils/fcm';
// import DetectScreenshot from 'react-native-detect-screenshot';
import * as ScreenshotDetector from 'react-native-screenshot-detect';
import remoteConfig from '@react-native-firebase/remote-config';
import {RoundedGreyButton} from './src/components/Buttons';
import DeviceInfo from 'react-native-device-info';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [updateModal, setUpdateModal] = useState(false);

  useEffect(() => {
    const eventEmitter = ScreenshotDetector.subscribe(() => {
      Alert.alert(
        'For security and privacy reasons, this app restricts the ability to take screenshot.',
      );
    });
    return ScreenshotDetector.unsubscribe(eventEmitter);
  }, []);

  const update = async () => {
    Linking.openURL('https://apps.apple.com/us/app/velo-qatar/id1510547168');
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage, 'remoteMessage');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    checkForUpdate();
    registerAppWithFCM();
    requestUserPermission();
    notificationListener();
  }, []);

  const registerAppWithFCM = async () => {
    await messaging().registerDeviceForRemoteMessages();
  };

  async function checkForUpdate() {
    try {
      await remoteConfig().fetchAndActivate();
      const forceUpdateVersion = remoteConfig()
        .getValue('force_update_version')
        .asString();
      var currentVersion = DeviceInfo.getVersion();
      console.log(currentVersion,forceUpdateVersion,'vv')
      if (forceUpdateVersion > currentVersion) {
        Alert.alert(
          'Update App',
          'Please update your app to the latest version to continue using.',
          [
            {
              text: 'Update',
              onPress: async () => {
                update();
              },
              style: 'cancel',
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    } catch (error) {
      console.error('Error fetching remote config:', error);
    }
  }

  return (
    <>
      <ToastProvider
        offset={50}
        animationType="zoom-in"
        placement="bottom"
        normalColor={'#000'}
        duration={2000}
        textStyle={{paddingRight: 40}}>
        <UserProvider>
          {loading ? (
            <View style={[styles.container, {backgroundColor: '#000'}]}>
              <StatusBar barStyle="light-content" backgroundColor="#161415" />
              <Text>Alive Skin</Text>
            </View>
          ) : (
            <UserConsumer>
              {({auth}) => {
                return (
                  <NavigationContainer>
                    {auth === true && <ScreenNavigationStack />}
                    {!auth && <ScreenNavigationStack />}
                  </NavigationContainer>
                );
              }}
            </UserConsumer>
          )}
        </UserProvider>
      </ToastProvider>

   
    </>
  );
};

export default App;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  modalBox: {
    paddingTop: Platform.OS === 'ios' ? 30 : 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  titleHeading: {
    flexDirection: 'row',
  },
  titleText: {
    paddingHorizontal: 20,
    paddingTop: 20,

    paddingBottom: 10,
    fontSize: 18,
    color: '#161415',
    fontFamily: 'Gotham-Medium',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTotalBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  summeryBox: {
    width: width - 70,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logo: {
    position: 'absolute',
    resizeMode: 'cover',
    left: 0,
    right: 0,
    top: 0,
    height: height,
    width: width,
    bottom: -2,
    zIndex: 2,
  },
});
