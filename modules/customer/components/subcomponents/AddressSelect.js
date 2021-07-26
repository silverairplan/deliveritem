import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-elements';
import React from 'react';
// import {Picker} from '@react-native-community/picker';

export default function AddressSelect(props) {
  let addressPickerOptions = getAddressPickerOptions();
  return (
    <>
      <View style={styles.optionListView}>
        <Text h4 style={styles.titles}>
          {'Select Address for Delivery'}
        </Text>
      </View>
      <>
        <View>
          {/* <Picker
            selectedValue={props.address}
            style={styles.statusPicker}
            onValueChange={(itemValue, itemIndex) => {
              props.address = itemValue;
              props.navigation.setParams({address: props.option});
            }}>
            {addressPickerOptions.map(picker => {
              return picker;
            })}
          </Picker> */}
          <Button
            title="Confirm"
            onPress={() => {
              props.navigation.setParams({
                address: props.address,
              });
              props.navigation.goBack(); //TODO: actually get data and pass it back
            }}
          />
        </View>
      </>
    </>
  );
}

const getAddressPickerOptions = () => { //TODO: actually get data from jasons feature
  return [
    <Picker.Item
      label={'123'.toString()}
      value={123}
      key={'min_picker_' + 123}
    />,
  ];
};

const styles = StyleSheet.create({
  general: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOptionButton: {
    paddingBottom: 20,
  },
  optionListView: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  dropDownIcon: {
    position: 'absolute',
    right: 0,
  },
  deleteOptionIcon: {
    position: 'absolute',
    left: 0,
  },
  titles: {
    textAlign: 'center',
    color: '#03a5fc',
    padding: 10,
    paddingTop: 30,
  },
});
