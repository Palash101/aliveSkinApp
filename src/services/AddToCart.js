import AsyncStorage from '@react-native-async-storage/async-storage';

export const AddToCart = async data => {
  let allData = [];
  return AsyncStorage.getItem('CartData', (err, result) => {
    if (result) {
      allData = [...JSON.parse(result), ...data];
      console.log(allData, 'alldata');
      AsyncStorage.setItem(JSON.stringify(allData));
      return allData;
    } else {
      allData = data;
      console.log(allData, 'alldata');
      AsyncStorage.setItem(JSON.stringify(data));
      return allData;
    }
  });
};

export const GetCartData = async() => {
    return AsyncStorage.getItem('CartData', (err, result) => {
        if (result) {
           return JSON.parse(result)
        }
    });
}
