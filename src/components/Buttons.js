import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-paper';
import { assets } from '../config/AssetsConfig';

export const ThemeButton = props => {
  return (
    <Button
      mode="elevated"
      contentStyle={[styles.buttonText]}
      onPress={() => props.onPress()}
      {...props}>
      <Text style={styles.themeBtnText}>{props.label}</Text>
    </Button>
  );
};
export const ThemeButton2 = props => {
  return (
    <Button
      mode="elevated"
      contentStyle={[styles.buttonText, {backgroundColor: '#5b6952'}]}
      onPress={() => props.onPress()}
      {...props}>
      <Text style={styles.themeBtnText}>{props.label}</Text>
    </Button>
  );
};

export const VideoButton = props => {
  return (
    <TouchableOpacity
      style={[styles.videoButton]}
      onPress={() => props.onPress()}
      {...props}>
        <Image source={assets.play} style={{width:12,height:12,tintColor:'#fff',marginRight:10}}/>
      <Text style={styles.themeBtnText}>{props.label}</Text>
    </TouchableOpacity>
  );
};

export const DarkButton = props => {
  return (
    <Button
      style={{width: '100%'}}
      mode="elevated"
      contentStyle={styles.OutlineButtonText}
      labelStyle={{color: '#fff'}}
      onPress={() => props.onPress()}
      {...props}>
      <Text
        style={{
          fontSize: 18,
          textTransform: 'uppercase',
          color: '#fff',
          fontFamily: 'Gotham-Medium',
        }}>
        {props.label}
      </Text>
    </Button>
  );
};

export const RoundedDarkButton = props => {
  return (
    <Button
      mode="elevated"
      contentStyle={styles.RoundedDarkButton}
      onPress={() => props.onPress()}
      {...props}>
      <Text
        style={{
          fontSize: 12,
          color: '#fff',
          lineHeight: 16,
          fontFamily: 'Gotham-Medium',
          textTransform: 'uppercase',
        }}>
        {props.label}
      </Text>
    </Button>
  );
};

export const RoundedDarkButton2 = props => {
  return (
    <TouchableOpacity
      style={[styles.RoundedDarkButton2, props.style]}
      onPress={() => props.onPress()}>
      <Text
        style={{
          fontSize: 12,
          color: '#fff',
          lineHeight: 15,
          fontWeight:'600',
          fontFamily: 'Gotham-Medium',
          textTransform: 'uppercase',
        }}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

export const RoundedRedButton = props => {
  return (
    <TouchableOpacity
      style={[styles.RoundedRedButton, props.style]}
      onPress={() => props.onPress()}>
      <Text
        style={{
          fontSize: 12,
          color: '#fff',
          lineHeight: 16,
          fontFamily: 'Gotham-Medium',
          textTransform: 'uppercase',
        }}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

export const RoundedGreyButton = props => {
  return (
    <Button
      mode="elevated"
      contentStyle={[styles.RoundedDarkButton, {backgroundColor: '#161415'}]}
      onPress={() => props.onPress()}
      {...props}>
      {/* {props.loading !== true ? ( */}
      <Text
        style={{
          fontSize: 12,
          color: '#fff',
          lineHeight: 16,
          fontFamily: 'Gotham-Medium',
          textTransform: 'uppercase',
        }}>
        {props.label}
      </Text>
    </Button>
  );
};
export const RoundedDefaultButton = props => {
  return (
    <Button
      mode="elevated"
      contentStyle={[styles.RoundedDarkButton, {backgroundColor: '#ddd'}]}
      onPress={() => props.onPress()}
      {...props}>
      {/* {props.loading !== true ? ( */}
      <Text
        style={{
          fontSize: 12,
          color: '#888',
          lineHeight: 16,
          fontFamily: 'Gotham-Medium',
          textTransform: 'uppercase',
        }}>
        {props.label}
      </Text>
    </Button>
  );
};
export const RoundedGreyButton2 = props => {
  return (
    <TouchableOpacity
      style={[styles.RoundedDarkButton3, props.style]}
      onPress={() => props.onPress()}>
      <Text
        style={{
          fontSize: 12,
          color: '#fff',
          lineHeight: 16,
          fontFamily: 'Gotham-Medium',
          textTransform: 'uppercase',
        }}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};
export const CurvedGreyButton = props => {
  return (
    <Button
      mode="elevated"
      contentStyle={[styles.CurvedButton]}
      onPress={() => props.onPress()}
      style={{borderRadius: 12, ...props.style}}
      {...props}>
      {/* {props.loading !== true ? ( */}
      <Text
        style={{
          fontSize: 22,
          color: '#fff',
          lineHeight: 26,
          fontFamily: 'Gotham-Black',
          textTransform: 'uppercase',
        }}>
        {props.label}
      </Text>
    </Button>
  );
};
export const RoundedOutlineButton = props => {
  return (
    <Button
      mode="outlined"
      contentStyle={[
        styles.RoundedDarkButton,
        {backgroundColor: 'transparent'},
      ]}
      onPress={() => props.onPress()}
      {...props}>
      {/* {props.loading !== true ? ( */}
      <Text
        style={{
          fontSize: 14,
          color: '#000',
          lineHeight: 16,
          fontFamily: 'Gotham-Medium',
          textTransform: 'uppercase',
        }}>
        {props.label}
      </Text>
    </Button>
  );
};
export const RoundedThemeButton = props => {
  return (
    <Button
      mode="elevated"
      contentStyle={styles.RoundedThemeButton}
      onPress={() => props.onPress()}
      {...props}>
      <Text
        style={{
          fontSize: 12,
          color: '#000',
          fontFamily: 'Gotham-Medium',
          lineHeight: 16,
          textTransform: 'uppercase',
        }}>
        {props.label}
      </Text>
    </Button>
  );
};
export const RoundedThemeButton2 = props => {
  return (
    <TouchableOpacity
      style={[styles.RoundedThemeButton2, props.style]}
      onPress={() => props.onPress()}>
      <Text
        style={{
          fontSize: 12,
          color: '#000',
          fontFamily: 'Gotham-Medium',
          lineHeight: 16,
          textTransform: 'uppercase',
        }}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

export const RoundedThemeLightButton = props => {
  return (
    <Button
      mode="elevated"
      contentStyle={styles.RoundedThemeButton}
      onPress={() => props.onPress()}
      {...props}>
      <Text
        style={{
          fontSize: 12,
          color: '#000',
          fontFamily: 'Gotham-Medium',
          lineHeight: 16,
          textTransform: 'uppercase',
        }}>
        {props.label}
      </Text>
    </Button>
  );
};
const styles = StyleSheet.create({
  buttonText: {
    fontFamily: 'Gotham-Black',
    fontWeight: '800',
    backgroundColor: '#A9958B',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    height: 45,
  },
  videoButton:{
    fontFamily: 'Gotham-Black',
    fontWeight: '800',
    backgroundColor: '#5b6952',
    display:'flex',
    flexDirection:'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: 'auto',
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:20
  },
  OutlineButtonText: {
    fontFamily: 'Gotham-Black',
    fontWeight: '800',
    backgroundColor: '#000',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    height: 55,
  },
  CurvedButton: {
    fontFamily: 'Gotham-Black',
    fontWeight: '800',
    backgroundColor: '#161415',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  RoundedDarkButton: {
    fontFamily: 'Gotham-Black',
    fontWeight: '800',
    backgroundColor: '#000',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    height: 36,
    padding: 0,
  },
  RoundedDarkButton2: {
    fontFamily: 'Gotham-Black',
    fontWeight: '800',
    backgroundColor: '#563925',
    alignItems: 'center',
    alignSelf: 'center',
    width: 'auto',
    padding: 5,
    borderRadius: 20,
  },
  RoundedDarkButton3: {
    fontFamily: 'Gotham-Black',
    fontWeight: '800',
    backgroundColor: '#000',
    alignItems: 'center',
    alignSelf: 'center',
    width: 'auto',
    padding: 10,
    borderRadius: 20,
  },
  RoundedRedButton: {
    backgroundColor: '#f50e02',
    fontFamily: 'Gotham-Black',
    fontWeight: '800',
    alignItems: 'center',
    alignSelf: 'center',
    width: 'auto',
    padding: 5,
    borderRadius: 20,
  },
  RoundedThemeButton: {
    fontFamily: 'Gotham-Black',
    fontWeight: '800',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    height: 36,
  },
  RoundedThemeButton2: {
    fontFamily: 'Gotham-Black',
    fontWeight: '800',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    height: 36,
    paddingTop: 10,
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  loader: {
    marginTop: 8,
  },
  themeBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: 'Gill Sans Medium',
  },
});
