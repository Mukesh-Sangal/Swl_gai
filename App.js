import React, {Component,  useEffect, useState} from 'react';
import { Button, Image, View, StyleSheet, Alert, Dimensions, TouchableOpacity, Text,ScrollView} from 'react-native';
import General from './components/General';
import Swiper from 'react-native-swiper';
import {getDeviceLocation,getDistance} from './components/utils';
function App() {
  const [isLoading, setLoading] = useState(true);
  const [data , setData] = useState([]);
  const item = data.length ? data[0] : {}
  useEffect(() => {
    fetch('https://swlss-app.gailabs.com/users/data')
      .then((response) => response.json())
      .then(async(data) => {
        const location = await getDeviceLocation();
        getDistance(data, location);
        setData(data) 
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    }, []);  
  return (
    <Swiper style={styles.wrapper} showsButtons={false}>
      {data.map(user => {
          return (
            <View style={styles.slide1}>
              <General 
                logo={"https://swlss-app.gailabs.com/"+user.field_logo}
                title={user.field_title}
                subtitle={user.field_subtitle}
                alternatephone={user.field_alternate_phone_number}
                phn={user.field_phone}
                pageKey={user.uid}
              />
            </View>
          )
      })}
    </Swiper>
  );
}
const styles = StyleSheet.create({
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
export default App;