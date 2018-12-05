import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
} from 'react-native';
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
});

// eslint-disable-next-line react/prefer-stateless-function
export default class ExerciseSection extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.textTitle}>
          { 'Exercises at this day' }
        </Text>
        <Devider />
        {
        this.props.day.item.exercises.map((element, index) => {
          return (
            <View style={styles.exerciseContainer}>
              <Text style={styles.textExerciseNumber}>
                { index + 1 }
              </Text>
              <View style={styles.exerciseRow}>
                <Text style={[styles.textExerciseTitle]}>
                  { 'Exercise Name:' }
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[styles.textExerciseInput, styles.exerciseBox]}
                  placeholder="type exercise name"
                  spellCheck={false}
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
