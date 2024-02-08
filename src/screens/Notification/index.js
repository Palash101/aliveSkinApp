import React, {useContext, useEffect} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PageContainer} from '../../components/Container';
import {useState} from 'react';
import {assets} from '../../config/AssetsConfig';
import {UserContext} from '../../../context/UserContext';
import {NotificationController} from '../../controllers/NotificationController';
import PageLoader from '../../components/PageLoader';

const Notification = ({navigation}) => {
  const {getToken} = useContext(UserContext);
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getNotifications();
    });
    return focusHandler;
  }, [refresh]);

  const getNotifications = async () => {
    setLoading(true);
    const token = await getToken();
    const instance = new NotificationController();
    const result = await instance.getAllNotification(token);
    console.log(result, 'resultresult');
    setLoading(false);
    setData(result?.data);
    if (result?.count > 0) {
      readNotifications();
    }
  };

  const readNotifications = async () => {
    setLoading(true);
    const token = await getToken();
    const instance = new NotificationController();
    const result = await instance.readNotification(token);
    setLoading(false);
  };

  const deleteAll = async () => {
    setLoading1(true);
    const token = await getToken();
    const instance = new NotificationController();
    const result = await instance.deleteNotification(token);
    if (result.status === 'success') {
      getNotifications();
      setLoading1(false);
    } else {
      setLoading1(false);
    }
  };

  return (
    <>
      <PageLoader loading={loading1} />
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
        <Text style={styles.sectionHeading}>NOTIFICATIONS</Text>
        {data?.length > 0 && (
          <TouchableOpacity style={styles.clear} onPress={() => deleteAll()}>
            <Text style={{fontFamily: 'Gotham-Medium', marginTop: 7}}>
              Clear
            </Text>
          </TouchableOpacity>
        )}

        <ScrollView
          contentContainerStyle={{paddingHorizontal: 10, marginTop: 20}}>
          {data?.length > 0 ? (
            <View style={styles.classesList}>
              {data.map((item, index) => (
                <View key={index + 'keyy'} style={styles.notiTitle}>
                  <Image source={assets.logo_dark} style={styles.img} />
                  <View style={styles.rightBox}>
                    <Text style={styles.titleText}>
                      {item.attributes.title}
                    </Text>
                    <Text style={styles.description}>
                      {item.attributes.message}
                    </Text>
                    <Text style={styles.date}>{item.attributes.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noData}>No Record Found.</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
};
export default Notification;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  clear: {
    position: 'absolute',
    right: 10,
    top: 50,
  },
  notiTitle: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    fontFamily: 'Gotham-Book',
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 10,
    width: width - 20,
  },
  bg: {
    flex: 1,
    backgroundColor: '#fff',
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Gill Sans Medium',
    marginTop: 55,
    textAlign: 'center',
  },
  rightBox: {
    width: width - 95,
  },
  titleText: {
    fontFamily: 'Gotham-Medium',
    lineHeight: 16,
    fontSize: 14,
  },
  noData: {
    fontSize: 14,
    alignSelf: 'center',
    marginTop: height / 2 - 200,
    marginBottom: 20,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Gotham-Book',
    marginTop: 2,
    lineHeight: 16,
  },
  date: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'Gotham-Medium',
    marginTop: 8,
    textAlign: 'right',
    marginRight: 10,
  },
  img: {
    backgroundColor: '#000',
    borderRadius: 12,
    width: 52,
    height: 52,
    marginRight: 10,
  },
});
