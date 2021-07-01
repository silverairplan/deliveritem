import React from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Button, Icon, Text, ListItem, Input} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import {isUniqueCategory} from '../MenuUtilities';

export default class CategoryEditor extends React.Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    this.oldMenu = props.route.params.menu;
    this.menu = props.route.params.newMenu;
    this.state = {
      menu: props.route.params.menu,
    };
  }

  render() {
    return (
      <>
        <CategoryView
          navigation={this.navigation}
          menu={this.menu}
          oldMenu={this.oldMenu}
        />
      </>
    );
  }
}

const CategoryView = props => {
  let EditorStack = createStackNavigator();
  return (
    <EditorStack.Navigator
      title="Edit Categories"
      mode="modal"
      headerMode="none"
      initialRouteName="Categories">
      <EditorStack.Screen
        name="Categories"
        component={CategoriesList}
        initialParams={{
          menu: props.menu,
          oldMenu: props.oldMenu,
        }}
        options={{headerShown: false}}
      />
      <EditorStack.Screen
        name="Editor"
        component={EditCategory}
        initialParams={{
          menu: props.menu,
        }}
        options={({navigation}) => ({
          title: 'Editor',
          headerStatusBarHeight: 10,
        })}
      />
      <EditorStack.Screen
        name="Delete Confirmation"
        component={DeleteConfirmation}
        initialParams={{
          menu: props.menu,
        }}
      />
    </EditorStack.Navigator>
  );
};

function EditCategory({navigation, route}) {
  return (
    <EditCategoryName
      navigation={navigation}
      menu={route.params.menu}
      category={route.params.category}
    />
  );
}

function EditCategoryName(props) {
  let updatedName = '';
  const validateAndSubmit = () => {
    updatedName = updatedName.trim();
    if (props.category.categoryName !== updatedName) {
      if (updatedName === '') {
        Alert.alert('Please enter a name');
      } else if (!isUniqueCategory(updatedName, props.menu)) {
        Alert.alert('Please enter a unique category name');
        return;
      }
      props.category.categoryName = updatedName;
      props.navigation.navigate('Categories', {
        category: props.category,
      });
    }
  };
  return (
    <>
      <View style={styles.categoryEditorView}>
        <Text h4 style={styles.titlesPopped}>
          {props.category.categoryName}
        </Text>
        <Icon
          raised
          containerStyle={styles.deleteCategoryIcon}
          size={16}
          name="delete"
          color="#ff0000"
          reverse
          underlayColor="#ff0000"
          onPress={() => {
            props.navigation.navigate('Delete Confirmation', {
              category: props.category,
              menu: props.menu,
            });
          }}
        />
      </View>
      <View style={styles.general}>
        <Input
          label={'Category Name'}
          inputStyle={styles.input}
          inputContainerStyle={{borderBottomWidth:0}}
          placeholder={`${props.category.categoryName}`}
          onChangeText={value => {
            updatedName = value;
          }}
          //onSubmitEditing={value => validateAndSubmit()}
        />
        <Button
          style={styles.navButtons}
          buttonStyle={{backgroundColor:'#FB322F',width:100}}
          title="Cancel"
          onPress={() => props.navigation.goBack()}
        />
      </View>
      <View style={{padding:15}}>
        <Button
          style={styles.navButtons}
          
          title="Save"
          onPress={() => validateAndSubmit()}
        />
      </View>
     
    </>
  );
}

function CategoriesList({navigation, route}) {
  return (
    <>
      <View style={styles.categoryEditorView}>
        <Text h4 style={styles.titles}>
          {'Categories'}
        </Text>
        <Icon
          raised
          containerStyle={styles.addCategoryIcon}
          size={16}
          name="add"
          color="#000000"
          onPress={() => {
            let newLength = route.params.menu.categories.push({
              categoryName: 'New Category',
              timeServed: ['All Day'],
              items: [],
            });
            navigation.navigate('Editor', {
              category: route.params.menu.categories[newLength - 1],
              menu: route.params.menu,
            });
          }}
        />
      </View>
      <ScrollView>
        {route.params.menu.categories.map(category => {
          return (
            <View key={'category_editor_display_' + category.categoryName}>
              <View style={styles.menuListView}>
                <ListItem
                  title={category.categoryName}
                  subtitle={`Items: ${category.items.length}`}
                  bottomDivider
                  chevron
                  onPress={() =>
                    navigation.navigate('Editor', {
                      menu: route.params.menu,
                      category: category,
                    })
                  }
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={{padding:15}}>
        <Button
          icon={
            <Icon name="cloud-upload" type="ionicons" size={25} color="white" />
          }
          title=" Save and Update Menu"
          onPress={() => {
            updateOldMenu(route.params.oldMenu, route.params.menu);
            navigation.navigate('Menu', {
              needsUpdate: true,
              menu: route.params.oldMenu,
            });
          }}
          style={styles.saveButton}
        />
      </View>
      
    </>
  );
}

function updateOldMenu(oldMenu, newMenu) {
  oldMenu.categories = newMenu.categories;
}

function DeleteConfirmation({navigation, route}) {
  return (
    <>
      <View style={styles.general}>
        <Icon name="warning" size={30} color="orange" />
        <Text>{`Are you sure you want to delete the ${
          route.params.category.categoryName
        } category?`}</Text>
        <Button
          icon={<Icon name="undo" size={15} color="white" />}
          title="Cancel"
          onPress={() => navigation.goBack()}
        />
      </View>
      <Button
        icon={<Icon name="delete" size={15} color="white" />}
        title="Delete It"
        style={styles.deleteButton}
        onPress={() => {
          removeCategoryFromMenu(
            route.params.category.categoryName,
            route.params.menu,
          );
          navigation.navigate('Categories', {
            menu: route.params.menu,
          });
        }}
      />
    </>
  );
}

function removeCategoryFromMenu(categoryName, menu) {
  console.log(categoryName);
  console.log(menu.categories);
  menu.categories = menu.categories.filter(
    category => category.categoryName !== categoryName,
  );
  console.log(menu.categories);
}

const styles = StyleSheet.create({
  general: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    textAlign: 'center',
    padding: 20,
    paddingTop: 20,
  },
  deleteButton: {
    textAlign: 'center',
    padding: 20,
    paddingTop: 10,
  },
  categoryEditorView: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    padding:15
  },
  deleteCategoryIcon: {
    position: 'absolute',
    left: 0,
  },
  addCategoryIcon: {
    position: 'absolute',
    right: 0,
  },
  titlesPopped: {
    textAlign: 'center',
    color: '#03a5fc',
    padding: 10,
    backgroundColor: '#e8e8e8',
  },
  titles: {
    textAlign: 'center',
    color: '#03a5fc',
    padding: 10,
  },
  input:{
    backgroundColor:'white',
    borderColor:'#979797',
    borderWidth:1,
    borderRadius:8,
    paddingLeft:11,
    paddingTop:8,
    paddingBottom:8
  }
});
