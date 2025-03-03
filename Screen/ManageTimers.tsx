import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';

const categories = ['Workout', 'Study', 'Break', 'Other'];

type Timer = {
  id: string;
  name: string;
  duration: number;
  remainingTime: number;
  status: 'Running' | 'Paused' | 'Completed';
  category: string;
  halfwayAlert?: boolean;
  halfwayAlertTriggered?: boolean;
};

const ManageTimersScreen = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [completedTimer, setCompletedTimer] = useState<Timer | null>(null);

  useEffect(() => {
    loadTimers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateTimers();
    }, 1000);
    return () => clearInterval(interval);
  }, [timers]);

  const loadTimers = async () => {
    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      if (storedTimers) setTimers(JSON.parse(storedTimers));
    } catch (error) {
      console.error('Failed to load timers:', error);
    }
  };

  const addCompletedTimerToHistory = async (timerName: string) => {
    const newHistoryItem = {
      id: Date.now().toString(),
      name: timerName,
      completionTime: new Date().toLocaleString(),
    };
    try {
      const storedHistory = await AsyncStorage.getItem('completedTimers');
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      const updatedHistory = [newHistoryItem, ...history];
      await AsyncStorage.setItem('completedTimers', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to update history: ', error);
    }
  };

  const updateTimers = () => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.status === 'Running' && timer.remainingTime > 0) {
          const newTime = timer.remainingTime - 1;
          let updatedTimer = {
            ...timer,
            remainingTime: newTime <= 0 ? 0 : newTime,
            status: newTime <= 0 ? ('Completed' as const) : ('Running' as const),
          };

          if (
            updatedTimer.halfwayAlert &&
            !updatedTimer.halfwayAlertTriggered &&
            newTime <= timer.duration / 2
          ) {
            Alert.alert('Halfway Alert', `Timer "${timer.name}" is halfway done!`);
            updatedTimer.halfwayAlertTriggered = true;
          }

          if (newTime <= 0 && timer.status === 'Running') {
            addCompletedTimerToHistory(timer.name);
            setCompletedTimer(timer);
          }
          return updatedTimer;
        }
        return timer;
      })
    );
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const startTimer = (id: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => (timer.id === id ? { ...timer, status: 'Running' } : timer))
    );
  };

  const pauseTimer = (id: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => (timer.id === id ? { ...timer, status: 'Paused' } : timer))
    );
  };

  const resetTimer = (id: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id
          ? { ...timer, remainingTime: timer.duration, status: 'Paused', halfwayAlertTriggered: false }
          : timer
      )
    );
  };

  const allAction = (category: string, action: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.category === category) {
          if (action === 'Reset') {
            return { ...timer, remainingTime: timer.duration, status: 'Paused', halfwayAlertTriggered: false };
          }
          return { ...timer, status: action as 'Running' | 'Paused' | 'Completed' };
        }
        return timer;
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Timers</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item: category }) => {
          const categoryTimers = timers.filter((timer) => timer.category === category);
          return (
            <View style={styles.categoryContainer}>
              <TouchableOpacity onPress={() => toggleCategory(category)} style={styles.categoryHeader}>
                <Text style={styles.categoryText}>
                  {category} ({categoryTimers.length})
                </Text>
                <Text>{expandedCategories[category] ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {expandedCategories[category] && (
                <>
                <View style={styles.allActions}>
  <Button title="Start All" onPress={() => allAction(category, 'Running')} color="#002957" />
  <Button title="Pause All" onPress={() => allAction(category, 'Paused')} color="#002957" />
  <Button title="Reset All" onPress={() => allAction(category, 'Reset')} color="#002957" />
</View>
{categoryTimers.map((timer) => (
  <View key={timer.id} style={styles.timerItem}>
    <Text>Name: {timer.name}</Text>
    <Text>Duration: {timer.duration}s</Text>
    <Text>Status: {timer.status}</Text>
    <Progress.Bar progress={timer.remainingTime / timer.duration} width={200} />
    <View style={styles.timerControls}>
      <Button title="Start" onPress={() => startTimer(timer.id)} color="#002957" />
      <Button title="Pause" onPress={() => pauseTimer(timer.id)} color="#002957" />
      <Button title="Reset" onPress={() => resetTimer(timer.id)} color="#002957" />
    </View>
  </View>
                  ))}
                </>
              )}
            </View>
          );
        }}
      />

      <Modal visible={!!completedTimer} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Timer Completed: {completedTimer?.name}</Text>
          <Button title="Close" onPress={() => setCompletedTimer(null)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  categoryContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  categoryHeader: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddd',
  },
  categoryText: { fontSize: 18, fontWeight: 'bold' },
  allActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  timerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    backgroundColor: '#fff',
    padding: 20,
    fontSize: 20,
    borderRadius: 10,
  },
});

export default ManageTimersScreen;
