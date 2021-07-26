import React from 'react';
import fetchRestaurants from './subcomponents/FetchRestaurants';
import {createStackNavigator} from '@react-navigation/stack';
import RestaurantDisplay from './subcomponents/RestaurantDisplay';
import AddItemToCart from './subcomponents/AddItemToCart';
import MenuDisplay from './subcomponents/MenuDisplay';
import OrderReview from './subcomponents/OrderReview';
import AddressSelect from './subcomponents/AddressSelect';
import {Icon, Button} from 'react-native-elements';

const OrderStack = createStackNavigator();
const Stack = createStackNavigator();

export default class RestaurantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      address: 'g',
      name: '',
      protoUrl: '',
      restaurantList: props.route.params.restaurants,
      profile: props.route.params.data,
    };

    //console.log(JSON.parse(props.route.params.data).userData);
  }

  render() {
    console.log('restaurantlist', this.state.profile);
    return (
      <Stack.Navigator
        initialRouteName="OrderStack"
        mode="modal"
        headerMode="none">
        <Stack.Screen
          name="Order Stack"
          component={OrderStackStructure}
          initialParams={{
            restaurantList: this.state.restaurantList,
            profile: this.state.profile,
          }}
          options={({navigation, route}) => ({
            title: 'Deliver to 12345 Test St',
          })}
        />
        {/* <Stack.Screen
          name="Order Review"
          component={OrderReview}
          options={({navigation, route}) => ({
            title: 'Choose an Item',
            headerBackTitle: 'Go Back',
          })}
        /> */}
        <Stack.Screen
          name="Address Select"
          component={AddressSelect}
          options={({navigation, route}) => ({
            title: '',
          })}
        />
      </Stack.Navigator>
    );
  }
}

const OrderStackStructure = ({navigation, route}) => {
  return (
    <OrderStack.Navigator initialRouteName="RestaurantDisplay">
      <OrderStack.Screen
        name="RestaurantDisplay"
        component={RestaurantDisplay}
        initialParams={{
          restaurantList: route.params.restaurantList,
        }}
        options={() => ({
          title: 'Deliver to 12345 Test St', //TODO: Populate with actual address
          headerRight: props => (
            <Button
              icon={<Icon name="create" size={15} color="#03a5fc" />}
              title="Change"
              type="clear"
              onPress={() => {
                navigation.navigate('Address Select', {
                  address: '',
                });
              }}
            />
          ),
        })}
      />
      <OrderStack.Screen
        name="MenuDisplay"
        component={MenuDisplay}
        options={() => ({
          title: 'Choose an Item',
          headerBackTitle: '',
        })}
      />
      <OrderStack.Screen
        name="Order Review"
        component={OrderReview}
        initialParams={{
          profile: route.params.profile,
        }}
        options={({navigation, route}) => ({
          title: 'Checkout',
          profile: route.params.profile,
        })}
      />
      <OrderStack.Screen
        name="AddItemToCart"
        component={AddItemToCart}
        options={() => ({
          title: 'Customize',
          headerBackTitle: 'Cancel',
        })}
      />
    </OrderStack.Navigator>
  );
};
