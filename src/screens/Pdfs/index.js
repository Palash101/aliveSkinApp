import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {UserContext} from '../../../context/UserContext';
import {useNavigation} from '@react-navigation/native';
import {HomeController} from '../../controllers/HomeController';
import ActivityCard1 from '../../components/Card/ActivityCard1';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Pdfs = () => {
  const {getToken, getUser} = useContext(UserContext);
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    getUserDetail();
    getPdfs();
  }, []);

  const getUserDetail = async () => {
    const res = await getUser();
    setUser(res);
  };

  const getPdfs = async () => {
    const instance = new HomeController();
    const allPdfsData = await instance.AllPdfs();
    setPdfs(allPdfsData?.pdf);
  };

  const goToProgram = () => {
    navigation.navigate('PdfDetail');
  };

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
      <Text style={styles.sectionHeading}>Personal programs in Documents</Text>

      <ScrollView
        style={{flex: 1, marginTop: 15, padding: 15, paddingBottom: 150}}>
        <View style={[styles.section, {paddingBottom: 50}]}>
          <View style={styles.AllProductSection}>
            {pdfs.map((item, index) => (
              <ActivityCard1
                onPress={() => navigation.navigate('PdfDetail', {item: item})}
                item={item}
                index={index}
                key={index + 'pdf'}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default Pdfs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  AllProductSection: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  more: {
    color: '#5b6952',
    fontWeight: '600',
    fontSize: 14,
    position: 'absolute',
    right: 0,
    marginTop: 10,
  },
  card2Para: {
    fontSize: 12,
    color: '#333',
    marginTop: 7,
  },

  card2Top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card2Title: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
    width: '100%',
    position: 'relative',
    marginTop: 10,
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Gill Sans Medium',
    marginTop: 55,
    textAlign: 'center',
  },

  heading: {
    display: 'flex',
    flexDirection: 'row',
  },
  username: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 24,
    paddingLeft: 5,
  },
  handIcon: {
    width: 24,
    height: 24,
  },
  logo: {
    position: 'absolute',
    resizeMode: 'cover',
    left: 0,
    right: 0,
    top: 0,
    height: height,
    width: width,
    bottom: -2,
    zIndex: 2,
  },
  bg: {
    flex: 1,
  },
});
