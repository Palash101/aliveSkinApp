import React, {useContext, useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {UserContext} from '../../../context/UserContext';
import {useNavigation} from '@react-navigation/native';
import {PackageController} from '../../controllers/PackageController';
import PackageCard from '../../components/Card/PackageCard';
import {assets} from '../../config/AssetsConfig';
import PackageCardSingle from '../../components/Card/PackageCardSingle';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import { PackageItem2 } from '../../components/PackageItem2';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Package = () => {
  const {getToken, getUser} = useContext(UserContext);
  const navigation = useNavigation();
  const [packages, setPackages] = useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getPackages();
  }, []);

  const getPackages = async () => {
    const token = await getToken();
    if (token) {
      const instance = new PackageController();
      const result = await instance.AllPackages(token);
      setPackages(result.packages);
    }
  };

  return (
    <View style={styles.bg}>
      <TouchableOpacity
        style={{
          marginLeft: 20,
          marginTop: 50,
          backgroundColor: '#000',
          width: 28,
          height: 28,
          alignItems: 'center',
          borderRadius: 5,
          position: 'absolute',
          zIndex: 99,
        }}
        onPress={() => navigation.goBack()}>
        <Image
          source={assets.back}
          style={{width: 16, height: 16, tintColor: '#fff', marginTop: 5}}
        />
      </TouchableOpacity>
      <Text style={styles.sectionHeading}>PACKAGES</Text>

      <FlatList
        data={packages.sort((a, b) => a.position - b.position)}
        pagingEnabled
        contentContainerStyle={{gap: 10, padding: 10,paddingBottom:50}}
        decelerationRate={'normal'}
        renderItem={({item, index}) => (
          <PackageItem2
            key={index + 'Package'}
            onPress={() => navigation.navigate('PackageDetail', {item: item})}
            item={item}
            index={index}
          />
        )}
      />

   
    </View>
  );
};
export default Package;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#fff',
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Gill Sans Medium',
    marginTop: 55,
    textAlign: 'center',
  },
});
