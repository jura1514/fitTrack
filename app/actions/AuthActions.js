import { Facebook } from 'expo';
import firebase from '../config/firebase';
import { retrieveData, storeData } from '../services/AsyncStorage';

const firebaseWithfb = require('firebase');

const actionTypes = {
  loginWithEmailAndPasswordAction: 'LOGIN_WITH_EMAIL_AND_PASSWORD',
  loginWithEmailAndPasswordActionErr: 'LOGIN_WITH_EMAIL_AND_PASSWORD_ERR',
  loginWithFacebookAction: 'LOGIN_WITH_FACEBOOK',
  loginWithFacebookActionErr: 'LOGIN_WITH_FACEBOOK_ERR',
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


export const loginWithFacebook = () => {
  return async (dispatch) => {
    const appId = '298553117405390';
    const permissions = ['public_profile', 'email']; // Permissions required, consult Facebook docs

    const {
      type,
      token,
    } = await Facebook.logInWithReadPermissionsAsync(
      appId,
      { permissions },
    );

    switch (type) {
      case 'success': {
        await firebaseWithfb.auth().setPersistence(firebaseWithfb.auth.Auth.Persistence.LOCAL);
        const credential = firebaseWithfb.auth.FacebookAuthProvider.credential(token);
        const fbProfileData = await firebaseWithfb.auth()
          .signInAndRetrieveDataWithCredential(credential);

        return dispatch({
          type: actionTypes.loginWithFacebookAction,
          payload: fbProfileData,
          isLoggedIn: true,
        });
      }
      case 'cancel': {
        return dispatch({
          type: actionTypes.loginWithFacebookActionErr,
          payload: null,
          isLoggedIn: false,
        });
      }

      default: {
        return dispatch({
          type: actionTypes.loginWithFacebookActionErr,
          payload: null,
          isLoggedIn: false,
        });
      }
    }
  };
};
