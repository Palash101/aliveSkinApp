import {useNavigation} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { assets } from '../../config/AssetsConfig';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Splash = () => {

  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(1))

  const navigation = useNavigation();

  useEffect(() => {


    setTimeout(() => {
      navigation.navigate("Welcome");
    }, 1000);
  },[])
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#161415" />
      <Animated.Image source={assets.logo} style={[styles.logo,{opacity: fadeAnim}]} />
    </View>
  );
};
export default Splash;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5b6952',
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
    left: 0,
    right: 0,
    top: 0,
    height: 200,
    width: 200,
    bottom: 0,
    zIndex: 2,
    margin:'auto',
    tintColor:'#fff'
  },
});
