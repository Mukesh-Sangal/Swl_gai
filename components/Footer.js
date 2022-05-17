import React, {Component} from  'react';
import {View, Text, StyleSheet} from "react-native";
class Footer extends Component {
  
  render(){   
    return (
      <View style={styles.mainFooter}>
        <Text style={styles.info}>© gai Technologies Pvt. Ltd. 2020</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
mainFooter:{
  display:'flex',
  backgroundColor:'#72C6B9',
  height:50,
  flexDirection:'column',
  justifyContent:'center',
  alignItems:'center',
  fontSize:14
},
info:{
  marginTop:20,
  color: '#000'
} 
});
export default Footer; 