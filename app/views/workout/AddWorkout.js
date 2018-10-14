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
import { addWorkoutToDb } from '../../services/WorkoutService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

class AddWorkout extends Component {
  static navigationOptions = {
    title: 'Add Workout',
  };

  state = {
    name: null,
    numberOfDays: null,
    makeActive: false,
    error: '',
    addDisabled: true,
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

    this.handleDisableAdd();
  };

  handleAddPress = () => {
    addWorkoutToDb(this.state.name, this.state.numberOfDays, this.state.makeActive)
      .then(() => {
        Alert.alert('Success', 'Workout added');
        this.props.navigation.goBack();
      })
      .catch((error) => {
        Alert.alert('Error', `Couldn't add a workout. Reason:${error}`);
      });
  };

  handleDisableAdd = () => {
    if (!this.state.name || !this.state.numberOfDays || this.state.error) {
      this.setState({ addDisabled: true });
    }
    this.setState({ addDisabled: false });
  }

  renderError = () => {
    if (this.state.error) {
      return <Text style={styles.errorPassword}>{this.state.error}</Text>;
    }
    return null;
  };

  render() {
    return (
      <View
        style={styles.container}
      >
        <View style={styles.fieldContainer}>
          <TextInput
            style={styles.text}
            onChangeText={name => this.setState({ name })}
            placeholder="Name"
            spellCheck={false}
            value={this.state.name}
          />
          <TextInput
            style={styles.text}
            keyboardType="numeric"
            onChangeText={numberOfDays => this.handleDaysInput(numberOfDays)}
            placeholder="Days"
            spellCheck={false}
            value={this.state.numberOfDays}
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
          onPress={this.handleAddPress}
          disabled={this.state.addDisabled}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default AddWorkout;

AddWorkout.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
