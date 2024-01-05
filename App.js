import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ScreenNavigationStack from './src/navigation/ScreenNavigation';
import {ToastProvider} from 'react-native-toast-notifications';
import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import AuthNavigationStack from './src/navigation/AuthNavigation';
import UserProvider, {UserConsumer} from './context/UserContext';
import { StripeProvider } from '@stripe/stripe-react-native';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <>
      <StripeProvider
        publishableKey="pk_test_51JazH4SFwd8aLJMUiNmiaM2EPvvAvGeI82PBujQfck2kh3Dq7mCozuFKfm6Gpk1Q0xMiI6WpJcXz8Mc1oYsxZRUV00RleLRpSc"
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        merchantIdentifier="merchant.com.aliveskin" // required for Apple Pay
      >
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
                      {!auth && <AuthNavigationStack />}
                    </NavigationContainer>
                  );
                }}
              </UserConsumer>
            )}
          </UserProvider>
        </ToastProvider>
      </StripeProvider>
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
