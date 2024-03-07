import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import {SettingController} from '../../controllers/SettingController';
import { SkeltonBlackCard } from '../../components/Skelton';

const width = Dimensions.get('window').width;

const About = props => {
  const activeColor = ['#fff', '#fff', 'rgba(225,215,206,1)'];
  const navigation = useNavigation();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getTerms();
  }, []);

  const getTerms = async () => {
    setLoading(true)
    const instance = new SettingController();
    const result = await instance.Setting();
    setData(result?.about_us);
    setLoading(false)
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={activeColor} style={styles.card1}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginLeft: 0,
            marginTop: 60,
            paddingHorizontal: 15,
            marginBottom:25,
          }}>
          <Image
            source={assets.back}
            style={{width: 16, height: 16, tintColor: '#000', marginTop: 5}}
          />
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: 'center',
            marginTop: -50,
            lineHeight:30,
            fontFamily: 'Gotham-Medium',
          }}>
          About
        </Text>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            paddingTop: 20,
            paddingHorizontal: 15,
            paddingBottom: 50,
          }}>
          <Text style={[styles.itemHeading, {marginBottom: 10}]}>
            {data?.heading}
          </Text>
          {loading === true ? <>
              <SkeltonBlackCard width={width - 40} />
              <SkeltonBlackCard width={width - 40} />
            </> :
          <View style={{marginTop: 10}}>
            <RenderHTML
              contentWidth={width - 40}
              source={{html: data?.description}}
            />
          </View>
}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};
export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemHeading: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
    fontFamily: 'Gill Sans Medium',
  },
  card1: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
