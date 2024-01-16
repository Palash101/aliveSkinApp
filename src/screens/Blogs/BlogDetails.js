import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import Calendar from '../../components/calendar/Calendar';
import {ThemeButton, ThemeButton2, VideoButton} from '../../components/Buttons';
import moment from 'moment';
import VideoPlayer from 'react-native-video-player';
import {ModalView} from '../../components/ModalView';
import {IMAGE_BASE} from '../../config/ApiConfig';
import RenderHTML from 'react-native-render-html';
import {BlogsController} from '../../controllers/BlogController';
import {UserContext} from '../../../context/UserContext';
import {LikeSection} from '../../components/LikeSection';
import PageLoader from '../../components/PageLoader';
import DynamicHeader from '../../components/DynamicHeader';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const BlogDetails = props => {
  const activeColor = ['#fff', '#fff', 'rgba(225,215,206,1)'];
  const activeColor2 = [
    'rgba(225,215,206,1)',
    'rgba(225,215,206,0.4)',
    'rgba(225,215,206,0)',
  ];
  const navigation = useNavigation();
  const {getToken, getUser} = useContext(UserContext);

  const [item, setItem] = useState();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(
    'https://cdn.coverr.co/videos/coverr-stream-next-to-the-road-4482/1080p.mp4',
  );
  const [show, setShow] = useState(false);
  const [liked, setLiked] = useState('Unliked');
  const [likeCount, setLikeCount] = useState(0);
  let scrollOffsetY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setItem('');
      setLoading(true);
      setLiked('Unliked');
      getDetail();
    });
    return unsubscribe;
  }, [props.route.params]);

  const getDetail = async () => {
    setLoading(true);

    const instance = new BlogsController();
    const token = await getToken();
    if (token) {
      const result1 = await instance.authBlogDetail(
        'Blog',
        props.route.params.item.id,
        token,
      );
      console.log(result1?.blog?.my_like, 'result1');
      setItem(result1.blog);
      setLikeCount(result1.blog?.like_count);
      setLoading(false);
      if (result1?.blog?.my_like.like === 'Liked') {
        setLiked(result1?.blog?.my_like?.like);
      } else {
        setLiked('Unliked');
      }
      console.log(result1?.blog?.my_like?.like, 'likeval');

      const viewResult = await instance.view(
        props.route.params.item.id,
        1,
        token,
      );
      console.log(viewResult, 'viewResult');
    } else {
      const result1 = await instance.blogDetail(props.route.params.item.id);
      setItem(result1.blog);
      setLikeCount(result1.blog?.like_count);
      setLoading(false);
    }
  };

  const like = async () => {
    const token = await getToken();
    let likeVal = liked === 'Unliked' ? 'Liked' : 'Unliked';
    let count = liked === 'Unliked' ? likeCount + 1 : likeCount - 1;
    setLiked(likeVal);
    setLikeCount(count);
    if (token) {
      console.log(item.id, likeVal, token, 'sss');
      const instance = new BlogsController();
      const result = await instance.like(item.id, likeVal, token);
    }
  };

  return (
    <View style={styles.container}>
      <PageLoader loading={loading} />
      {/* <ImageBackground
        source={{uri: IMAGE_BASE + item?.headerImage}}
        resizeMode="cover"
        style={styles.videoCardbg}>
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
              onPress={() => navigation.goBack()}>
              <Image
                source={assets.back}
                style={{width: 16, height: 16, tintColor: '#fff', marginTop: 5}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground> */}

      <DynamicHeader
        animHeaderValue={scrollOffsetY}
        image={item?.headerImage}
        goBack={() => navigation.goBack()}
      />

      <LinearGradient colors={activeColor} style={styles.card1}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{paddingHorizontal: 15, paddingBottom: 50}}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
            {useNativeDriver: false},
          )}>
          <LikeSection
            like={like}
            liked={liked === 'Liked' ? 'Liked' : 'Unliked'}
            likeCount={likeCount}
            viewCount={item?.view_count}
            commentCount={item?.view_count}
          />
          <View>
            <Text style={styles.avlHeading}>{item?.title}</Text>
            <Text style={styles.avlPara}>
              Posted on {moment(item?.updated_at).format('LL')}
            </Text>
          </View>

          {item?.summary && (
            <View style={{marginBottom: 15}}>
              <Text style={styles.itemHeading}>Summary</Text>
              <Text style={styles.para}>{item?.summary}</Text>
            </View>
          )}
          {item?.tags && (
            <View style={{marginBottom: 15}}>
              <Text style={styles.itemHeading}>Related</Text>
              <View style={styles.tags}>
                {JSON.parse(item?.tags)
                  ?.slice(0, 3)
                  .map((item1, index) => (
                    <Text key={index + item.id + 'tag'} style={styles.tag}>
                      {item1}
                    </Text>
                  ))}
              </View>
            </View>
          )}
          {item?.body && (
            <View style={{marginTop: 15}}>
              <Text style={[styles.itemHeading, {marginBottom: 10}]}>
                Description
              </Text>

              <RenderHTML
                contentWidth={width - 40}
                source={{html: item?.body}}
              />
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};
export default BlogDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBox: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    marginTop: 15,
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
    marginTop: -30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
