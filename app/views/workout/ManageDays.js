import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { ImagePicker } from 'expo';
import moment from 'moment';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Loading from '../../sections/Loading';
import ExerciseSection from '../../sections/ExerciseSection';
import Devider from '../../sections/Devider';

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
    days: data,
    images: [],
  };

  get pagination() {
    const { days, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={days.length}
        activeDotIndex={activeSlide}
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
    return (
      <ExerciseSection day={day} />
    );
  };

  renderDays = (day) => {
    return (
      <View style={styles.dayDetailsContainer}>
        <Text style={styles.textTitle}>
          { 'Name' }
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="type day name"
          spellCheck={false}
          value={day.item.name}
        />
        <Text style={styles.textTitle}>
          { 'Weekday' }
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="select week day"
          spellCheck={false}
          value={day.item.weekday}
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
          <Carousel
            data={this.state.days}
            // firstItem={FirstItem}
            itemWidth={ItemWidth}
            sliderWidth={SliderWidth}
            sliderHeight={SliderHeight}
            activeSlideAlignment="center"
            renderItem={this.renderDays}
            onSnapToItem={index => this.setState({ activeSlide: index })}
          />
        </ScrollView>
        <ActionButton buttonColor="#00b5ec">
          <ActionButton.Item
            buttonColor="#1abc9c"
            title="New Day"
            onPress={() => {}}
          >
            <FontAwesome name="calendar-plus-o" size={25} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="New Exercise"
            onPress={() => {}}
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
