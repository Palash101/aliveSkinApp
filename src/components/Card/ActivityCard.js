import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {VideoButton} from '../Buttons';
import {assets} from '../../config/AssetsConfig';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const ActivityCard = props => {
  console.log(props.active);
  return (
    <TouchableOpacity
      onPress={() => props.onPress()} 
      style={[styles.card1, props.active ? {backgroundColor: '#6A6C61'} : '']}>
      <View style={styles.card2Top}>
        <View
          style={{
            backgroundColor: props.active ? '#BBBEB3' : '#563925',
            padding: 5,
            borderRadius: 4,
          }}>
          <Image
            source={props.active? assets.docs : assets.play}
            style={{width: 10, height: 10, tintColor: props.active ? '#000' : '#fff'}}
          />
        </View>
        <Text
          style={{
            backgroundColor: props.active ? '#BBBEB3' : '#563925',
            color: props.active ? '#000' : '#fff',
            fontWeight: '600',
            paddingHorizontal: 5,
            fontSize: 12,
            lineHeight: 18,
            borderRadius: 4,
            fontFamily: 'Gill Sans Medium',
            overflow: 'hidden',
          }}>
          Free
        </Text>
      </View>
      <Text style={[styles.card2Title, props.active ? {color: '#fff'} : '']}>
        Lip Line Strengthening
      </Text>
      <Text
        style={[styles.card2Para, props.active ? {color: '#f2f2f2'} : '']}
        ellipsizeMode="tail"
        numberOfLines={1}>
        Lorem ipsum doller emit is dummy content
      </Text>
    </TouchableOpacity>
  );
};

export default ActivityCard;
const styles = StyleSheet.create({
  card1: {
    backgroundColor: '#E2D8CF',
    marginRight: 10,
    marginVertical: 10,
    borderRadius: 10,
    height: 190,
    width: width / 2 - 60,
    overflow: 'hidden',
    padding: 10,
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
    fontFamily: 'Gill Sans Medium',
  },
  card2Para: {
    fontSize: 12,
    color: '#333',
    marginTop: 7,
    fontFamily: 'Gotham-Light',
  },
});
