/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Icon} from 'react-native-elements';
export default function Tabbar({state,navigation}) {
  const {routes,index} = state

  const geticon = (name) => {
    switch(name)
    {
      case 'Menu':
        return {name:'silverware-fork-knife',type:'material-community'};
      case 'Orders':
        return {name:'lock',type:'font-awesome-5'};
      case 'Profile':
        return {name:'user-alt',type:'font-awesome-5'}
      default:
        return {name:'ios-restaurant',type:'ionicon'};
    }
  }
  
  return (
    <View style={style.container}>
      {routes.map((item, indexitem) => {
        const icon = geticon(item.name);
        return (
          <TouchableOpacity
            style={{flex: 1, alignItems: 'center'}}
            onPress={()=>navigation.navigate(item.name)}
            key={indexitem}>
              {
                icon && (
                  <Icon
                    name={icon.name}
                    size={RFValue(22, 580)}
                    color={index == indexitem?"#F52D56":"#C8C7CC"}
                    solid={true}
                    type={icon.type}
                  />
                )
              }
            <Text
              style={[
                style.item,
                {color: index == indexitem ? '#F52D56' : '#C8C7CC'},
              ]}>
              {item.name}
            </Text>
            </TouchableOpacity>
        )
      })}
    </View>
  );
}

const style = StyleSheet.create({
  container:{
    display:'flex',
    flexDirection:'row',
    backgroundColor:'white',
    shadowColor:'#000',
    shadowRadius:10,
    shadowOffset:{
      width:0,
      height:-2,
    },
    elevation:3,
    padding:12
  },
  item:{
    fontSize:RFValue(12,580),
    color:'#C8C7CC'
  }
})