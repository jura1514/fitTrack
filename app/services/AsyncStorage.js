import { AsyncStorage } from 'react-native';


export const storeData = async (key, value) => {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const mergeData = async (key, value) => {
  try {
    return await AsyncStorage.mergeItem(key, value);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const removeData = (key) => {
  return AsyncStorage.removeItem(key);
};
