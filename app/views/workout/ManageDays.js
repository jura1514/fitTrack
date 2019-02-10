import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Loading from '../../sections/Loading';
import ExerciseSection from '../../sections/ExerciseSection';
import Devider from '../../sections/Devider';
import {
  getDays, addDayToDb, updateDayDb, deleteDay,
} from '../../services/DayService';
import {
  getExercises, addExerciseToDb, updateExerciseDb, deleteExecise,
} from '../../services/ExerciseService';

// caruousel settings
const SliderWidth = Dimensions.get('screen').width;
const SliderHeight = Dimensions.get('screen').height;
const ItemWidth = 300.0;

const weekDaysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 10,
  },
  dayDetailsContainer: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'grey',
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#00b5ec',
  },
  paginationContainer: {
    bottom: 0,
  },
  textInput: {
    height: 40,
    margin: 0,
    marginLeft: 7,
    marginRight: 7,
    paddingLeft: 10,
  },
  textTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nameTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 25,
    flex: 0.9,
  },
  iconPosition: {
    flex: 0.1,
    textAlign: 'right',
  },
  deleteBtn: {
    display: 'none',
  },
  binIcon: {
    width: 25,
    height: 25,
    color: 'red',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'stretch',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButton: {
    height: 50,
    backgroundColor: '#00b5ec',
    borderColor: '#48BBEC',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

class ManageDays extends Component {
  static navigationOptions = () => {
    const header = 'Workout Days';
    return {
      headerTitle: header,
    };
  };

  state = {
    loading: false,
    workoutId: null,
    days: [],
    exercises: [],
    refresh: false,
    isModalVisible: false,
    selectedModalDay: null,
    exerciseDataChanged: false,
    dayDataChanged: false,
  };

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', () => this.didFocus());
  }

  get pagination() {
    const { days, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={days.length}
        activeDotIndex={activeSlide || 0}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  didFocus = () => {
    const workoutId = this.props.navigation.getParam('wourkoutId', null);

    if (workoutId) {
      this.loadData(workoutId);
      this.setState({ workoutId });
    } else {
      this.props.navigation.navigate('WorkoutListRT');
    }
  };

  loadData = async (workoutId) => {
    this.setState({ loading: true });
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
      this.setState({ loading: false });
    } else {
      this.setState({ days: daysArray });
      this.setState({ loading: false });
    }
  };

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
      this.refreshCarousel();
    }
  };

  addNewExercise = () => {
    const { exercises } = this.state;
    const { days } = this.state;
    const { carousel } = this.state;
    const newExercise = {
      name: null,
      sets: '0',
      reps: '0',
      description: null,
    };

    const selectedDay = days[carousel.currentIndex];

    if (selectedDay) {
      if (selectedDay.id) {
        newExercise.index = exercises.length > 0 ? exercises.length + 1 : 1;

        newExercise.dayId = selectedDay.id;

        exercises.push(newExercise);
        this.exerciseChanged();
        this.refreshCarousel();
      } else {
        Alert.alert('Error', 'Save day data first');
      }
    } else {
      Alert.alert('Error', 'Add and save day first');
    }
  };

  backToWorkoutList = () => {
    this.props.navigation.pop(2);
  };

  addNewDay = () => {
    const { days } = this.state;
    const unsavedDay = days.find(e => !e.id);

    if (!unsavedDay || days.length === 0) {
      const newDay = {
        name: null,
        weekDay: null,
      };

      days.push(newDay);
      this.dayChanged();
      this.refreshCarousel();
      this.state.carousel.snapToNext();
    } else {
      Alert.alert('Error', 'Save existing day before adding a new one.');
    }
  };

  saveData = () => {
    const { days } = this.state;
    const { exercises } = this.state;
    if (days.length > 0) {
      if (this.validDay(days)) {
        if (exercises.length > 0) {
          const invalidExercise = this.validExercises(exercises);
          if (!invalidExercise) {
            if (this.state.dayDataChanged) {
              this.saveDays(days);
            }
            if (this.state.exerciseDataChanged) {
              this.saveExercises(exercises);
            }
          } else {
            Alert.alert('Error', 'Please enter all mandaory fields for exercise(s)');
          }
        } else {
          this.saveDays(days);
        }
      } else {
        Alert.alert('Error', 'Please enter all fields for day');
      }
    }
  };

  saveDays = (days) => {
    const promises = [];
    days.forEach((day) => {
      if (day.id) {
        const promise = new Promise((resolve, reject) => {
          this.updateDay(day).then((response) => {
            resolve(response);
          })
            .catch((error) => {
              reject(error);
            });
        });

        promises.push(promise);
      } else {
        const promise = new Promise((resolve, reject) => {
          this.addDayToDb(day).then((response) => {
            day.id = response; // eslint-disable-line no-param-reassign
            resolve();
          })
            .catch((error) => {
              reject(error);
            });
        });

        promises.push(promise);
      }
    });

    Promise.all(promises).then(() => {
      Alert.alert('Success', 'Day data saved.');
      this.refreshCarousel();
    });
  };

  saveExercises = (exercises) => {
    const promises = [];
    exercises.forEach((e) => {
      if (e.id) {
        const promise = new Promise((resolve, reject) => {
          this.updateExercise(e).then((response) => {
            resolve(response);
          })
            .catch((error) => {
              reject(error);
            });
        });

        promises.push(promise);
      } else {
        const promise = new Promise((resolve, reject) => {
          this.addExerciseToDb(e).then((response) => {
            e.id = response;
            resolve();
          })
            .catch((error) => {
              reject(error);
            });
        });

        promises.push(promise);
      }
    });

    Promise.all(promises).then(() => {
      Alert.alert('Success', 'Exercise(s) saved.');
      this.refreshCarousel();
    });
  };

  validDay = (days) => {
    const invalidDay = days.find((e) => {
      return !e.name || !e.weekDay;
    });

    return !invalidDay;
  };

  validExercises = (exercises) => {
    const invalidExercise = exercises.find((e) => {
      return !e.name || !e.sets || !e.reps || e.sets === 0 || e.reps === 0;
    });

    return invalidExercise;
  }

  addDayToDb = (day) => {
    return addDayToDb(day.name, day.weekDay, this.state.workoutId);
  };

  updateDay = (day) => {
    return updateDayDb(day.id, day.name, day.weekDay);
  };

  addExerciseToDb = (e) => {
    return addExerciseToDb(e.name, e.sets, e.reps, e.description, e.dayId);
  };

  updateExercise = (e) => {
    return updateExerciseDb(e.id, e.name, e.sets, e.reps, e.description);
  };

  deleteDayCLicked = async (dayId) => {
    Alert.alert(
      'Alert',
      'Are you sure you want to delete this day?',
      [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'OK', onPress: () => this.deleteDayCall(dayId) },
      ],
      { cancelable: false },
    );
  };

  deleteDayCall = async (id) => {
    try {
      await this.checkAndDeleteExercisesForDay(id);
      await deleteDay(id);
      // eslint-disable-next-line
      const daysCopy = this.state.days;
      const index = daysCopy.findIndex(i => i.id === id);
      daysCopy.splice(index, 1);
      this.setState({ days: daysCopy });
    } catch (e) {
      Alert.alert('Error', `Could not delete a day.\n Reason:${e}`);
    }
  }

  checkAndDeleteExercisesForDay = async (id) => {
    try {
      const { exercises } = this.state;
      const hasExercises = exercises.find(e => e.dayId === id);

      if (hasExercises && typeof hasExercises !== 'undefined') {
        const promises = [];

        exercises.forEach((e) => {
          if (e.dayId === id) {
            const promise = new Promise((resolve, reject) => {
              deleteExecise(e.id).then(() => {
                resolve();
              })
                .catch((error) => {
                  reject(error);
                });
            });

            promises.push(promise);
          }
        });

        Promise.all(promises);
      }
    } catch (e) {
      Alert.alert('Error', `Could not clear exercise(s) for a day.\n Reason:${e}`);
    }
  }

  exercisesOnDelete = async (id) => {
    try {
      await deleteExecise(id);
      // eslint-disable-next-line
      const exercisesCopy = this.state.exercises;
      const index = exercisesCopy.findIndex(i => i.id === id);
      exercisesCopy.splice(index, 1);
      this.setState({ exercises: exercisesCopy });
    } catch (e) {
      Alert.alert('Error', `Could not delete an exercise.\n Reason:${e}`);
    }
  }

  getCurrentDayExercises = (day) => {
    const { exercises } = this.state;

    if (exercises.length > 0) {
      const filteredExercises = exercises.filter((e) => {
        return e.dayId === day.item.id;
      });

      return filteredExercises;
    }

    return exercises;
  }

  exerciseChanged = () => {
    if (!this.state.exerciseDataChanged) {
      this.setState({ exerciseDataChanged: true });
    }
  }

  dayChanged = () => {
    if (!this.state.dayDataChanged) {
      this.setState({ dayDataChanged: true });
    }
  }

  renderExercises = (day) => {
    const { days } = this.state;
    const { carousel } = this.state;
    const selectedDay = days[carousel.currentIndex];
    const dayExercises = this.getCurrentDayExercises(day);

    if (selectedDay.id === day.item.id) {
      return (
        <ExerciseSection
          day={day}
          exercises={dayExercises}
          onDeleteAction={this.exercisesOnDelete}
          exerciseChanged={this.exerciseChanged}
        />
      );
    }

    return null;
  };

  updateDayName = (text, day) => {
    // eslint-disable-next-line
    const daysCopy = this.state.days;
    const index = daysCopy.findIndex(i => i.id === day.item.id);
    daysCopy[index].name = text;
    this.setState({ days: daysCopy }, () => this.dayChanged());
  };

  updateWeekDay = (text, day) => {
    // eslint-disable-next-line
    const daysCopy = this.state.days;
    const index = daysCopy.findIndex(i => i.id === day.item.id);
    daysCopy[index].weekDay = text;
    this.setState({ days: daysCopy }, () => this.dayChanged());
    this.toggleModal();
  };

  toggleModal = (selectedModalDay) => {
    this.setState({ selectedModalDay });
    this.setState(prevState => ({ isModalVisible: !prevState.isModalVisible }));
  }

  refreshCarousel() {
    this.setState(prevState => ({ refresh: !prevState.refresh }));
  }

  renderDays = (day) => {
    return (
      <View style={styles.dayDetailsContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.nameTitle}>
            { 'Name' }
          </Text>
          <TouchableOpacity
            style={!day.item.id ? styles.deleteBtn : styles.iconPosition}
            onPress={() => this.deleteDayCLicked(day.item.id)}
          >
            <FontAwesome name="trash-o" size={25} style={styles.binIcon} />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="type day name"
          spellCheck={false}
          onChangeText={(text) => { this.updateDayName(text, day); }}
          value={day.item.name}
        />
        <Text style={styles.textTitle}>
          { 'Weekday' }
        </Text>
        <TouchableOpacity onPress={() => this.toggleModal(day)} style={styles.textInput}>
          <Text>{day.item.weekDay ? day.item.weekDay : 'Select day of the week'}</Text>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
        >
          <View style={styles.modalContent}>
            <FlatList
              key="id"
              data={weekDaysArray}
              extraData={this.state}
              keyExtractor={item => item.item}
              renderItem={(weekDay) => {
                return (
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => this.updateWeekDay(weekDay.item, this.state.selectedModalDay)}
                  >
                    <Text style={styles.modalButtonText}>{String(weekDay.item)}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>
        <Devider />
        {this.renderExercises(day)}
      </View>
    );
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
        <KeyboardAwareScrollView
          enableAutomaticScroll
          enableOnAndroid
          extraScrollHeight={100}
          extraHeight={100}
          contentContainerStyle={styles.contentContainer}
        >
          <Carousel
            ref={(c) => { this.state.carousel = c; }}
            data={this.state.days}
            extraData={this.state.refresh}
            // firstItem={FirstItem}
            itemWidth={ItemWidth}
            sliderWidth={SliderWidth}
            sliderHeight={SliderHeight}
            activeSlideAlignment="center"
            renderItem={this.renderDays}
            onSnapToItem={index => this.setState({ activeSlide: index })}
          />
        </KeyboardAwareScrollView>
        <ActionButton buttonColor="#00b5ec">
          <ActionButton.Item
            buttonColor="rgba(231,76,60,1)"
            title="Save"
            onPress={() => this.saveData()}
          >
            <FontAwesome name="save" size={25} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#1abc9c"
            title="New Day"
            onPress={() => this.addNewDay()}
          >
            <FontAwesome name="calendar-plus-o" size={25} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="New Exercise"
            onPress={() => this.addNewExercise()}
          >
            <MaterialIcons name="playlist-add" size={25} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#D5D8DC"
            title="Back to Workouts"
            onPress={() => this.backToWorkoutList()}
          >
            <FontAwesome name="list-ul" size={25} />
          </ActionButton.Item>
        </ActionButton>
        { this.pagination }
        {this.renderLoading()}
      </View>
    );
  }
}

export default ManageDays;

ManageDays.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
