import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import {IMAGE_BASE} from '../config/ApiConfig';
import {assets} from '../config/AssetsConfig';

const Header_Max_Height = 310;
const Header_Min_Height = 130;

export default function DynamicHeader({animHeaderValue, image, goBack}) {


  
  const animateHeaderBackgroundColor = animHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: ['#dddddd', '#dddddd'],
    extrapolate: 'clamp',
  });

  const animateHeaderHeight = animHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: animateHeaderHeight,
          backgroundColor: animateHeaderBackgroundColor,
        },
      ]}>
      <Image
        source={{uri: IMAGE_BASE + image}}
        resizeMode="cover"
        style={styles.videoCardbg}
      />

      <View style={styles.back}>
        <TouchableOpacity
          style={{
            marginLeft: 15,
            backgroundColor: '#000',
            width: 28,
            height: 28,
            alignItems: 'center',
            borderRadius: 5,
          }}
          onPress={goBack}>
          <Image
            source={assets.back}
            style={{width: 16, height: 16, tintColor: '#fff', marginTop: 5}}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
  },
  videoCardbg: {
    height: '100%',
    width: '100%',
  },
  back: {
    position: 'absolute',
    left: 0,
    top: -5,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 50,
  },
});
