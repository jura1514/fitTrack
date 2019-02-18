import firebase from '../config/firebase';
import { retrieveData, storeData } from '../services/AsyncStorage';

const actionTypes = {
  loginWithEmailAndPasswordAction: 'LOGIN_WITH_EMAIL_AND_PASSWORD',
  loginWithEmailAndPasswordActionErr: 'LOGIN_WITH_EMAIL_AND_PASSWORD_ERR',
  checkUserLoggedInAction: 'CHECK_USER_LOGGEDIN',
};

export const loginWithEmailAndPassword = (email, password) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          storeData('user', JSON.stringify(user));
          dispatch({
            type: actionTypes.loginWithEmailAndPasswordAction,
            payload: user,
            isLoggedIn: true,
          });
          resolve(user);
        })
        .catch((error) => {
          dispatch({
            type: actionTypes.loginWithEmailAndPasswordActionErr,
            payload: null,
            isLoggedIn: false,
          });
          reject(error);
        });
    });
  };
};

export const checkUserLoggedIn = () => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      const state = getState();
      const { isConnected } = state.network;
      if (isConnected) {
        firebase.auth().onAuthStateChanged((user) => {
          resolve(user);
          dispatch({
            type: actionTypes.checkUserLoggedInAction,
            payload: user || null,
          });
        });
      } else {
        retrieveData('user').then((user) => {
          resolve(user);
          dispatch({
            type: actionTypes.checkUserLoggedInAction,
            payload: user || null,
          });
        });
      }
    });
  };
};
