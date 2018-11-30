import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import UserAvatar from 'react-native-user-avatar';
import { GestureHandler } from 'expo';
import { FontAwesome } from '@expo/vector-icons';

const { TapGestureHandler, State } = GestureHandler;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'flex-start',
  },
  text: {
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0,
  },
  mainContent: {
    marginRight: 60,
  },
  countDays: {
    color: '#20B2AA',
  },
  timeAgo: {
    fontSize: 12,
    color: '#696969',
  },
  workoutName: {
    fontSize: 23,
    color: '#1E90FF',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 25,
  },
  selectedIcon: {
    color: 'grey',
  },
  selected: {
    backgroundColor: 'silver',
  },
});

class WorkoutListItem extends React.PureComponent {
    doubleTapRef = React.createRef();

    onPress = () => {
      this.props.onPressItem(this.props.id);
    };

    avatarOnSelected = () => {
      if (this.props.isSelected) {
        return (
          <View>
            <FontAwesome name="check-circle" size={65} style={styles.selectedIcon} />
          </View>
        );
      }
      return (
        <View>
          <UserAvatar style={styles.avatar} name={this.props.workout.name.charAt(0)} colors={['#b34d4d', '#867979', '#c4a321', '#62addb', '#62db98']} />
        </View>
      );
    };

    onSingleTap = (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        this.props.navigation.navigate('ManageWorkoutRT', {
          wourkoutId: this.props.id,
        });
      }
    };

    onDoubleTap = (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        this.onPress();
      }
    };

    render() {
      const icon = this.avatarOnSelected();
      return (
        <TapGestureHandler
          onHandlerStateChange={this.onSingleTap}
          waitFor={this.doubleTapRef}
        >
          <TapGestureHandler
            ref={this.doubleTapRef}
            onHandlerStateChange={this.onDoubleTap}
            numberOfTaps={2}
          >
            <View>
              <TouchableOpacity style={this.props.isSelected ? styles.selected : ''}>
                <View style={styles.container}>
                  {icon}
                  <View style={styles.content}>
                    <View style={styles.mainContent}>
                      <View style={styles.text}>
                        <Text style={styles.workoutName}>{this.props.nameTitle}</Text>
                      </View>
                      <Text style={styles.countDays}>{this.props.daysTitle}</Text>
                      <Text style={styles.timeAgo}>{this.props.createTitle}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </TapGestureHandler>
        </TapGestureHandler>
      );
    }
}

export default WorkoutListItem;

WorkoutListItem.propTypes = {
  createTitle: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  daysTitle: PropTypes.string.isRequired,
  nameTitle: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onPressItem: PropTypes.func.isRequired,
  workout: PropTypes.shape({
    name: PropTypes.string.isRequired,
    charAt: PropTypes.func.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
