import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {ListItem, Text, Button} from 'react-native-elements';

export default function OrderReview({navigation, route}) {
  let customerOrder = route.params.order;
  // Will eventually need to grab the restaurant name from order
  let orderSubtotal = 0.0;
  let orderTotal = 0.0;

  /*
    TODO: THE ORDER SUBTOTAL DOESN'T ACCOUNT FOR ADD-ONS
    TODO: ADD UP FEES AND GET ACTUAL TOTAL
  */
  const getOrderSubtotal = () => {
    // console.log(customerOrder);
    customerOrder.items.map(orderItem => {
      // console.log(orderItem.itemName);
      orderSubtotal += parseFloat(orderItem.itemPrice);
    });
    // console.log(orderSubtotal);
  };

  /*
    GENERATES A STRING TO DISPLAY OPTIONS SELECTED
  */
  const getOptions = item => {
    let options = '';

    item.options.forEach(option => {
      option.optionList.forEach((addon, index) => {
        options +=
          ' - ' +
          addon.optionName +
          (index < option.optionList.length ? '\n' : '');
      });
    });

    if (item.specialInstructions) {
      options += 'Special Instructions: ' + item.specialInstructions;
    }

    return options;
  };

  return (
    <>
      <ScrollView style={styles.general}>
        {/* <Text style={styles.restaurantName}>Restaurant Name</Text> */}
        <Text style={styles.restaurantName}>
          {customerOrder.restaurantName}
        </Text>
        {getOrderSubtotal()}
        {/* <Text style={styles.itemSectionTitle}>Items</Text> */}
        {route.params.order.items.map(orderItem => {
          return (
            <View key={orderItem.itemName}>
              <ListItem
                title={orderItem.itemName}
                titleStyle={styles.orderItemTitle}
                rightTitle={'$' + orderItem.itemPrice}
                // subtitle={orderItem.specialInstructions}
                subtitle={getOptions(orderItem) || false}
                subtitleStyle={styles.orderItemDescription}
                containerStyle={styles.orderItemContainer}
                // onPress={() => console.log('Pressed')}
                bottomDivider
              />
            </View>
          );
        })}
        <Text style={styles.itemOrderTotalTitle}>Order Total</Text>
        <View style={styles.orderTotalContainer}>
          <ListItem title="Subtotal:" rightTitle={'$' + orderSubtotal} />
          {/* TODO: GET FEES AND SALES TAX FROM DATA */}
          <ListItem title="Delivery Fees:" rightTitle={'$' + 0.0} />
          <ListItem title="Service Fees:" rightTitle={'$' + 0.0} />
          <ListItem title="Sales Tax:" rightTitle={'$' + 0.0} />
        </View>
      </ScrollView>
      {/* <Button title={'Proceed To Checkout $' + orderSubtotal} /> */}
      {/* TODO: CREATE AND NAVIGATE TO PAYMENT SCREEN */}
      <Button title={'Pay $' + orderSubtotal} />
    </>
  );
}

const styles = StyleSheet.create({
  general: {
    flex: 1,
    backgroundColor: '#fff',
  },
  restaurantName: {
    marginTop: 80,
    textAlign: 'center',
    fontSize: 20,
  },
  itemSectionTitle: {
    fontSize: 22,
    padding: 15,
    fontWeight: 'bold',
  },
  itemOrderTotalTitle: {
    fontSize: 22,
    padding: 15,
    fontWeight: 'bold',
  },
  orderItemContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  orderItemTitle: {},
  orderItemDescription: {
    fontSize: 12,
    color: '#111',
  },
  orderSubtotal: {
    fontSize: 25,
  },
});
