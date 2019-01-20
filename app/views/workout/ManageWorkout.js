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
import Loading from '../../sections/Loading';
import {
  getWorkouts, updateWorkout, addWorkoutToDb, getWorkout,
} from '../../services/WorkoutService';


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
    name: '',
    numberOfDays: null,
    makeActive: false,
    error: '',
    btnText: '',
    loading: false,
    workoutRecord: null,
  };

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', this.didFocus);
  }

  didFocus = () => {
    const workoutId = this.props.navigation.getParam('wourkoutId', null);

    if (workoutId) {
      this.loadData(workoutId);
      this.setState({ btnText: 'Save' });
    } else {
      this.setState({ btnText: 'Add' });
    }
  }

  loadData = async (id) => {
    this.setState({ loading: true });
    const snapshot = await getWorkout(id);
    if (snapshot.val()) {
      const workoutRecord = snapshot.val();
      this.setState({ workoutRecord });
      this.setState({ name: workoutRecord.name });
      this.setState({ numberOfDays: workoutRecord.numberOfDays });
      this.setState({ makeActive: workoutRecord.isActive });
      this.setState({ loading: false });
    } else {
      this.setState({ loading: false });
    }
  }

  setWorkoutName = (name) => {
    this.setState({ name });
  };

  handleDaysInput = (days) => {
    if (days !== '') {
      if (Number.parseInt(days, 10)) {
        this.setState({ numberOfDays: days });
        if (days <= 7) {
          this.setState({ error: '' });
        } else {
          this.setState({ error: 'Number of days in workout cannot exceed 7.' });
        }
      } else {
        this.setState({ error: 'Not a valid number entered in days field.' });
      }
    } else {
      this.setState({ numberOfDays: days });
    }
  };

  handleAddEditPress = async () => {
    if (this.state.makeActive && !this.state.workoutRecord.isActive) {
      const hasActive = await this.hasActiveWorkout();

      if (hasActive) {
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
    this.setState({ numberOfDays: 5 });
    if (this.state.workoutRecord) {
      const workoutId = this.props.navigation.getParam('wourkoutId', null);
      updateWorkout(
        workoutId,
        this.state.name,
        this.state.numberOfDays,
        this.state.makeActive,
      ).then(() => {
        Alert.alert('Success', 'Workout saved.');
        this.props.navigation.goBack();
      })
        .catch((error) => {
          Alert.alert('Error', `Couldn't update a workout. Reason:${error}`);
        });
    } else {
      addWorkoutToDb(this.state.name, this.state.numberOfDays, this.state.makeActive)
        .then(() => {
          Alert.alert('Success', 'Workout added');
          this.props.navigation.navigate('ManageDaysRT');
        })
        .catch((error) => {
          Alert.alert('Error', `Couldn't add a workout. Reason:${error}`);
        });
    }
  };

  hasActiveWorkout = async () => {
    let hasActive = false;
    const snapshot = await getWorkouts();
    if (snapshot.val()) {
      // eslint-disable-next-line
      for (let key in snapshot.val()) {
        const workout = snapshot.val()[key];
        if (workout.isActive) {
          hasActive = true;
        }
      }
    }

    return hasActive;
  };

  renderError = () => {
    if (this.state.error) {
      return <Text style={styles.errorPassword}>{this.state.error}</Text>;
    }
    return null;
  };

  renderLoading = () => {
    if (this.state.loading) {
      return <Loading key="loader" animating={this.state.loading} />;
    }
    return null;
  };

  render() {
    return (
      <View
        style={this.props.loading ? styles.loadingContainer : styles.container}
      >
        <View style={styles.fieldContainer}>
          <TextInput
            style={styles.text}
            onChangeText={name => this.setState({ name })}
            placeholder="Name"
            spellCheck={false}
            value={this.state.name}
          />
          <View style={styles.switchView}>
            <Text style={styles.switchTitle}>Make this workout Active?</Text>
            <Switch
              style={styles.switch}
              onValueChange={value => this.setState({ makeActive: value })}
              value={this.state.makeActive}
            />
          </View>
        </View>
        {this.renderError()}
        <TouchableHighlight
          style={this.state.workoutRecord ? styles.button : styles.displayNone}
          onPress={this.handleAddEditDaysPress}
        >
          <Text style={styles.buttonText}>Add/Edit Days</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.handleAddEditPress}
          disabled={this.state.name.length === 0 || this.state.error}
          style={
            this.state.name.length === 0 || this.state.error
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

export default ManageWorkout;

ManageWorkout.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
