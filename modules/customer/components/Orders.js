import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {signedIn: false, name: '', protoUrl: ''};
  }
  //https://reactnavigation.org/docs/material-top-tab-navigator/
  //Please use this style of navigator for previous orders and current order

  render() {
    return (
      <View style={styles.general}>
        <Text> Orders Display goes here </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  general: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
