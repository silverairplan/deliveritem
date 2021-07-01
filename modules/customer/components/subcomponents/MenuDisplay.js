import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {ListItem, Text, Button} from 'react-native-elements';

// var currentOrder = {
//   orderId: '',
//   restaurantName: '',
//   status: 'Awaiting Confirmation',
//   orderTotal: '',
//   items: [],
//   dropoffName: '',
//   dropoffAddress: '',
//   dropoffPhoneNumber: '',
//   dropoffInstructions: '',
//   dateOrderPlaced: '',
//   timeOrderPlaced: '',
//   timeOrderOutForDelivery: '',
//   timeOrderDelivered: '',
//   requiresId: false,
// }; //TODO: populate with things from jasons profile function

export default function MenuDisplay({navigation, route}) {
  const [currentOrder, setCurrentOrder] = React.useState({
    orderId: '',
    restaurantName: '',
    status: 'Awaiting Confirmation',
    orderTotal: '',
    items: [],
    dropoffName: '',
    dropoffAddress: '',
    dropoffPhoneNumber: '',
    dropoffInstructions: '',
    dateOrderPlaced: '',
    timeOrderPlaced: '',
    timeOrderOutForDelivery: '',
    timeOrderDelivered: '',
    requiresId: false,
  }); //TODO: populate with things from jasons profile function

  React.useEffect(() =>
    navigation.addListener('focus', () => {
      // USED TO CLEAR CART IF SWITCHING RESTAURANTS
      if (
        currentOrder.restaurantName !==
        route.params.restaurant.profile.restaurantInfo.restaurantName
      ) {
        setCurrentOrder({
          ...currentOrder,
          items: [],
          restaurantName:
            route.params.restaurant.profile.restaurantInfo.restaurantName,
        });
      }
      // ADDS ITEM TO ORDER
      if (route.params.addToCart) {
        // currentOrder.items.push(route.params.itemToAdd);
        setCurrentOrder({
          ...currentOrder,
          items: [...currentOrder.items, route.params.itemToAdd],
        });
        // console.log('Current Order:' + '\n' + currentOrder.items);
        navigation.setParams({
          addToCart: false,
          itemToAdd: null,
        });
      }
    }),
  );
  return (
    <>
      <ScrollView>
        {route.params.restaurant.menu.categories.map(category => {
          return (
            <View key={'category_display_' + category.categoryName}>
              <View style={styles.menuListView}>
                <Text h4 style={styles.titles}>
                  {category.categoryName}
                </Text>
              </View>
              {category.items.map(item => {
                {
                  /* CURRENTLY NOT USED - itemTitle - probably for availability feature */
                }
                {
                  /* let itemTitle = '';
                if (item.available) {
                  itemTitle = item.itemName + ' $' + item.itemPrice;
                } else {
                  itemTitle =
                    item.itemName +
                    ' $' +
                    item.itemPrice +
                    ' *Not Currently Available*';
                } */
                }
                return (
                  <View
                    key={
                      'category_display_' +
                      category.categoryName +
                      '_menu_item_' +
                      item.itemName +
                      item.itemPrice
                    }>
                    {menuListItemDisplay(item, category, navigation)}
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
      {currentOrder.items.length > 0 ? (
        <Button
          // title="View Order"
          title={`Proceed to Checkout (${currentOrder.items.length})`}
          onPress={() =>
            // navigation.navigate('Home', {
            //   screen: 'Order Review',
            //   params: {order: currentOrder},
            // })
            navigation.navigate('Order Review', {
              order: currentOrder,
            })
          }
        />
      ) : null}
    </>
  );
}

/*
  TODO: FIX ROUTE PARAMS TO BE CONSISTENT
*/
const menuListItemDisplay = (item, category, navigation) => {
  if (item.picture === '') {
    return (
      <ListItem
        title={item.itemName}
        subtitle={item.itemDescription}
        bottomDivider
        chevron
        onPress={() => {
          navigation.navigate('AddItemToCart', {
            item: item,
            category: category,
            addToCart: false,
            itemToAdd: null,
          });
        }}
      />
    );
  }
  return (
    <ListItem
      title={item.itemName}
      subtitle={item.itemDescription}
      leftAvatar={{source: {uri: item.picture}}}
      bottomDivider
      chevron
      onPress={navigateToAddItemToCart(item, category, navigation)}
    />
  );
};

const navigateToAddItemToCart = (item, category, navigation) => {
  var orderItem = {
    itemName: item.itemName,
    itemCategory: category,
    itemDescription: item.itemDescription,
    itemQuantity: 1,
    options: [],
    specialInstructions: '',
  };
  navigation.navigate('AddItemToCart', {
    menuItem: item,
    orderItem: orderItem,
    category: category,
    addToCart: false,
  });
};

const styles = StyleSheet.create({
  titles: {
    textAlign: 'center',
    color: '#03a5fc',
    padding: 5,
  },
  categoryEditorButton: {
    color: '#03a5fc',
  },
  menuListView: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  addCategoryIcon: {
    position: 'absolute',
    right: 0,
  },
});
