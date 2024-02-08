import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {ModalView} from '../../components/ModalView';
import RenderHTML from 'react-native-render-html';
import {BlogsController} from '../../controllers/BlogController';
import {UserContext} from '../../../context/UserContext';
import {LikeSection} from '../../components/LikeSection';
import PageLoader from '../../components/PageLoader';
import DynamicHeader from '../../components/DynamicHeader';
import {CommentsController} from '../../controllers/CommentsController';
import {useToast} from 'react-native-toast-notifications';
import GetKeyboardHeight from '../../utils/GetKeyboardHeight';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const BlogDetails = props => {
  const activeColor = ['#fff', '#fff', '#fff'];
  const navigation = useNavigation();
  const {getToken, getUser} = useContext(UserContext);
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState('');
  const [likeReturn, setLikeReturn] = useState();
  const toast = useToast();

  const [url, setUrl] = useState(
    'https://cdn.coverr.co/videos/coverr-stream-next-to-the-road-4482/1080p.mp4',
  );
  const [show, setShow] = useState(false);
  const [liked, setLiked] = useState('Unliked');
  const [likeCount, setLikeCount] = useState(0);
  const [allComments, setAllComments] = useState([]);
  let scrollOffsetY = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);
  const keyboardHeight = GetKeyboardHeight();

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
      setAllComments(result1.blog.comments);
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
      setAllComments(result1.blog.comments);
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
      if(result.status === 'success'){
      }
    }
  };

  const send = async () => {
    const token = await getToken();
    if (token) {
      const user = await getUser();
      setLoading(true);
      const instance = new CommentsController();
      const result = await instance.PostComment(
        item?.id,
        'Blog',
        comments,
        token,
      );
      if (result.status === 'success') {
        toast.show('Comment posted successfully.');
        setAllComments([...allComments,{comments: comments, user: user}]);
        setOpen(false);
        setComments('');
        setLoading(false);
      } else {
        setLoading(false);
      }
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
            )}
            keyboardShouldPersistTaps="handled">
            <LikeSection
              like={like}
              liked={liked === 'Liked' ? 'Liked' : 'Unliked'}
              likeCount={likeCount}
              viewCount={item?.view_count}
              commentCount={item?.view_count}
            />
            <View>
              <Text style={styles.avlHeading}>{item?.title}</Text>
              {/* <Text style={styles.avlPara}>
                Posted on {moment(item?.updated_at).format('LL')}
              </Text> */}
            </View>

            {item?.summary && (
              <View style={{marginBottom: 15}}>
                <Text style={styles.itemHeading}>Summary</Text>
                <Text style={styles.para}>{item?.summary}</Text>
              </View>
            )}
            {item?.tags && (
              <View style={{marginBottom: 0}}>
                {/* <Text style={styles.itemHeading}>Related</Text> */}
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
                <RenderHTML
                  contentWidth={width - 40}
                  source={{html: item?.body}}
                />
              </View>
            )}

            <View style={styles.commentBox}>
              <View style={styles.hding}>
                <Text style={styles.hdingText}>Comments({allComments.length})</Text>
                <TouchableOpacity onPress={() => setOpen(true)} style={[styles.sendBtn,{marginTop:-3}]}>
                  <Text style={styles.sendText}>POST YOUR COMMENT</Text>
                </TouchableOpacity>
              </View>

              {allComments.map((i, index) => (
                <View style={styles.commentBox1}>
                  <Text style={styles.commentText}>{i?.comments}</Text>
                  <Text style={styles.commentUser}>{i?.user?.name}</Text>
                </View>
              ))}

              
            </View>
          </ScrollView>
       
      </LinearGradient>


        <ModalView
          visible={open}
          setVisible={() => setOpen(false)}
          style={{
            height: 'auto',
            marginTop: 260,
            justifyContent: 'flex-end',
            marginBottom: keyboardHeight - 150,
          }}
          heading={'Write your comment'}>
           
            <View style={styles.inputBox}>
                <TextInput
                  value={comments}
                  label={'Write your comments here...'}
                  onChangeText={setComments}
                  placeholder="Write your comments here..."
                  style={styles.input}
                  multiline={true}
                />
              </View>
              <TouchableOpacity style={styles.sendBtn} onPress={() => send()}>
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
           
          </ModalView>
    </View>
  );
};
export default BlogDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyBoardContainer: {
    // backgroundColor: '#fff',
    // textAlign: 'center',
    // alignItems: 'center',
    // top: 0,
    //  bottom: 20,
    //  position: 'absolute',
    // left: 20,
    // right: 20,
    // flex: 1,
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
    borderTopWidth:1,
    borderBottomWidth:1,
    paddingVertical:10,
    marginBottom:20,
    borderColor:'#ddd'
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
    marginTop: -15,
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
