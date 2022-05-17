import React, {Component} from 'react';
import { Button, Image, View, StyleSheet, Alert, Dimensions, TouchableOpacity, Text,ScrollView} from 'react-native';
import Status from '../components/Status';
import Header from '../components/Header';
import Photo from '../components/Photo';
import Footer from '../components/Footer';

class General extends Component {
  render() {
     let { logo, title, subtitle, pageKey, alternatephone, phn} = this.props
    return (
      <View style={{ flex: 1 }}>
      <Status/>
      <Header logo={logo} title={title} subtitle={subtitle}/>
      <Photo pageKey={pageKey} alternatephone={alternatephone} phn={phn}/>
      <Footer/>
      </View>
    )
  }
}

export default General;