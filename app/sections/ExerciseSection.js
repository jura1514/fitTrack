import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Devider from './Devider';

const styles = StyleSheet.create({
  textExerciseInput: {
    marginRight: 15,
    paddingLeft: 5,
  },
  textTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textExerciseTitle: {
    fontSize: 12,
    fontWeight: 'normal',
    marginTop: 6,
    textAlign: 'center',
    flex: 1,
  },
  exerciseContainer: {
    margin: 10,
    borderWidth: 2,
    borderColor: '#00b5ec',
  },
  textExerciseNumber: {
    color: '#00b5ec',
    fontSize: 20,
    textAlign: 'left',
    marginLeft: 7,
    fontWeight: 'bold',
    marginRight: 'auto',
  },
  textAddInfoTitle: {
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'center',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  additionalInfoInput: {
    margin: 0,
    marginLeft: 7,
    marginRight: 7,
    paddingLeft: 10,
  },
  exerciseRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseBox: {
    flex: 1.2,
  },
  iconPosition: {
    textAlign: 'right',
    marginLeft: 'auto',
  },
  deleteBtn: {
    display: 'none',
  },
  binIcon: {
    width: 25,
    height: 25,
    color: 'red',
  },
  flexRow: {
    flexDirection: 'row',
  },
});

export default class ExerciseSection extends React.Component {
  state = {
    day: this.props.day.item,
    exercises: this.props.exercises,
  };

  componentWillReceiveProps(newProps) {
    this.setState({ exercises: newProps.exercises });
  }

  deleteExerciseClicked = async (exerciseId) => {
    Alert.alert(
      'Alert',
      'Are you sure you want to delete this exercise?',
      [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'OK', onPress: () => this.props.onDeleteAction(exerciseId) },
      ],
      { cancelable: false },
    );
  };

  updateExerciseName = (text, index) => {
    // eslint-disable-next-line
    const exercisesCopy = this.state.exercises;
    exercisesCopy[index].name = text;
    this.setState({ exercises: exercisesCopy }, () => this.props.exerciseChanged());
  };

  updateExerciseSets = (text, index) => {
    // eslint-disable-next-line
    const exercisesCopy = this.state.exercises;
    exercisesCopy[index].sets = text;
    this.setState({ exercises: exercisesCopy }, () => this.props.exerciseChanged());
  };

  updateExerciseReps = (text, index) => {
    // eslint-disable-next-line
    const exercisesCopy = this.props.exercises;
    exercisesCopy[index].reps = text;
    this.setState({ exercises: exercisesCopy }, () => this.props.exerciseChanged());
  };

  updateExerciseDesc = (text, index) => {
    // eslint-disable-next-line
    const exercisesCopy = this.state.exercises;
    exercisesCopy[index].description = text;
    this.setState({ exercises: exercisesCopy }, () => this.props.exerciseChanged());
  };

  render() {
    return (
      <View>
        <Text style={styles.textTitle}>
          { `Exercises at: ${this.state.day.name ? this.state.day.name : ''}` }
        </Text>
        <Devider />
        {this.state.exercises.length > 0}
        {this.state.exercises.map((element, index) => {
          return (
            <View style={styles.exerciseContainer}>
              <View style={styles.flexRow}>
                <Text style={styles.textExerciseNumber}>
                  { index + 1 }
                </Text>
                <TouchableOpacity
                  style={!element.id ? styles.deleteBtn : styles.iconPosition}
                  onPress={() => this.deleteExerciseClicked(element.id)}
                >
                  <FontAwesome name="trash-o" size={25} style={styles.binIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.exerciseRow}>
                <Text style={[styles.textExerciseTitle]}>
                  { 'Exercise Name:' }
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[styles.textExerciseInput, styles.exerciseBox]}
                  placeholder="type exercise name"
                  spellCheck={false}
                  /* eslint-disable no-param-reassign */
                  onChangeText={(text) => { this.updateExerciseName(text, index); }}
                  value={element.name}
                />
              </View>
              <View style={styles.exerciseRow}>
                <Text style={[styles.textExerciseTitle]}>
                  { 'Number of Sets:' }
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  keyboardType="numeric"
                  style={[styles.textExerciseInput, styles.exerciseBox]}
                  placeholder="select number of sets"
                  spellCheck={false}
                  /* eslint-disable no-param-reassign */
                  onChangeText={(text) => { this.updateExerciseSets(text, index); }}
                  value={element.sets}
                />
              </View>
              <View style={styles.exerciseRow}>
                <Text style={[styles.textExerciseTitle]}>
                  { 'Number of Reps:' }
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  keyboardType="numeric"
                  style={[styles.textExerciseInput, styles.exerciseBox]}
                  placeholder="select number of reps"
                  spellCheck={false}
                  /* eslint-disable no-param-reassign */
                  onChangeText={(text) => { this.updateExerciseReps(text, index); }}
                  value={element.reps}
                />
              </View>
              <Text style={styles.textAddInfoTitle}>
                { 'Additional Info' }
              </Text>
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.additionalInfoInput}
                placeholder="provide additional info"
                spellCheck={false}
                multiline
                numberOfLines={3}
                /* eslint-disable no-param-reassign */
                onChangeText={(text) => { this.updateExerciseDesc(text, index); }}
                value={element.description}
              />
            </View>
          );
        })
        }
      </View>
    );
  }
}
