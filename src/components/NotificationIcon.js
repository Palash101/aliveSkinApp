import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {assets} from '../config/AssetsConfig';
import {useNavigation} from '@react-navigation/native';

export const NotificationIcon = props => {
  return (
    <TouchableOpacity style={styles.icon} onPress={props.onPress}>
      <View style={styles.numberBox}>
        <Text style={styles.numberText}>3</Text>
      </View>
      <Image source={assets.bell} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginLeft: 20,
    top: 50,
    position: 'absolute',
    right: 20,
  },
  numberBox: {
    position: 'absolute',
    right: -4,
    backgroundColor: '#000',
    paddingHorizontal: 4,
    paddingVertical: 2,
    zIndex: 99,
    borderRadius: 20,
  },
  numberText: {color: '#fff', fontSize: 10, fontFamily: 'Gotham-Medium'},
  image: {width: 24, height: 24, tintColor: '#000', marginTop: 5},
});
