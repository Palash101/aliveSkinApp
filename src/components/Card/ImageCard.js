import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {VideoButton} from '../Buttons';
import {assets} from '../../config/AssetsConfig';
import {IMAGE_BASE} from '../../config/ApiConfig';
import moment from 'moment';
import { LikeSection } from '../LikeSection';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const ImageCard = props => {
  const {item} = props;
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.card}>
      <ImageBackground
        source={{uri: IMAGE_BASE + item?.headerImage}}
        resizeMode="cover"
        style={styles.videoCardbg}>
        <View style={styles.tags}>
          {item?.tags &&
            JSON.parse(item?.tags)
              ?.slice(0, 3)
              .map((item1, index) => (
                <Text key={index + item.id + 'tag'} style={styles.tag}>
                  {item1}
                </Text>
              ))}
        </View>
        {/* <View style={styles.bottomBox}>
          <View style={styles.likeBox}>
            <Image
              source={assets.like}
              style={{
                width: 20,
                height: 20,
                tintColor: props.index == 2 ? 'red' : '#888',
              }}
            />
            <Text style={styles.likeText}>120 Likes</Text>
          </View>
          <View style={styles.viewBox}>
            <Image
              source={assets.view}
              style={{width: 20, height: 20, tintColor: '#888'}}
            />
            <Text style={styles.viewText}>120 Viewer</Text>
          </View>
        </View> */}
        <LikeSection
            like={() => console.log()}
            liked={item?.my_like?.like === 'Liked' ? 'Liked' : 'Uniked'}
            likeCount={item?.like_count}
            viewCount={item?.view_count}
            commentCount={item?.view_count}
          />

        <View style={styles.content}>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.para} ellipsizeMode="tail" numberOfLines={1}>
            Posted on {moment(item?.updated_at).format('LL')}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default ImageCard;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    height: 250,
    width: width - 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2D8CF',
  },
  videoCardbg: {
    flex: 1,
    padding: 10,
  },
  content: {
    backgroundColor: '#fff',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
    position: 'relative',
    fontFamily:'Gill Sans Medium'
  },
  para: {
    color: '#000',
    fontSize: 10,
    position: 'relative',
    fontFamily:'Gotham-Light',
    lineHeight:14
  },
  tags: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    position: 'absolute',
    bottom: 60,
    left: 10,
    right: 10,
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
    fontFamily:'Gill Sans Medium'
  },
  bottomBox: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
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
});
