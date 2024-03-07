import React from 'react';
import {Dimensions, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const windowWith = Dimensions.get('window').width;

export const SkeltonBlackCard = ({height,width}) => {
  return (
    <SkeletonPlaceholder borderRadius={12}>
      <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
        <SkeletonPlaceholder.Item width={width? width : windowWith - 20} marginTop={10} height={height ? height : 90} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};
