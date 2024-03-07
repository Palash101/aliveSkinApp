import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {assets} from '../config/AssetsConfig';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

export const PackageItem = props => {
  const {item} = props;
  return (
    <View style={styles.packageItem}>
      <View style={[styles.priceBox, {borderColor: '#563925'}]}>
        {moment(item.expire_date).diff(moment(), 'days') >= 0 ? (
          <Text style={[styles.tag]}>ACTIVE PACKAGE</Text>
        ) : (
          <Text style={[styles.tag]}>Expired</Text>
        )}
        <View style={styles.priceTextBox}>
          <Text style={[styles.name]}>{item.name}</Text>
          <Text style={[styles.status]}>{item?.bookings} Appointment left</Text>
        </View>
        {moment(item.expire_date).diff(moment(), 'days') >= 0 ? (
          <View style={styles.dayBox}>
            <Text style={styles.expireText}>Expired in</Text>
            <Text style={styles.day}>
              {moment(item.expire_date).diff(moment(), 'days') + 1}
            </Text>
            <Text style={styles.dayText}>Days</Text>
          </View>
        ) : (
          <View>
            <TouchableOpacity style={styles.btn} onPress={props.upgrade}>
              <Text style={styles.btnText}>UPGRADE</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#563925',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
  },
  btnText: {
    color: '#fff',
    fontFamily: 'Gotham-Medium',
  },
  packageItem: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 20,
  },

  tag: {
    position: 'absolute',
    backgroundColor: '#563925',
    color: '#fff',
    fontFamily: 'Gotham-Medium',
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    left: -10,
    top: -10,
  },
  name: {
    color: '#000',
    fontFamily: 'Gill Sans Medium',
    fontSize: 22,
    marginTop: 5,
  },
  status: {
    color: '#000',
    fontFamily: 'Gill Sans Medium',
    fontSize: 14,
    marginTop: 0,
    paddingTop: 4,
    paddingLeft: 2,
  },
  dayBox: {
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#563925',
    width: 80,
    height: 80,
    borderRadius: 50,
    marginTop: -20,
  },
  expireText: {
    fontFamily: 'Gotham-Medium',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 16,
  },
  day: {
    fontSize: 26,
    fontFamily: 'Gotham-Black',
    textAlign: 'center',
    color: '#563925',
    lineHeight: 26,
  },
  dayText: {
    fontFamily: 'Gotham-Medium',
    textAlign: 'center',
    fontSize: 10,
  },
});
