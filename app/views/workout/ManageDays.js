import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { ImagePicker } from 'expo';
import moment from 'moment';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Loading from '../../sections/Loading';
import ExerciseSection from '../../sections/ExerciseSection';
import Devider from '../../sections/Devider';
import {
  getDays, addDayToDb, updateDayDb, deleteDay,
} from '../../services/DayService';
import { getExercises, addExerciseToDb, updateExerciseDb } from '../../services/ExerciseService';

// caruousel settings
const SliderWidth = Dimensions.get('screen').width;
const SliderHeight = Dimensions.get('screen').height;
const ItemWidth = 300.0;

const data = [
  {
    name: 'day 1',
    weekday: moment().weekday(0).format('dddd'),
    exercises: [
      {
        name: 'bench press',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'barbell row',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'flyes',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'deadlifts',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'Squats',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'Pull ups',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'Bycep curles',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
    ],
  },
  {
    name: 'day 2',
    weekday: moment().weekday(2).format('dddd'),
    exercises: [
      {
        name: 'bench press',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'barbell row',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'flyes',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'deadlifts',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'Squats',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'Pull ups',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'Bycep curles',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
    ],
  },
  {
    name: 'day 3',
    weekday: moment().weekday(4).format('dddd'),
    exercises: [
      {
        name: 'bench press',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'barbell row',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'flyes',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'deadlifts',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'Squats',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'Pull ups',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
      {
        name: 'Bycep curles',
        sets: 5,
        reps: 8,
        description: 'Do as much as you can and as hard as you can, ye',
      },
    ],
  },
];

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
    defaultDay: {
      name: null,
      weekDay: null,
    },
    defaultExercise: {
      name: null,
      sets: '0',
      reps: '0',
      description: null,
    },
    refresh: false,
  };

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', this.didFocus);
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
    const newExercise = this.state.defaultExercise;

    const selectedDay = days[carousel.currentIndex];

    if (selectedDay.id) {
      // newExercise.index = exercises.length > 0 ? exercises.length + 1 : 1;

      newExercise.dayId = selectedDay.id;

      exercises.push(newExercise);
      this.refreshCarousel();
    } else {
      Alert.alert('Error', 'Save day data first');
    }
  };

  addNewDay = () => {
    const { days } = this.state;
    const newDay = this.state.defaultDay;

    days.push(newDay);
    this.refreshCarousel();
    this.state.carousel.snapToNext();
  };

  saveData = () => {
    const { days } = this.state;
    const { exercises } = this.state;

    if (this.validDay(days)) {
      if (exercises.length > 0) {
        const invalidExercise = this.validExercises(exercises);
        if (!invalidExercise) {
          this.saveDays(days);
          this.saveExercises(exercises);
        } else {
          Alert.alert('Error', `Please enter all mandaory fields for exercise ${exercises.indexOf(invalidExercise) + 1}`);
        }
      } else {
        this.saveDays(days);
      }
    } else {
      Alert.alert('Error', 'Please enter all fields for day');
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
      return !e.name || !e.sets || !e.reps;
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
      await deleteDay(id);
      // eslint-disable-next-line
      const daysCopy = this.state.days;
      const index = daysCopy.findIndex(i => i.id === id);
      daysCopy.splice(index, 1);
      this.setState({ days: daysCopy });
    } catch (e) {
      Alert.alert('Error', `Could not delete a day. Reason:${e}`);
    }
  }

  refreshExercisesOnDelete = (newExerciseArr) => {
    this.setState({ exercises: newExerciseArr });
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

  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
    });
    if (!result.cancelled) {
      this.setState(prevState => ({ images: prevState.images.push(result.uri) }));
    }
  };

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
          onDeleteAction={this.refreshExercisesOnDelete}
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
    this.setState({ days: daysCopy });
  };

  updateWeekDay = (text, day) => {
    // eslint-disable-next-line
    const daysCopy = this.state.days;
    const index = daysCopy.findIndex(i => i.id === day.item.id);
    daysCopy[index].weekDay = text;
    this.setState({ days: daysCopy });
  };

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
        <TextInput
          style={styles.textInput}
          placeholder="select week day"
          spellCheck={false}
          onChangeText={(text) => { this.updateWeekDay(text, day); }}
          value={day.item.weekDay}
        />
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
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View behavior="position" keyboardVerticalOffset={50}>
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
          </View>
        </ScrollView>
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
