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
  Button,
} from 'react-native';
import { connect } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import db from '../config/firebase';
import Loading from '../sections/Loading';
import Devider from '../sections/Devider';
import { loadActiveData } from '../actions/ActiveWorkoutActions';
import OfflineQueue from '../sections/OfflineQueue';

const onlineUrl = 'https://www.google.com/';
const offlineUrl = 'https://www.weifhweopfhwioehfiwoephfpweoifhewifhpewoif.com';

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
  exerciseContainer: {
    margin: 10,
    borderWidth: 2,
    borderColor: '#00b5ec',
  },
  textExerciseTitle: {
    fontSize: 12,
    fontWeight: 'normal',
    marginTop: 6,
    textAlign: 'center',
    flex: 1,
  },
  exerciseRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textAddInfoTitle: {
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'center',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  additionalInfoContent: {
    margin: 0,
    marginLeft: 7,
    marginRight: 7,
    marginBottom: 10,
    paddingLeft: 10,
  },
  textExerciseContent: {
    marginRight: 15,
    paddingLeft: 5,
  },
  exerciseBox: {
    flex: 1.2,
  },
  textExerciseNumber: {
    color: '#00b5ec',
    fontSize: 20,
    textAlign: 'left',
    marginLeft: 7,
    fontWeight: 'bold',
    marginRight: 'auto',
  },
  flexRow: {
    flexDirection: 'row',
  },
  textTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

class Home extends React.Component {
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
    this.props.loadActiveData();

    this.setBackButtonListener();
    this.props.navigation.setParams({ handleLogOut: this.logoutUser });
  }

  didBlur = () => {
    BackHandler.removeEventListener('backPress', this.handleBackButton);
  }

  findSetCurrentDay = (currentWeekDayName) => {
    const { days } = this.props;
    const { exercises } = this.props;
    const foundDay = days.find(day => day.weekDay === currentWeekDayName);

    if (foundDay) {
      this.setState({ currentDay: foundDay });

      const foundExercises = [];
      if (exercises && exercises.length > 0) {
        exercises.forEach((e) => {
          if (e.dayId === foundDay.id) {
            foundExercises.push(e);
          }
        });
        this.setState({ currentDayExercises: foundExercises });
      }

      this.setState({ currentDayExercises: foundExercises });
    } else {
      this.setState({ currentDay: null });
      this.setState({ currentDayExercises: [] });
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
    if (this.props.loading) {
      return <Loading key="loader" animating={this.props.loading} />;
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
        // eslint-disable-next-line
        <View style={{ flex: 1 }}>
          <Text style={styles.textTitle}>
            { `Exercises at: ${currentDay.name}` }
          </Text>
          <Devider />
          <FlatList
            key="id"
            data={this.state.currentDayExercises}
            extraData={this.state}
            style={styles.list}
            keyExtractor={item => item.id}
            renderItem={(item) => {
              const { index } = item;
              const exercise = item.item;
              return (
                <View style={styles.exerciseContainer}>
                  <View style={styles.flexRow}>
                    <Text style={styles.textExerciseNumber}>
                      { index + 1 }
                    </Text>
                  </View>
                  <View style={styles.exerciseRow}>
                    <Text style={[styles.textExerciseTitle]}>
                      { 'Exercise Name:' }
                    </Text>
                    <Text
                      style={[styles.textExerciseContent, styles.exerciseBox]}
                    >
                      {exercise.name}
                    </Text>
                  </View>
                  <View style={styles.exerciseRow}>
                    <Text style={[styles.textExerciseTitle]}>
                      { 'Number of Sets:' }
                    </Text>
                    <Text
                      style={[styles.textExerciseContent, styles.exerciseBox]}
                    >
                      {exercise.sets}
                    </Text>
                  </View>
                  <View style={styles.exerciseRow}>
                    <Text style={[styles.textExerciseTitle]}>
                      { 'Number of Reps:' }
                    </Text>
                    <Text
                      style={[styles.textExerciseContent, styles.exerciseBox]}
                    >
                      {exercise.reps}
                    </Text>
                  </View>
                  <Text style={styles.textAddInfoTitle}>
                    { 'Additional Info' }
                  </Text>
                  <Text style={styles.additionalInfoContent}>{exercise.description}</Text>
                </View>
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

  alertUserOnError = () => {
    if (this.props.error) {
      Alert.alert('Error', `${this.props.error}\nPlease reload the screen`);
    }

    if (this.props.isConnected) {
      Alert.alert('Alert', `Network Status: ${this.props.isConnected}`);
    }
  }

  // toggleConnection = () => {
  //   this.setState(prevState => ({
  //     network: {
  //       ...prevState.network,
  //       pingUrl:
  //         prevState.network.pingUrl === onlineUrl ? offlineUrl : onlineUrl,
  //     },
  //   }));
  // }

  render() {
    this.alertUserOnError();
    if (this.props.activeWorkout !== null && typeof this.props.activeWorkout !== 'undefined') {
      return (
        <View
          style={this.props.loading ? styles.loadingContainer : styles.container}
        >
          {/* <View style={{ marginBottom: 20 }}>
            <Button
              onPress={() => this.toggleConnection()}
              title="Toggle Internet connection"
              color="#841584"
            />
          </View> */}
          <OfflineQueue title="Offline Queue (FIFO), throttle = 1s" />
          {this.renderFilterPanel()}
          <Devider />
          {this.renderContent()}
          {this.renderLoading()}
        </View>
      );
    }
    return (
      <View
        style={this.props.loading ? styles.loadingContainer : styles.noActive}
      >
        <Text style={styles.noActiveText}>
          {!this.props.loading ? 'No ACTIVE workouts' : ''}
        </Text>
        {this.renderLoading()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activeWorkout: state.reducers.activeWorkout,
    days: state.reducers.days,
    exercises: state.reducers.exercises,
    loading: state.reducers.loading,
    error: state.reducers.error,
    isConnected: state.network.isConnected,
  };
};

export default connect(mapStateToProps, { loadActiveData })(Home);

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
