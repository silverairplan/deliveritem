import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Icon, ListItem, Text, Card, Button} from 'react-native-elements';

export default function RestaurantDisplay({navigation, route}) {
  return (
    <ScrollView>
      {route.params.restaurantList.restaurants.map(restaurant => {
        let picture = restaurant.profile.picture; //might just have them upload one of their pictures
        return (
          <View
            key={
              restaurant.profile.restaurantInfo.restaurantName +
              '_' +
              restaurant.profile.id
            }>
            <Card
              image={require('../../assets/chorizo-mozarella-gnocchi-bake-cropped.jpg')} //TODO: fix invalid prop param
              onPress={() =>
                navigation.navigate('Cart', {restaurant: restaurant})
              }>
              {
                //todo: grab picture from the correct item
              }
              <Text h4 style={styles.restaurantName}>
                {restaurant.profile.restaurantInfo.restaurantName}
              </Text>
              <Text style={{paddingBottom: 5}}>
                {/* {restaurant.profile.restaurantInfo.restaurantType.typeTags
                  .toString()
                  .replaceAll(',', ' · ')} */}
                {/* REPLACED LOGIC FOR ISSUE WITH `.replaceAll` NOT EXISTING AS 
                A STRING FUNCTION FOR OLDER VERSIONS */}
                {restaurant.profile.restaurantInfo.restaurantType.typeTags.join(
                  ' . ',
                )}
              </Text>
              <Button
                title="Order"
                onPress={() => {
                  navigation.navigate('MenuDisplay', {restaurant: restaurant});
                }}
              />
            </Card>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  restaurantName: {
    color: '#03a5fc',
    padding: 5,
  },
});
