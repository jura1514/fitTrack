import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import UserAvatar from 'react-native-user-avatar';
import { FontAwesome } from '@expo/vector-icons';

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

    render() {
      const icon = this.avatarOnSelected();
      return (
        <TouchableOpacity style={this.props.isSelected ? styles.selected : ''} onPress={this.onPress}>
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
};
