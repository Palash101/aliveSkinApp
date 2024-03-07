import moment from 'moment';
import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const AppointmentCard = props => {
  const {item} = props;
  return (
    <View style={styles.bookingBox}>
      <View style={styles.bookingBox2}>
        <View style={{flexDirection: 'row'}}>
        {item?.status != 'Cancelled' ? (
          <View style={{paddingVertical: 6, paddingLeft: 5, paddingRight: 15}}>
            <TouchableOpacity
              onPress={() => props.goChat(item)}
              style={styles.detail}>
              <Image source={assets.comment} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>
        ):<View style={{paddingVertical: 6,width:37, paddingLeft: 5, paddingRight: 15}}>
       
      </View>}
          <View>
            <Text style={styles.date}>{moment(item.date).format('DD')}</Text>
          </View>
          <View style={styles.monthBox}>
            <Text style={styles.month}>{moment(item.date).format('MMM')}</Text>
            <Text style={styles.year}>{moment(item.date).format('YYYY')}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 14, marginTop: 5, fontWeight: '600'}}>
              @ {moment(item.date).format('hh:mm A')}
            </Text>
          </View>
        </View>

        {item?.status === 'Cancelled' ? (
          <Text style={styles.status}>Cancelled</Text>
        ) : (
          <View>
            {props?.upcoming === true && item.type === 'Package' ? (
              <TouchableOpacity onPress={() => props.Cancel(item)}>
                <Text style={styles.detailText}>Cancel</Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        )}
      </View>
    
    </View>
  );
};

export default AppointmentCard;
const styles = StyleSheet.create({
  bookingBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#5b6952',
    overflow: 'hidden',
    marginVertical: 5,
  },
  status: {
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontFamily: 'Gotham-Medium',
    backgroundColor:'#000'
  },
  detailText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontFamily: 'Gotham-Book',
    marginBottom: 5,
  },
  bookingBox2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  monthBox: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  bidBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bid: {
    fontFamily: 'Gotham-Medium',
    fontSize: 12,
  },
  date: {
    fontFamily: 'Gotham-Black',
    textAlign: 'center',
    fontSize: 28,
    width: 40,
  },
  month: {
    fontFamily: 'Gotham-Book',
    textAlign: 'left',
    textTransform: 'uppercase',
    width:35,
  },
  year: {
    marginTop: 2,
    fontFamily: 'Gotham-Boook',
    textAlign: 'left',
    textTransform: 'uppercase',
    width:35,
  },
  at: {
    marginTop: 5,
    fontFamily: 'Gotham-Medium',
    textAlign: 'center',
  },
  time: {
    fontFamily: 'Gotham-Medium',
    textAlign: 'center',
    fontSize: 12,
  },
});
