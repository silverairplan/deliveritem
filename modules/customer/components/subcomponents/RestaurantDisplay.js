import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Icon, ListItem, Text, Card, Button} from 'react-native-elements';

export default function RestaurantDisplay({navigation, route}) {
  
  return (
    <ScrollView>
      {route.params.restaurantList.map(restaurant => {
        let picture = restaurant.Profile.picture; //might just have them upload one of their pictures
        return (
          <View
            key={
              restaurant.Profile.restaurantInfo.restaurantName +
              '_' +
              restaurant.Profile.id
            }>
            <Card
              image={!picture?require('../../assets/chorizo-mozarella-gnocchi-bake-cropped.jpg'):{uri:picture}} //TODO: fix invalid prop param
              onPress={() =>
                navigation.navigate('Cart', {restaurant: restaurant})
              }>
              {
                //todo: grab picture from the correct item
              }
              <Text h4 style={styles.restaurantName}>
                {restaurant.Profile.restaurantInfo.restaurantName}
              </Text>
              <Text style={{paddingBottom: 5}}>
                {/* {restaurant.Profile.restaurantInfo.restaurantType.typeTags
                  .toString()
                  .replaceAll(',', ' · ')} */}
                {/* REPLACED LOGIC FOR ISSUE WITH `.replaceAll` NOT EXISTING AS 
                A STRING FUNCTION FOR OLDER VERSIONS */}
                {restaurant.Profile.restaurantInfo.restaurantType.typeTags.join(
                  ' . ',
                )}
              </Text>
              <Button
                title="Order"
                buttonStyle={styles.buttonStyle}
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
  buttonStyle: {
    backgroundColor: '#F86D64',
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 5,
  },
});
