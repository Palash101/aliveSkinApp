import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {VideoButton} from '../Buttons';
import {assets} from '../../config/AssetsConfig';
import LinearGradient from 'react-native-linear-gradient';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const PackageCardSingle = props => {
  console.log(props.active);
  const {item} = props;

  const [colors, setColors] = useState([
    ['#E2D8CF', '#E2D8CF', '#E2D8CF'],
    ['#E2D8CF', '#E2D8CF', '#E2D8CF'],
    ['#E2D8CF', '#E2D8CF', '#E2D8CF'],
    ['#E2D8CF', '#E2D8CF', '#E2D8CF'],
    ['#E2D8CF', '#E2D8CF', '#E2D8CF'],
    ['#E2D8CF', '#E2D8CF', '#E2D8CF'],
    ['#E2D8CF', '#E2D8CF', '#E2D8CF'],
  ]);
  const [activeColor, setActivecolor] = useState([
    '#E2D8CF',
    '#E2D8CF',
    '#E2D8CF',
  ]);

  useEffect(() => {
    if (props.index) {
      setActivecolor(colors[JSON.parse(props.index)]);
    }
  }, []);

  return (
    <TouchableOpacity onPress={props.onPress} style={{position: 'relative'}}>
      <LinearGradient
        colors={activeColor}
        style={styles.card1}></LinearGradient>
      <View style={styles.innerContent}>
        <Text
          style={{
            color: item.color,
            marginLeft: 2,
            marginBottom: 2,
            fontWeight: '600',
            fontSize: 14,
          }}>
          {item?.tag}
        </Text>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subTitle}>{item.bookings} Appointments</Text>
        <Text style={styles.para}>{item.description}</Text>
      </View>
      <View
        style={[
          styles.priceTag,
          {backgroundColor: '#563925', borderColor: activeColor[2]},
        ]}>
        <View style={styles.innerPrice}>
          <Text style={styles.price}>{item.price} KD</Text>
          <Text style={styles.pricePara}>{item.days} DAYS</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PackageCardSingle;
const styles = StyleSheet.create({
  card1: {
    backgroundColor: '#E2D8CF',
    marginRight: 10,
    marginVertical: 10,
    borderRadius: 20,
    height: height - 230,
    width: width - 20,
    overflow: 'hidden',
    padding: 10,
  },
  innerContent: {
    backgroundColor: '#fff',
    height: height - 330,
    marginLeft: 20,
    borderRadius: 20,
    width: width - 40,
    top: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    padding: 10,
  },
  priceTag: {
    position: 'absolute',
    width: 150,
    height: 150,

    borderWidth: 10,
    borderRadius: 150,
    borderColor: '#c673ef',
    textAlign: 'center',
    right: 50,
    bottom: 140,
  },
  innerPrice: {
    borderWidth: 8,
    height: 130,
    width: 130,
    borderRadius: 150,
    borderColor: '#fff',
  },
  price: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 24,
  },
  pricePara: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  title: {
    color: '#000',
    fontWeight: '600',
    fontSize: 24,
    width: '100%',
    position: 'relative',
  },

  subTitle: {
    color: '#563925',
    fontWeight: '600',
    fontSize: 18,
    width: '100%',
    position: 'relative',
    marginTop: 5,
  },
  para: {
    fontSize: 14,
    color: '#333',
    marginTop: 7,
  },
});
