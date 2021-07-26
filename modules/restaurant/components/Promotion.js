import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {ScrollView} from 'react-native-gesture-handler';
import {Text, ListItem, Icon} from 'react-native-elements';
import PromotionEdit from './subcomponents/PromotionEdit';
import {Button} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

const Stack = createStackNavigator();
export default function Promotion({route}) {
  return (
    <Stack.Navigator initialRouteName="Promotion">
      <Stack.Screen
        name="Promotion"
        component={PromotionScreen}
        initialParams={{
          promotion: route.params.data.Promotion
            ? JSON.parse(route.params.data.Promotion)
            : [],
          needsupdate: false,
        }}
        options={({navigation, route}) => ({
          headerRight: props => (
            <Button
              icon={<Icon name="create" size={15} color="#03a5fc" />}
              title="Create"
              type="clear"
              onPress={() => {
                navigation.navigate('PromotionEdit', {
                  promotion: route.params.promotion,
                });
              }}
            />
          ),
          headerTitleAlign:'center',
          headerTitleStyle:{
          }
        })}
      />
      <Stack.Screen
        name="PromotionEdit"
        component={PromotionEdit}
        initialParams={{
          promotion: route.params.data.Promotion
            ? JSON.parse(route.params.data.Promotion)
            : [],
          needsupdate: false,
        }}
        options={({route}) => ({
          title: route.params.item ? 'Edit Promotion' : 'Create Promotion',
          headerTitleAlign: 'center',
        })}
      />
    </Stack.Navigator>
  );
}

function PromotionItem({promotion, navigation, route, index}) {
  console.log(promotion.picture);
  return (
    <TouchableOpacity
      style={style.promotionItem}
      onPress={() =>
        navigation.navigate('PromotionEdit', {
          item: promotion,
          promotion: route.params.promotion,
          index: index,
        })
      }>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image
          source={{uri: `${promotion.picture}?date=${new Date().getSeconds()}`}}
          style={{width: wp('18'), height: wp('20'), borderRadius: 15}}
        />
      </View>
      <View style={{flex: 3}}>
        {(!promotion.expired || new Date(promotion.expired) < new Date()) && (
          <Text style={{color: '#F86D64', fontWeight: 'bold'}}>Expired</Text>
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text>{promotion.title}</Text>
          <Text>{`${
            promotion.from
              ? moment(new Date(promotion.from)).format('MM/DD/yyyy')
              : ''
          } - ${
            promotion.expired
              ? moment(new Date(promotion.expired)).format('MM/DD/yyyy')
              : ''
          }`}</Text>
        </View>
        <Text style={{marginBottom: 10}}>
          {`${promotion.discount} on ${
            promotion.type == 'order' ? 'ENTIRE ORDER' : 'SPECIFIC ITEMS(1)'
          }`}
        </Text>
        <Text>{promotion.details}</Text>
      </View>
    </TouchableOpacity>
  );
}

function PromotionScreen({route, navigation}) {
  return (
    <View style={{paddingTop:24}}>

      <View>
        <FlatList
          data={route.params.promotion}
          renderItem={({item, index}) => (
            <PromotionItem
              promotion={item}
              key={index + ''}
              navigation={navigation}
              route={route}
              index={index}
            />
          )}
          keyExtractor={(item, index) => index + ''}
        />
        {/* {route.params.promotion?.map((item, index) => (
          <ListItem
            title={item.title}
            subtitle={item.details}
            leftAvatar={{source: {uri: item.picture + '?date=' + new Date()}}}
            chevron
            topDivider
            onPress={() => {
              navigation.navigate('PromotionEdit', {
                item: item,
                promotion: route.params.promotion,
                index,
              });
            }}
          />
        ))} */}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  orderHeadings: {
    textAlign: 'center',
    color: '#03a5fc',
    padding: 10,
    fontWeight: 'bold',
    fontSize: 24,
    backgroundColor: '#fff',
  },
  promotionItem: {
    backgroundColor: 'white',
    marginBottom: 3,
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
  },
});
