import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../../../context/UserContext';
import PageLoader from '../../components/PageLoader';
import WebView from 'react-native-webview';
import {NotificationController} from '../../controllers/NotificationController';
import {NotificationIcon} from '../../components/NotificationIcon';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Chat = props => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {getToken, getUser} = useContext(UserContext);
  const [url, setUrl] = useState('');
  const [user, setUser] = useState();
  const [count, setCount] = useState(0);

  const webViewRef = useRef(null);

  const handleOpenCamera = () => {
    webViewRef.current.injectJavaScript(`
      document.getElementById('fileInput').captureStream();
      document.getElementById('fileInput').click();
    `);
  };

  const handleFileInputChange = () => {
    // Handle the file input change event
    webViewRef.current.injectJavaScript(`
      var selectedFile = document.getElementById('fileInput').files[0];
      alert('Selected file: ' + selectedFile.name);
      // You can perform additional actions here, such as uploading the file
    `);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setUrl(false);
      setLoading(true);
      getUrl();
    });
    return unsubscribe;
  }, []);

  const getUrl = async () => {
    getNotifications();
    setLoading(true);
    console.log(props.route.params.item, 'itemmm');
    setUrl(
      `https://firebase-chat-mu.vercel.app/?bookingId=${props.route.params.item.slot_id}&userId=${props.route.params.item.user_id}`,
    );
    setLoading(false);
  };

  const getNotifications = async () => {
    setLoading(true);
    const token = await getToken();
    const instance = new NotificationController();
    const result = await instance.getAllNotification(token);
    setLoading(false);
    setCount(result?.count);
  };
  const getUserToken = async () => {
    return await getToken();
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
        onPress={() => navigation.navigate('home')}>
        <Image
          source={assets.back}
          style={{width: 16, height: 16, tintColor: '#fff', marginTop: 5}}
        />
      </TouchableOpacity>
      <Text style={styles.sectionHeading}>Discussion</Text>
      {count ? (
        <NotificationIcon
          count={count}
          onPress={() => navigation.navigate('Notification')}
        />
      ) : (
        <></>
      )}

      {url ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 10,
            top: 80,
          }}>
          <WebView
            ref={webViewRef}
            source={{
              uri: url,
              headers: {
                Authorization: 'Bearer ' + getUserToken(),
                Accept: 'application/json',
              },
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={event => console.log(event.nativeEvent.data)}
            onNavigationStateChange={data => console.log(data, 'ress')}
            startInLoadingState={true}
            injectedJavaScript={`
            function handleFileInputChange() {
              var selectedFile = document.getElementById('fileInput').files[0];
              window.ReactNativeWebView.postMessage('Selected file: ' + selectedFile.name);
              // You can perform additional actions here, such as uploading the file
            }
          `}
            onLoad={() => {
              webViewRef.current.injectJavaScript(`
              document.getElementById('fileInput').addEventListener('change', handleFileInputChange);
            `);
            }}
          />
        </View>
      ) : (
        <PageLoader loading={true} />
      )}
    </View>
  );
};
export default Chat;

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
  footerPrice2: {
    color: '#333',
    fontWeight: '600',
    fontSize: 12,
    textDecorationLine: 'line-through',
    paddingLeft: 10,
  },
  modalBox: {
    paddingTop: Platform.OS === 'ios' ? 30 : 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    bottom: -40,
    left: 0,
    right: 0,
    height: 500,
  },
  titleHeading: {
    flexDirection: 'row',
  },
  titleText: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    fontSize: 14,
    color: '#161415',
    fontFamily: 'Gill Sans Medium',
    textTransform: 'uppercase',
  },
  modalContent: {
    paddingBottom: 20,
  },
  removeBtn: {
    position: 'absolute',
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderWidth: 1,
    right: -5,
    marginTop: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  removeText: {
    color: '#333',
    fontSize: 14,
    alignSelf: 'center',
    fontWeight: '600',
  },
  addressBtn: {
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 20,
    width: width / 2 - 40,
  },
  addBtnText: {
    fontSize: 12,
    textAlign: 'center',
  },
  addressBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalBox1: {
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginTop: 0,
  },
  addBtn: {alignSelf: 'center', marginBottom: 10},
  addText: {
    fontFamily: 'Gotham-Medium',
    lineHeight: 16,
    fontSize: 12,
  },
  addHding: {
    fontFamily: 'Gotham-Medium',
    lineHeight: 16,
    fontSize: 12,
  },
  addDet: {
    fontFamily: 'Gotham-Book',
    fontSize: 12,
    lineHeight: 14,
  },
  label: {
    fontFamily: 'Gotham-Book',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
    marginTop: 5,
  },
  inputBox: {
    backgroundColor: '#ddd',
    marginTop: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 6,
    padding: 3,
    marginBottom: 10,
  },
  cartItem: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
    width: width - 30,
  },
  input: {
    width: width - 170,
    marginLeft: 5,
    paddingVertical: 5,
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Gotham-Book',
  },
  countryPicker: {
    width: width - 170,
    marginLeft: 5,
    backgroundColor: 'transparent',
    color: '#000000',
    textTransform: 'uppercase',
    fontSize: 12,
    fontFamily: 'Gotham-Book',
  },
  codeInput: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 26,
    width: 65,
    borderRadius: 6,
    paddingHorizontal: 5,
  },
  codeText: {
    fontSize: 12,
    marginTop: 5,
  },
  itemTitleBox: {
    width: width - 200,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  itemImage: {
    width: 38,
    height: 38,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  itemQtyBox: {
    width: 40,
    paddingLeft: 10,
  },
  itemPriceBox: {
    width: 50,
  },
  itemTotalBox: {
    width: 70,
  },

  itemTitle: {
    fontSize: 12,
    width: width - 250,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily: 'Gotham-Light',
  },
  itemCat: {
    fontSize: 10,
    lineHeight: 16,
    fontFamily: 'Gotham-Light',
  },
  itemqty: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Gotham-Light',
  },
  itemTotal: {
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'Gotham-Medium',
  },
  totalText: {
    fontFamily: 'Gill Sans Medium',
    fontSize: 16,
  },
  footer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyButton: {
    padding: 10,
    backgroundColor: '#563925',
    width: width / 2 - 30,
    textAlign: 'center',
    borderRadius: 20,
  },
  cartButton: {
    padding: 10,
    backgroundColor: '#563925',
    flexDirection: 'row',
    width: width / 2 - 10,
    justifyContent: 'center',
    borderRadius: 20,
  },
  cartImage: {
    width: 16,
    height: 16,
    tintColor: '#fff',
    marginRight: 10,
  },
  buyButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  },
  cartButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Gill Sans Medium',
  },
  footerPrice: {
    color: '#563925',
    fontSize: 16,
    fontFamily: 'Gill Sans Medium',
  },
  bg: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
