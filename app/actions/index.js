import firebase from '../config/firebase';

// export const selectPerson = (peopleId) => {
//   return {
//     type: 'SELECTED_PERSON',
//     payload: peopleId,
//   };
// };

// export const noneSelected = () => {
//   return {
//     type: 'NONE_SELECTED',
//   };
// };

// export const formUpdate = ({ prop, value }) => {
//   return {
//     type: 'FORM_UPDATE',
//     payload: { prop, value },
//   };
// };

// export const createNewContact = ({
//  first_name, last_name, phone, email, company, project, notes
// }) => {
//   const { currentUser } = firebase.auth();

//   return (dispatch) => {
//     firebase.database().ref(`/users/${currentUser.uid}/people`)
//       .push({
//  first_name, last_name, phone, email, company, project, notes
// })
//       .then(() => {
//         dispatch({ type: 'NEW_CONTACT' });
//       });
//   };
// };

export const loadInitialWorkouts = () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase
      .database()
      .ref('/Workouts')
      .orderByChild('email')
      .equalTo(currentUser.email)
      .once('value', (snapshot) => {
        dispatch({ type: 'INITIAL_FETCH', payload: snapshot.val() });
      });
  };
};

export const loadWorkoutDays = (workoutId) => {
  return (dispatch) => {
    firebase
      .database()
      .ref('/Days')
      .orderByChild('workoutId')
      .equalTo(workoutId)
      .once('value', (snapshot) => {
        dispatch({ type: 'DAYS_FETCH', payload: snapshot.val() });
      });
  };
};


export const loadActiveWorkout = () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase
      .database()
      .ref('/Workouts')
      .orderByChild('email')
      .equalTo(currentUser.email)
      .once('value', (snapshot) => {
        const workouts = snapshot.val();
        let active = null;
        // eslint-disable-next-line
        for (let key in workouts) {
          const newObj = workouts[key];
          if (newObj.isActive) {
            newObj.id = key;
            // it can only be 1 active workout
            active = newObj;
            break;
          }
        }

        dispatch({ type: 'ACTIVE_WORKOUT_FETCH', payload: active });
      })
      .then((snapshot) => {
        const workouts = snapshot.val();
        const active = workouts.find(e => e.isActive);
        const { id } = active;
        dispatch(loadWorkoutDays(id || null));
      });
  };
};

// export const deleteContact = (uid) => {
//   const { currentUser } = firebase.auth();

//   return (dispatch) => {
//     firebase.database().ref(`/users/${currentUser.uid}/people/${uid}`)
//       .remove()
//       .then(() => {
//         dispatch({ type: 'DELETE_CONTACT' });
//       });
//   };
// };

// export const updateContact = (personSelected) => {
//   return {
//     type: 'UPDATE_CONTACT',
//     payload: personSelected,
//   };
// };

// export const saveContact = ({
//  first_name, last_name, phone, email, company, project, notes, uid
// }) => {
//   const { currentUser } = firebase.auth();

//   return (dispatch) => {
//     firebase.database().ref(`/users/${currentUser.uid}/people/${uid}`)
//       .set({
//  first_name, last_name, phone, email, company, project, notes, uid
// })
//       .then(() => {
//         dispatch({ type: 'SAVE_CONTACT' });
//       });
//   };
// };
