import React, { Component }  from 'react';
import {Button, Image, View,alert, Alert, PermissionsAndroid,  StyleSheet, Dimensions, TouchableOpacity, Text, TextInput} from 'react-native';
import Textarea from 'react-native-textarea';
import ImagePicker from 'react-native-image-picker';
import axios from 'react-native-axios';
import * as Location from 'expo-location';
import SendSMS from 'react-native-sms';

class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      count:0,
      error: null,
        LocalImage:[],
        filesToUpload:[],
      multipleUrl:[],
      location:null,
      place: [],
      Address: null,
      disabled: true,
      imagecount:0,
      text: ''
    }
  }
  componentDidMount = async () => {
  }
  _takePhoto = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let options = {
          storageOptions: 
          { 
            privateDirectory: true 
          } 
        }
        ImagePicker.launchCamera(options, (response) => {

          // console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled photo picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else {
          let source = { uri: response.uri };
          // console.log(source.uri,'Heloo');
          this.setState({
            count: this.state.count+1
          })
          let count = this.state.count
          // console.log(response.data,'Base 64 data');
          let imageUri = response ? `data:image/jpg;base64,${response.data}` : null

          this.state.multipleUrl.push(imageUri)
          this.setState({
            LocalImage: this.state.LocalImage.concat(source.uri),
          })
          this.state.filesToUpload.push(response.data);
        }
      })
      } else {
        console.log("Camera permission denied");
      } 
  }
  _renderImages() {
		let images = [];  
		this.state.LocalImage.map((item, index) => {
      images.push( <Image
				key={index}
        source={{ uri: item }}
				resizeMode='cover'
        style={styles.image}
      />)
		})
		return images; 
  }
  _handletext = (text) => {
      this.setState({ text: text })
   }
  _getImagesAndMessage = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
     console.log('Permission to access location was denied');
   }
   const location = await Location.getCurrentPositionAsync({});
   this.setState({location})
    const place = await Location.reverseGeocodeAsync({
    latitude : location.coords.latitude,
    longitude : location.coords.longitude
   });
   this.setState({place}, () => {
      console.log(this.state.place,'Hlo City');
   })
    let imagedata = this.state.LocalImage;
    let imagecount = this.state.count;
    // let text = this.state.text
    this.setState({
      imagedata : this.state.count+1
    })
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
          {
            title: 'Tadiwanashe App Sms Permission',
            message:
                'Tadiwanashe App needs access to your inbox ' +
                'so you can send messages in background.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
          },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          SendSMS.send({
              //Message body
              body: this.state.text,
              //Recipients Number
              recipients: [this.props.phn,this.props.alternatephone],
              //An array of types that would trigger a "completed" response when using android
              successTypes: ['sent', 'queued']
              }, (completed, cancelled, error) => {
                  if(completed){
                    console.log('SMS Sent Completed');
                  }else if(cancelled){
                    console.log('SMS Sent Cancelled');
                  }else if(error){
                    console.log('Some error occured');
                  }
              }
          );
      } 
      else {
          console.log('SMS permission denied');
      }
    } 
    catch (err) {
      console.warn(err);
    }
    axios.get('https://swlss-app.gailabs.com/session/token').then(result => {
    console.log(result);
      if (result.status === 200) {
        const csrfToken = result.data;
        console.log(result.data,'Hiii');
        const file_promises = this.state.filesToUpload.map((file_url, index) => {
          return fetch('https://swlss-app.gailabs.com/entity/file?_format=hal_json', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/hal+json',
              'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(
              { 
                "_links": {
                  "type": {
                    "href": "https://swlss-app.gailabs.com/rest/type/file/image"
                  }
                },
                "filename": [
                  {
                    "value": "picture.jpeg"
                  }
                ],
                "filemime": [
                  {
                    "value": "image/jpeg"
                  }
                ],
                "uri": [
                  {
                    "value": "public://swl-data/images/user-"+this.props.pageKey+"/picture.jpg"
                  }
                ],
                "data": [
                    {
                      "value": file_url,
                    }
                ]
              }
            ),
          })   
          .then(response => response.json())  
        });
        Promise.all(file_promises).then(results => {
          
             console.log(results,'results data');
          fetch('https://swlss-app.gailabs.com/node?_format=hal_json', {
          method: 'POST',
            headers: {
              'Authorization': 'Basic cm9vdDpsZXR0aGV0cmVlc2dyb3c5',
              'Content-Type': 'application/hal+json',
              'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(
              {
                "_links":{   
                  "type":{
                    "href": "https://swlss-app.gailabs.com/rest/type/node/swl_data"
                  }
                },
                "title":[                   
                  { 
                    "value": "User " + this.props.pageKey                
                  }
                ],
                "field_region":[   
                  {
                    "value":this.state.place[0].region    
                  }
                ],
                "field_city":[   
                  {
                    "value":this.state.place[0].city   
                  }
                ],
                "field_nearby":[   
                  {
                    "value":this.state.place[0].name    
                  }
                ],
                "field_street":[   
                  {
                    "value":this.state.place[0].street  
                  }
                ],
                "field_postalcode":[   
                  {
                    "value":this.state.place[0].postalCode 
                  }
                ],
                "field_swl_image": results.map((result) => {
                  return {
                    target_id: result.fid[0].value
                  }
                })
              }
            ),
        })
        .then(response => response.json())
        .then(
          (results) => {
          // on success you do whatever you will want
            console.log('success data for Messages Send');
            this.setState({
              count:0,
              LocalImage:[],
              text:''
            })
            
          },
          (error) => {
            console.log('error', error);
          }
        );
        }).catch((err) => {
          console.log('Printing the err', err)
        })    
      }
    }).catch((er) => {
      console.log(er, 'err while posting')
    })
} 
  render() {
		let image= this.state.count;
    if(!image){
      return (
        <View style={{flex:1}}>
          <View style={styles.Container}>
            <View style={styles.ImageBorder}>
            </View>
            <View style={styles.ImageBorder2}>
            </View>
            <View style={styles.ImageBorderlast}>
            </View>
          </View>
          <View style={styles.containerButton}>
            <TouchableOpacity onPress={this._takePhoto} disabled={this.state.count === 4} style={[styles.ButtonContainer, { backgroundColor: this.state.count === 4 ? '#0f6d5f42' : '#666' }]}>
              <Text style={styles.buttonText}>
                Take Picture
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._getImagesAndMessage} disabled={this.state.count === 0} style={[styles.ButtonContainer, { backgroundColor: this.state.count === 0 ? '#0f6d5f42' : '#666' }]}>
              <Text style={styles.buttonText}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <Textarea
              containerStyle={styles.textareaContainer}
              style={styles.textarea}
              maxLength={400}
              onChangeText={this._handletext}
              defaultValue={this.state.text}
              placeholder={'Enter Message......'}
              placeholderTextColor={'#2b2b2b8f'}
              underlineColorAndroid={'transparent'}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.images}>
          {this._renderImages()}
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity onPress={this._takePhoto} disabled={this.state.count === 4} style={[styles.ButtonContainer, { backgroundColor: this.state.count === 4 ? '#0f6d5f42' : '#666' }]}>
            <Text style={styles.buttonText}>
              Take Picture
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._getImagesAndMessage} disabled={this.state.count === 0} style={[styles.ButtonContainer, { backgroundColor: this.state.count === 0 ? '#0f6d5f42' : '#666' }]}>
            <Text style={styles.buttonText}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Textarea
            containerStyle={styles.textareaContainer}
             style={styles.textarea}
            maxLength={400}
            onChangeText={this._handletext}
            defaultValue={this.state.text}
            placeholder={'Enter Message......'}
            placeholderTextColor={'#2b2b2b8f'}
            underlineColorAndroid={'transparent'}
          />
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  Container:{
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height /3,
    display:'flex',
    flexWrap:'wrap',
    flexDirection:'row',
    borderColor:'#666'
  },
  ImageBorder:{
    width: Dimensions.get("window").width/2,
    borderColor:'#666',
    borderRightWidth: 1,
    borderBottomWidth:1,
    height:139,
  },
  ImageBorder2:{
    width: Dimensions.get("window").width/2,
    borderColor:'#666',
    borderBottomWidth:1,
    height:139,
  },
  ImageBorderlast:{
    width: Dimensions.get("window").width/2,
    borderColor:'#666',
    borderRightWidth: 1,
    height:139
  },
  images:{
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height /3,
    display:'flex',
    flexWrap:'wrap',
    flexDirection:'row',
    borderColor:'#666'
  },
  image:{
    display:'flex',
    flexBasis:'49%',
    flexWrap:'wrap',
    borderColor:'#000',
    width: Dimensions.get("window").width/ 2,
    height:139,
    backgroundColor:'rgba(0,0,0,0.25)',
    overflow: 'hidden',
    margin:'0.5%',  
  },
  containerButton:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:6
  },
  ButtonContainer: {
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor:'transparent',
    backgroundColor: '#666',
    paddingVertical: 4,
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  container: {
    flex: 1,
    margin:10,
  },
  textareaContainer: {
    padding: 15,
    borderWidth: 1.5,
    backgroundColor: '#0f6d5f42',
  },
  textarea: {
    height: 150,
    textAlignVertical: 'top', 
    fontSize: 18,
    color: 'black',
  },
})
export default Photo; 