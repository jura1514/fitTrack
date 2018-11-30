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
  Text,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import db from '../config/firebase';
import { getWorkouts } from '../services/WorkoutService';
import Loading from '../sections/Loading';

const styles = StyleSheet.create({
  imagestyle: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: 'center',
  },
  menuIcon: {
    marginLeft: 15,
  },
  noActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  noActiveText: {
    fontSize: 22,
  },
});

export default class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: 'Home',
      headerLeft: (
        <FontAwesome name="bars" style={styles.menuIcon} size={30} onPress={() => navigation.toggleDrawer()} />
      ),
      headerRight: (
        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => params.handleLogOut()}>
            <Image
              style={styles.imagestyle}
               // eslint-disable-next-line
              source={require('../../assets/icons/exit.png')}
            />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  state = {
    workouts: [],
    loading: false,
  };

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', this.didFocus);
    this.didBlurListener = this.props.navigation.addListener('didBlur', this.didBlur);
  }

  componentWillUnmount() {
    this.didFocusListener.remove();
    this.didBlurListener.remove();
  }

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
    const snapshot = await getWorkouts();
    if (snapshot.val()) {
      const workoutsArray = [];

      // eslint-disable-next-line
      for (let key in snapshot.val()) {
        const newObj = snapshot.val()[key];
        if (newObj.isActive) {
          newObj.id = key;
          workoutsArray.push(newObj);
        }
      }
      this.setState({ workouts: workoutsArray });
      this.setState({ loading: false });
    } else {
      this.setState({ loading: false });
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

  render() {
    if (this.state.workouts.length > 0) {
      return [
        <FlatList
          key="id"
          data={this.state.workouts}
          extraData={this.state}
          style={styles.list}
          keyExtractor={item => item.id}
          renderItem={(item) => {
            const workout = item.item;
            const nameTitle = workout.name;
            return (
              <View>
                <Text>{nameTitle}</Text>
              </View>
            );
          }}
        />,
        this.renderLoading(),
      ];
    }
    return [
      <View style={styles.noActive}>
        <Text style={styles.noActiveText}>No ACTIVE workouts</Text>
      </View>,
      this.renderLoading(),
    ];
  }
}

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
