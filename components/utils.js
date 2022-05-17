import { getDistance as calculateDistance } from 'geolib';
import * as Location from 'expo-location';

export const getDistance = (data,location) => {
    data.forEach(user => {
      var address =  user.field_address.split(",");
      var dis = calculateDistance(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        { latitude:address[0], longitude: address[1] }
      );
    })
}

export const getDeviceLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }
    return await Location.getCurrentPositionAsync({});   
}