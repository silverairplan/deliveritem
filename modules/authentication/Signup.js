import React,{useState} from 'react'
import {Text,Input,Button} from 'react-native-elements'
import {View,StyleSheet,TouchableOpacity, AsyncStorage} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { RFValue } from 'react-native-responsive-fontsize'
import PhoneInput from 'react-native-phone-number-input'
import {Auth} from 'aws-amplify';

export default function Signup({authState,onStateChange})
{
  const [data,setData] = useState({
    email:"",
    password:"",
    phonenumber:""
  })

  const [error,seterror] = useState("")

  const signUp = () => {
    Auth.signUp({username:data.email,password:data.password,attributes:{email:data.email,phone_number:data.phonenumber}}).then(res=>{
      AsyncStorage.setItem("username",data.email)
      setData({
        email:"",
        password:"",
        phonenumber:""
      })
      seterror("")
      onStateChange('confirmSignUp')
    }).catch(err=>seterror(err.message))
  }
  if(authState == 'signUp')
  {
    return (
      <View style={style.container}>
        <Text h4 h4Style={{fontSize:RFValue(18,580)}}>Create a new account</Text>
        <View style={{marginTop:15}}>
          {
            error != "" && (
              <Text style={{color:'red',textAlign:'center'}}>{error}</Text>
            )
          }
          <Input label="Email *" value={data.email} autoCapitalize="none" inputStyle={style.inputStyle} inputContainerStyle={{borderBottomWidth:0}} style={{marginTop:15}} labelStyle={{color:'black',fontWeight:'normal'}} onChangeText={value=>setData({...data,email:value})}></Input>
          <Input label="Password *" value={data.password} secureTextEntry={true}  autoCapitalize="none" inputStyle={style.inputStyle} inputContainerStyle={{borderBottomWidth:0}} style={{marginTop:15}} labelStyle={{color:'black',fontWeight:'normal'}}  onChangeText={value=>setData({...data,password:value})}></Input>
          <View style={{paddingLeft:15,paddingRight:15}}>
            <Text>Phone Number *</Text>
            <PhoneInput
              defaultCode="US"
              layout="first"
              withDarkTheme
              withShadow
              value={data.phonenumber}
              containerStyle={{marginTop:5,borderWidth:1,borderColor:'#888'}}
              onChangeFormattedText={value=>setData({...data,phonenumber:value})}
            ></PhoneInput>
          </View>
          <Button buttonStyle={style.buttonStyle} title="NEXT" onPress={signUp}></Button>
          <Button type="clear" title="Sign In" titleStyle={{color:'#AAAA00'}} buttonStyle={{marginTop:25}} onPress={()=>onStateChange('signIn')}></Button>
        </View>
        
      </View>
    )
  }
  else
  {
    return null;
  }
  
}

const style = StyleSheet.create({
  container:{
    flex:1,
    width:wp('100'),
    height:hp('100'),
    padding:24
  },
  inputStyle:{
    flex:1,marginTop:5,borderRadius:5,borderColor:'#888',borderWidth:1,paddingLeft:15
  },
  buttonStyle:{
    backgroundColor: '#F86D64',
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 30,
  }
})