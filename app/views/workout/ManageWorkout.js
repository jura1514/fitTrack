import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Switch,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import Loading from '../../sections/Loading';
import {
  updateWorkout, addWorkoutToDb,
} from '../../services/WorkoutService';
import {
  loadWorkoutData,
  setLoading,
  setWorkoutName,
  setWorkoutActiveState,
  loadWorkoutDataFromStorage,
  setLoadedWorkout,
} from '../../actions/WorkoutActions';
import {
  findActiveWorkout,
  findActiveWorkoutFromStorage,
} from '../../actions/ActiveWorkoutActions';
import {
  addWorkoutToQueue,
  updateWorkoutToQueue,
} from '../../actions/NetworkActions';
import OfflineNotice from '../../sections/OfflineNotice';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'grey',
  },
  fieldContainer: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  switchView: {
    flexDirection: 'row',
  },
  switchTitle: {
    height: 40,
    margin: 0,
    marginLeft: 7,
    marginRight: 7,
    paddingTop: 10,
    paddingLeft: 10,
  },
  text: {
    height: 40,
    margin: 0,
    marginLeft: 7,
    marginRight: 7,
    paddingLeft: 10,
  },
  button: {
    height: 50,
    backgroundColor: '#00b5ec',
    borderColor: '#48BBEC',
    alignSelf: 'stretch',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  disabledBtn: {
    height: 50,
    backgroundColor: '#787878',
    borderColor: '#48BBEC',
    alignSelf: 'stretch',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  errorPassword: {
    color: 'red',
    margin: 0,
    marginLeft: 7,
    marginRight: 7,
    paddingLeft: 10,
  },
  displayNone: {
    display: 'none',
  },
});

class ManageWorkout extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const header = params.wourkoutId ? 'Edit Workout' : 'Add Workout';
    return {
      headerTitle: header,
    };
  };

  state = {
    error: '',
    btnText: '',
  };

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', () => this.didFocus());
  }

  didFocus = () => {
    const workoutId = this.props.navigation.getParam('wourkoutId', null);

    if (workoutId) {
      if (this.props.isConnected) {
        this.props.setLoading(true);
        this.props.loadWorkoutData(workoutId, true);
        this.props.findActiveWorkout();
      } else {
        this.props.setLoading(true);
        this.props.loadWorkoutDataFromStorage(workoutId, true);
        this.props.findActiveWorkoutFromStorage();
      }
      this.setState({ btnText: 'Save' });
    } else {
      this.setState({ btnText: 'Add' });
      // reset form if screen was previously loaded
      this.resetForm();
    }
  }

  resetForm = () => {
    this.props.setWorkoutName('');
    this.props.setWorkoutActiveState(false);
    this.props.setLoadedWorkout(null);
  }

  handleAddEditPress = async () => {
    if (this.props.makeActive && !this.props.workoutRecord.isActive) {
      if (this.props.activeWorkout) {
        Alert.alert('Error', 'Cannot have multiple active workouts.');
      } else {
        this.createOrUpdateWorkout();
      }
    } else {
      this.createOrUpdateWorkout();
    }
  };

  handleAddEditDaysPress = () => {
    const workoutId = this.props.navigation.getParam('wourkoutId', null);
    this.props.navigation.navigate('ManageDaysRT', {
      wourkoutId: workoutId,
    });
  };

  createOrUpdateWorkout = () => {
    if (this.props.workoutRecord) {
      this.handleUpdateWorkout();
    } else {
      this.handleCreateWorkout();
    }
  };

  handleUpdateWorkout = () => {
    const workoutId = this.props.navigation.getParam('wourkoutId', null);
    if (this.props.isConnected) {
      updateWorkout(
        workoutId,
        this.props.name,
        this.props.makeActive,
      ).then(() => {
        Alert.alert('Success', 'Workout saved.');
        this.props.navigation.goBack();
      })
        .catch((error) => {
          Alert.alert('Error', `Couldn't update a workout. Reason:${error}`);
        });
    } else {
      this.props.updateWorkoutToQueue({
        workoutId,
        name: this.props.name,
        isActive: this.props.makeActive,
      });
      Alert.alert('Alert', 'Details stored and will be updated when you back online');
      this.props.navigation.navigate('ManageDaysRT');
    }
  };

  handleCreateWorkout = () => {
    if (this.props.isConnected) {
      addWorkoutToDb(this.props.name, this.props.makeActive)
        .then(() => {
          Alert.alert('Success', 'Workout added');
          this.props.navigation.navigate('ManageDaysRT');
        })
        .catch((error) => {
          Alert.alert('Error', `Couldn't add a workout. Reason:${error}`);
        });
    } else {
      this.props.addWorkoutToQueue({
        name: this.props.name,
        isActive: this.props.makeActive,
      });
      Alert.alert('Alert', 'Workout added to the queue and will be available when you back online');
      this.props.navigation.navigate('ManageDaysRT');
    }
  };

  renderError = () => {
    if (this.state.error) {
      return <Text style={styles.errorPassword}>{this.state.error}</Text>;
    }
    return null;
  };

  renderLoading = () => {
    if (this.props.loading) {
      return <Loading key="loader" animating={this.props.loading} />;
    }
    return null;
  };

  render() {
    return (
      <View
        style={this.props.loading ? styles.loadingContainer : styles.container}
      >
        <OfflineNotice />
        <View style={styles.fieldContainer}>
          <TextInput
            style={styles.text}
            onChangeText={(name) => { this.props.setWorkoutName(name); }}
            placeholder="Name"
            spellCheck={false}
            value={this.props.name}
          />
          <View style={styles.switchView}>
            <Text style={styles.switchTitle}>Make this workout Active?</Text>
            <Switch
              style={styles.switch}
              onValueChange={(value) => { this.props.setWorkoutActiveState(value); }}
              value={this.props.makeActive}
            />
          </View>
        </View>
        {this.renderError()}
        <TouchableHighlight
          style={this.props.workoutRecord ? styles.button : styles.displayNone}
          onPress={this.handleAddEditDaysPress}
        >
          <Text style={styles.buttonText}>Add/Edit Days</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.handleAddEditPress}
          disabled={(this.props.name && this.props.name.length === 0) || this.state.error}
          style={
            (this.props.name && this.props.name.length === 0) || this.state.error
              ? styles.disabledBtn
              : styles.button}
        >
          <Text style={styles.buttonText}>
            {this.state.btnText}
          </Text>
        </TouchableHighlight>
        {this.renderLoading()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    workoutRecord: state.workout.foundWorkout,
    name: state.workout.workoutName,
    makeActive: state.workout.workoutActiveState,
    loading: state.workout.loading,
    fetchError: state.workout.error,
    activeWorkout: state.activeWorkout.activeWorkout,
    isConnected: state.network.isConnected,
  };
};

export default connect(mapStateToProps, {
  loadWorkoutData,
  setLoading,
  setWorkoutName,
  setWorkoutActiveState,
  findActiveWorkout,
  loadWorkoutDataFromStorage,
  findActiveWorkoutFromStorage,
  setLoadedWorkout,
  addWorkoutToQueue,
  updateWorkoutToQueue,
})(ManageWorkout);


ManageWorkout.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
