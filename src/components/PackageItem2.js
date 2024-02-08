import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../config/AssetsConfig';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import RenderHTML from 'react-native-render-html';

const width = Dimensions.get('window').width;

export const PackageItem2 = props => {
  const {item} = props;
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.packageItem}>
      <View style={[styles.priceBox, {borderColor: '#563925'}]}>
        {item?.tag ? (
          <View style={styles.tagBox}>
            <Text style={[styles.tag]}>{item?.tag}</Text>
          </View>
        ) : (
          <></>
        )}
        <View style={styles.priceTextBox}>
          <Text style={[styles.name]}>{item.name}</Text>
          <Text style={[styles.status]}>{item.bookings} Appointment</Text>
          <View style={styles.description}>
            <RenderHTML
              contentWidth={width - 40}
              source={{html: item.description}}
            />
          </View>
        </View>

        <View style={styles.dayBox}>
          <Text style={styles.day}>{item.price} KD</Text>
          <Text style={styles.dayText}>for {item.days} days</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#563925',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
  },
  description: {
    marginTop: 10,
    marginBottom: 10,
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
    borderRadius: 10,
    overflow: 'hidden',
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
  tagBox: {
    position: 'absolute',
    backgroundColor: '#563925',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    left: -10,
    top: -10,
    borderTopLeftRadius: 8,
  },
  tag: {
    color: '#fff',
    fontFamily: 'Gotham-Medium',
    fontSize: 10,
  },
  name: {
    color: '#000',
    fontFamily: 'Gill Sans Medium',
    fontSize: 22,
    marginTop: -5,
    width:width - 140
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
    borderRadius: 50,
    position:'absolute',
    right:0,
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
    fontSize: 12,
    marginTop: 5,
  },
});
