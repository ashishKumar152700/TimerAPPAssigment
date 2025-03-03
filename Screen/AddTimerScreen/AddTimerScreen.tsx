import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const categories = ['Workout', 'Study', 'Break', 'Other'];

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../Global/types'; 

type AddTimerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddTimerScreen'>;

type Props = {
  navigation: AddTimerScreenNavigationProp;
};

const AddTimerScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const saveTimer = async () => {
    if (!name || !duration) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const parsedDuration = parseInt(duration, 10);
    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: parsedDuration,
      category,
      status: 'Paused',
      remainingTime: parsedDuration,
      halfwayAlert, 
    };

    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      const timers = storedTimers ? JSON.parse(storedTimers) : [];
      const updatedTimers = [...timers, newTimer];
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
      Alert.alert('Success', 'Timer saved successfully!');
      setName('');
      setDuration('');
      setCategory(categories[0]);
      setHalfwayAlert(false);
      navigation.navigate('ManageTimers');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save timer');
    }
  };

  const resetStorage = async () => {
    await AsyncStorage.clear();
    Alert.alert('Success', 'Storage Cleared');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Timer</Text>

      <Text style={styles.label}>Timer Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter timer name"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Duration (seconds)</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="Enter duration"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Enable Halfway Alert</Text>
        <Switch value={halfwayAlert} onValueChange={setHalfwayAlert} />
      </View>

      <TouchableOpacity style={styles.button} onPress={saveTimer}>
        <Text style={styles.buttonText}>Save Timer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetStorage}>
        <Text style={styles.buttonText}>Clear All Timers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('History')}>
        <Text style={styles.floatingButtonText}>H</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002957',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#002957',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#d9534f',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#002957',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AddTimerScreen;
