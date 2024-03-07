import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Welcome from '../screens/Auth/Welcome';
import Login from '../screens/Auth/Login';
import Verify from '../screens/Auth/Verify';

import {Dimensions, Platform, StyleSheet, Text, View} from 'react-native';
import Questionaries from '../screens/Questionaries';
import DrawerNavigation from './DrawerNavigation';
import Terms from '../screens/Terms';
import ScreenNavigationStack from './ScreenNavigation';
import Splash from '../screens/Auth/Splash';

const width = Dimensions.get('window').width;

function LogoTitle() {
  return (
    <View style={styles.container}>
      <Text>Alive Skin</Text>
      {/* <Image source={assets.logo} style={{width: 60, height: 24}} /> */}
    </View>
  );
}
const AuthNavigationStack = ({navigation}) => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
       <Stack.Screen
        name={'Splash'}
        component={Splash}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={'Welcome'}
        component={Welcome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Login'}
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Verify'}
        component={Verify}
        options={{
          headerShown: false,
        }}
      />
        <Stack.Screen
        name={'Questionaries'}
        component={Questionaries}
        options={{
          headerShown: false
        }}
      />
       <Stack.Screen
        name={'Drawer'}
        component={DrawerNavigation}
        options={{
          headerShown: false,
          cardStyle: {backgroundColor: '#ffffff'},
        }}
      />

    </Stack.Navigator>
  );
};

export default AuthNavigationStack;

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === 'android' ? width - 30 : width - 138,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
