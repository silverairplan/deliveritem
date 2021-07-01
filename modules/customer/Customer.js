import React from 'react';
//import {View} from 'react-native';
import Orders from './components/Orders';
import Profile from './components/Profile';
import RestaurantList from './components/RestaurantList';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
var data;

export default class Customer extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.data);
    this.state = {name: props.name, protoUrl: '', data: props.data};
    data = this.state.data;
  }

  render() {
    return <NavigationBar />;
  }
}

//TODO: Add icons to the nav bar
function NavigationBar() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={RestaurantList}
        initialParams={{data: data}}
      />
      <Tab.Screen name="Orders" component={Orders} />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{data: data}}
      />
    </Tab.Navigator>
  );
}
