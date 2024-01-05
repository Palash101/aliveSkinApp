import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {IMAGE_BASE} from '../../config/ApiConfig';
import {UserContext} from '../../../context/UserContext';
import {NotificationIcon} from '../../components/NotificationIcon';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {PackageController} from '../../controllers/PackageController';
import {PackageItem} from '../../components/PackageItem';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Profile = () => {
  const navigation = useNavigation();
  const {getToken, getUser} = useContext(UserContext);
  const [user, setUser] = useState();
  const activeColor = [
    'rgba(225,215,206,0.2)',
    'rgba(225,215,206,0.5)',
    'rgba(225,215,206,1)',
  ];
  const [packageItem, setPackageItem] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUserDetail();
      getPackage();
    });
    return unsubscribe;
  }, []);

  const getPackage = async () => {
    const token = await getToken();
    if (token) {
      const instance = new PackageController();
      const result = await instance.myPackage(token);
      setPackageItem(result.packages);
    }
  };

  const getUserDetail = async () => {
    const res = await getUser();
    setUser(res);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={activeColor} style={styles.card1}>
        <TouchableOpacity
          onPress={() => navigation.navigate('home')}
          style={{
            marginLeft: 15,
            marginTop: 60,
          }}>
          <Image
            source={assets.back}
            style={{width: 16, height: 16, tintColor: '#000', marginTop: 5}}
          />
        </TouchableOpacity>
        <NotificationIcon onPress={() => navigation.navigate('notification')} />
        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding: 10, paddingBottom: 20}}>
          <View style={styles.prSection}>
            {user?.image ? 
            <Image
              source={{uri: IMAGE_BASE + user?.image}}
              style={[styles.prImage, {tintColor: '#888'}]}
            />
            :
            <Image source={assets.profile} style={styles.prImage} />
            }
            <View style={styles.prright}>
              <View>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.phone}>{user?.phone}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProfileEdit', {user: user})
                }>
                <Image
                  source={assets.next}
                  style={{width: 16, height: 16, tintColor: '#888'}}
                />
              </TouchableOpacity>
            </View>
          </View>

          {packageItem?.length ? (
            <View style={styles.section}>
              <FlatList
                data={packageItem}
                pagingEnabled
                contentContainerStyle={{gap: 10}}
                showsHorizontalScrollIndicator={false}
                decelerationRate={'normal'}
                renderItem={({item, index}) => <PackageItem item={item} />}
              />
            </View>
          ) : (
            <></>
          )}

          <View style={styles.sectionBox}>
            <TouchableOpacity style={styles.linkBox}>
              <View style={{flexDirection: 'row'}}>
                <Image source={assets.medal} style={styles.medal} />
                <Text
                  style={{
                    fontFamily: 'Gill Sans Medium',
                    fontSize: 16,
                    lineHeight: 18,
                    marginLeft: 10,
                    marginTop: 3,
                  }}>
                  30 Rewards Point
                </Text>
              </View>
              <Image source={assets.next} style={styles.linkNext} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionBox}>
            <TouchableOpacity style={styles.linkBox}>
              <View style={{flexDirection: 'row'}}>
                <Image source={assets.facebook} style={styles.social} />
                <Text
                  style={{
                    fontFamily: 'Gill Sans Medium',
                    fontSize: 16,
                    lineHeight: 18,
                    marginLeft: 10,
                  }}>
                  Facebook
                </Text>
              </View>
              <Image source={assets.next} style={styles.linkNext} />
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity style={styles.linkBox}>
              <View style={{flexDirection: 'row'}}>
                <Image source={assets.instagram} style={styles.social} />

                <Text
                  style={{
                    fontFamily: 'Gill Sans Medium',
                    fontSize: 16,
                    lineHeight: 18,
                    marginLeft: 10,
                  }}>
                  Instagram
                </Text>
              </View>
              <Image source={assets.next} style={styles.linkNext} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionBox}>
            <TouchableOpacity
              style={styles.linkBox}
              onPress={() => navigation.navigate('SlotHistory')}>
              <Text style={styles.linkText}>Appointments History</Text>
              <Image source={assets.next} style={styles.linkNext} />
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity style={styles.linkBox}>
              <Text style={styles.linkText}>Products History</Text>
              <Image source={assets.next} style={styles.linkNext} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionBox}>
            <TouchableOpacity
              style={styles.linkBox}
              onPress={() => navigation.navigate('About')}>
              <Text style={styles.linkText}>About</Text>
              <Image source={assets.next} style={styles.linkNext} />
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              style={styles.linkBox}
              onPress={() => navigation.navigate('Terms')}>
              <Text style={styles.linkText}>Terms & Conditions</Text>
              <Image source={assets.next} style={styles.linkNext} />
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              style={styles.linkBox}
              onPress={() => navigation.navigate('Faqs')}>
              <Text style={styles.linkText}>FAQ</Text>
              <Image source={assets.next} style={styles.linkNext} />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionBox}>
            <TouchableOpacity
              style={styles.linkBox}
              onPress={() => navigation.navigate('Contact')}>
              <Text style={styles.linkText}>Contact</Text>
              <Image source={assets.next} style={styles.linkNext} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{alignSelf: 'center'}}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Gotham-Medium',
                marginTop: 30,
              }}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  medal: {
    width: 20,
    height: 20,
  },
  social: {
    width: 20,
    height: 20,
  },
  medalText: {
    color: '#fbcc5b',
    fontFamily: 'Gotham-Medium',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 2,
  },
  linkBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  line: {
    height: 1,
    marginVertical: 5,
    backgroundColor: '#ddd',
  },
  linkText: {
    fontFamily: 'Gill Sans Medium',
    fontSize: 16,
  },
  linkNext: {width: 14, height: 14, tintColor: '#888'},
  card1: {
    flex: 1,
  },
  sectionBox: {
    backgroundColor: '#ffffff',
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
  },
  prright: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 130,
  },
  prSection: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  prImage: {
    width: 80,
    height: 80,
    borderRadius: 80,
    marginRight: 10,
  },
  name: {
    fontFamily: 'Gill Sans Medium',
    fontSize: 16,
    lineHeight: 20,
  },
  phone: {
    fontFamily: 'Gotham-Medium',
    lineHeight: 20,
    fontSize: 12,
  },
  back: {
    marginLeft: 20,
    marginTop: 50,
    backgroundColor: '#000',
    width: 28,
    height: 28,
    alignItems: 'center',
    borderRadius: 5,
    position: 'absolute',
    zIndex: 99,
  },
  backImage: {
    width: 16,
    height: 16,
    tintColor: '#fff',
    marginTop: 5,
  },
  sectionHeading: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Gill Sans Medium',
  },
});
