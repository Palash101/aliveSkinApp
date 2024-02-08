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

const ProductCard = props => {
  const {item} = props;
  return (
    <View style={{paddingTop: 0}}>
      <TouchableOpacity onPress={() => props.onPress(item)} style={styles.card}>
        {item?.images && (
          <Image
            source={{uri: IMAGE_BASE + item?.images[0]?.image}}
            style={styles.videoCardbg}
          />
        )}

        <View style={styles.content}>
          <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
            {item?.name}
          </Text>
          <Text style={styles.tag} ellipsizeMode="tail" numberOfLines={1}>
            {item?.product_categories?.name}
          </Text>
          <View style={{flexDirection: 'row', columnGap: 10}}>
            {item.discount === 'true' && (
              <Text style={styles.crossPrice}>{item.price} KD</Text>
            )}
            <Text style={styles.price}>
              {item.discount === 'true' ? item.discount_price : item.price} KD
            </Text>
          </View>
        </View>
        {item.current_stock > 0 ? <></>:
          <View style={styles.stockBox}>
            <Text style={styles.stockText}>OUT OF STOCK</Text>
          </View>
        } 
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

export default ProductCard;
const styles = StyleSheet.create({
  card: {
    height: 178,
    width: width / 3,
    marginBottom: 15,
    overflow: 'hidden',
  },
  stockBox:{
    position:'absolute',
    backgroundColor:'rgba(255,255,255,0.6)',
    left:0,
    right:0,
    top:0,
    height:125,
    justifyContent:'center',
    display:'flex',
  },
  stockText:{
    textAlign:'center',
    color:'red',
    fontFamily:'Gotham-Book'
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
  videoCardbg: {
    height: width / 3 + 10 - 20,
    paddingVertical: 10,
    width: width / 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    resizeMode: 'contain',
    backgroundColor: '#fff',
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
    marginTop: 5,
    fontFamily: 'Gill Sans Medium',
  },
  crossPrice: {
    color: '#888',
    fontWeight: '600',
    fontSize: 13,
    textDecorationLine: 'line-through',
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
    lineHeight: 16,
    fontFamily: 'Gill Sans Medium',
  },
});
