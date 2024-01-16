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
import {assets} from '../../config/AssetsConfig';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const ProductCard2 = props => {
  const {item} = props;
  return (
    <View style={{paddingTop: 0}}>
      <TouchableOpacity onPress={() => props.onPress(item)} style={styles.card}>
        <Image
          source={{uri: IMAGE_BASE + item.images[0].image}}
          style={styles.videoCardbg}
        />
        <View style={styles.content}>
          <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.tag}>{item.product_categories.name}</Text>
          <View style={{flexDirection: 'row', columnGap: 10}}>
            {item.discount === 'true' && (
              <Text style={styles.crossPrice}>{item.price} KD</Text>
            )}
            <Text style={styles.price}>
              {item.discount === 'true' ? item.discount_price : item.price} KD
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {item?.auth === 'true' ? (
        <View style={styles.lockIconBox}>
          <Image source={assets.requirements} style={styles.lockIcon} />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default ProductCard2;
const styles = StyleSheet.create({
  card: {
    height: 194,
    width: width / 2 - 20,
    marginBottom: 15,
    overflow: 'hidden',
  },
  videoCardbg: {
    height: width / 2 - 60,
    paddingVertical: 10,
    width: width / 2 - 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    resizeMode:'contain',
    backgroundColor:'#fff'
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
  crossPrice: {
    color: '#888',
    fontWeight: '600',
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  lockIconBox: {
    position: 'absolute',
    width: 24,
    height: 24,
    padding: 5,
    right: 0,
    top: 0,
    backgroundColor: '#563925',
    borderBottomLeftRadius: 20,
    zIndex: 999,
  },
  lockIcon: {
    tintColor: '#fff',
    width: 14,
    height: 14,
  },
  price: {
    color: '#000',
    fontSize: 13,
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
    lineHeight: 16,
    fontFamily: 'Gill Sans Medium',
  },
});
