import React, {useContext, useEffect, useState} from 'react';
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
import {UserContext} from '../../../context/UserContext';
import {FlatList} from 'react-native-gesture-handler';
import ImageCard from '../../components/Card/ImageCard';
import {useNavigation} from '@react-navigation/native';
import ImageCardFull from '../../components/Card/ImageCardFull';
import {BlogsController} from '../../controllers/BlogController';
import { NotificationIcon } from '../../components/NotificationIcon';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Blogs = () => {
  const {getToken, getUser} = useContext(UserContext);
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getUserDetail();
    getBlogs();
  }, []);

  const getUserDetail = async () => {
    const res = await getUser();
    setUser(res);
  };

  const getBlogs = async () => {
    const token = await getToken();
    if (token) {
      const instance = new BlogsController();
      const result = await instance.authAllBlogs('Blog', token);
      setBlogs(result.blogs);
    } else {
      const instance = new BlogsController();
      const result = await instance.AllBlogs(token);
      setBlogs(result.blogs);
    }
  };

  const goToProgram = () => {
    navigation.navigate('Programs');
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
      <Text style={styles.sectionHeading}>BLOGS</Text>
      <NotificationIcon onPress={() => navigation.navigate('notification')}/>

      <ScrollView
        style={{flex: 1, marginTop: 15, padding: 15, paddingBottom: 150}}>
        <View style={[styles.section, {paddingBottom: 50}]}>
          <FlatList
            data={blogs}
            pagingEnabled
            contentContainerStyle={{gap: 10}}
            showsHorizontalScrollIndicator={false}
            decelerationRate={'normal'}
            renderItem={({item, index}) => (
              <ImageCardFull
                onPress={() => navigation.navigate('BlogDetails', {item: item})}
                item={item}
                index={index}
                key={index + 'blog'}
              />
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default Blogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  more: {
    color: '#6A6C61',
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
