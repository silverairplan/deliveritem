import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {ListItem, Text, Card, Button, Input, Icon} from 'react-native-elements';

import {Auth} from 'aws-amplify';
import ImagePicker from 'react-native-image-crop-picker';
import {updateDynamoRestaurant} from './subcomponents/ProfileEditor/updateDynamoRest';
import RNFetchBlob from 'rn-fetch-blob';
import state from './state.json';
import {RFValue} from 'react-native-responsive-fontsize';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Loading from 'react-native-loading-spinner-overlay'
import SelectPicker from 'react-native-picker-select'
var profile;
//var profile = testProfile();
var menu;
const Stack = createStackNavigator();

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    //TODO: load menu in from memory and set state
    //profile = props.data.customerInfo;

    profile = props.route.params.data.Profile ?? {
      id: '1',
      restaurant: true,
      restaurantInfo: {
        restaurantName: 'Your Restaurant',
        restaurantAddress: '',
        hoursOfOperation: {
          mondayHours: {
            mondayOpen: '8:00 AM',
            mondayClosed: '10:00 PM',
          },
          tuesdayHours: {
            tuesdayOpen: '8:00 AM',
            tuesdayClosed: '10:00 PM',
          },
          wednesdayHours: {
            wednesdayOpen: '8:00 AM',
            wednesdayClosed: '10:00 PM',
          },
          thursdayHours: {
            thursdayOpen: '8:00 AM',
            thursdayClosed: '10:00 PM',
          },
          fridayHours: {
            fridayOpen: '8:00 AM',
            fridayClosed: '10:00 PM',
          },
          saturdayHours: {
            saturdayOpen: '8:00 AM',
            satudayClosed: '10:00 PM',
          },
          sundayHours: {
            sundayOpen: '8:00 AM',
            sundayClosed: '10:00 PM',
          },
        },
        restaurantType: {
          typeTags: ['food'],
          food: true,
          drink: true,
        },
      },
      deliveryOptions: {
        flatFee: '0.00',
        flatFeeRadius: '5.0',
        additionalDeliveryFee: '0',
        maxRadius: '10.0',
      },
      displayItem: {
        itemName: '',
        itemPicture: '',
        itemCategory: '',
      },
    };

    menu = props.route.params.data.Menu;
    this.state = {
      profile: profile,
      menu: menu,
    };
  }

  editProfile = newProfile => {
    this.setState({profile: newProfile});
  };

  render() {
    return (
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen
          name="Profile"
          component={EditProfile}
          initialParams={{
            profile: this.state.profile,
            menu: this.state.menu,
            needsUpdate: false,
          }} //make sure that on navigation to menu we check needsUpdate
          options={({navigation, route}) => ({
            title: 'Edit Profile',
            headerRight: props =>
              !route.params.edit ? (
                <Button
                  icon={<Icon name="create" color="#03a5fc"/>}
                  title="Edit"
                  type="clear"
                  onPress={() => navigation.setParams({edit: true})}
                />
              ) : (
                <></>
              ),
              headerTitleStyle:{
              }
          })}
        />
        {/* <Stack.Screen
          name="Editor"
          component={EditItem}
          initialParams={{
            item: this.state.profile,
            menu: this.state.menu,
          }}
          options={({navigation}) => ({
            title: 'Profile Editor',
          })}
        />
        <Stack.Screen
          name="PhotoSelector"
          component={SelectPhotos}
          initialParams={{
            profile: this.state.profile,
          }}
          options={({navigation}) => ({
            title: 'Photos',
            headerStatusBarHeight: 10,
            headerBackTitle: 'Attributes',
          })}
        />
        <Stack.Screen
          name="ProfileEditor"
          component={ProfileEditor}
          options={({navigation}) => ({
            title: 'Profile Editor',
          })}
        /> */}
      </Stack.Navigator>
    );
  }
}



function EditProfile({navigation, route}) {
  let self = this;
  const [loading,setloading] = useState(false)
  const [profiledata, setprofiledata] = useState(profile);
  const [image, setimage] = useState(null);
  const windowWidth = Dimensions.get('window').width;

  useEffect(()=>{
    if(route.params.edit)
    {
      setimage(null)
    }
  },[route.params.edit])

  const uploadS3bucket = async () => {
    let blob = await RNFetchBlob.fs.readFile(image.uri, 'base64');
    const info = await Auth.currentUserInfo();
    let body = {
      convertedUri: blob,
      restName: info.username,
      dataType: 'restaurantProfile',
    };
    const responseimg = await fetch(
      'https://9yl3ar8isd.execute-api.us-west-1.amazonaws.com/beta/updates3bucket',
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'multipart/form-data',
          Connection: 'keep-alive',
          // ???Content-Type???: ???application/x-www-form-urlencoded???,
        },
        body: JSON.stringify(body),
      },
    );

    const responsejson = await responseimg.json();

    return responsejson;
  };

  const saveprofile = async () => {
    try{
      setloading(true)
      if (image) {
        let picture = await uploadS3bucket();
        profile = {...profiledata, picture: JSON.parse(picture.body).Location};
      } else {
        profile = profiledata;
      }
  
      setimage(null)
      setloading(false)
      updateDynamoRestaurant(profile);
  
      navigation.setParams({edit: false});
    }
    catch(e)
    {
      setloading(false)
    }
    
  };

  const openpicker = () => {
    ImagePicker.openPicker({}).then(res => {
      setimage({
        uri: res.path,
        type: res.mime,
        filename: res.path.split('/').pop(),
      });
    });
  };

  return (
    <ScrollView>
      <View>
      <Text h4 style={styles.titles} h4Style={{fontSize:RFValue(15,580)}}>
              Restaurant Information
            </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            padding: 10,
            alignItems:'center'
          }}>
          <TouchableOpacity
            style={[styles.picture]}
            onPress={openpicker}>
            {image || profile.picture ? (
              <Image
                source={{
                  uri: image && route.params.edit ? image.uri : profile.picture + '?date=' + new Date().getTime(),
                }}
                style={styles.picture}
              />
            ) : (
              <Icon name="picture" size={RFValue(30, 580)} />
            )}
          </TouchableOpacity>

          <View style={{flex: 1}}>
            
            <View>
              <Input
                label="Restaurant Name"
                inputStyle={styles.input}
                inputContainerStyle={{borderBottomWidth: 0}}
                placeholder="Restaurant Name"
                disabled={!route.params.edit}
                value={profiledata.restaurantInfo.restaurantName}
                onChangeText={value =>
                  setprofiledata({
                    ...profiledata,
                    restaurantInfo: {
                      ...profiledata.restaurantInfo,
                      restaurantName: value,
                    },
                  })
                }
              />
              <Input
                label="Restaurant Phone Number"
                inputStyle={styles.input}
                inputContainerStyle={{borderBottomWidth: 0}}
                placeholder="Restaurant Phone Number"
                disabled={!route.params.edit}
                value={profiledata.restaurantInfo.restaurantPhoneNumber}
                onChangeText={value =>
                  setprofiledata({
                    ...profiledata,
                    restaurantInfo: {
                      ...profiledata.restaurantInfo,
                      restaurantPhoneNumber: value,
                    },
                  })
                }
              />
          </View>
        </View>
      </View>
      <View>
              <Input
                label="Restaurant Address"
                inputStyle={styles.input}
                inputContainerStyle={{borderBottomWidth: 0}}
                placeholder="Restaurant Address"
                disabled={!route.params.edit}
                value={profiledata.restaurantInfo.restaurantAddress.address}
                onChangeText={value =>
                  setprofiledata({
                    ...profiledata,
                    restaurantInfo: {
                      ...profiledata.restaurantInfo,
                      restaurantAddress: {
                        ...profiledata.restaurantInfo.restaurantAddress,
                        address: value,
                      },
                    },
                  })
                }
              />
              <Input
                label="Restaurant City"
                inputStyle={styles.input}
                inputContainerStyle={{borderBottomWidth: 0}}
                placeholder="Restaurant City"
                disabled={!route.params.edit}
                value={profiledata.restaurantInfo.restaurantAddress.city}
                onChangeText={value =>
                  setprofiledata({
                    ...profiledata,
                    restaurantInfo: {
                      ...profiledata.restaurantInfo,
                      restaurantAddress: {
                        ...profiledata.restaurantInfo.restaurantAddress,
                        city: value,
                      },
                    },
                  })
                }
              />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {/* <Picker
                  selectedValue={
                    profiledata.restaurantInfo.restaurantAddress.state
                  }
                  style={{
                    width: windowWidth / 2,
                    height: 44,
                    marginRight: 25,
                  }}
                  itemStyle={{
                    height: 44,
                    fontSize:RFValue(12,580)
                  }}
                  onValueChange={value => {
                    //change dropdown
                    setprofiledata({
                      ...profiledata,
                      restaurantInfo: {
                        ...profiledata.restaurantInfo,
                        restaurantAddress: {
                          ...profiledata.restaurantInfo.restaurantAddress,
                          state: value,
                        },
                      },
                    });
                  }}>
                  <Picker.Item label={'State'} value={''} />
                  {Object.keys(state).map((item, index) => (
                    <Picker.Item label={state[item]} value={item} key={index} />
                  ))}
                </Picker> */}
                <View>
                  
                <SelectPicker
                  value={profiledata.restaurantInfo.restaurantAddress.state}
                  items={Object.keys(state).map((item)=>({label:state[item],value:item}))}
                  placeholder={{label:"State"}}
                  textInputProps={{
                    style:{
                      width:windowWidth / 2,
                      height:44,
                      marginLeft:15,
                      backgroundColor:'white',
                      borderRadius:8,
                      borderColor:'#AAA',
                      borderWidth:1,
                      padding:5,
                      fontSize:RFValue(15,580),
                      color:'#888'
                    }
                  }}
                  style={{
                    backgroundColor:'white'
                  }}
                  onValueChange={value => {
                    //change dropdown
                    setprofiledata({
                      ...profiledata,
                      restaurantInfo: {
                        ...profiledata.restaurantInfo,
                        restaurantAddress: {
                          ...profiledata.restaurantInfo.restaurantAddress,
                          state: value,
                        },
                      },
                    });
                  }}
                  disabled={!route.params.edit}
                ></SelectPicker>
                </View>
                <View style={{flex: 1}}>
                  <Input
                    label="Zip Code"
                    inputStyle={styles.input}
                    inputContainerStyle={{borderBottomWidth: 0}}
                    placeholder="Zip Code"
                    disabled={!route.params.edit}
                    value={profiledata.restaurantInfo.restaurantAddress.zipcode}
                    onChangeText={value =>
                      setprofiledata({
                        ...profiledata,
                        restaurantInfo: {
                          ...profiledata.restaurantInfo,
                          restaurantAddress: {
                            ...profiledata.restaurantInfo.restaurantAddress,
                            zipcode: value,
                          },
                        },
                      })
                    }
                  />
                </View>
              </View>
            </View>
        {route.params.edit ? (
          <>
            <Text h4 style={styles.titles}>
              Delivery Options
            </Text>
            {/* <Input
              label="Flat Fee"
              inputStyle={styles.input}
              inputContainerStyle={{borderBottomWidth: 0}}
              value={profiledata.deliveryOptions.flatFee}
              keyboardType="number-pad"
              onChangeText={value =>
                setprofiledata({
                  ...profiledata,
                  deliveryOptions: {
                    ...profiledata.deliveryOptions,
                    flatFee: value,
                  },
                })
              }
            />
            <Input
              label="Flat Fee Radius"
              inputStyle={styles.input}
              inputContainerStyle={{borderBottomWidth: 0}}
              value={profiledata.deliveryOptions.flatFeeRadius}
              keyboardType="number-pad"
              onChangeText={value =>
                setprofiledata({
                  ...profiledata,
                  deliveryOptions: {
                    ...profiledata.deliveryOptions,
                    flatFeeRadius: value,
                  },
                })
              }
            /> */}
            <Input
              label="Delivery Radius"
              inputStyle={styles.input}
              inputContainerStyle={{borderBottomWidth: 0}}
              value={profiledata.deliveryOptions.maxRadius}
              keyboardType="number-pad"
              onChangeText={value =>
                setprofiledata({
                  ...profiledata,
                  deliveryOptions: {
                    ...profiledata.deliveryOptions,
                    maxRadius: value,
                  },
                })
              }
            />
            <Input
              label="Delivery Fees"
              inputStyle={styles.input}
              inputContainerStyle={{borderBottomWidth: 0}}
              value={profiledata.deliveryOptions.additionalDeliveryFee}
              keyboardType="number-pad"
              onChangeText={value =>
                setprofiledata({
                  ...profiledata,
                  deliveryOptions: {
                    ...profiledata.deliveryOptions,
                    additionalDeliveryFee: value,
                  },
                })
              }
            />
          </>
        ) : (
          <>
            <Text h4 style={styles.titles}>
              Delivery Options
            </Text>
            <ListItem
              title={'Flat Fee: $' + profile.deliveryOptions.flatFee}
              bottomDivider
              chevron
            />
            <ListItem
              title={
                'Flat Fee Radius: ' +
                profile.deliveryOptions.flatFeeRadius +
                ' mile(s)'
              }
              bottomDivider
              chevron
            />
            <ListItem
              title={
                'Delivery Radius: ' +
                profile.deliveryOptions.maxRadius +
                ' mile(s)'
              }
              bottomDivider
              chevron
            />
            <ListItem
              title={
                'Delivery Fees: $' +
                profile.deliveryOptions.additionalDeliveryFee +
                '/mile'
              }
              bottomDivider
              chevron
            />
          </>
        )}

        {route.params.edit ? (
          <View style={styles.buttoncontainer}>
            <Button
              title="Cancel"
              type="outline"
              onPress={() => navigation.setParams({edit: false})}
              buttonStyle={[styles.buttonStyle, {marginBottom: 15,backgroundColor:'white',borderColor:'#888'}]}
              titleStyle={{color:'#888'}}
            />
            <Button
              title="Save & Update"
              onPress={saveprofile}
              buttonStyle={styles.buttonStyle}
            />
          </View>
        ) : (
          <View style={{paddingLeft: 15, paddingRight: 15}}>
            <Button
              buttonStyle={styles.buttonStyle}
              style={styles.signOutButton}
              title={'Sign Out'}
              onPress={() => Auth.signOut()}
            />
          </View>
        )}
        <Loading visible={loading}></Loading>
      </View>
    </ScrollView>
  );
}

function ProfileList({navigation, route}) {
  if (route.params.needsUpdate) {
    //update with API
    this.setState({profile});
  }
  return (
    <ScrollView>
      <View
        key={'profile_display_' + profile.restaurantInfo.restaurantName}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{flex: 1}}>
        <Text style={styles.titles} h4 h4Style={{fontSize:12}}>
          Restaurant Information
        </Text>
        <ListItem
          title={'Restaurant Name'}
          subtitle={profile.restaurantInfo.restaurantName}
          bottomDivider
          chevron
        />
        <ListItem
          title={'Restaurant Phone Number'}
          subtitle={profile.restaurantInfo.restaurantPhoneNumber}
          bottomDivider
          chevron
          // onPress={() =>
          //   navigation.navigate('Editor', {
          //     profile: profile,
          //     name: profile.restaurantInfo.restaurantPhoneNumber,
          //     attribute: 'Restaurant Phone Number',
          //     attributeToEdit: profile.restaurantInfo.restaurantPhoneNumber,
          //     toChange: 'restaurantPhoneNumber',
          //     new: false,
          //   })
          // }
        />
        <ListItem
          title={'Restaurant Address'}
          subtitle={
            profile.restaurantInfo.restaurantAddress.address +
            ' ' +
            profile.restaurantInfo.restaurantAddress.city +
            ', ' +
            profile.restaurantInfo.restaurantAddress.state +
            ' ' +
            profile.restaurantInfo.restaurantAddress.zipcode
          }
          bottomDivider
          chevron
          // onPress={() =>
          //   navigation.navigate('Editor', {
          //     profile: profile,
          //     name: profile.restaurantInfo.restaurantAddress,
          //     attribute: 'Restaurant Address',
          //     attributeToEdit: profile.restaurantInfo.restaurantAddress,
          //     toChange: 'restaurantAddress',
          //     new: false,
          //   })
          // }
        />
        {/* <ListItem
          title="Hours of Operation"
          bottomDivider
          chevron
          onPress={() =>
            navigation.navigate('ProfileEditor', {
              profile: profile,
              toEditor: 'restaurantHoursNav',
              new: false,
            })
          }
        /> */}
        <ListItem
          title="Restaurant Tags"
          badge={{
            value: profile.restaurantInfo.restaurantType.typeTags.length,
            textStyle: {color: 'white'},
            containerStyle: {marginTop: 0},
          }}
          bottomDivider
          chevron
          onPress={() => {
            navigation.navigate('ProfileEditor', {
              profile: profile,
              toEditor: 'restaurantTypeNav',
              new: false,
            });
          }}
        />
        <Text h4 style={styles.titles}>
          Delivery Options
        </Text>
        <ListItem
          title={'Flat Fee: $' + profile.deliveryOptions.flatFee}
          bottomDivider
          chevron
        />
        <ListItem
          title={
            'Flat Fee Radius: ' +
            profile.deliveryOptions.flatFeeRadius +
            ' mile(s)'
          }
          bottomDivider
          chevron
        />
        <ListItem
          title={
            'Delivery Radius: ' + profile.deliveryOptions.maxRadius + ' mile(s)'
          }
          bottomDivider
          chevron
        />
        <ListItem
          title={
            'Additional Delivery Fees: $' +
            profile.deliveryOptions.additionalDeliveryFee +
            '/mile'
          }
          bottomDivider
          chevron
        />
        <Text h4 style={styles.titles}>
          Profile Picture
        </Text>
        <Card image={{uri: profile.picture + '?date=' + new Date()}}>
          {/* <ListItem
            title={'Choose Picture'}
            chevron
            onPress={() =>
              navigation.navigate('PhotoSelector', {
                profile: profile,
                name: profile.displayItem,
                toChange: 'itemPicture',
                new: false,
              })
            }
          /> */}
        </Card>
        <View style={styles.buttoncontainer}>
          <Button
            buttonStyle={styles.buttonStyle}
            style={styles.signOutButton}
            title={'Edit Profile'}
            onPress={() => navigation.navigate('ProfileEdit')}
          />
        </View>
        <View style={styles.buttoncontainer}>
          <Button
            buttonStyle={styles.buttonStyle}
            style={styles.signOutButton}
            title={'Sign Out'}
            onPress={() => Auth.signOut()}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titles: {
    textAlign: 'center',
    color: '#03a5fc',
    padding: 10,
  },
  signOutButton: {
    padding: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#979797',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 11,
    paddingTop: 8,
    paddingBottom: 8,
  },
  buttoncontainer: {
    padding: 15,
    paddingBottom: 0,
  },
  buttonStyle: {
    backgroundColor: '#F86D64',
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 5,
  },
  picture: {
    width: wp('30'),
    height: wp('30'),
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
/*

import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Customer from './modules/customer/Customer';
import Restaurant from './modules/restaurant/Restaurant';
import Amplify from 'aws-amplify';
import {Auth} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native';
import awsconfig from './aws-exports';
import {Alert, ActivityIndicator} from 'react-native';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

var stage = 'beta';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isRestaurant: false,
      userId: {},
      loading: true,
    };
  }
  async componentDidMount() {
    try {
      let dataCall = await fetchUserAttributes();
      let dataJson = await dataCall.json();
      console.log(dataJson);
      this.setState({
        data: dataJson,
        isRestaurant: JSON.parse(dataJson).restaurant,
        userId: dataJson.id,
        loading: false,
      });
    } catch (e) {
      console.log(e);
      Alert.alert('Unable to load user data');
    }
  }

  render() {
    if (!this.state.loading) {
      return (
        <NavigationContainer>
          {this.state.isRestaurant ? (
            <Restaurant data={this.state.data} />
          ) : (
            <Customer data={this.state.data} />
          )}
        </NavigationContainer>
      );
    } else {
      return <ActivityIndicator />;
    }
  }
}

async function fetchUserAttributes() {
  let token = null;
  let UID = '';
  let prom1 = Auth.currentUserInfo().then(info => (UID = info.username));
  let prom2 = Auth.currentSession().then(
    info => (token = info.getIdToken().getJwtToken()),
  );
  await prom1;
  await prom2;
  const body = JSON.stringify({
    incoming_Id: UID,
  });
  return fetch(
    'https://9yl3ar8isd.execute-api.us-west-1.amazonaws.com/' +
      stage +
      '/getuserid',
    {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
        Authorization: token,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: body, // body data type must match "Content-Type" header
    },
  );
}

export default withAuthenticator(App);
*/
