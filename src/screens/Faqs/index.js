import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {assets} from '../../config/AssetsConfig';
import {FaqsController} from '../../controllers/FaqsController';
import LinearGradient from 'react-native-linear-gradient';

const Faqs = ({navigation}) => {

  const [active, setActive] = useState({});
  const [faqs, setFaqs] = useState([]);
  const activeColor = ['#fff', '#fff', 'rgba(225,215,206,1)'];

  const toggleActive = async item => {
    if (active.id === item.id) {
      setActive('');
    } else {
      setActive(item);
    }
  };

  useEffect(() => {
    getFaqsData();
  }, []);

  const getFaqsData = async () => {
    const instance = new FaqsController();
    const result = await instance.AllFaqs();
    if (result.status === 'success') {
      setFaqs(result.faqs);
    }
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
          }}>
          <Image
            source={assets.back}
            style={{width: 16, height: 16, tintColor: '#000', marginTop: 5}}
          />
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: 'center',
            marginTop: -20,
            fontFamily: 'Gotham-Medium',
          }}>
          FAQ's
        </Text>

      <ScrollView contentContainerStyle={{paddingBottom: 50,marginTop:20}}>

        <View style={styles.allFaq}>
          {faqs.map((item, index) => (
            <View style={styles.faqItem} key={index + 'faq'}>
              <TouchableOpacity
                style={styles.faqTitle}
                onPress={() => toggleActive(item)}>
                <Text style={styles.titleText}>{item.questions}</Text>
                <Image
                  source={assets.chevron}
                  style={
                    active.id !== item.id
                      ? styles.chevronImage
                      : styles.chevronImageOpen
                  }
                />
              </TouchableOpacity>
              {active.id === item.id && (
                <View style={styles.faqPara}>
                  <Text style={styles.paraText}>{item.answers}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      
      </ScrollView>
      </LinearGradient>
    </View>
  );
};
export default Faqs;

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
  faqItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  heading: {
    paddingLeft: 15,
    fontSize: 16,
    lineHeight: 20,
    marginTop: 10,
    textTransform: 'uppercase',
    fontFamily: 'Gotham-Medium',
    color: '#161415',
  },
  support: {
    padding: 15,
  },
  supportText: {
    fontSize: 14,
    fontFamily: 'Gotham-Medium',
    lineHeight: 18,
    color: '#161415',
  },
  faqTitle: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal:20,
    borderRadius: 8,
    fontFamily: 'Gotham-Book',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#161415',
  },
  titleText: {
    fontFamily: 'Gotham-Medium',
    lineHeight: 20,
    fontSize: 14,
    color: '#161415',
  },
  paraText: {
    fontFamily: 'Gotham-Book',
    lineHeight: 16,
    fontSize: 14,
    color: '#161415',
  },
  faqPara: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontFamily: 'Gotham-Book',
    color: '#161415',
  },
  chevronImage: {
    width: 22,
    height: 22,
  },
  chevronImageOpen: {
    width: 22,
    height: 22,
    transform: [{rotate: '180deg'}],
  },
  supportList: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginBottom: 15,
  },
  iconBox: {
    width: 22,
    height: 22,
    backgroundColor: '#000',
    padding: 4,
    borderRadius: 20,
  },
  supportIcon: {
    width: 14,
    height: 14,
    tintColor: '#fff',
  },
  supportText: {
    lineHeight: 24,
    fontSize: 16,
    fontFamily: 'Gotham-medium',
    color: '#161415',
  },
  supportData: {
    marginLeft: '25%',
    marginTop: 15,
  },
});
