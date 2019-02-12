import { AsyncStorage } from 'react-native';


export const storeData = async (key, value) => {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (error) {
    return error;
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
    return error;
  }
};

export const removeData = (key) => {
  return AsyncStorage.removeItem(key);
};
