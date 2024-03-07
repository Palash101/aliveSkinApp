import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
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
import {Badge} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Product = () => {
  const {getToken, getUser} = useContext(UserContext);
  const [user, setUser] = useState();
  const [products, setProducts] = useState();
  const [activePage, setActivePage] = useState(1);
  const [total, setTotal] = useState();
  const [brands, setBrands] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [barCategories, setBarCategories] = useState([
    {name: 'Featured'},
    {name: 'Brands'},
    {name: 'All'},
  ]);
  const [recommandProducts, setRecommandProduct] = useState([]);
  const [activeCategory, setActiveCategory] = useState({name: 'Featured'});
  const navigation = useNavigation();
  const [cartData, serCartData] = useState(0);
  const [search, setSearch] = useState();

  const scrollY = new Animated.Value(0);

  useEffect(() => {
    getCategories();
    getBrands();
    getRecomandProducts();
    getallProducts();
    const unsubscribe = navigation.addListener('focus', () => {
      AsyncStorage.getItem('CartData', (_err, result) => {
        if (result) {
          serCartData(JSON.parse(result));
        }
      });
    });
    return unsubscribe;
  }, []);

  const getCategories = async () => {
    const instance = new ProductContoller();
    const cat = await instance.category();

    let array = [{name: 'Featured'}, {name: 'Brands'}, {name: 'All'}];
    console.log(cat.tops.data, 'cat.tops.data');
    // cat.tops.data.forEach(element => {
    //   array.push({name: element.name});
    // });
    cat.categories.forEach(element => {
      array.push({name: element.name});
    });
    console.log(array, 'arrayarray');
    setBarCategories(array);
  };

  const getRecomandProducts = async () => {
    const token = await getToken();
    if (token) {
      const instance = new ProductContoller();
      const result = await instance.recommandProducts(token);
      console.log(result, token, 'recomanddd');
      setRecommandProduct(result.recomendation);
    }
  };

  useEffect(() => {
    console.log(activeCategory, 'activecategory');
    setActivePage(1);
    // setProducts([]);
    setTotal(0);
    if (activeCategory.name != 'Featured' && activeCategory.name != 'Brands') {
      if (activeCategory.name === 'All') {
        getFilterProduct('');
      } else {
        getFilterProduct(activeCategory.name);
      }
    } else if (activeCategory.name === 'Featured') {
      getallProducts();
    } else {
      getBrands();
    }
  }, [activeCategory]);

  const getFilterProduct = async name => {
    setLoadMore(true);
    setProducts();
    const instance = new ProductContoller();
    const result = await instance.allProducts(name, 1);
    console.log(result);
    setLoadMore(false);
    setTotal(result.products.total);
    setProducts(result.products?.data);
  };

  const getallProducts = async () => {
    // setLoadMore(true);
    const instance = new ProductContoller();
    const result = await instance.allProducts('', activePage);
    console.log(result);
    setProducts(result.products?.data);
    setTotal(result.products.total);
    setLoadMore(false);
  };

  const getBrands = async () => {
    // setLoadMore(true);
    const instance = new ProductContoller();
    const result = await instance.brands();
    console.log(result);
    setLoadMore(false);
    setBrands(result.brands);
  };

  const goToProgram = item => {
    navigation.navigate('ProductDetails', {item: item});
  };

  const loadClick = async () => {
    setLoadMore(true);
    const instance = new ProductContoller();
    const newActivePage = activePage + 1;
    setActivePage(newActivePage);
    let prName = '';
    if (activeCategory.name === 'All') {
      prName = '';
    } else {
      prName = activeCategory.name;
    }
    const result = await instance.allProducts(prName, newActivePage);
    console.log(result);
    setLoadMore(false);
    setTotal(result.products.total);
    setProducts([...products, ...result.products?.data]);
  };

  const goToSearch = async () => {
    navigation.navigate('SearchProducts', {search: search});
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <View style={styles.bg}>
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
        <TouchableOpacity
          style={{
            width: 32,
            height: 24,
            marginTop: -7,
            marginBottom: -7,
            right: 10,
            padding: 7,
          }}
          onPress={() => goToSearch()}>
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

      <View style={styles.categories}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {barCategories.map((item, index) => (
            <TouchableOpacity
              key={index + 'cat'}
              style={[
                styles.catItem,
                item.name === activeCategory.name ? styles.activeCat : '',
              ]}
              onPress={() => setActiveCategory(item)}>
              <Text
                style={[
                  styles.catText,
                  item.name === activeCategory.name ? styles.activeCatText : '',
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {activeCategory?.name === 'Featured' ? (
        <ScrollView
          contentContainerStyle={{paddingBottom: 20}}
          style={{padding: 15, marginTop: 0}}>
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>New In</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{gap: 10}}>
              {products?.map((item, index) => (
                <ProductCard
                  onPress={goToProgram}
                  item={item}
                  key={index + 'new'}
                  active={index % 2 != 0}
                />
              ))}
            </ScrollView>

            {loadMore && <ActivityIndicator style={{marginVertical: 50}} />}
          </View>

          {recommandProducts?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Recommended Products </Text>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 10}}>
                {recommandProducts.map((item, index) => (
                  <ProductCard
                    onPress={goToProgram}
                    item={item?.product}
                    key={index + 'recommand'}
                    active={index % 2 != 0}
                  />
                ))}
              </ScrollView>

              {loadMore && <ActivityIndicator style={{marginVertical: 50}} />}
            </View>
          ) : (
            <></>
          )}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Shop by Brands</Text>

            <View style={styles.bandSection}>
              {brands?.map((item, index) => (
                <BrandCard
                  onPress={() =>
                    navigation.navigate('BrandDetails', {item: item})
                  }
                  item={item}
                  key={index + 'brand'}
                  active={index % 2 != 0}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <></>
      )}

      {activeCategory?.name === 'Brands' && (
        <ScrollView
          style={{flex: 1, padding: 15, marginTop: 0, paddingBottom: 150}}>
          <View style={styles.section}>
            <View style={styles.bandSection}>
              {brands?.map((item, index) => (
                <BrandCard
                  onPress={() =>
                    navigation.navigate('BrandDetails', {item: item})
                  }
                  item={item}
                  key={index + 'br2'}
                  active={index % 2 != 0}
                />
              ))}
            </View>
            {loadMore && <ActivityIndicator />}
          </View>
        </ScrollView>
      )}

      {activeCategory?.name != 'Featured' &&
        activeCategory?.name != 'Brands' && (
          <ScrollView
            style={{flex: 1, padding: 15, marginTop: 0}}
            onScroll={Animated.event([
              {nativeEvent: {contentOffset: {y: scrollY}}},
            ])}
            onMomentumScrollEnd={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                loadClick();
              }
            }}>
            <View style={[styles.section, {paddingBottom: 80}]}>
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
              {loadMore && <ActivityIndicator />}
              {/* {total != products?.length && (
                  <>
                    {!loadMore && (
                      <TouchableOpacity
                        style={{marginTop: 20}}
                        onPress={() => loadClick()}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontWeight: '600',
                            color: 'blue',
                            fontFamily: 'Gill Sans Medium',
                          }}>
                          Load More...
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )} */}
            </View>
          </ScrollView>
        )}
    </View>
  );
};
export default Product;

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
    top: 55,
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

  sectionHeading: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 15,
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
