import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileEditor from './subcomponents/ProfileEditor/ProfileEditor';
import {ListItem, Text, Button} from 'react-native-elements';
import {EditTextAttribute} from './subcomponents/ProfileEditor/AttributeEditor';
import SelectPhotos from './subcomponents/ProfileEditor/PhotoSelector';
//import testProfile from './subcomponents/testProfile';
import {Auth} from 'aws-amplify';

var profile;
//var profile = testProfile();
const Stack = createStackNavigator();

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    Auth.currentUserInfo();
    console.log(props.route.params.data);
    this.state = {
      signedIn: false,
      name: '',
      protoUrl: '',
      profile: props.route.params.data,
    };
    profile = this.state.profile;
  }

  editProfile = newProfile => {
    this.setState({profile: newProfile});
  };

  render() {
    return (
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen
          name="User Profile"
          component={ProfileList}
          initialParams={{
            profile: this.state.profile,
            needsUpdate: false,
          }}
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
          name="Editor"
          component={EditProfile}
          initialParams={{
            item: this.state.profile,
          }}
          options={({navigation}) => ({
            title: 'Profile Editor',
          })}
        />
        <Stack.Screen
          name="ProfileEditor"
          component={ProfileEditor}
          options={({navigation}) => ({
            title: 'Profile Editor',
          })}
        />
      </Stack.Navigator>
    );
  }
}

function EditProfile({navigation, route}) {
  return (
    <EditTextAttribute
      navigation={navigation}
      item={route.params.item}
      attribute={route.params.attribute}
      toChange={route.params.toChange}
    />
  );
}

function ProfileList({navigation, route}) {
  return (
    <ScrollView>
      <View style={styles.general}>
        <Text h4 style={styles.titles}>
          User Information
        </Text>
        <ListItem
          leftAvatar={{
            title: profile.customerInfo.customerName.firstName,
            source: {
              uri: profile.customerInfo.picture,
            },
            showAccessory: true,
            avatarStyle: {
              borderColor: '#ffffff',
            },
            rounded: true,
            size: 'xlarge',
            onAccessoryPress: () => {
              navigation.navigate('PhotoSelector', {
                profile: profile,
                name: profile.customerInfo,
                toChange: 'customerInfo',
                new: false,
              });
            },
          }}
          title={profile.customerInfo.customerName.firstName}
          subtitle={profile.customerInfo.customerName.lastName}
          bottomDivider
          chevron
          onPress={() => {
            navigation.navigate('Editor', {
              profile: profile,
              name: profile.customerInfo.customerName,
              attribute: 'Customer Name',
              attributeToEdit: profile.customerInfo.customerName,
              toChange: 'customerName',
              new: false,
            });
          }}
        />
        <ListItem
          title={'Saved Addresses '}
          bottomDivider
          chevron
          onPress={() =>
            navigation.navigate('ProfileEditor', {
              profile: profile,
              name: profile.customerInfo.customerAddress.savedAddresses,
              attribute: 'Saved Addresses',
              attributeToEdit:
                profile.customerInfo.customerAddress.savedAddresses,
              toChange: 'savedAddresses',
              toEditor: 'addressNavigation',
              new: false,
            })
          }
        />
        <Text h4 style={styles.titles}>
          Contact Information
        </Text>
        <ListItem
          title={
            'Email : ' + profile.customerInfo.contactInformation.emailAddress
          }
          bottomDivider
          chevron
          onPress={() =>
            navigation.navigate('Editor', {
              profile: profile,
              name: profile.customerInfo.contactInformation.emailAddress,
              attribute: 'Email Address',
              attributeToEdit:
                profile.customerInfo.contactInformation.emailAddress,
              toChange: 'emailAddress',
              new: false,
            })
          }
        />
        <ListItem
          title={
            'Phone : ' +
            profile.customerInfo.contactInformation.contactNumber.phoneNumber
          }
          bottomDivider
          chevron
          onPress={() =>
            navigation.navigate('Editor', {
              profile: profile,
              name:
                profile.customerInfo.contactInformation.contactNumber
                  .phoneNumber,
              attribute: 'Phone Number',
              attributeToEdit:
                profile.customerInfo.contactInformation.contactNumber
                  .phoneNumber,
              toChange: 'phoneNumber',
              new: false,
            })
          }
        />
        <Text h4 style={styles.titles}>
          Payment Options
        </Text>
        <ListItem
          title={'Saved Cards'}
          bottomDivider
          chevron
          onPress={() =>
            navigation.navigate('ProfileEditor', {
              profile: profile,
              name: profile.paymentOptions,
              attribute: 'Payment Options',
              attributeToEdit: profile.paymentOptions,
              toChange: 'paymentOptions',
              toEditor: 'paymentNav',
              new: false,
            })
          }
        />
        <Button
          style={styles.signOutButton}
          title={'Sign Out'}
          onPress={() => Auth.signOut()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  general: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  titles: {
    textAlign: 'center',
    color: '#03a5fc',
    padding: 10,
  },
  signOutButton: {
    marginTop: 50,
    padding: 15,
  },
});
