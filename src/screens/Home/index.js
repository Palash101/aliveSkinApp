import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUserDetail();
      getData();
      getPackage();
      getBookings();
    });
    return unsubscribe;
  }, []);

  const getPackage = async () => {
    const token = await getToken();
    if (token) {
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
          moment(item.date).isSame(new Date()) ||
          moment(item.date).isAfter(new Date()),
      );
      console.log(filterData, 'filterData');
      setAllBookings(filterData);
    }
  };

  const getUserDetail = async () => {
    const res = await getUser();
    setUser(res);
  };
  const getData = async () => {
    const instance = new HomeController();
    const result = await instance.HomeData();
    setPackages(result?.packages?.data);

    setRecommandProducts(result?.recomendations?.data);

    const instance1 = new BlogsController();
    const token = await getToken();
    if (token) {
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

  const goToProgram = item => {
    navigation.navigate('ProgramDetails', {item: item});
  };

  const goToProduct = item => {
    navigation.navigate('ProductDetails', {item: item});
  };

  return (
    <ImageBackground resizeMode="cover" style={styles.bg}>
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

      <NotificationIcon onPress={() => navigation.navigate('notification')} />

      <PageLoader loading={loading} />

      <ScrollView style={{flex: 1, padding: 15, paddingBottom: 50}}>
        
        <View style={styles.heading}>
          <Image source={assets.hi} style={styles.handIcon} />
          <Text style={styles.username}>Hi, {user?.name}</Text>
        </View>

        {allBookings?.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Upcoming Appointments </Text>
            <FlatList
              data={allBookings}
              pagingEnabled
              horizontal={true}
              contentContainerStyle={{gap: 10}}
              showsHorizontalScrollIndicator={false}
              decelerationRate={'normal'}
              renderItem={({item, index}) => (
                <View style={styles.bookingBox}>
                  <Text style={styles.date}>
                    {moment(item.date).format('DD MMM, YYYY')}
                  </Text>
                  <Text style={styles.at}>at</Text>
                  <Text style={styles.time}>
                    {moment(item.date).format('HH:mm A')}
                  </Text>
                </View>
              )}
            />
          </View>
        ) : (
          <></>
        )}

        <View style={styles.section}>
          <TouchableOpacity
            style={{
              marginVertical: 10,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#6A6C61',
              padding: 10,
              borderRadius: 20,
            }}
            onPress={() => navigation.navigate('Slots')}>
            <Image
              source={assets.calendar}
              style={{
                width: 16,
                tintColor: '#fff',
                height: 16,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Gill Sans Medium',
                fontWeight: '600',
              }}>
              Add New Appointment
            </Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionHeading}>Recommanded Activities</Text>

          <FlatList
            data={[0, 1, 2, 3]}
            pagingEnabled
            horizontal={true}
            contentContainerStyle={{gap: 10}}
            showsHorizontalScrollIndicator={false}
            decelerationRate={'normal'}
            renderItem={({item, index}) => (
              <ActivityCard
                onPress={goToProgram}
                key={index + 'Activity'}
                active={index % 2 != 0}
              />
            )}
          />
        </View> */}

        {recommandProducts?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Recommanded Products </Text>
            <FlatList
              data={recommandProducts}
              pagingEnabled
              horizontal={true}
              contentContainerStyle={{gap: 10}}
              showsHorizontalScrollIndicator={false}
              decelerationRate={'normal'}
              renderItem={({item, index}) => (
                <RecommandedProductCard
                  onPress={goToProduct}
                  item={item?.product}
                  key={index + 'recommand'}
                  active={index % 2 != 0}
                />
              )}
            />
          </View>
        ) : (
          <></>
        )}

        {packageItem?.length ? (
          <View style={styles.section}>
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
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={[styles.sectionHeading, {marginBottom: 0}]}>
              Our Packages
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Package')}
              style={styles.moreBox}>
              <Text style={styles.more}>More...</Text>
            </TouchableOpacity>
            <FlatList
              data={packages}
              pagingEnabled
              horizontal={true}
              // contentContainerStyle={{gap: 10}}
              showsHorizontalScrollIndicator={false}
              decelerationRate={'normal'}
              renderItem={({item, index}) => (
                <PackageCard
                  key={index + 'Package'}
                  onPress={() =>
                    navigation.navigate('PackageDetail', {item: item})
                  }
                  item={item}
                  index={index}
                />
              )}
            />
          </View>
        )}

        <View style={[styles.section, {marginTop: 10}]}>
          <Text style={[styles.sectionHeading, {marginBottom: 0}]}>
            Personal Program
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Programs')}
            style={styles.moreBox}>
            <Text style={styles.more}>See More</Text>
          </TouchableOpacity>

          <FlatList
            data={videos}
            pagingEnabled
            horizontal={true}
            // contentContainerStyle={{gap: 10}}
            showsHorizontalScrollIndicator={false}
            decelerationRate={'normal'}
            renderItem={({item, index}) => (
              <VideoCard
                item={item}
                onPress={() => goToProgram(item)}
                key={index + 'Video'}
              />
            )}
          />
        </View>

        <View style={[styles.section, {marginTop: 0}]}>
          <Text style={styles.sectionHeading}>Beauty Tips</Text>

          <FlatList
            data={beautyBlog}
            pagingEnabled
            horizontal={true}
            contentContainerStyle={{gap: 10}}
            showsHorizontalScrollIndicator={false}
            decelerationRate={'normal'}
            renderItem={({item, index}) => (
              <ImageCard
                onPress={() => navigation.navigate('BlogDetails', {item: item})}
                item={item}
                key={index + 'beautyVideo'}
              />
            )}
          />
        </View>

        <View style={[styles.section, {marginBottom: 50}]}>
          <Text style={styles.sectionHeading}>Blogs</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('blogs')}
            style={styles.moreBox}>
            <Text style={styles.more}>See More</Text>
          </TouchableOpacity>
          <FlatList
            data={blogs}
            pagingEnabled
            horizontal={true}
            contentContainerStyle={{gap: 10}}
            showsHorizontalScrollIndicator={false}
            decelerationRate={'normal'}
            renderItem={({item, index}) => (
              <ImageCard
                onPress={() => navigation.navigate('BlogDetails', {item: item})}
                item={item}
                key={index + 'Video'}
              />
            )}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookingBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderTopWidth: 4,
    borderColor: '#6A6C61',
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
    fontFamily: 'Gotham-Medium',
    textAlign: 'center',
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
    marginBottom: 10,
    fontSize: 14,
  },
  section: {
    marginTop: 10,
  },

  moreBox: {
    position: 'absolute',
    right: 0,
    marginTop: 10,
  },
  more: {
    color: '#6A6C61',
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
    backgroundColor: '#f1f1f1',
  },
});
