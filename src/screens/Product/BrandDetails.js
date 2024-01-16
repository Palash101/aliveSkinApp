import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
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
import {ProductContoller} from '../../controllers/ProductController';
import {FlatList} from 'react-native-gesture-handler';
import ProductCard from '../../components/Card/ProductCard';
import ProductCard2 from '../../components/Card/ProductCard2';
import DynamicHeader from '../../components/DynamicHeader';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const BrandDetails = props => {
  const activeColor = ['#fff', '#fff', 'rgba(225,215,206,1)'];
  let scrollOffsetY = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadMore, setLoadMore] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDetail();
    });
    return unsubscribe;
  }, [props.route.params]);

  const getDetail = async () => {
    console.log(props.route.params.item, 'dd');
    setItem(props.route.params.item);

    const instance = new ProductContoller();
    const result = await instance.productsByBrand(props.route.params.item.id);
    setProducts(result.products.data);
    setLoadMore(false);
  };
  const goToProgram = item => {
    navigation.navigate('ProductDetails', {item: item});
  };

  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={{uri: IMAGE_BASE + item?.image}}
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
              onPress={() => navigation.navigate('Home')}>
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
        image={item?.image}
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
          <View>
            <Text style={styles.avlHeading}>{item?.name}</Text>
          </View>

          {item?.descriptions && (
            <View style={{marginTop: 15}}>
              <Text style={[styles.sectionHeading, {marginBottom: 10}]}>
                Descriptions
              </Text>

              <RenderHTML
                contentWidth={width - 40}
                source={{html: item?.descriptions}}
              />
            </View>
          )}

          <View style={styles.section}>
            {products?.length ? (
              <Text style={styles.sectionHeading}>Products</Text>
            ) : (
              <></>
            )}
            <View style={[styles.AllProductSection]}>
              {products?.map((item, index) => (
                <ProductCard2
                  onPress={goToProgram}
                  item={item}
                  key={index + 'pr'}
                  active={index % 2 != 0}
                />
              ))}
            </View>

            {loadMore && <ActivityIndicator style={{marginVertical: 50}} />}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};
export default BrandDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 0,
    paddingTop: 50,
  },
  AllProductSection: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    fontSize: 16,
    marginVertical: 10,
    fontFamily: 'Gill Sans Medium',
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
  },

  avlHeading: {
    fontSize: 20,
    marginTop: 20,
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
