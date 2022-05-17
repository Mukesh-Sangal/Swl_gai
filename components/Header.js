import React, {Component} from  'react';
import {View, Text, StyleSheet,Image, FlatList, ActivityIndicator} from "react-native";

class Header extends Component {
  
  render(){
     const data = this.props
        return (
            <View style={styles.mainHeader}>
            <View style={styles.Container}>
                <View style={styles.HeaderLeft}>
                <Image style={{width: 60, height: 55}} source={{uri :data.logo}}/>
                </View>
                <View style={styles.headerRightTop}>
                <Text style={styles.textHeaderRightTop}>{data.title}</Text>
                <Text style={styles.textHeaderRightBottom}>{data.subtitle}</Text>
                </View>
            </View>
            </View>
        );
  }
}

const styles = StyleSheet.create({
mainHeader:{
  backgroundColor:'#72C6B9',
  marginTop:27,
  display:'flex'
},
Container:{
  display:'flex',
  marginTop:8,
  flexDirection:'row',
  justifyContent:'space-evenly',
  alignItems:'center'
},
HeaderLeft:{
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  position:'relative',
  marginRight:8
},
headerRightTop:{
  display:'flex',
  marginBottom:8
},
textHeaderRightTop:{
  fontSize:26,
  fontWeight:'bold',
  color: '#000',
  alignItems:'center'
},
textHeaderRightBottom:{
  fontSize:16,
  fontWeight:'700',
  color: '#000'
}

});
export default Header; 