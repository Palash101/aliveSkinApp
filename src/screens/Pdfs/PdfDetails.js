import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import {BlogsController} from '../../controllers/BlogController';
import {UserContext} from '../../../context/UserContext';
import PageLoader from '../../components/PageLoader';
import {useToast} from 'react-native-toast-notifications';
import Pdf from 'react-native-pdf';
import {IMAGE_BASE} from '../../config/ApiConfig';
import {assets} from '../../config/AssetsConfig';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PdfDetail = props => {
  const activeColor = ['#fff', '#fff', '#fff'];
  const navigation = useNavigation();
  const {getToken, getUser} = useContext(UserContext);
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setItem(props.route.params.item);
    });
    return unsubscribe;
  }, [props.route.params]);

  return (
    <View style={styles.container}>
      <PageLoader loading={loading} />

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
      <Text style={styles.sectionHeading}></Text>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingHorizontal: 15, paddingBottom: 50}}
        scrollEventThrottle={16}>
        <View style={{marginTop: 15}}>
          <Text style={styles.avlHeading}>{item?.title}</Text>
        </View>

        {item?.decription && (
          <View style={{marginTop: 15}}>
            <RenderHTML
              contentWidth={width - 40}
              source={{html: item?.decription}}
            />
          </View>
        )}
        {item?.pdf ? (
          <Pdf
            source={{uri: IMAGE_BASE + item.pdf, cache: true}}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`current page: ${page}`);
            }}
            onError={error => {
              console.log(error);
            }}
            style={styles.pdf}
          />
        ) : (
          <></>
        )}
      </ScrollView>
    </View>
  );
};
export default PdfDetail;

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
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width - 30,
    height: Dimensions.get('window').height - 325,
    marginTop: 10,
  },
  commentBox: {
    marginBottom: 10,
    paddingBottom: 10,
  },
  commentBox1: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    paddingBottom: 10,
  },
  commentText: {
    fontFamily: 'Gotham-Book',
    fontSize: 14,
  },
  commentUser: {
    fontFamily: 'Gotham-Book',
    fontSize: 12,
    lineHeight: 20,
    color: '#333',
  },

  bottomBox: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    marginTop: 15,
  },

  inputBox: {
    backgroundColor: '#ddd',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 6,
    padding: 3,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  input: {
    width: width - 170,
    marginLeft: 5,
    paddingVertical: 5,
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Gotham-Book',
    height: 40,
  },
  hding: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginBottom: 20,
    borderColor: '#ddd',
  },
  hdingText: {
    fontFamily: 'Gotham-Medium',
    fontSize: 14,
  },

  sendBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#000',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  sendText: {
    color: '#fff',
    fontFamily: 'Gotham-Medium',
  },
  likeBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  viewBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  likeText: {
    fontSize: 10,
    margin: 4,
    fontWeight: '600',
    fontFamily: 'Gotham-Medium',
  },
  viewText: {
    fontSize: 10,
    margin: 4,
    fontWeight: '600',
    fontFamily: 'Gotham-Medium',
  },

  vid: {
    height: 300,
    width: width - 40,
    backgroundColor: '#ddd',
  },
  videoCardbg: {
    flex: 1,
    padding: 10,
    height: 300,
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
  itemHeading: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    fontFamily: 'Gill Sans Medium',
  },
  para: {
    fontSize: 12,
    color: '#000',
    fontWeight: '400',
    marginVertical: 10,
    fontFamily: 'Gill Sans Medium',
  },

  card1: {
    flex: 1,
    paddingTop: 20,
  },

  avlHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#563925',
    fontFamily: 'Gill Sans Medium',
  },
  avlPara: {
    fontSize: 12,
    marginBottom: 20,
    marginTop: 5,
    color: '#333',
    fontFamily: 'Gill Sans Medium',
  },
  tags: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
  },
  tag: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#563925',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
    fontFamily: 'Gill Sans Medium',
  },
});
