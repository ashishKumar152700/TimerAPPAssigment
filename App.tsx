import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './Screen/HomeScreen/HomeScreen';
import AddTimerScreen from './Screen/AddTimerScreen/AddTimerScreen';
import HistoryScreen from './Screen/HistoryScreen/HistoryScreen';
import ManageTimersScreen from './Screen/ManageTimers';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddTimer" component={AddTimerScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="ManageTimers" component={ManageTimersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
