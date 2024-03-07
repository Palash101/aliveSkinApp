import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DrawerNavigation from './DrawerNavigation';
import Questionaries from '../screens/Questionaries';
import BottomTab from './BottomTab';
import Reel from '../screens/Reel';
import Faqs from '../screens/Faqs';
import Profile from '../screens/Profile';
import Slots from '../screens/Slots';
import SlotHistory from '../screens/Slots/SlotHistory';
import Programs from '../screens/Programs';
import ProgramDetails from '../screens/Programs/ProgramDetails';
import Terms from '../screens/Terms';
import {useNavigation} from '@react-navigation/native';
import {Dimensions, Platform, Text, TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native';
import {assets} from '../config/AssetsConfig';
import About from '../screens/About';
import Contact from '../screens/Contact';
import Product from '../screens/Product';
import ProductDetails from '../screens/Product/ProductDetails';
import Package from '../screens/Packages';
import PackageDetail from '../screens/Packages/PackageDetail';
import Cart from '../screens/Product/Cart';
import BlogDetails from '../screens/Blogs/BlogDetails';
import BrandDetails from '../screens/Product/BrandDetails';
import SearchProducts from '../screens/Product/SearchProducts';
import ProfileEdit from '../screens/Profile/ProfileEdit';
import Login from '../screens/Auth/Login';
import SlotQuestions from '../screens/Questionaries/SlotQuestions';
import ProductHistory from '../screens/Product/ProductHistory';
import Welcome from '../screens/Auth/Welcome';
import Chat from '../screens/Chat';
import Notification from '../screens/Notification';
import Consulation from '../screens/Consulation';
import Pdfs from '../screens/Pdfs';
import PdfDetail from '../screens/Pdfs/PdfDetails';
import Splash from '../screens/Auth/Splash';

const width = Dimensions.get('window').width;

function BackIcon() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <Image
        source={assets.back}
        style={{width: 20, height: 20, marginLeft: 15}}
      />
    </TouchableOpacity>
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
const ScreenNavigationStack = ({navigation}) => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'Splash'}
        component={Splash}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Welcome'}
        component={Welcome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Login'}
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'Drawer'}
        component={DrawerNavigation}
        options={{
          headerShown: false,
          cardStyle: {backgroundColor: '#ffffff'},
        }}
      />
      <Stack.Screen
        name={'Questionaries'}
        component={Questionaries}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'ProductHistory'}
        component={ProductHistory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'SlotQuestions'}
        component={SlotQuestions}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Reel"
        component={Reel}
        options={{
          headerShown: false,
         // headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Stack.Screen
        name="Faqs"
        component={Faqs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Slots"
        component={Slots}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SlotHistory"
        component={SlotHistory}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Programs"
        component={Programs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProgramDetails"
        component={ProgramDetails}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />

      <Stack.Screen
        name="Product"
        component={Product}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />

      <Stack.Screen
        name="Package"
        component={Package}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Stack.Screen
        name="PackageDetail"
        component={PackageDetail}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <></>,
        }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Stack.Screen
        name="BlogDetails"
        component={BlogDetails}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />

      <Stack.Screen
        name="BrandDetails"
        component={BrandDetails}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />

      <Stack.Screen
        name="SearchProducts"
        component={SearchProducts}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{
          headerShown: false,
          // headerLeft: () => <BackIcon />,
          // headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Consulation"
        component={Consulation}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Pdfs"
        component={Pdfs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PdfDetail"
        component={PdfDetail}
        options={{
          headerShown: false,
        }}
      />

    </Stack.Navigator>
  );
};

export default ScreenNavigationStack;
