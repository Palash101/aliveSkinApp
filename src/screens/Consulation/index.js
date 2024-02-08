import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
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
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {useToast} from 'react-native-toast-notifications';
import PageLoader from '../../components/PageLoader';
import {AuthContoller} from '../../controllers/AuthController';
import RenderHTML from 'react-native-render-html';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Consulation = () => {
  const navigation = useNavigation();
  const {getToken, getUser} = useContext(UserContext);
  const activeColor = [
    'rgba(225,215,206,0.2)',
    'rgba(225,215,206,0.5)',
    'rgba(225,215,206,1)',
  ];
  const [data, setData] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);
  const [more, setMore] = useState({id: '', more: false});

  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPrescriptions();
    });
    return unsubscribe;
  }, []);

  const getPrescriptions = async () => {
    const token = await getToken();
    if (token) {
      console.log(token, 'token');
      const instance = new AuthContoller();
      const result = await instance.allPrescription(token);
      setData(result?.prescriptions);
    }
  };

  const setMoreVal = async item => {
    if (item.id === more.id) {
      setMore({id: item.id, more: !more?.more});
    } else {
      setMore({id: item.id, more: true});
    }
  };

  return (
    <>
      <PageLoader loading={loading} />
      <View style={styles.container}>
        <LinearGradient colors={activeColor} style={styles.card1}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              marginLeft: 15,
              marginTop: 60,
            }}>
            <Image
              source={assets.back}
              style={{width: 16, height: 16, tintColor: '#000', marginTop: 5}}
            />
          </TouchableOpacity>
          <Text
            style={{
              alignSelf: 'center',
              marginTop: -20,
              fontFamily: 'Gotham-Medium',
            }}>
            Consulations
          </Text>
          <ScrollView
            style={{flex: 1, marginTop: 15}}
            contentContainerStyle={{padding: 10, paddingBottom: 20}}>
            {data && data.length > 0 ? (
              <>
                {data.map((item, index) => (
                  <View style={styles.presBox}>
                    <View style={styles.presHeader}>
                      <Text style={styles.presTitle}>Prescription </Text>
                      <Text style={styles.presTitle}>
                        {moment(item.created_at).format('LL')}
                      </Text>
                    </View>

                    <View
                      style={{
                        height:
                          item.id === more.id && more?.more === true
                            ? 'auto'
                            : 85,
                        paddingHorizontal: 10,
                        overflow: 'hidden',
                      }}>
                      <RenderHTML
                        contentWidth={width - 40}
                        source={{html: item.prescription}}
                      />
                    </View>
                    {item.id === more.id && more?.more === false ? (
                      <Text
                        style={{
                          position: 'absolute',
                          bottom: 39,
                          right: 7,
                          backgroundColor: '#f2f2f2',
                          paddingHorizontal: 4,
                        }}>
                        .....
                      </Text>
                    ) : (
                      <></>
                    )}
                    <TouchableOpacity
                      onPress={() => setMoreVal(item)}
                      style={{
                        margin: 5,
                        position: 'absolute',
                        bottom: 5,
                        right: 25,
                      }}>
                      <Text style={{fontFamily: 'Gotham-Medium', fontSize: 12}}>
                        {item.id === more.id && more?.more === true
                          ? 'Read less'
                          : 'Read more'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            ) : (
              <Text
                style={{fontSize: 12, marginVertical: 40, textAlign: 'center'}}>
                No prescription found
              </Text>
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    </>
  );
};
export default Consulation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  presHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddd',
    padding: 10,
    marginBottom: 10,
  },
  presBox: {
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 6,
    overflow: 'hidden',
    borderColor: '#000',
    borderWidth: 1,
  },
  presTitle: {
    fontFamily: 'Gotham-Medium',
    color: '#000',
  },

  medal: {
    width: 18,
    height: 18,
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
    fontFamily: 'Gill Sans Medium',
    marginTop: 20,
    marginLeft: 10,
  },
});
