import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
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
import {API_BASE, IMAGE_BASE} from '../../config/ApiConfig';
import RenderHTML from 'react-native-render-html';
import {VideoController} from '../../controllers/VideoController';
import {UserContext} from '../../../context/UserContext';
import {LikeSection} from '../../components/LikeSection';
import { BlogsController } from '../../controllers/BlogController';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProgramDetails = props => {
  const activeColor = ['#fff', '#fff', 'rgba(225,215,206,1)'];
  const activeColor2 = [
    'rgba(225,215,206,1)',
    'rgba(225,215,206,0.4)',
    'rgba(225,215,206,0)',
  ];
  const {getToken, getUser} = useContext(UserContext);

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState();
  const [data, setData] = useState([]);
  const [url, setUrl] = useState(
    'https://cdn.coverr.co/videos/coverr-stream-next-to-the-road-4482/1080p.mp4',
  );
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(0);
  const [liked, setLiked] = useState('Unliked');
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDetail();
    });
    return unsubscribe;
  }, [props.route.params]);

  const getDetail = async () => {
    setLiked('Unliked');
    const instance = new VideoController();

    const token = await getToken();
    if (token) {
      const result1 = await instance.authVideoDetail(
        props.route.params.item.id,
        token,
      );
      console.log(result1.video, 'result1.video');
      setItem(result1.video);
      setLikeCount(result1.video?.like_count);
      setActive(0);
      setUrl(IMAGE_BASE + result1.video.files[0].image);

      const viewResult = await instance.view(
        props.route.params.item.id,
        1,
        token,
      );
      console.log(viewResult, 'viewResult');
    } else {
      const instance1 = new BlogsController(); 
      const result1 = await instance1.authBlogDetail('Video', props.route.params.item.id);
      console.log(result1.video, 'result1.video');
      setItem(result1.video);
      setLikeCount(result1.video?.like_count);
      setActive(0);
      setUrl(IMAGE_BASE + result1.video.files[0].image);
    }
  };

  useEffect(() => {
    if (item?.files) {
      setUrl(IMAGE_BASE + item.files[active].image);
    }
  }, [active, item]);

  const like = async () => {
    const token = await getToken();
    let likeVal = liked === 'Unliked' ? 'Liked' : 'Unliked';
    let count = liked === 'Unliked' ? likeCount + 1 : likeCount - 1;
    setLiked(likeVal);
    setLikeCount(count);
    if (token) {
      const instance = new VideoController();
      const result = await instance.like(item.id, likeVal, token);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{uri: IMAGE_BASE + item?.bannerImage}}
        resizeMode="cover"
        style={styles.videoCardbg}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={activeColor2}
          style={styles.videoCardbg1}></LinearGradient>

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
              onPress={() => navigation.navigate('Home')}>
              <Image
                source={assets.back}
                style={{width: 16, height: 16, tintColor: '#fff', marginTop: 5}}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.avlHeading}>{item?.title}</Text>
        
        </View>
      </ImageBackground>

      <LinearGradient colors={activeColor} style={styles.card1}>
        <ScrollView contentContainerStyle={{flex: 1, padding: 20}}>
          <LikeSection
            like={like}
            liked={item?.my_like?.like === 'Liked' ? 'Liked' : 'Uniked'}
            likeCount={likeCount}
            viewCount={item?.view_count}
            commentCount={item?.view_count}
          />

          <View>
            <Text style={[styles.itemHeading, {marginBottom: 5}]}>About</Text>
            <RenderHTML
              contentWidth={width - 40}
              source={{html: item?.decription}}
            />
          </View>
          {/* <View style={{marginTop: 15}}>
            <Text style={styles.itemHeading}>Related</Text>
            <View style={styles.tags}>
              <Text style={styles.tag}>Skin Care</Text>
              <Text style={styles.tag}>Beauty</Text>
            </View>
          </View>
          <View style={{marginTop: 15}}>
            <Text style={styles.itemHeading}>Description</Text>
            <Text style={styles.para}>Lorem ipsum doller emit is dummy</Text>
          </View> */}
        </ScrollView>
        <TouchableOpacity
          style={[styles.videoButton]}
          onPress={() => setShow(true)}>
          <Image
            source={assets.play}
            style={{
              width: 12,
              height: 12,
              tintColor: '#fff',
              marginRight: 10,
            }}
          />
          <Text style={styles.themeBtnText}>Start Training</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Modal
        visible={show}
        onDismiss={() => setShow(false)}
        style={{height: height, marginTop: 260}}>
        <TouchableOpacity
          onPress={() => setShow(false)}
          style={{
            width: 24,
            height: 24,
            position: 'absolute',
            left: 15,
            top: 50,
            borderRadius: 4,
            zIndex: 999,
          }}>
          <Image
            source={assets.close}
            style={{width: 20, height: 20, margin: 2, tintColor: '#fff'}}
          />
        </TouchableOpacity>
        {active !== 0 ? (
          <TouchableOpacity
            onPress={() => setActive(active - 1)}
            style={{
              width: 32,
              height: 32,
              position: 'absolute',
              left: 15,
              top: height / 2 - 14,
              borderRadius: 4,
              zIndex: 9999,
              backgroundColor: 'rgba(255,255,255,0.6)',
              alignItems: 'center',
              paddingTop: 2,
            }}>
            <Image
              source={assets.back}
              style={{width: 24, height: 24, margin: 2, tintColor: '#fff'}}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}

        {active + 1 !== item?.files?.length ? (
          <TouchableOpacity
            onPress={() => setActive(active + 1)}
            style={{
              width: 32,
              height: 32,
              position: 'absolute',
              right: 15,
              top: height / 2 - 14,
              borderRadius: 4,
              zIndex: 9999,
              backgroundColor: 'rgba(255,255,255,0.6)',
              alignItems: 'center',
              paddingTop: 2,
            }}>
            <Image
              source={assets.next}
              style={{width: 24, height: 24, margin: 2, tintColor: '#fff'}}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}

        <VideoPlayer
          video={{uri: url}}
          videoWidth={width}
          videoHeight={height}
          fullscreen={false}
          thumbnail={
            item?.bannerImage ? IMAGE_BASE + item?.bannerImage : assets.videobg
          }
        />
      </Modal>
    </View>
  );
};
export default ProgramDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  time: {
    backgroundColor: '#563925',
    paddingHorizontal: 5,
    color: '#fff',
    marginLeft: 15,
    height: 20,
    width: 80,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
    borderRadius: 8,
    overflow: 'hidden',
    fontSize: 12,
    marginTop: 5,
  },
  itemHeading: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  para: {
    fontSize: 12,
    color: '#000',
    fontWeight: '400',
    marginVertical: 10,
  },
  videoButton: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    right: 10,
    fontFamily: 'Gotham-Black',
    fontWeight: '800',
    backgroundColor: '#563925',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
  },
  themeBtnText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Gotham-Book',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  card1: {
    flex: 1,
    marginTop: -350,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  slots: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 15,
    gap: 10,
  },
  slot: {
    backgroundColor: '#fff',
    padding: 8,
    borderWidth: 1,
    borderColor: '#BBBEB3',
    fontWeight: '500',
    fontSize: 12,
  },
  avlHeading: {
    fontSize: 26,
    marginTop: 80,
    fontWeight: '600',
    paddingLeft: 15,
    color: '#563925',
  },
  avlPara: {
    fontSize: 14,
    marginBottom: 20,
    marginTop: 5,
    fontWeight: '600',
    paddingLeft: 15,
    color: '#333',
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
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
