import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  EditTextAttribute,
  EditNumberAttribute,
  EditTags,
  SelectNewCategory,
} from './AttributeEditor';
import Attributes from './ItemAttributes'; 
import AddItem from './AddItem'
import {DeleteConfirmation} from './DeleteConfirmation';
import {EditOptions} from './OptionsEditor';
import SelectPhotos from './PhotoSelector';

export default class ItemEditor extends React.Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    this.menu = props.route.params.menu;
    this.category = props.route.params.category;
    this.state = {
      isNew: props.route.params.new,
      item: props.route.params.newItem,
      oldItem: props.route.params.item,
    };
  }

  render() {
    return (
      <>
        <ItemView
          item={this.state.item}
          oldItem={this.state.oldItem}
          navigation={this.navigation}
          menu={this.menu}
          categoryName={this.category}
          isNew={this.state.isNew}
        />
      </>
    );
  }
}

const ItemView = props => {
  let EditorStack = createStackNavigator();
  return (
    <EditorStack.Navigator
      title="Edit Attribute"
      mode="modal"
      headerMode="none"
      initialRouteName="Attributes">
      <EditorStack.Screen
        name="Attributes"
        component={AddItem}
        initialParams={{
          item: props.item,
          oldItem: props.oldItem,
          isNew: props.isNew,
          menu: props.menu,
          category: props.categoryName,
          newCategory: '',
        }}
        options={{headerShown: false}}
      />
      <EditorStack.Screen
        name="Editor"
        component={EditItem}
        initialParams={{
          item: props.item,
          menu: props.menu,
          category: props.categoryName,
        }}
        options={({navigation}) => ({
          title: 'Editor',
          headerStatusBarHeight: 10,
          headerBackTitle: 'Attributes',
        })}
      />
      <EditorStack.Screen
        name="PhotoSelector"
        component={SelectPhotos}
        initialParams={{
          item: props.item,
          menu: props.menu,
          category: props.categoryName,
        }}
        options={({navigation}) => ({
          title: 'Photos',
          headerStatusBarHeight: 10,
          headerBackTitle: 'Attributes',
        })}
      />
      <EditorStack.Screen
        name="Delete Confirmation"
        component={DeleteConfirmation}
        initialParams={{
          item: props.item,
          menu: props.menu,
          uneditedItemName: props.oldItem.itemName,
          categoryName: props.categoryName,
        }}
      />
    </EditorStack.Navigator>
  );
};

function EditItem({navigation, route}) {
  if (
    route.params.toChange === 'itemPrice' ||
    route.params.toChange === 'cityTax'
  ) {
    return (
      <EditNumberAttribute
        navigation={navigation}
        item={route.params.item}
        attribute={route.params.attribute}
        toChange={route.params.toChange}
      />
    );
  } else if (route.params.toChange === 'typeTags') {
    return (
      <EditTags
        navigation={navigation}
        item={route.params.item}
        attribute={route.params.attribute}
        toChange={route.params.toChange}
      />
    );
  } else if (route.params.toChange === 'options') {
    return (
      <EditOptions
        navigation={navigation}
        item={route.params.item}
        option={route.params.option}
        attribute={route.params.attribute}
        toChange={route.params.toChange}
        editOptionTitle={route.params.editOptionTitle}
        editOptionList={route.params.editOptionList}
        editOptionMinMax={route.params.editOptionMinMax}
      />
    );
  } else if (route.params.toChange === 'category') {
    return (
      <SelectNewCategory
        navigation={navigation}
        item={route.params.item}
        menu={route.params.menu}
      />
    );
  }
  return (
    <EditTextAttribute
      navigation={navigation}
      item={route.params.item}
      attribute={route.params.attribute}
      toChange={route.params.toChange}
      menu={route.params.menu}
      category={route.params.category}
    />
  );
}
