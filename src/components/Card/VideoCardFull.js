import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {VideoButton} from '../Buttons';
import {assets} from '../../config/AssetsConfig';
import {IMAGE_BASE} from '../../config/ApiConfig';
import { LikeSection } from '../LikeSection';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const VideoCardFull = props => {
  const {item} = props;
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.videoCard}>
      <ImageBackground
        source={{uri: IMAGE_BASE + item.bannerImage}}
        resizeMode="cover"
        style={styles.videoCardbg}>
       <LikeSection
          like={() => console.log()}
          liked={item?.my_like?.like === 'Liked' ? 'Liked' : 'Uniked'}
          likeCount={item?.like_count}
          viewCount={item?.view_count}
          commentCount={item?.view_count}
        />

        <View style={styles.videoBottom}>
          <View style={{borderWidth:2,height:54,width:54,paddingVertical:13,paddingHorizontal:15,
          borderColor:'#fff',borderRadius:44,backgroundColor:'rgba(255,255,255,0.3)'}}>
            <Image
              source={assets.play}
              style={{width: 24, height: 24, tintColor: '#fff'}}
            />
          </View>
        </View>
        <Text style={styles.videoTitle}>{item?.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default VideoCardFull;
const styles = StyleSheet.create({
  videoCard: {
    backgroundColor: '#ddd',
    marginRight: 10,
    marginVertical: 10,
    borderRadius: 10,
    height: 220,
    width: width - 30,
    overflow: 'hidden',
  },
  videoCardbg: {
    flex: 1,
    padding: 10,
  },
  videoTitle: {
    fontWeight: '600',
    fontSize: 18,
    width: width,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    fontFamily: 'Gill Sans Medium',
    textTransform: 'capitalize',
    color: '#fff',
    bottom: 0,
    position: 'absolute',
  },
  videoBottom: {
    position: 'absolute',
    bottom: 10,
    display: 'flex',
    flexDirection: 'row',
    left: 0,
    right: 0,
    top: 80,
    margin: 'auto',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  time: {
    backgroundColor: '#BBBEB3',
    paddingHorizontal: 5,
    height: 20,
    lineHeight: 20,
    fontWeight: '600',
    borderRadius: 8,
    overflow: 'hidden',
    fontSize: 12,
    marginTop: 5,
  },
});
