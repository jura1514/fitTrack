import db from '../config/firebase';

const registerUser = (email, firstName, lastName) => {
  db
    .database()
    .ref('Users/')
    .push({
      email,
      firstName,
      lastName,
    })
    .then((data) => {
      // success callback
      console.log('data ', data);
    })
    .catch((error) => {
      // error callback
      console.log('error ', error);
    });
};

export default registerUser;
