import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Timer {
  id: string;
  name: string;
  duration: number;
  category: string;
  status: 'Running' | 'Paused' | 'Completed';
}

const TimerListScreen = () => {
  const [timers, setTimers] = useState<{ title: string; data: Timer[] }[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchTimers();
  }, []);

  const fetchTimers = async () => {
    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      const timersList: Timer[] = storedTimers ? JSON.parse(storedTimers) : [];

      // Group timers by category
      const groupedTimers = timersList.reduce((acc: { [key: string]: Timer[] }, timer) => {
        if (!acc[timer.category]) acc[timer.category] = [];
        acc[timer.category].push(timer);
        return acc;
      }, {});

      // Convert to SectionList format
      const sections = Object.keys(groupedTimers).map((category) => ({
        title: category,
        data: groupedTimers[category],
      }));

      setTimers(sections);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load timers');
    }
  };

  const toggleSection = (category: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={timers}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <TouchableOpacity style={styles.header} onPress={() => toggleSection(title)}>
            <Text style={styles.headerText}>{title} ({collapsedSections[title] ? 'Show' : 'Hide'})</Text>
          </TouchableOpacity>
        )}
        renderItem={({ item, section }) =>
          !collapsedSections[section.title] ? (
            <View style={styles.item}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Remaining Time: {item.duration}s</Text>
              <Text>Status: {item.status}</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#004F87',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimerListScreen;
