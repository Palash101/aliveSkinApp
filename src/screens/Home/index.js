import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {UserContext} from '../../../context/UserContext';
import VideoCard from '../../components/Card/VideoCard';
import {FlatList} from 'react-native-gesture-handler';
import ActivityCard from '../../components/Card/ActivityCard';
import ImageCard from '../../components/Card/ImageCard';
import PackageCard from '../../components/Card/PackageCard';
import {useNavigation} from '@react-navigation/native';
import {HomeController} from '../../controllers/HomeController';
import PageLoader from '../../components/PageLoader';
import ProductCard from '../../components/Card/ProductCard';
import {PackageController} from '../../controllers/PackageController';
import moment from 'moment';
import RecommandedProductCard from '../../components/Card/RecommandedProductCard';
import {BlogsController} from '../../controllers/BlogController';
import {ScheduleController} from '../../controllers/ScheduleController';
import {NotificationIcon} from '../../components/NotificationIcon';
import {PackageItem} from '../../components/PackageItem';
import {ProductContoller} from '../../controllers/ProductController';
import {AuthContoller} from '../../controllers/AuthController';
import {useToast} from 'react-native-toast-notifications';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NotificationController} from '../../controllers/NotificationController';
import {ExpandingDot} from 'react-native-animated-pagination-dots';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Home = () => {
  const {getToken, getUser, getAuth} = useContext(UserContext);
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const [packages, setPackages] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [beautyBlog, setBeautyBlog] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommandProducts, setRecommandProducts] = useState([]);
  const [packageItem, setPackageItem] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allPdfs, setAllPdfs] = useState([]);

  const [auth, setAuth] = useState(false);
  const [count, setCount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    getDataLoad();
    const unsubscribe = navigation.addListener('focus', () => {
      getUserDetail();
      getData();
      getBookings();
      getPackage();
      getFirebaseToken();
    });
    return unsubscribe;
  }, []);

  const getFirebaseToken = async () => {
    const newFirebaseToken = await messaging().getToken();
    const saveToken = await AsyncStorage.getItem('firebaseToken');

    if (!saveToken || saveToken !== newFirebaseToken) {
      const token = await getToken();
      const instance = new AuthContoller();
      const result = await instance.firebaseTokenUpdate(
        newFirebaseToken,
        token,
      );
      AsyncStorage.setItem('firebaseToken', newFirebaseToken);
    }
  };

  const getNotifications = async () => {
    const token = await getToken();
    const instance = new NotificationController();
    const result = await instance.getAllNotification(token);
    setCount(result?.count);
  };

  const getPackage = async () => {
    const token = await getToken();
    if (token) {
      getNotifications();
      const instance = new PackageController();
      const result = await instance.myPackage(token);
      setPackageItem(result.packages);
    }
  };

  const getBookings = async () => {
    const token = await getToken();
    if (token) {
      const instance = new ScheduleController();
      const result = await instance.allBookings(token);
      const filterData = result.bookings.filter(
        item =>
          (moment(item.date).isSame(new Date()) ||
            moment(item.date).isAfter(new Date())) &&
          item.status != 'Cancelled',
      );
      console.log(filterData, 'filterData');
      setAllBookings(filterData);
    }
  };

  const getUserDetail = async () => {
    const token = await getToken();
    if (token) {
      const instance = new AuthContoller();
      const result = await instance.profileDetails(token);
      setUser(result.user);
      setAuth(true);
      console.log(result, 'resss');
    }
  };
  const getData = async () => {
    const instance = new HomeController();
    const result = await instance.HomeData();
    setPackages(result?.packages?.data);

    const allPdfsData = await instance.AllPdfs();
    setAllPdfs(allPdfsData?.pdf);

    const instance1 = new BlogsController();
    const token = await getToken();
    if (token) {
      const instance2 = new ProductContoller();
      const recommandData = await instance2.recommandProducts(token);
      console.log(recommandData, 'recommandData');
      setRecommandProducts(recommandData?.recomendation);

      const result1 = await instance1.authAllBlogs('Blog', token);

      let blogAll = result1.blogs.filter(i => i.type === 'Normal');
      let beautyAll = result1.blogs.filter(i => i.type === 'BeautyTips');
      setBlogs(blogAll);
      setBeautyBlog(beautyAll);
      const result2 = await instance1.authAllBlogs('Video', token);
      setVideos(result2?.videos);
    } else {
      setBlogs(result?.blogs.data);
      setVideos(result?.videos?.data);
      setBeautyBlog(result?.beautyTips.data);
    }
    setLoading(false);
  };

  const getDataLoad = async () => {
    // setLoading(true);
    getData();
  };

  const goToProgram = item => {
    navigation.navigate('ProgramDetails', {item: item});
  };

  const goToPdfs = item => {
    navigation.navigate('PdfDetail', {item: item});
  };
  const goToProduct = item => {
    navigation.navigate('ProductDetails', {item: item});
  };
  const goToAppointment = async () => {
    const token = await getToken();
    if (token) {
      if (packageItem?.length > 0 || user.type === 'Old') {
        navigation.navigate('Slots');
      } else {
        toast.show('Please purchase package for book appointments.');
      }
    } else {
      toast.show('Please login for book appointments.');
    }
  };

  const images = [
    {
      image: '../../assets/images/bg1.jpeg',
    },
    {
      image: '../../assets/images/banner2.jpeg',
    },
    {
      image: '../../assets/images/banner3.jpeg',
    },
  ];
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <>
      {loading === true ? (
        <PageLoader loading={loading} />
      ) : (
        <ImageBackground resizeMode="cover" style={styles.bg}>
          <View style={styles.bgTop}></View>

          <TouchableOpacity
            style={{
              marginLeft: 20,
              marginTop: 50,
              backgroundColor: '#000',
              width: 28,
              height: 28,
              alignItems: 'center',
              borderRadius: 5,
            }}
            onPress={() => navigation.openDrawer()}>
            <Image
              source={assets.hamburger}
              style={{width: 16, height: 16, tintColor: '#fff', marginTop: 5}}
            />
          </TouchableOpacity>

          {user && user?.name ? (
            <NotificationIcon
              count={count}
              onPress={() => navigation.navigate('Notification')}
            />
          ) : (
            <></>
          )}

          <PageLoader loading={loading} />

          <ScrollView style={{flex: 1, padding: 15, paddingBottom: 50}}>
            {user && user?.name ? (
              <View style={styles.heading}>
                <Image source={assets.hi} style={styles.handIcon} />
                <Text style={styles.username}>Hi, {user?.name}</Text>
              </View>
            ) : (
              <></>
            )}

            <View style={{marginBottom: 30}}>
              <FlatList
                horizontal={true}
                data={images}
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
                renderItem={(item, key) => (
                  <View style={styles.slider}>
                    <Image source={assets.banner} style={styles.sliderImage} />
                  </View>
                )}
              />

              <ExpandingDot
                data={images}
                expandingDotWidth={30}
                scrollX={scrollX}
                inActiveDotOpacity={0.6}
                inActiveDotColor="#5b6952"
                activeDotColor="#5b6952"
                dotStyle={{
                  width: 10,
                  height: 10,
                  backgroundColor: '#5b6952',
                  borderRadius: 5,
                  marginHorizontal: 5,
                }}
                containerStyle={{
                  bottom: -25,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
            </View>

            {allBookings?.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionHeading}>
                  Upcoming Appointments{' '}
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{gap: 10}}>
                  {allBookings.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Chat', {item: item})}
                      style={styles.bookingBox}>
                      <Text style={styles.date}>
                        {moment(item.date).format('DD')}
                      </Text>
                      <Text style={styles.month}>
                        {moment(item.date).format('MMM')}
                      </Text>
                      <Text style={styles.year}>
                        {moment(item.date).format('YYYY')}
                      </Text>

                      <Text style={styles.time}>
                        {moment(item.date).format('HH:mm A')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <></>
            )}

            <View style={styles.aboutBox}>
              <Image source={assets.image2} style={styles.aboutImage} />
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.abTitle}>Alive.Skin</Text>
                <Text style={styles.abPara}>Start your concern with me</Text>
                <TouchableOpacity
                  style={{
                    marginTop: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: '#5b6952',
                    padding: 5,
                    borderRadius: 8,
                  }}
                  onPress={() => goToAppointment()}>
                  <Image
                    source={assets.calendar}
                    style={{
                      width: 12,
                      tintColor: '#fff',
                      height: 12,
                      marginRight: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Gill Sans Medium',
                      fontWeight: '600',
                      fontSize: 12,
                    }}>
                    Add New Appointment
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {recommandProducts?.length ? (
              <View style={[styles.section, {marginTop: 20}]}>
                <Text style={styles.sectionHeading}>Recommended Products </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{gap: 10}}>
                  {recommandProducts.map((item, index) => (
                    <RecommandedProductCard
                      onPress={goToProduct}
                      item={item?.product}
                      key={index + 'recommend'}
                      active={index % 2 != 0}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : (
              <></>
            )}

            {packageItem?.length && packageItem[0].bookings != 0 ? (
              <>
                {/* <View style={styles.section}>
                  <FlatList
                    data={packageItem}
                    pagingEnabled
                    contentContainerStyle={{gap: 10}}
                    showsHorizontalScrollIndicator={false}
                    decelerationRate={'normal'}
                    renderItem={({item, index}) => (
                      <PackageItem
                        upgrade={() => navigation.navigate('Package')}
                        item={item}
                      />
                    )}
                  />
                </View> */}
              </>
            ) : (
              <View style={[styles.section, {marginTop: 10, marginBottom: 0}]}>
                <Text style={[styles.sectionHeading, {marginBottom: 0}]}>
                  Consulting packages
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Package')}
                  style={styles.moreBox}>
                  <Text style={styles.more}>More...</Text>
                </TouchableOpacity>

                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {packages
                    ?.sort((a, b) => a.position - b.position)
                    .map((item, index) => (
                      <PackageCard
                        key={index + 'Package'}
                        onPress={() =>
                          navigation.navigate('PackageDetail', {item: item})
                        }
                        item={item}
                        index={index}
                      />
                    ))}
                </ScrollView>
              </View>
            )}

            <View style={[styles.section, {marginTop: 15}]}>
              <Text style={[styles.sectionHeading, {marginBottom: 0}]}>
                Personal Program in Videos
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Programs')}
                style={styles.moreBox}>
                <Text style={styles.more}>See More</Text>
              </TouchableOpacity>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {videos.map((item, index) => (
                  <VideoCard
                    item={item}
                    onPress={() => goToProgram(item)}
                    key={index + 'Video'}
                  />
                ))}
              </ScrollView>
            </View>
            {allPdfs ? (
              <View style={[styles.section, {marginTop: 15}]}>
                <Text style={[styles.sectionHeading, {marginBottom: 0}]}>
                  Personal Program in Documents
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Pdfs')}
                  style={styles.moreBox}>
                  <Text style={styles.more}>See More</Text>
                </TouchableOpacity>

                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {allPdfs?.map((item, index) => (
                    <ActivityCard
                      item={item}
                      onPress={() => goToPdfs(item)}
                      key={index + 'pdf'}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : (
              <></>
            )}

            <View style={[styles.section, {marginTop: 10}]}>
              <Text style={styles.sectionHeading}>Beauty Tips</Text>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 10}}>
                {beautyBlog.map((item, index) => (
                  <ImageCard
                    onPress={() =>
                      navigation.navigate('BlogDetails', {item: item})
                    }
                    item={item}
                    key={index + 'beautyVideo'}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={[styles.section, {marginBottom: 50, marginTop: 20}]}>
              <Text style={styles.sectionHeading}>Blogs</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('blogs')}
                style={styles.moreBox}>
                <Text style={styles.more}>See More</Text>
              </TouchableOpacity>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 10}}>
                {beautyBlog.map((item, index) => (
                  <ImageCard
                    onPress={() =>
                      navigation.navigate('BlogDetails', {item: item})
                    }
                    item={item}
                    key={index + 'Video'}
                  />
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </ImageBackground>
      )}
    </>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgTop: {
    position: 'absolute',
    height: 300,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#5b6952',
  },
  slider: {
    marginTop: 10,
  },
  sliderImage: {
    height: 300,
    width: width - 30,
    borderRadius: 10,
  },
  aboutBox: {
    marginTop: 30,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#d7d5da',
    padding: 10,
    borderRadius: 10,
  },
  aboutImage: {
    width: 102,
    height: 102,
  },
  abTitle: {
    fontFamily: 'Gill Sans Medium',
    fontSize: 16,
  },
  abPara: {
    fontFamily: 'Gotham-Book',
    fontSize: 12,
  },
  bookingBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderColor: '#5b6952',
    overflow: 'hidden',
  },
  bidBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bid: {
    fontFamily: 'Gotham-Medium',
    fontSize: 12,
  },
  date: {
    marginTop: 10,
    fontFamily: 'Gotham-Black',
    textAlign: 'center',
    fontSize: 26,
  },
  month: {
    marginTop: 2,
    fontFamily: 'Gotham-Book',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  year: {
    marginTop: 2,
    fontFamily: 'Gotham-Boook',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 30,
  },
  at: {
    marginTop: 5,
    fontFamily: 'Gotham-Medium',
    textAlign: 'center',
  },
  time: {
    marginTop: 5,
    fontFamily: 'Gotham-Medium',
    textAlign: 'center',
    fontSize: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 5,
    backgroundColor: '#d7d5da',
  },
  section: {
    marginTop: 0,
  },

  moreBox: {
    position: 'absolute',
    right: 0,
    marginTop: 10,
  },
  more: {
    color: '#5b6952',
    fontSize: 14,
    marginTop: 6,
    fontFamily: 'Gill Sans Medium',
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
    fontWeight: '600',
    fontSize: 16,
    width: '100%',
    position: 'relative',
    marginTop: 10,
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    fontFamily: 'Gill Sans Medium',
  },

  packages: {
    marginTop: 10,
  },
  ptitle: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Gill Sans Medium',
  },
  pappoint: {
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Gill Sans Medium',
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
  },
  username: {
    fontSize: 14,
    lineHeight: 24,
    paddingLeft: 5,
    fontFamily: 'Gill Sans Medium',
    color: '#fff',
  },
  handIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
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
    backgroundColor: '#f1f1f1',
  },
});
