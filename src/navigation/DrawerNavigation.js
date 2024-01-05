import * as React from 'react';
import {
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import BottomTab from './BottomTab';
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import {assets} from '../config/AssetsConfig';
import {useNavigation} from '@react-navigation/native';

import {UserContext} from '../../context/UserContext';
import {GreyBox} from '../components/GreBox';
import Terms from '../screens/Terms';
import Profile from '../screens/Profile';
import Faqs from '../screens/Faqs';
import Questionaries from '../screens/Questionaries';
import Slots from '../screens/Slots';
import ProductDetails from '../screens/Product/ProductDetails';
import Product from '../screens/Product';
import Cart from '../screens/Product/Cart';
import Package from '../screens/Packages';
import PackageDetail from '../screens/Packages/PackageDetail';
import BlogDetails from '../screens/Blogs/BlogDetails';
import Programs from '../screens/Programs';
import ProgramDetails from '../screens/Programs/ProgramDetails';
import BrandDetails from '../screens/Product/BrandDetails';
import SearchProducts from '../screens/Product/SearchProducts';
import ProfileEdit from '../screens/Profile/ProfileEdit';
import About from '../screens/About';
import Contact from '../screens/Contact';
import SlotHistory from '../screens/Slots/SlotHistory';

const Drawer = createDrawerNavigator();
const width = Dimensions.get('window').width;
function CustomDrawerContent(props) {
  const userCtx = React.useContext(UserContext);

  const logout = () => {
    userCtx.signOut();
  };

  return (
    <DrawerContentScrollView style={{position: 'relative'}} {...props}>
      <GreyBox
        label="Profile"
        {...props}
        active={false}
        onPress={() => props.navigation.navigate('Profile')}
      />
      <GreyBox
        label="About Alive Skin"
        {...props}
        onPress={() => props.navigation.navigate('About')}
      />
      <GreyBox
        label="Faqs"
        {...props}
        onPress={() => props.navigation.navigate('Faqs')}
      />
     
      <GreyBox
        label="Terms & Conditions"
        onPress={() => props.navigation.navigate('Terms')}
      />
       <GreyBox
        label="Contact"
        {...props}
        onPress={() => props.navigation.navigate('Contact')}
      />
      <GreyBox label="Logout" onPress={logout} />
    </DrawerContentScrollView>
  );
}

function LogoTitle() {
  return (
    <View
      style={{
        width: Platform.OS === 'android' ? width - 105 : width - 155,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Alive Skin</Text>
      {/* <Image source={assets.logo} style={{width: 60, height: 24}} /> */}
    </View>
  );
}

function HambergerIcon() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
      <Image
        source={assets.hamburger}
        style={{width: 24, height: 24, marginLeft: 15}}
      />
    </TouchableOpacity>
  );
}
function BackIcon() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <Image
        source={assets.back}
        style={{width: 24, height: 24, marginLeft: 15}}
      />
    </TouchableOpacity>
  );
}

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false
        // headerLeft: () => <HambergerIcon />,
        // headerRight: () => <></>,
        // headerStyle: {
        //   borderBottomWidth: 1,
        //   borderColor: '#000',
        // },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>

      <Drawer.Screen
        name={'Questionaries'}
        component={Questionaries}
        options={{
          headerShown: false
        }}
      />

      <Drawer.Screen
        name="Home"
        component={BottomTab}
        options={{
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Drawer.Screen
        name="Faqs"
        component={Faqs}
        options={{
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
       <Drawer.Screen
        name="Slots"
        component={Slots}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="SlotHistory"
        component={SlotHistory}
        options={{
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="Programs"
        component={Programs}
        options={{
          headerShown: false,
        }}
      />
 <Drawer.Screen
        name="ProgramDetails"
        component={ProgramDetails}
        options={{
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="Terms"
        component={Terms}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Drawer.Screen
        name="About"
        component={About}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Drawer.Screen
        name="Contact"
        component={Contact}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />

       <Drawer.Screen
        name="Product"
        component={Product}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
   <Drawer.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />

<Drawer.Screen
        name="Package"
        component={Package}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
   <Drawer.Screen
        name="PackageDetail"
        component={PackageDetail}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
  <Drawer.Screen
        name="Cart"
        component={Cart}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Drawer.Screen
        name="BlogDetails"
        component={BlogDetails}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />

      <Drawer.Screen
        name="BrandDetails"
        component={BrandDetails}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />

      <Drawer.Screen
        name="SearchProducts"
        component={SearchProducts}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
       <Drawer.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{
          headerLeft: () => <BackIcon />,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />

    </Drawer.Navigator>
  );
}
