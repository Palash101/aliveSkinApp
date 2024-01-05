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

const RecommandedProductCard = props => {
  const {item} = props;
  return (
    <TouchableOpacity onPress={() => props.onPress(item)} style={styles.card}>
      {item?.featured_image && (
        <Image
          source={{uri: IMAGE_BASE + item?.featured_image}}
          style={styles.videoCardbg}
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
          {item?.name}
        </Text>
        {item?.product_categories?.name ? (
          <Text style={styles.tag} ellipsizeMode="tail" numberOfLines={1}>
            {item?.product_categories?.name}
          </Text>
        ) : (
          <></>
        )}
        <Text style={styles.price}>{item?.price} KD</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecommandedProductCard;
const styles = StyleSheet.create({
  card: {
    height: 170,
    width: width / 3,
    marginBottom: 10,
    overflow: 'hidden',
  },
  videoCardbg: {
    height: width / 3 + 10 - 20,
    paddingVertical: 10,
    width: width / 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  content: {
    padding: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: '#000',
    fontSize: 12,
    position: 'relative',
    marginBottom: 0,
    lineHeight: 20,
    fontFamily: 'Gill Sans Medium',
  },
  price: {
    color: '#000',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
    fontFamily: 'Gotham-Medium',
  },
  tags: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
  },
  tag: {
    fontSize: 12,
    color: '#888',
    lineHeight: 14,
    marginTop: -2,
    fontFamily: 'Gill Sans Medium',
  },
});
