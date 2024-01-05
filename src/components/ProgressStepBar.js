import {View, Dimensions, StyleSheet} from 'react-native';

const width = Dimensions.get('window').width;

const ProgressStepBar = ({total,step}) => {
  return (
    <>
        <View style={styles.outer}>
            <View style={[styles.inner,{width:width/total * step,}]}></View>
        </View>
    </>
  );
};
export default ProgressStepBar;

const styles = StyleSheet.create({
    outer:{
        position:'absolute',
        height:6,
        backgroundColor:'#ddd',
        width:width,
        zIndex:999
    },
    inner:{
        
        height:6,
        backgroundColor:'#000'
    }
});
