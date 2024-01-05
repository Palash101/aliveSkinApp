import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {DarkButton, ThemeButton} from '../../components/Buttons';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.faceBox}>
        <Image source={assets.face} style={styles.faceImage} />
      </View>
      {/* <View style={{backgroundColor:'#ddd',
    width:width,borderTopLeftRadius:20,
    borderTopRightRadius:20,marginTop:-30,display:'flex'}}> */}
      <View style={styles.listBox}>
        <Text style={styles.title}>Welcome to Alive Skin</Text>
        <View style={styles.listItem}>
          <Image source={assets.check} style={styles.checkImage} />
          <Text style={styles.listText}>
            {' '}
            <Text style={styles.bold}>Free analysis</Text> of skin & hair
          </Text>
        </View>
        <View style={styles.listItem}>
          <Image source={assets.check} style={styles.checkImage} />
          <Text style={styles.listText}>
            Coach given <Text style={styles.bold}>treatment kit</Text>
          </Text>
        </View>
        <View style={styles.listItem}>
          <Image source={assets.check} style={styles.checkImage} />
          <Text style={styles.listText}>
            Free monthly <Text style={styles.bold}> checkup</Text>
          </Text>
        </View>
      </View>
      <ThemeButton
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
        label={'Get Started'}
      />
      {/* </View> */}
    </View>
  );
};
export default Welcome;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    textAlign: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  faceBox: {
    height: height,
    backgroundColor: '#efb0ba',
    paddingBottom: 60,
  },
  faceImage: {
    width: width,
    height: height,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: '#563925',
    fontFamily: 'Gill Sans Medium',
  },
  bold: {
    fontWeight:'600',
    fontFamily: 'Gill Sans Medium',
  },
  checkImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#563925',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  listText: {
    fontSize: 16,
    fontFamily: 'Gill Sans Medium',
  },
  button: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#efb0ba',
  },
  listBox: {
    backgroundColor: 'rgba(239,176,186,0.6)',
    padding: 25,
    borderRadius: 20,
    marginTop: -100,
    width: 300,
    position: 'absolute',
    bottom: 120,
  },
});
