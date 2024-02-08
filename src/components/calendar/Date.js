import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import moment from 'moment';

export default class Date extends PureComponent {
  props: {
    // Date to render
    date: Moment,
    // Index for `onPress` and `onRender` callbacks
    index: number,
    // Whether it's the currently selected date or no
    isActive: boolean,
    // Called when user taps a date
    onPress: (index: number) => void,
    // Called after date is rendered to pass its width up to the parent component
    onRender: (index: number, width: number) => void,
  };

  // Style helper functions that merge active date styles with the default ones
  // when rendering a date that was selected by user or was set active by default

  getContainerStyle = date => ({
    ...(date.format('DD') === moment(new Date()).format('DD')
      ? styles.container2
      : styles.container),
    ...(this.props.isActive ? styles.containerActive : {}),
  });

  isToday = date => {
    if (date.format('DD') === moment(new Date()).format('DD')) {
      return true;
    } else {
      return false;
    }
  };

  getDayStyle = () => ({
    ...styles.text,
    ...styles.day,
    ...(this.props.isActive ? styles.textActive : {}),
  });

  getDateStyle = () => ({
    ...styles.text,
    ...styles.date,
    ...(this.props.isActive ? styles.textActive : {}),
  });

  // Call `onRender` and pass component's with when rendered
  onLayout = (event: {
    nativeEvent: {
      layout: {x: number, y: number, width: number, height: number},
    },
  }) => {
    const {index, onRender} = this.props;
    const {
      nativeEvent: {
        layout: {width},
      },
    } = event;
    onRender(index, width);
  };

  // Call `onPress` passed from the parent component when date is pressed
  onPress = () => {
    const {index, onPress} = this.props;
    onPress(index);
  };

  render() {
    const {date} = this.props;
    return (
      <>
        <TouchableOpacity
          style={this.getContainerStyle(date)}
          onLayout={this.onLayout}
          onPress={this.onPress}>
          <Text style={this.getDayStyle()}>
            {date.format('ddd').toUpperCase()}
          </Text>
          <Text style={this.getDateStyle()}>{date.format('DD')}</Text>
        </TouchableOpacity>
        {this.isToday(date) === true && (
          <View
            style={{
              height: 3,
              backgroundColor: '#5b6952',
              marginTop: 4,
              width: 30,
              alignSelf: 'center',
              borderRadius: 20,
            }}></View>
        )}
      </>
    );
  }
}

const styles = {
  container: {
    paddingHorizontal: 7,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    marginHorizontal: 2,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  container2: {
    paddingHorizontal: 7,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    marginHorizontal: 2,
    marginTop: 5,
  },
  containerActive: {
    backgroundColor: '#5b6952',
    borderRadius:60
  },
  day: {
    fontSize: 10,
    fontWeight:'600',
    fontFamily: 'Gill Sans Medium',
  },
  date: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Gotham-Medium',
    marginTop: 2,
    fontWeight:'600',
    paddingHorizontal:7
  },
  text: {
    color: '#000',
    textAlign: 'center',
    fontSize:10,
    fontWeight:'600',
    fontFamily: 'Gill Sans Medium',
  },
  textActive: {
    color: '#fff',
    fontFamily: 'Gill Sans Medium',
  },
};
