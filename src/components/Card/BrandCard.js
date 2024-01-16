import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {IMAGE_BASE} from '../../config/ApiConfig';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const BrandCard = props => {
  const {item} = props;
  return (
    <ImageBackground
      source={{uri: IMAGE_BASE + item.image}}
      resizeMode="cover"
      style={styles.videoCardbg}>
      <TouchableOpacity onPress={props.onPress} style={styles.content}>
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default BrandCard;
const styles = StyleSheet.create({
  card: {
    height: width / 3 + 20,
    width: width / 3 - 20,
    marginBottom: 20,
    marginTop: 20,
  },
  videoCardbg: {
    height: width / 3 + 20,
    width: width / 3 - 20,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    borderRadius: 8,
  },
  content: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    position: 'relative',
    marginBottom: 0,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Gill Sans Medium',
  },
});
