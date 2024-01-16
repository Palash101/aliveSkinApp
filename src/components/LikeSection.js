import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {assets} from '../config/AssetsConfig';

export const LikeSection = ({
  likeCount,
  viewCount,
  commentCount,
  liked,
  like,
}) => {
  return (
    <View style={styles.bottomBox}>
      <TouchableOpacity onPress={() => like()} style={styles.likeBox}>
        <Image
          source={liked === 'Liked' ? assets.liked : assets.like}
          style={{
            width: 20,
            height: 20,
            tintColor: liked === 'Liked' ? 'red' : '#888',
          }}
        />
        <Text style={styles.likeText}>{likeCount > 0 ? likeCount:''}</Text>
      </TouchableOpacity>
      <View style={styles.viewBox}>
       
        <Image
          source={assets.view}
          style={{width: 20, height: 20, tintColor: '#888'}}
        />
        <Text style={styles.viewText}>{viewCount > 0 ? viewCount : ''}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBox: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    marginBottom: 15,
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
    fontSize: 12,
    margin: 4,
    fontWeight: '600',
    fontFamily: 'Gotham-Medium',
  },
  viewText: {
    fontSize: 12,
    margin: 4,
    fontWeight: '600',
    fontFamily: 'Gotham-Medium',
  },
});
