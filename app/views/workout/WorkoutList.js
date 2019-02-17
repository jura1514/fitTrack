import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  FlatList,
  Alert,
  BackHandler,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import ActionButton from 'react-native-action-button';
import { FontAwesome } from '@expo/vector-icons';
import WorkoutListItem from './WorkoutListItem';
import db from '../../config/firebase';
import Loading from '../../sections/Loading';
import {
  loadWorkoutsData,
  loadWorkoutDays,
  deleteWorkoutAction,
  loadWorkoutsFromStorage,
  loadDaysFromStorage,
} from '../../actions/WorkoutActions';
import OfflineNotice from '../../sections/OfflineNotice';
import { storeData } from '../../services/AsyncStorage';

const styles = StyleSheet.create({
  imagestyle: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: 'center',
  },
  deleteBtn: {
    display: 'none',
  },
  headerView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  binIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: 'center',
    color: 'red',
  },
  menuIcon: {
    marginLeft: 15,
  },
});

class WorkoutList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const id = params.selectedWorkout ? params.selectedWorkout : '';
    return {
      headerTitle: 'Workouts',
      headerLeft: (
        <FontAwesome name="bars" style={styles.menuIcon} size={30} onPress={() => navigation.toggleDrawer()} />
      ),
      headerRight: (
        <View style={styles.headerView}>
          <TouchableOpacity style={id === '' ? styles.deleteBtn : ''} onPress={() => params.handleSelectedItem(id)}>
            <FontAwesome name="trash-o" size={30} style={styles.binIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => params.handleLogOut()}>
            <Image
              style={styles.imagestyle}
               // eslint-disable-next-line
              source={require('../../../assets/icons/exit.png')}
            />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  state = {
    workoutsWithDays: [],
    isSelected: false,
    selectedId: '',
  };

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', () => this.didFocus());
    this.didBlurListener = this.props.navigation.addListener('didBlur', () => this.didBlur());
  }

  componentWillUnmount() {
    this.didFocusListener.remove();
    this.didBlurListener.remove();
  }

  handleAddWorkout = () => {
    this.props.navigation.navigate('ManageWorkoutRT');
  };

  logoutUser = async () => {
    try {
      await db.auth().signOut();
      this.props.navigation.navigate('LoginRT');
    } catch (e) {
      Alert.alert('Error', `Could not sign out. Reason:${e}`);
    }
  };

  didFocus = () => {
    if (this.props.IsConnected) {
      this.loadData();
    } else {
      this.loadOfflineData();
    }
    this.setBackButtonListener();
    this.props.navigation.setParams({ handleLogOut: this.logoutUser });
  }

  didBlur = () => {
    BackHandler.removeEventListener('backPress', this.handleBackButton);
  }

  loadData = () => {
    this.props.loadWorkoutsData()
      .then(() => {
        if (this.props.workouts && Array.isArray(this.props.workouts)) {
          const workoutsWithDays = [];
          let counter = 0;
          // required to store days in local storage
          const arrayOfDays = [];
          this.props.workouts.forEach((workout) => {
            this.props.loadWorkoutDays(workout.id)
              .then((days) => {
                workout.numberOfDays = days // eslint-disable-line no-param-reassign
                  ? days.length : 0;
                workoutsWithDays.push(workout);
                counter += 1;

                if (days) {
                  days.forEach(e => arrayOfDays.push(e));
                }

                if (counter === this.props.workouts.length) {
                  storeData('days', JSON.stringify(arrayOfDays));
                  this.setState({ workoutsWithDays });
                }
              });
          });
        }
      });
  }

  loadOfflineData = () => {
    this.props.loadWorkoutsFromStorage()
      .then(() => {
        if (this.props.workouts && Array.isArray(this.props.workouts)) {
          this.props.loadDaysFromStorage()
            .then((allStoredDays) => {
              const workoutsWithDays = [];
              let counter = 0;

              this.props.workouts.forEach((workout) => {
                const findWorkoutDays = allStoredDays.filter(e => e.workoutId === workout.id);
                workout.numberOfDays = findWorkoutDays // eslint-disable-line no-param-reassign
                  ? findWorkoutDays.length : 0;
                workoutsWithDays.push(workout);
                counter += 1;

                if (counter === this.props.workouts.length) {
                  this.setState({ workoutsWithDays });
                }
              });
            });
        }
      });
  }

  handleDeleteWorkout = async (id) => {
    Alert.alert(
      'Alert',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'OK', onPress: () => this.processDeleteWorkout(id) },
      ],
      { cancelable: false },
    );
  };

  processDeleteWorkout = (id) => {
    this.props.deleteWorkoutAction(id).then(() => {
      this.loadData();
      this.props.navigation.setParams({ selectedWorkout: '' });
    });
  }

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

  onPressAction = (id) => {
    if (id) {
      if (!this.state.isSelected) {
        this.setState({ isSelected: true });
        this.setState({ selectedId: id });

        this.props.navigation.setParams({ selectedWorkout: id });
        this.props.navigation.setParams({ handleSelectedItem: this.handleDeleteWorkout });
      } else if (this.state.isSelected && this.state.selectedId !== id) {
        this.setState({ isSelected: true });
        this.setState({ selectedId: id });

        this.props.navigation.setParams({ selectedWorkout: id });
        this.props.navigation.setParams({ handleSelectedItem: this.handleDeleteWorkout });
      } else if (this.state.isSelected && this.state.selectedId === id) {
        this.setState({ isSelected: false });
        this.setState({ selectedId: '' });

        this.props.navigation.setParams({ selectedWorkout: '' });
      } else {
        this.setState({ isSelected: false });
        this.setState({ selectedId: '' });

        this.props.navigation.setParams({ selectedWorkout: '' });
      }
    }
  };

  highlightItem = (itemId) => {
    if (this.state.isSelected && this.state.selectedId === itemId) {
      return true;
    }
    return false;
  }

  alertUserOnError = () => {
    if (this.props.error) {
      Alert.alert('Error', `${this.props.error}\nPlease reload the screen`);
    }
  }

  render() {
    return [
      this.alertUserOnError(),
      <OfflineNotice />,
      <FlatList
        key="id"
        data={this.state.workoutsWithDays}
        onRefresh={() => this.loadData()}
        refreshing={this.props.loading}
        extraData={this.state}
        style={styles.list}
        keyExtractor={item => item.id}
        renderItem={(item) => {
          const workout = item.item;
          const daysTitle = `has ${workout.numberOfDays} days`;
          const createTitle = `created on: ${workout.creationTime}`;
          let nameTitle = workout.name;
          if (workout.isActive) {
            nameTitle = `${workout.name} - ACTIVE`;
          }
          return (
            <WorkoutListItem
              id={workout.id}
              workout={workout}
              nameTitle={nameTitle}
              daysTitle={daysTitle}
              createTitle={createTitle}
              isSelected={this.highlightItem(workout.id)}
              onPressItem={this.onPressAction}
              navigation={this.props.navigation}
            />
          );
        }}
      />,
      this.renderLoading(),
      <ActionButton
        key="fab"
        buttonColor="#00b5ec"
        onPress={() => this.handleAddWorkout()}
      />,
    ];
  }
}

const mapStateToProps = (state) => {
  return {
    workouts: state.workout.workouts,
    days: state.workout.days,
    loading: state.workout.loading,
    error: state.workout.error,
    isConnected: state.network.isConnected,
  };
};

export default connect(mapStateToProps, {
  loadWorkoutsData,
  loadWorkoutDays,
  deleteWorkoutAction,
  loadWorkoutsFromStorage,
  loadDaysFromStorage,
})(WorkoutList);

WorkoutList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
