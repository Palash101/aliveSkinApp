import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import ProductCard from '../../components/Card/ProductCard';
import {ProductContoller} from '../../controllers/ProductController';
import {UserContext} from '../../../context/UserContext';
import {IMAGE_BASE} from '../../config/ApiConfig';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import {DarkButton, ThemeButton, ThemeButton2} from '../../components/Buttons';
import {AddToCart, GetCartData} from '../../services/AddToCart';
import {Badge} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageLoader from '../../components/PageLoader';
import RenderHTML from 'react-native-render-html';
import {ModalView} from '../../components/ModalView';
import {Modal} from 'react-native-paper';

import useKeyboardHeight from 'react-native-use-keyboard-height';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProductDetails = props => {
  const {getToken, getUser} = useContext(UserContext);
  const [user, setUser] = useState();
  const [item, setItem] = useState();
  const navigation = useNavigation();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [cartData, serCartData] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [activeInfo, setActiveInfo] = useState();
  const [ingModal, setIngModal] = useState(false);
  const [code, setCode] = useState();
  const [codeError, setCodeError] = useState('');
  const [modalLoad, setModalLoad] = useState(false);
  const [more, setMore] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [checkDisabled, setCheckDisabled] = useState(false);
  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setAuthModal(false);
      setMore(false);
      setLoading(true);
      getDetail();
    });
    return unsubscribe;
  }, [props.route.params]);

  const getDetail = async () => {
    setQuantity(0);

    const instance = new ProductContoller();
    const result1 = await instance.productDetail(props.route.params.item.id);
    setItem(result1.products);

    AsyncStorage.getItem('CartData', (_err, result) => {
      console.log(result, 'resultresult');
      if (result) {
        serCartData(JSON.parse(result));
        let isPresent = JSON.parse(result).filter(
          i => i.productId === result1.products.id,
        );
        if (isPresent?.length) {
          setQuantity(isPresent[0].quantity);
        }
      }
    });

    setLoading(false);
  };

  const add = async val => {
    if (val === 'add' && quantity === 0 && item.auth === 'true') {
      setCheckDisabled(true);
      setCodeError('');
      setAuthModal(true);
      return false;
    } else {
      addToCart(val);
    }
  };

  const addToCart = async val => {
    setAuthModal(false);
    let qty = val === 'add' ? quantity + 1 : quantity - 1;
    let itemData = [
      {
        itemName: item.name,
        itemImage: item.images[0].image,
        category: item.product_categories.name,
        productId: item.id,
        quantity: qty,
        price: item.discount === 'true' ? item.discount_price : item.price,
        actualPrice: item.price,
        total:
          item.discount === 'true'
            ? item.discount_price * qty
            : item.price * qty,
      },
    ];

    if (code && code !== '') {
      itemData[0].code = code;
    }

    setQuantity(qty);

    console.log(itemData);

    AsyncStorage.getItem('CartData', (_err, result) => {
      let allData = [];
      if (result) {
        let prData = JSON.parse(result).filter(i => i.productId !== item.id);
        allData = [...prData, ...itemData];
        AsyncStorage.setItem('CartData', JSON.stringify(allData));
        serCartData(allData);
      } else {
        allData = itemData;
        AsyncStorage.setItem('CartData', JSON.stringify(allData));
        serCartData(allData);
      }
    });
  };

  const showInfo = info => {
    setActiveInfo(info);
    setIngModal(true);
  };

  // const saveAnswer = async (q, val) => {
  //   let newQ = q;
  //   newQ.answer = val;
  //   let remainData = [];
  //   data.map(i => {
  //     if (i.id === q.id) {
  //       remainData.push(newQ);
  //     } else {
  //       remainData.push(i);
  //     }
  //   });

  //   setData(remainData);
  //   console.log(remainData, 'dd');

  //   let allAnswer = remainData.filter(j => j.answer && j.answer != '');
  //   if (allAnswer.length === remainData.length) {
  //     setCheckDisabled(false);
  //   } else {
  //     setCheckDisabled(true);
  //   }
  // };

  const checkCode = async () => {
    setModalLoad(true);
    setCodeError('');
    const instance = new ProductContoller();
    const result = await instance.checkCode(item.id, code);
    if (result.status === true) {
      setModalLoad(false);
      addToCart('add');
    } else {
      setCodeError('Please enter valid code.');
      setModalLoad(false);
    }
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

      {loading ? (
        <PageLoader loading={loading} />
      ) : (
        <>
          <ScrollView style={{flex: 1, marginTop: 10}}>
            <View style={styles.imageSection}>
              <FlatList
                horizontal={true}
                data={item.images}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {x: scrollX}}}],
                  {
                    useNativeDriver: false,
                  },
                )}
                pagingEnabled
                decelerationRate={'normal'}
                scrollEventThrottle={16}
                renderItem={(item1, key) => (
                  <Image
                    source={{uri: IMAGE_BASE + item1?.item.image}}
                    style={styles.bannerImage}
                  />
                )}
              />

              <ExpandingDot
                data={item.images}
                expandingDotWidth={30}
                scrollX={scrollX}
                inActiveDotOpacity={0.6}
                inActiveDotColor="#563925"
                activeDotColor="#563925"
                dotStyle={{
                  width: 10,
                  height: 10,
                  backgroundColor: '#563925',
                  borderRadius: 5,
                  marginHorizontal: 5,
                }}
                containerStyle={{
                  bottom: 30,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
            </View>
            <View style={styles.content}>
              <View style={styles.titleBox}>
                <View style={{width: width - 110}}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.category}>
                    {item.product_categories.name}
                  </Text>
                </View>
                <View>
                  <Text style={styles.price}>
                    {item.discount === 'true'
                      ? item.discount_price
                      : item.price}{' '}
                    KD
                  </Text>
                  {item.discount === 'true' ? (
                    <Text style={styles.price2}>{item.price} KD</Text>
                  ) : (
                    <></>
                  )}
                </View>
              </View>

              {item.description && item.description !== null && (
                <View
                  style={[
                    styles.description,
                    {
                      height: more ? 'auto' : 155,
                      paddingBottom: 30,
                      overflow: 'hidden',
                    },
                  ]}>
                  <View
                    style={{height: more ? 'auto' : 115, overflow: 'hidden'}}>
                    <RenderHTML
                      contentWidth={width - 40}
                      source={{html: item.description}}
                    />
                  </View>
                  {!more ? (
                    <Text
                      style={{
                        position: 'absolute',
                        bottom: 39,
                        right: 7,
                        backgroundColor: '#f2f2f2',
                        paddingHorizontal: 4,
                      }}>
                      .....
                    </Text>
                  ) : (
                    <></>
                  )}
                  <TouchableOpacity
                    onPress={() => setMore(!more)}
                    style={{
                      margin: 5,
                      position: 'absolute',
                      bottom: 5,
                      right: 25,
                    }}>
                    <Text style={{fontFamily: 'Gotham-Medium', fontSize: 12}}>
                      {more ? 'Read less' : 'Read more'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {item.ingredients && (
                <View style={styles.ingBox}>
                  <Text style={styles.title}>Ingredients</Text>
                  <View style={styles.ingList}>
                    {item.ingredients.map((i, index) => (
                      <View key={index + 'ing'} style={styles.ingItem}>
                        <Image
                          source={assets.checked}
                          style={{width: 12, height: 12, tintColor: i.color}}
                        />
                        <Text style={styles.ingName}>{i.name}</Text>

                        {i?.description?.length > 0 ? (
                          <TouchableOpacity onPress={() => showInfo(i)}>
                            <Image
                              source={assets.info}
                              style={{width: 12, height: 12, tintColor: '#888'}}
                            />
                          </TouchableOpacity>
                        ) : (
                          <></>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerPrice}>
                {item.discount === 'true' ? item.discount_price : item.price} KD
              </Text>
              {item.discount === 'true' && (
                <Text style={styles.footerPrice2}>{item.price} KD</Text>
              )}
            </View>
            {quantity <= 0 ? (
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => add('add')}>
                <Image source={assets.cart} style={styles.cartImage} />
                <Text style={styles.cartButtonText}>Add to cart</Text>
              </TouchableOpacity>
            ) : (
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <View style={[styles.bottomWrap, {paddingTop: 5}]}>
                  <TouchableOpacity
                    style={styles.minus}
                    onPress={() => addToCart('minus')}>
                    <Text style={styles.minusText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.plus}
                    onPress={() => addToCart('add')}>
                    <Text style={styles.plusText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[styles.cartButton, {width: 120}]}
                  onPress={() => navigation.navigate('Cart')}>
                  <Image source={assets.cart} style={styles.cartImage} />
                  <Text style={styles.cartButtonText}>Go to cart</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}

      <ModalView
        visible={authModal}
        setVisible={() => setAuthModal(false)}
        style={{
          height: 'auto',
          marginTop: 260,
          justifyContent: 'flex-end',
          marginBottom: keyboardHeight,
        }}
        heading={
          <View style={{flexDirection: 'row', paddingHorizontal: 15}}>
            <Text
              style={{
                fontSize: 18,
                marginLeft: 10,
                fontFamily: 'Gill Sans Medium',
              }}>
              Please enter your authentication code
            </Text>
          </View>
        }>
        <View style={{paddingHorizontal: 10}}>
          {/* {data.map((i, index) => (
              <View style={styles.qbox}>
                <Text style={styles.label}>{i.question}</Text>
                <View style={styles.answerBox}>
                  {i.type === 'option' ? (
                    <>
                      {i.options.map((j, ind1) => (
                        <TouchableOpacity
                          onPress={() => saveAnswer(i, j)}
                          style={[
                            styles.answerItem,
                            i.answer === j ? styles.activeAnswer : {},
                          ]}>
                          <Text style={[styles.answerText]}>{j}</Text>
                        </TouchableOpacity>
                      ))}
                    </>
                  ) : (
                    <>
                      {i.type === 'boolean' ? (
                        <>
                          <TouchableOpacity
                            onPress={() => saveAnswer(i, 'Yes')}
                            style={[
                              styles.answerItem,
                              i.answer === 'Yes' ? styles.activeAnswer : {},
                            ]}>
                            <Text style={[styles.answerText]}>Yes</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => saveAnswer(i, 'No')}
                            style={[
                              styles.answerItem,
                              i.answer === 'No' ? styles.activeAnswer : {},
                            ]}>
                            <Text style={[styles.answerText]}>No</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <View style={styles.inputBox}>
                            <TextInput
                              value={data[index].answer}
                              label={''}
                              onChangeText={val => saveAnswer(i, val)}
                              placeholder=""
                              style={styles.input}
                            />
                          </View>
                        </>
                      )}
                    </>
                  )}
                </View>
              </View>
            ))} */}

          <View style={styles.inputBox}>
            <TextInput
              value={code}
              label={''}
              onChangeText={setCode}
              placeholder="Enter you code "
              style={styles.input}
            />
          </View>
          <Text
            style={{
              color: 'red',
              fontSize: 12,
              position: 'absolute',
              marginTop: 45,
              marginLeft: 10,
            }}>
            {codeError}
          </Text>
          <TouchableOpacity
            disabled={!code}
            style={[
              styles.cartButton,
              {
                width: 120,
                marginTop: 10,
                alignItems: 'center',
                alignSelf: 'flex-end',
              },
              code ? {opacity: 1} : {opacity: 0.5},
            ]}
            onPress={() => checkCode()}>
            {modalLoad ? (
              <ActivityIndicator size={16} />
            ) : (
              <>
                <Image source={assets.cart} style={styles.cartImage} />
                <Text style={styles.cartButtonText}>Add to Cart</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ModalView>

      <Modal
        visible={ingModal}
        onDismiss={() => setIngModal(false)}
        style={{
          height: 460,
          marginTop: 260,
          justifyContent: 'flex-end',
        }}>
        <View style={styles.modalBox}>
          <View style={{flexDirection: 'row', paddingHorizontal: 15}}>
            <Image
              source={assets.checked}
              style={{width: 18, height: 16, tintColor: activeInfo?.color}}
            />
            <Text
              style={{
                fontSize: 18,
                marginLeft: 10,
                fontFamily: 'Gill Sans Medium',
              }}>
              {activeInfo?.name}
            </Text>
          </View>
          <ScrollView contentContainerStyle={{padding: 15}}>
            <RenderHTML
              contentWidth={width - 40}
              source={{html: activeInfo?.description}}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};
export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalBox: {
    paddingTop: Platform.OS === 'ios' ? 30 : 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    position: 'absolute',
    bottom: -140,
    left: 0,
    right: 0,
    height: 400,
  },
  titleHeading: {
    flexDirection: 'row',
  },
  titleText: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    fontSize: 14,
    color: '#161415',
    fontFamily: 'Gill Sans Medium',
    textTransform: 'uppercase',
  },
  activeAnswer: {
    backgroundColor: '#E2D8CF',
  },
  qbox: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  answerBox: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  answerItem: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  answerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  label: {
    color: '#000',
    fontFamily: 'Gotham-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  inputBox: {
    backgroundColor: '#ddd',
    marginTop: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 6,
    padding: 6,
    marginBottom: 10,
  },
  input: {
    width: width - 170,
    marginLeft: 5,
    paddingVertical: 5,
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Gotham-Book',
  },
  ingList: {
    paddingLeft: 15,
    paddingVertical: 5,
  },
  ingItem: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 4,
  },
  ingName: {
    fontSize: 12,
    marginHorizontal: 5,
    fontFamily: 'Gotham-Book',
  },
  titleBox: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    padding: 15,
  },
  bottomWrap: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 10,
  },
  plus: {
    backgroundColor: '#563925',
    width: 24,
    height: 24,
    textAlign: 'center',
    borderRadius: 4,
  },
  plusText: {
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 14,
    color: '#fff',
  },
  qtyText: {
    width: 24,
    height: 24,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  minus: {
    backgroundColor: '#563925',
    width: 24,
    height: 24,
    textAlign: 'center',
    borderRadius: 4,
  },
  minusText: {
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 14,
    color: '#fff',
  },

  footer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyButton: {
    padding: 10,
    backgroundColor: '#563925',
    width: width / 2 - 30,
    textAlign: 'center',
    borderRadius: 20,
  },
  cartButton: {
    padding: 10,
    display: 'flex',
    backgroundColor: '#563925',
    flexDirection: 'row',
    width: width / 2 - 30,
    justifyContent: 'center',
    borderRadius: 20,
  },
  cartImage: {
    width: 16,
    height: 16,
    tintColor: '#fff',
    marginRight: 10,
  },
  buyButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  },
  cartButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Gill Sans Medium',
  },
  imageSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  bannerImage: {
    width: width,
    height: 250,
    objectFit: 'contain',
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Gill Sans Medium',
    lineHeight: 16,
  },
  category: {
    color: '#888',
    lineHeight: 20,
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Gill Sans Medium',
  },
  footerPrice: {
    color: '#563925',
    fontWeight: '600',
    marginTop: 5,
    fontSize: 18,
    fontFamily: 'Gotham-Medium',
  },
  footerPrice2: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  price: {
    color: '#563925',
    fontSize: 18,
    fontFamily: 'Gotham-Medium',
  },
  price2: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginTop: 3,
    marginBottom: 6,
  },
  description: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 20,
  },
  descText: {
    fontSize: 12,
    fontFamily: 'Gotham-Light',
    lineHeight: 16,
  },

  bg: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
