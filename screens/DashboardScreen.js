import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from "../navigation/DrawerNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}


// import React, { Component } from 'react';
// import { Text, View } from 'react-native';
// export default class DashboardScreen extends Component {
//     render() {
//         return (
//             <View
//                 style={{
//                     flex: 1,
//                     justifyContent: "center",
//                     alignItems: "center"
//                 }}>
//                 <Text>....Dashboard Screen....</Text>
//             </View>
//         )
//     }
// }