import React from 'react';
import {View, ScrollView, StyleSheet,TouchableOpacity,Image} from 'react-native';
//import {NavigationEvents} from 'react-navigation';
import {createStackNavigator} from '@react-navigation/stack';
import ItemEditor from './subcomponents/MenuEditor/ItemEditor/ItemEditor';
import {Icon, ListItem, Text, Button} from 'react-native-elements';
import testMenu from './subcomponents/testMenu';
import CategoryEditor from './subcomponents/MenuEditor/CategoryEditor/CategoryEditor';
import {Auth} from 'aws-amplify'
import { RFValue } from 'react-native-responsive-fontsize'
//TODO: store menu locally for faster loading
const stage = 'beta';
//This menu variable is for testing, actual menu should be loaded in
var menu = testMenu();
//todo: display list https://react-native-elements.github.io/react-native-elements/docs/listitem.html
// use section: ListItem implemented with custom View for Subtitle
const Stack = createStackNavigator();

export default class MenuUpdater extends React.Component {
  constructor(props) {
    super(props);
    //if you need test data
    //menu = menu;
    console.log('menudata',props.route.params.data.Menu)
    menu = props.route.params.data.Menu.categories?props.route.params.data.Menu:JSON.parse(props.route.params.data.Menu);
    this.state = {menu: menu};
  }

  editMenu = newMenu => {
    this.setState({menu: newMenu});
    //navigation.setparams
    //update in state
    //update in database
  };

  render() {
    return (
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen
          name="Menu"
          component={MenuList}
          initialParams={{
            menu: menu,
            needsUpdate: false,
            deleteItem: false,
          }} //make sure that on navigation to menu we check needsUpdate
          options={({navigation, route}) => ({
            headerRight: props => (
              <Button
                icon={<Icon name="create" size={15} color="#03a5fc" />}
                title="Categories"
                style={styles.categoryEditorButton}
                type="clear"
                onPress={() => {
                  let newMenu = JSON.parse(JSON.stringify(route.params.menu));
                  navigation.navigate('CategoryEditor', {
                    menu: route.params.menu,
                    newMenu: newMenu,
                  });
                }}
              />
            ),
            title: 'Menu',
          })}
        />
        <Stack.Screen
          name="ItemEditor"
          component={ItemEditor}
          options={({navigation}) => ({
            title: 'Edit Menu',
            headerStatusBarHeight: 25,
            headerBackTitle: 'Discard Changes',
          })}
        />
        <Stack.Screen
          name="CategoryEditor"
          component={CategoryEditor}
          options={({navigation}) => ({
            title: 'Edit Categories',
            headerStatusBarHeight: 25,
            headerBackTitle: 'Discard Changes',
          })}
        />
      </Stack.Navigator>
    );
  }
}

function MenuList({navigation, route}) {
  console.log("gg");
  console.log(route.params.menu);
  React.useEffect(() =>
    navigation.addListener('focus', () => {
      if (route.params.needsUpdate) {
        navigation.setParams({
          needsUpdate: false,
        });
        updateMenu(
          route.params.menu
        ).then(data => {
          console.log(data); // JSON data parsed by `data.json()` call
        });
        //call the api gateway endpoint (eventually with contigo authentication) to update menu
      }
    }),
  );

  
  return (
    <ScrollView>
      {route.params.menu.categories.map(category => {
        return (
          <View key={'category_display_' + category.categoryName}>
            <View style={styles.menuListView}>
              <Text h4 style={styles.titles}>
                {category.categoryName}
              </Text>
              <Icon
                raised
                containerStyle={styles.addCategoryIcon}
                size={16}
                name="add"
                color="#000000"
                underlayColor="#dedede"
                onPress={() => {
                  let item = {
                    itemName: '',
                    itemDescription: '',
                    itemPrice: 0.0,
                    picture: '',
                    available: true,
                    options: [],
                    typeTags: [],
                    additionalHealthInfo: '',
                    cityTax: menu.defaultCityTax,
                  };
                  let newItem = JSON.parse(JSON.stringify(item));
                  navigation.navigate('ItemEditor', {
                    menu: menu,
                    newItem: newItem,
                    item: item,
                    category: category.categoryName,
                    new: true,
                  });
                }}
              />
            </View>
            {category.items.map(item => {
              let itemTitle = '';
              if (item.available) {
                itemTitle = item.itemName + ' $' + item.itemPrice;
              } else {
                itemTitle =
                  item.itemName +
                  ' $' +
                  item.itemPrice +
                  ' *Not Currently Available*';
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
                  {menuListItemDisplay(item, itemTitle, category, navigation)}
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
}

async function updateMenu(newMenu) {
  let info = await Auth.currentUserInfo()
  // Default options are marked with *
  const body = JSON.stringify({
    'restaurant-id': info.username,
    menu: JSON.stringify(newMenu),
  });
  const response = await fetch(
    'https://9yl3ar8isd.execute-api.us-west-1.amazonaws.com/' +
      stage +
      '/restaurants/updateMenu',
    {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
        //'authToken': authenticationToken,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: body, // body data type must match "Content-Type" header
    },
  );

  console.log('resdata',response.json())
  //return response.json(); // parses JSON response into native JavaScript objects
}

const menuListItemDisplay = (item, itemTitle, category, navigation) => {
  console.log(item)
  if (item.picture === '') {
    return (
      <ListItem
        title={itemTitle}
        subtitle={item.itemDescription}
        bottomDivider
        chevron
        onPress={() => {
          //create deep copy so we arent modifying existing data
          let newItem = JSON.parse(JSON.stringify(item));
          navigation.navigate('ItemEditor', {
            menu: menu,
            newItem: newItem,
            item: item,
            category: category.categoryName,
            new: false,
          });
        }}
      />
    );
  }
  return (
    <ListItem
      title={itemTitle}
      subtitle={item.itemDescription}
      leftAvatar={{source: {uri: item.picture + '?date=' + new Date()}}}
      bottomDivider
      chevron
      onPress={() => {
        //create deep copy so we arent modifying existing data
        let newItem = JSON.parse(JSON.stringify(item));
        navigation.navigate('ItemEditor', {
          menu: menu,
          newItem: newItem,
          item: item,
          category: category.categoryName,
          new: false,
        });
      }}
    />
  );
};


const menuitemcustomdisplay = (item,itemTitle,category,navigation) => {
  console.log(item)
  return (
    <TouchableOpacity style={styles.itemcontainer} onPress={()=>{
      let newItem = JSON.parse(JSON.stringify(item));
        navigation.navigate('ItemEditor', {
          menu: menu,
          newItem: newItem,
          item: item,
          category: category.categoryName,
          new: false,
        });
    }}>
      <View style={{flex:1,justifyContent:'center'}}>
        <Text style={styles.itemtitle}>{item.itemName}</Text>
        <Text style={styles.itemdescription}>{item.itemDescription}</Text>
        <Text style={styles.itemprice}>$ {item.itemPrice}</Text>
        {
          item.picture != "" && (
            <Image source={{uri:item.picture}} style={styles.itempicture}></Image>
          )
        }
        <Text style={styles.itemdescription}>Available: {item.available?'Yes':'No'}</Text>
      </View>
      {
        item.options.length > 0 && (
          <View style={styles.options}>
            {
              item.options.map((optionitem,index)=>(
                <View style={styles.optionitem} key={index}>
                  <Text style={styles.itemtitle}>{optionitem.optionTitle}</Text>
                  <Text style={styles.itemdescription}>minimum: {optionitem.minimum}</Text>
                  <Text style={styles.itemdescription}>maximum: {optionitem.maximum}</Text>
                  {
                    optionitem.optionList.map((listitem,listindex)=>(
                      <View style={styles.listitem} key={listindex}>
                        <Text style={styles.itemtitle}>{listitem.optionName}</Text>
                        <Text style={styles.itemprice}>$ {listitem.optionPrice}</Text>
                      </View>
                    ))
                  }
                </View>
              ))
            }
          </View>
        )
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  titles: {
    textAlign: 'center',
    color: '#03a5fc',
    padding: 10,
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
  itemcontainer:{
    backgroundColor:'white',
    borderColor:'pink',
    borderWidth:1,
    padding:10,
    display:'flex',
    flexDirection:'row',
    marginBottom:10
  },
  itemtitle:{
    color: '#03a5fc',
    fontSize:RFValue(14,580)
  },
  itemdescription:{
    color:'black'
  },
  itemprice:{
    color:'red'
  },
  itempicture:{
    
  },
  options:{
    borderColor:'pink',
    borderWidth:1,
    flex:1,
    padding:10,
    marginLeft:15
  },
  optionitem:{
    borderColor:'pink',
    borderWidth:1,
    flex:1,
    padding:10,
    marginBottom:10
  },
  listitem:{
    borderColor:'black',
    borderWidth:1,
    flex:1,
    padding:5,
    marginBottom:5
  }
});
