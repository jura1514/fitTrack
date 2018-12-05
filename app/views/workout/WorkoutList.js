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
import ActionButton from 'react-native-action-button';
import { FontAwesome } from '@expo/vector-icons';
import WorkoutListItem from './WorkoutListItem';
import db from '../../config/firebase';
import { getWorkouts, deleteWorkout } from '../../services/WorkoutService';
import Loading from '../../sections/Loading';

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

export default class WorkoutList extends React.Component {
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
    workouts: [],
    loading: false,
    isSelected: false,
    selectedId: '',
  };

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', this.didFocus);
    this.didBlurListener = this.props.navigation.addListener('didBlur', this.didBlur);
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
    this.loadData();
    this.setBackButtonListener();
    this.props.navigation.setParams({ handleLogOut: this.logoutUser });
  }

  didBlur = () => {
    BackHandler.removeEventListener('backPress', this.handleBackButton);
  }

  loadData = async () => {
    this.setState({ loading: true });
    const workoutsArray = [];
    const snapshot = await getWorkouts();
    if (snapshot.val()) {
      // eslint-disable-next-line
      for (let key in snapshot.val()) {
        const newObj = snapshot.val()[key];
        newObj.id = key;
        workoutsArray.push(newObj);
      }
      this.setState({ workouts: workoutsArray });
      this.setState({ loading: false });
    } else {
      this.setState({ workouts: workoutsArray });
      this.setState({ loading: false });
    }
  }

  handleDeleteWorkout = async (id) => {
    Alert.alert(
      'Alert',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'OK', onPress: () => this.deleteWorkout(id) },
      ],
      { cancelable: false },
    );
  };

  deleteWorkout = async (id) => {
    try {
      await deleteWorkout(id);
      this.props.navigation.setParams({ selectedWorkout: '' });
      this.loadData();
    } catch (e) {
      Alert.alert('Error', `Could delete a workout. Reason:${e}`);
    }
  }

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

  render() {
    return [
      <FlatList
        key="id"
        data={this.state.workouts}
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

WorkoutList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
