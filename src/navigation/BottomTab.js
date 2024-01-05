import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';

import {Image, Platform, Text, View} from 'react-native';

import {bottomMenu} from '../data/bottomMenu';
import Ripple from 'react-native-material-ripple';
import {assets} from '../config/AssetsConfig';
import Profile from '../screens/Profile';
import Rewads from '../screens/Rewards';
import Blogs from '../screens/Blogs';
import Product from '../screens/Product';

const Tab = createBottomTabNavigator();

const BottomTab = ({navigation}) => {
  return (
    <View style={{display: 'flex', flex: 1}}>
      <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen
          name={bottomMenu[0].name}
          component={Home}
          options={{
            tabBarLabel: bottomMenu[0].label,
            headerShown: false,
          }}
        />

        <Tab.Screen
          name={bottomMenu[1].name}
          component={Product}
          options={{
            tabBarLabel: bottomMenu[1].label,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name={bottomMenu[2].name}
          component={Rewads}
          options={{
            tabBarLabel: bottomMenu[2].label,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name={bottomMenu[3].name}
          component={Blogs}
          options={{
            headerShown: false,
            tabBarLabel: bottomMenu[2].label,
          }}
        />
        <Tab.Screen
          name={bottomMenu[4].name}
          component={Profile}
          options={{
            headerShown: false,
            tabBarLabel: bottomMenu[3].label,
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

function MyTabBar({state, navigation}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
      }}>
      {bottomMenu.map((route, index) => {
        let {label, inActive, active, name} = route;
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused && !!name) {
            navigation.navigate(name);
          }
        };

        return (
          <Ripple
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            onPress={onPress}
            style={{
              flex: 1,
              paddingTop: 10,
              paddingBottom: Platform.OS === 'ios' ? 20 : 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopWidth: 4,
              borderColor: isFocused ? '#563925' : '#fff',

            }}>
            <Image
              source={active}
              style={{
                tintColor: isFocused ? '#563925' : '#a7a9ac',
                width: 16,
                height: 16,
                marginBottom: 4,
              }}
            />
            {!!label && (
              <Text
                style={{
                  color:  isFocused ? '#563925' : '#a7a9ac',
                  fontSize: 10,
                  marginTop: 4,
                  fontWeight: isFocused ? '600' : '400',
                  fontFamily: 'Gill Sans Medium',
                }}>
                {label}
              </Text>
            )}
          </Ripple>
        );
      })}
    </View>
  );
}

export default BottomTab;
