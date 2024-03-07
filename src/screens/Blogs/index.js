import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
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
import {UserContext} from '../../../context/UserContext';
import {FlatList} from 'react-native-gesture-handler';
import ImageCard from '../../components/Card/ImageCard';
import {useNavigation} from '@react-navigation/native';
import ImageCardFull from '../../components/Card/ImageCardFull';
import {BlogsController} from '../../controllers/BlogController';
import ViewShot from 'react-native-view-shot';
import PageLoader from '../../components/PageLoader';
import { SkeltonBlackCard } from '../../components/Skelton';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Blogs = () => {
  const {getToken, getUser} = useContext(UserContext);
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState([]);
  const [capture, setCapture] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserDetail();
    getBlogs();
  }, []);

  const getUserDetail = async () => {
    const res = await getUser();
    setUser(res);
  };

  const getBlogs = async () => {
    setLoading(true);
    const token = await getToken();
    if (token) {
      const instance = new BlogsController();
      const result = await instance.authAllBlogs('Blog', token);
      setBlogs(result.blogs);
      setLoading(false);
    } else {
      const instance = new BlogsController();
      const result = await instance.AllBlogs(token);
      setBlogs(result.blogs);
      setLoading(false);
    }
  };

  const goToProgram = () => {
    navigation.navigate('Programs');
  };

  // const onCapture = () => {
  //   // Handle the screenshot capture event
  //   setCapture(true)
  //   Alert.alert('Screenshot captured:');
  //   // You can perform any action you need when a screenshot is detected
  // };

  return (
    // <ViewShot
    //   style={{display: 'flex', flex: 1}}
    //   onCapture={() => onCapture()}
    //   captureMode="mount">
    <>

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
        <Text style={styles.sectionHeading}>BLOGS</Text>

        <ScrollView
          style={{flex: 1, marginTop: 15, padding: 15, paddingBottom: 150}}>
          {!blogs.length ? (
            <>
            {loading === true ?
            <>
              <SkeltonBlackCard height={200} />
              <SkeltonBlackCard height={200} />
              </>
              :<>
              <View>
                  <Text style={styles.avlHeading}>No Slots Available</Text>
                </View>
              </>}
            </>
          ) : (
            <View style={[styles.section, {paddingBottom: 50, gap: 10}]}>
              {blogs.map((item, index) => (
                <ImageCardFull
                  onPress={() =>
                    navigation.navigate('BlogDetails', {item: item})
                  }
                  item={item}
                  index={index}
                  key={index + 'blog'}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
    // </ViewShot>
  );
};
export default Blogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avlHeading: {
    fontSize: 14,
    marginTop: 30,
    fontFamily: 'Gill Sans Medium',
    textAlign: 'center'
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
