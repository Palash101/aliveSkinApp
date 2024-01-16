import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Reel = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.bg}>
      <TouchableOpacity
        style={{
          marginLeft: 20,
          marginTop: 50,
          backgroundColor: '#000',
          width: 28,
          height: 28,
          alignItems: 'center',
          borderRadius: 5,
          position: 'absolute',
          zIndex: 99,
        }}
        onPress={() => navigation.goBack()}>
        <Image
          source={assets.back}
          style={{width: 16, height: 16, tintColor: '#fff', marginTop: 5}}
        />
      </TouchableOpacity>
      <Text style={styles.sectionHeading}>Reels</Text>

      <ScrollView
        style={{flex: 1, marginTop: 15, padding: 15, paddingBottom: 150}}>
        <View style={[styles.section, {paddingBottom: 50}]}>
      
       </View>
      </ScrollView>
    </View>
  );
};
export default Reel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Gill Sans Medium',
    marginTop: 55,
    textAlign: 'center',
  },
});
