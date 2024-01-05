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

const Rewads = () => {
  const activeColor = ['#f2f2f2', '#ddd', '#babdb2'];
  const activeColor2 = [
    'rgba(225,215,206,1)',
    'rgba(225,215,206,0.4)',
    'rgba(225,215,206,0)',
  ];
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={assets.rewardbg}
        resizeMode="cover"
        style={styles.videoCardbg}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={activeColor2}
          style={styles.videoCardbg1}></LinearGradient>

        <View>
          <View style={{display: 'flex', flexDirection: 'row', marginTop: 50}}>
            <TouchableOpacity
              style={{
                marginLeft: 15,
                backgroundColor: '#000',
                width: 28,
                height: 28,
                alignItems: 'center',
                borderRadius: 5,
              }}
              onPress={() => navigation.navigate('Home')}>
              <Image
                source={assets.back}
                style={{width: 16, height: 16, tintColor: '#fff', marginTop: 5}}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.avlHeading}>Get up to 100 Points!</Text>
          <Text style={styles.avlPara}>Invite Friends to Alive Skin Now!</Text>
          <TouchableOpacity style={styles.inviteBtn}>
            <Text style={styles.inviteText}>Invite Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <LinearGradient colors={activeColor} style={styles.card1}>
        <ScrollView contentContainerStyle={{flex: 1, padding: 20}}>
          <View style={styles.box}>
            <Text style={styles.boxHeading}>Get 15 Points on registration</Text>
            <Text style={styles.boxPara}>
              Get Register and complete your profile and get 15 points.
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxHeading}>
              Get 25 Points on your 1st appointment.
            </Text>
            <Text style={styles.boxPara}>
              Book your 1st appointment and get 25 points.
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxHeading}>
              Get 20 Points on your 1st purchase.
            </Text>
            <Text style={styles.boxPara}>
              Purchase any product and get 20 points.
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxHeading}>
              Get up to 100 points on package purchase.
            </Text>
            <Text style={styles.boxPara}>
              Purchase a package and chanse to win up to 100 points.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};
export default Rewads;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    backgroundColor: '#fff',
    margin: 10,
    borderColor: '#f1f1f1',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  boxHeading: {
    marginBottom: 5,
    color: '#563925',
    fontFamily: 'Gill Sans Medium',
  },
  boxPara: {
    color: '#333',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Gill Sans Medium',
  },
  videoCardbg1: {
    flex: 1,
    height: 300,
    position: 'absolute',
    zIndex: 0,
    top: 0,
    left: 0,
    right: 0,
  },

  inviteBtn: {
    backgroundColor: '#563925',
    width: 100,
    marginLeft: 15,
    padding: 5,
    borderRadius: 15,
  },
  inviteText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Gill Sans Medium',
  },
  videoCardbg: {
    flex: 1,
    padding: 10,
    height: 270,
  },
  card1: {
    flex: 1,
    marginTop: -350,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  avlHeading: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: '600',
    paddingLeft: 15,
    color: '#563925',
    fontFamily: 'Gill Sans Medium',
  },
  avlPara: {
    fontSize: 14,
    marginBottom: 20,
    marginTop: 5,
    paddingLeft: 15,
    color: '#333',
    fontFamily: 'Gill Sans Medium',
  },
});
