import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  StyleSheet,
  FlatList,
  Alert,
  BackHandler,
  TouchableOpacity,
  View,
  Image,
  Text,
  Picker,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import db from '../config/firebase';
import { getWorkouts } from '../services/WorkoutService';
import Loading from '../sections/Loading';
import Devider from '../sections/Devider';
import {
  getDays,
} from '../services/DayService';
import {
  getExercises,
} from '../services/ExerciseService';

const styles = StyleSheet.create({
  imagestyle: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: 'center',
  },
  menuIcon: {
    marginLeft: 15,
  },
  noActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  noActiveText: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 25,
    marginRight: 25,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'grey',
  },
  filterPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dayPicker: {
    width: '50%',
  },
  dayPickerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    width: '50%',
    textAlign: 'center',
  },
});

export default class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: 'Home',
      headerLeft: (
        <FontAwesome name="bars" style={styles.menuIcon} size={30} onPress={() => navigation.toggleDrawer()} />
      ),
      headerRight: (
        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => params.handleLogOut()}>
            <Image
              style={styles.imagestyle}
               // eslint-disable-next-line
              source={require('../../assets/icons/exit.png')}
            />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  state = {
    activeWorkout: null,
    days: [],
    exercises: [],
    loading: false,
    currentWeekDayName: moment().format('dddd'),
    currentDay: null,
    currentDayExercises: [],
  };

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', this.didFocus);
    this.didBlurListener = this.props.navigation.addListener('didBlur', this.didBlur);
  }

  componentWillUnmount() {
    this.didFocusListener.remove();
    this.didBlurListener.remove();
  }

  logoutUser = async () => {
    try {
      await db.auth().signOut();
      this.props.navigation.navigate('LoginRT');
    } catch (e) {
      Alert.alert('Error', `Could not sign out. Reason:${e}`);
    }
  };

  didFocus = () => {
    this.loadData();
    this.setBackButtonListener();
    this.props.navigation.setParams({ handleLogOut: this.logoutUser });
  }

  didBlur = () => {
    BackHandler.removeEventListener('backPress', this.handleBackButton);
  }

  loadData = async () => {
    this.setState({ loading: true });
    const foundActiveWorkout = await this.loadActiveWorkout();

    if (foundActiveWorkout) {
      this.loadWorkoutDays(foundActiveWorkout.id);
    }

    this.setState({ loading: false });
  }

  loadActiveWorkout = () => {
    return new Promise(async (resolve) => {
      const snapshot = await getWorkouts();
      if (snapshot.val()) {
        let activeWorkout = null;

        // eslint-disable-next-line
        for (let key in snapshot.val()) {
          const newObj = snapshot.val()[key];
          if (newObj.isActive) {
            newObj.id = key;
            // it can only be 1 active workout
            activeWorkout = newObj;
            break;
          }
        }

        this.setState({ activeWorkout });
        resolve(activeWorkout);
      }
    });
  }

  loadWorkoutDays = async (workoutId) => {
    const daysArray = [];
    const snapshot = await getDays(workoutId);
    if (snapshot.val()) {
      // eslint-disable-next-line
      for (let key in snapshot.val()) {
        const newObj = snapshot.val()[key];
        newObj.id = key;
        daysArray.push(newObj);
      }
      await this.getExercisesForDays(daysArray.map(e => e.id));

      this.setState({ days: daysArray });

      this.findSetCurrentDay(this.state.currentWeekDayName);
    } else {
      this.setState({ days: daysArray });
    }
  }

  getExercisesForDays = async (dayIds) => {
    const exercisesArray = [];
    if (dayIds.length > 0) {
      await dayIds.forEach(async (e) => {
        const snapshot = await getExercises(e);
        if (snapshot.val()) {
          // eslint-disable-next-line
          for (let key in snapshot.val()) {
            const newObj = snapshot.val()[key];
            newObj.id = key;
            exercisesArray.push(newObj);
          }
        }
      });

      this.setState({ exercises: exercisesArray });
    }
  };

  findSetCurrentDay = (currentWeekDayName) => {
    const { days } = this.state;
    const foundDay = days.find(day => day.weekDay === currentWeekDayName);

    if (foundDay) {
      this.setState({ currentDay: foundDay });
    } else {
      this.setState({ currentDay: null });
    }
  }

  dayPickerValueChanged = (pickerItemValue) => {
    this.setState({ currentWeekDayName: pickerItemValue });
    this.findSetCurrentDay(pickerItemValue);
  };

  setBackButtonListener = () => {
    BackHandler.addEventListener('backPress', this.handleBackButton);
  }

  handleBackButton = () => true;

  renderLoading = () => {
    if (this.state.loading) {
      return <Loading key="loader" animating={this.state.loading} />;
    }
    return null;
  }

  renderFilterPanel = () => {
    return (
      <View style={styles.filterPanel}>
        <Text style={styles.dayPickerTitle}>Select a day:</Text>
        <Picker
          selectedValue={this.state.currentWeekDayName}
          style={styles.dayPicker}
          onValueChange={itemValue => this.dayPickerValueChanged(itemValue)
          }
        >
          <Picker.Item label="Monday" value="Monday" />
          <Picker.Item label="Tuesday" value="Tuesday" />
          <Picker.Item label="Wednesday" value="Wednesday" />
          <Picker.Item label="Thursday" value="Thursday" />
          <Picker.Item label="Friday" value="Friday" />
          <Picker.Item label="Saturday" value="Saturday" />
          <Picker.Item label="Sunday" value="Sunday" />
        </Picker>
      </View>
    );
  }

  renderContent = () => {
    const { currentDay } = this.state;
    if (currentDay) {
      return (
        <View>
          <Text style={styles.textTitle}>{currentDay.name}</Text>
          <FlatList
            key="id"
            data={this.state.currentDayExercises}
            extraData={this.state}
            style={styles.list}
            keyExtractor={item => item.id}
            renderItem={(item, index) => {
              const exercise = item.item;
              return (
                <Text>{exercise.name}</Text>
                // <View style={styles.exerciseContainer}>
                //   <View style={{ flexDirection: 'row' }}>
                //     <Text style={styles.textExerciseNumber}>
                //       { index + 1 }
                //     </Text>
                //   </View>
                //   <View style={styles.exerciseRow}>
                //     <Text style={[styles.textExerciseTitle]}>
                //       { 'Exercise Name:' }
                //     </Text>
                //     <Text
                //       style={[styles.textExerciseInput, styles.exerciseBox]}
                //     >
                //       { 'Text goes here'}
                //     </Text>
                //   </View>
                //   <View style={styles.exerciseRow}>
                //     <Text style={[styles.textExerciseTitle]}>
                //       { 'Number of Sets:' }
                //     </Text>
                //     <Text
                //       style={[styles.textExerciseInput, styles.exerciseBox]}
                //     >
                //       { 'Text goes here'}
                //     </Text>
                //   </View>
                //   <View style={styles.exerciseRow}>
                //     <Text style={[styles.textExerciseTitle]}>
                //       { 'Number of Reps:' }
                //     </Text>
                //     <Text
                //       style={[styles.textExerciseInput, styles.exerciseBox]}
                //     >
                //       { 'Text goes here'}
                //     </Text>
                //   </View>
                //   <Text style={styles.textAddInfoTitle}>
                //     { 'Additional Info' }
                //   </Text>
                //   <Text style={styles.additionalInfoInput}>Text goes here</Text>
                // </View>
              );
            }}
          />
        </View>
      );
    }

    const noDaysAndExercises = 'No exercises at this day.\nIf you would like to see exercises at another day\nPlease select a day from a day picker.';
    return (
      <Text style={styles.noActiveText}>{noDaysAndExercises}</Text>
    );
  }

  render() {
    if (this.state.activeWorkout !== null && typeof this.state.activeWorkout !== 'undefined') {
      return (
        <View
          style={this.props.loading ? styles.loadingContainer : styles.container}
        >
          {this.renderFilterPanel()}
          <Devider />
          {this.renderContent()}
          {this.renderLoading()}
        </View>
      );
    }
    return [
      <View style={styles.noActive}>
        <Text style={styles.noActiveText}>No ACTIVE workouts</Text>
      </View>,
      this.renderLoading(),
    ];
  }
}

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
