import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {UserContext} from '../../../context/UserContext';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import ProductCard from '../../components/Card/ProductCard';
import {ProductContoller} from '../../controllers/ProductController';
import BrandCard from '../../components/Card/BrandCard';
import ProductCard2 from '../../components/Card/ProductCard2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageLoader from '../../components/PageLoader';
import { Badge } from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SearchProducts = props => {
  const {getToken, getUser} = useContext(UserContext);
  const [products, setProducts] = useState();
  const [activePage, setActivePage] = useState(1);
  const [loadMore, setLoadMore] = useState(true);

  const navigation = useNavigation();
  const [cartData, serCartData] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      AsyncStorage.getItem('CartData', (_err, result) => {
        if (result) {
          serCartData(JSON.parse(result));
        }
      });
      setSearch(props.route.params.search);
      searchNow(props.route.params.search);
    });
    return unsubscribe;
  }, [props.route.params]);

  const searchNow = async search => {
    setLoadMore(true);
    const instance = new ProductContoller();
    const result = await instance.searchProducts(search);
    setProducts(result.products.data);
    setLoadMore(false);
  };

  const goToProgram = item => {
    navigation.navigate('ProductDetails', {item: item});
  };

  return (
    <View style={styles.bg}>
      <PageLoader loading={loadMore} />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          marginLeft: 10,
          marginTop: 55,
        }}>
        <Image
          source={assets.back}
          style={{width: 16, height: 16, tintColor: '#000', marginTop: 5}}
        />
      </TouchableOpacity>
      <View style={styles.searchBox}>
        <TextInput
          value={search}
          label={'Search'}
          onChangeText={setSearch}
          placeholder="Search"
          style={styles.input}
        />
        <TouchableOpacity onPress={() => searchNow(search)}>
          <Image source={assets.search} style={{width: 14, height: 14}} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{position: 'absolute', right: 20, top: 53, zIndex: 999}}
        onPress={() => navigation.navigate('Cart')}>
        {cartData?.length > 0 && (
          <Badge
            style={{position: 'absolute', top: -10, right: -10, zIndex: 9999}}>
            {cartData?.length}
          </Badge>
        )}
        <Image
          source={assets.cart}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>

      <ScrollView style={{flex: 1, padding: 15, marginTop: 10}}>
        <View style={[styles.section, {paddingBottom: 80}]}>
          <View style={styles.sh}>
            <Text style={styles.sectionHeading}>{search}</Text>
            <Text style={{fontSize: 12,fontFamily: 'Gill Sans Medium',lineHeight:18}}>({products?.length} Items found)</Text>
          </View>
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
        </View>
      </ScrollView>
    </View>
  );
};
export default SearchProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  AllProductSection: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bandSection: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  searchBox: {
    flexDirection: 'row',
    width: width - 100,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    top: 52,
    left: 40,
    padding: 6,
    borderRadius: 20,
  },
  input: {
    fontSize: 12,
    paddingLeft: 10,
    width: width - 130,
  },
  categories: {
    marginTop: 10,
  },
  catItem: {
    paddingHorizontal: 10,
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: '#ddd',
  },
  catText: {
    color: '#000',
    fontFamily: 'Gill Sans Medium',
    lineHeight: 20,
  },
  activeCat: {
    paddingHorizontal: 10,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: '#563925',
  },
  activeCatText: {
    color: '#563925',
    lineHeight: 20,
    fontFamily: 'Gill Sans Medium',
  },
  section: {
    paddingHorizontal: 0,
  },
  more: {
    color: '#5b6952',
    fontWeight: '600',
    fontSize: 14,
    position: 'absolute',
    right: 0,
    marginTop: 10,
  },
  card2Para: {
    fontSize: 12,
    color: '#333',
    marginTop: 7,
  },

  card2Top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card2Title: {
    color: '#000',
    fontSize: 16,
    width: '100%',
    position: 'relative',
    marginTop: 10,
    fontFamily: 'Gill Sans Medium',
  },

  sh: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontFamily: 'Gill Sans Medium',
  },

  heading: {
    display: 'flex',
    flexDirection: 'row',
  },
  username: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 24,
    paddingLeft: 5,
  },
  handIcon: {
    width: 24,
    height: 24,
  },
  logo: {
    position: 'absolute',
    resizeMode: 'cover',
    left: 0,
    right: 0,
    top: 0,
    height: height,
    width: width,
    bottom: -2,
    zIndex: 2,
  },
  bg: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
