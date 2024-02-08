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

const PackageCard = props => {
  console.log(props.active);
  const {item} = props;

  const [colors, setColors] = useState([
    // ['#5b6952', '#5b6952', '#5b6952'],
    // ['#f9a501', '#f66114', '#f54141'],
    // ['#31a7f0', '#238aef', '#1169eb'],
    // ['#8ba7fb', '#a483f9', '#c673ef'],
    // ['#8ba7fb', '#a483f9', '#c673ef'],
    // ['#8ba7fb', '#a483f9', '#c673ef'],
    // ['#8ba7fb', '#a483f9', '#c673ef'],
    // ['#8ba7fb', '#a483f9', '#c673ef'],
    // ['#8ba7fb', '#a483f9', '#c673ef'],
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
    <TouchableOpacity onPress={props.onPress} style={styles.card1}>
      <View style={styles.innerContent}>
        {item?.tag &&
        <View style={styles.tags}>
          <Text style={styles.tag}>{item?.tag}</Text>
        </View>
        }
        <Text style={styles.title}>{item?.name}</Text>
        <Text style={styles.subTitle}>{item?.bookings} Appointments</Text>
        <Text style={styles.price}>{item?.price} KD</Text>
        <Text style={styles.pricePara}>{item?.days} DAYS</Text>
        <View style={styles.btn1}>
          <Text style={styles.btnText}>Get Started</Text>
        </View>
      </View>
     
    </TouchableOpacity>
  );
};

export default PackageCard;
const styles = StyleSheet.create({
  card1: {
    backgroundColor: 'transparent',
    marginRight: 10,
    marginVertical: 10,
    borderRadius: 10,
    height: 210,
    width: width / 2 - 30,
    overflow: 'hidden',
    padding: 10,
  },
  tags: {
    // backgroundColor: '#563925',
    paddingHorizontal: 5,
    overflow: 'hidden',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    paddingLeft: 10,
    textTransform: 'uppercase',
    borderWidth:1,
    borderTopWidth:0,
    alignSelf:'center',
    alignItems:'center',
    margin:'auto',
    width:'auto',
    marginTop:-10,
    borderColor:'#563925'

  },
  tag: {
    lineHeight: 24,
    fontWeight: '600',
    fontSize: 12,
    color: '#563925',
    fontFamily: 'Gill Sans Medium',
  },
  innerContent: {
    backgroundColor: '#fff',
    height: 210,
    marginLeft: 0,
    borderRadius: 10,
    width: width / 2 - 30,
    top: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    padding: 10,
    overflow: 'hidden',
  },
  priceTag: {
    position: 'absolute',
    width: 100,
    height: 100,

    borderWidth: 5,
    borderRadius: 50,
    borderColor: '#c673ef',
    textAlign: 'center',
    right: 0,
    left: (width / 2 - 30) / 2 - 50,
    bottom: 10,
  },
  price: {
    color: '#563925',
    fontWeight: '600',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 18,
    fontFamily: 'Gill Sans Medium',
  },
  pricePara: {
    color: '#563925',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Gill Sans Medium',
    textAlign: 'center',
  },

  title: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
    width: '100%',
    position: 'relative',
    textTransform: 'uppercase',
    marginTop: 10,
    fontFamily: 'Gill Sans Medium',
    textAlign: 'center',
  },

  subTitle: {
    color: '#808080',
    fontWeight: '600',
    fontSize: 12,
    width: '100%',
    position: 'relative',
    marginTop: 5,
    fontFamily: 'Gill Sans Medium',
    textAlign: 'center',
  },
  para: {
    fontSize: 12,
    color: '#333',
    marginTop: 7,
    fontFamily: 'Gill Sans Medium',
  },
  btn1:{
    backgroundColor: '#563925',
    position:'absolute',
    left:10,bottom:10,
    right:10,
    borderRadius:6,
    padding:5
  },
  btnText:{
    textAlign:'center',
    color:'#fff',
    fontFamily:'Gill Sans Medium'
  }
});
