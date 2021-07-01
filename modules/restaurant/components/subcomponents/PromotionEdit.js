import React,{useState,useEffect} from 'react'
import {View,ScrollView,StyleSheet,TouchableOpacity,Image} from 'react-native'
import {Input,Icon,Button} from 'react-native-elements'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import ImagePicker from 'react-native-image-crop-picker'
import {Auth} from 'aws-amplify'
import RNFetchBlob from 'rn-fetch-blob'

export default function PromotionEdit({navigation,route})
{
  const [image,setimage] = useState(null)
  const [promotion,setpromotion] = useState({
    picture:"",
    title:"",
    details:"",
    discount:0
  })


  useEffect(() => {
    if(route.params.item)
    {
      setpromotion(route.params.item)
    }
    setimage(null)
  }, [route.params.item])

  const promotionlist = route.params.promotion?route.params.promotion:[];
  let promotiondata = promotion;

  const updatepromotion = async() => {
    let info = await Auth.currentUserInfo()
    if(image)
    {
      let blob = await RNFetchBlob.fs.readFile(image.uri,'base64')
      
      let body = {
        convertedUri:blob,
        restName:info.username,
        menuItem:promotion.title,
        dataType:"restaurantMenu"
      }
      
      const responseimg = await fetch(
        "https://9yl3ar8isd.execute-api.us-west-1.amazonaws.com/beta/updates3bucket",
        {
          method:"POST",
          mode:'cors',
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'multipart/form-data',
            'Connection' : 'keep-alive'
            // ‘Content-Type’: ‘application/x-www-form-urlencoded’,
          },
          body:JSON.stringify(body)
        }
      )

      const responsejson = await responseimg.json()
      promotiondata = {...promotion,picture:JSON.parse(responsejson.body).Location}

    }

    
    
    let data = [promotiondata,...promotionlist]
    if(route.params.index != undefined)
    {
      data = promotionlist.map((item,index)=>index == route.params.index?promotiondata:item)
    }
    
    console.log('promotiondata',data)
    let body = {
      'restaurant-id': info.username,
      promotion:JSON.stringify(data)
    }

    
    const response = await fetch(
      'https://9yl3ar8isd.execute-api.us-west-1.amazonaws.com/beta/updatepromotion',
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          Connection: 'keep-alive'
          // ‘Content-Type’: ‘application/x-www-form-urlencoded’,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(body), // body data type must match “Content-Type” header
      },
    );
    let apiResponse = await response.json(); 

    navigation.navigate('Promotion',{promotion:data})
    return apiResponse;
  }

  const openpicker = () => {
    ImagePicker.openPicker({}).then(res=>{
      setimage({
        uri:res.path,
        type:res.mime,
        filename:res.path.split('/').pop(),
        
      })
    })
  }



  return (
    <ScrollView style={style.container}>
      <View style={{marginBottom:56}}>
        <TouchableOpacity style={style.photo} onPress={()=>openpicker()}>
          {
            (promotion.picture || image) ? 
            <Image source={{uri:image?image.uri:promotion.picture}} style={style.photo}></Image>:
            <Icon name="photo" size={wp('15')}></Icon>
          }
          
        </TouchableOpacity>
        <Input label="Title" inputStyle={style.input} inputContainerStyle={{borderBottomWidth:0}} placeholder="Title" value={promotion.title} onChangeText={value=>setpromotion({...promotion,title:value})}></Input>
        <Input label="Details" inputStyle={style.input} textAlignVertical="top" inputContainerStyle={{borderBottomWidth:0}} numberOfLines={5} placeholder="Details" value={promotion.details} onChangeText={value=>setpromotion({...promotion,details:value})}></Input>
        <Input label="Discount Price" inputStyle={style.input} inputContainerStyle={{borderBottomWidth:0}} placeholder="Discount Price" keyboardType="number-pad" value={promotion.discount + ""} onChangeText={value=>setpromotion({...promotion,discount:value})}></Input>
        <Button title="Save" onPress={updatepromotion}></Button>
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container:{
    flex:1,
    padding:24
  },
  photo:{
    width:wp('30'),
    height:wp('30'),
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white',
    alignSelf:'center',
    borderRadius:15
  },
  input:{
    backgroundColor:'white',
    borderColor:'#979797',
    borderWidth:1,
    borderRadius:8,
    paddingLeft:11,
    paddingTop:8,
    paddingBottom:8
  },
})