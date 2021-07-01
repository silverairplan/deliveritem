import React,{useEffect, useState} from 'react'
import {View,StyleSheet} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import {Text,ListItem,Icon} from 'react-native-elements'
import PromotionEdit from './subcomponents/PromotionEdit'

const Stack = createStackNavigator();
export default function Promotion({route})
{
  return (
    <Stack.Navigator initialRouteName="Promotion">
      <Stack.Screen
        name="Promotion"
        component={PromotionScreen}
        initialParams={{
          promotion:route.params.data.Promotion?JSON.parse(route.params.data.Promotion):[],
          needsupdate:false
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="PromotionEdit"
        component={PromotionEdit}
        initialParams={{
          promotion:route.params.data.Promotion?JSON.parse(route.params.data.Promotion):[],
          needsupdate:false
        }}
      ></Stack.Screen>
      
    </Stack.Navigator>
  )
}



function PromotionScreen({route,navigation})
{
  
  return (
    <ScrollView>
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
        <View style={{flex:1}}>
          <Text h4 h4Style={style.orderHeadings}>Promotion</Text>
        </View>
        <Icon name="plus" type="entypo" raised onPress={()=>{navigation.navigate('PromotionEdit',{promotion:route.params.promotion})}}></Icon>
      </View>
      
      <View>
        {
          route.params.promotion?.map((item,index)=>(
            <ListItem
              title={item.title}
              subtitle={item.details}
              leftAvatar={{source:{uri:item.picture + '?date=' + new Date()}}}
              chevron
              topDivider
              onPress={()=>{
                navigation.navigate('PromotionEdit',{item:item,promotion:route.params.promotion,index})
              }}
            ></ListItem>
          ))
        }
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  orderHeadings:{
    textAlign: 'center',
    color: '#03a5fc',
    padding: 10,
    fontWeight: 'bold',
    fontSize: 24,
    backgroundColor: '#fff',
  }
})