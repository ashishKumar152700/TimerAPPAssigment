import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HistoryItem = {
  id: string;
  name: string;
  completionTime: string;
  duration: number;
  category: string;
};

const HistoryScreen = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('completedTimers');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const exportTimerData = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('completedTimers');
      if (storedHistory) {
        await Share.share({
          title: 'Exported Timer Data',
          message: storedHistory,
        });
      } else {
        Alert.alert('No Data', 'There is no timer data to export.');
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      Alert.alert('Error', 'Failed to export timer data.');
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyItem}>
      <Text style={styles.itemName}>Name: {item.name}</Text>
      <Text style={styles.itemDetails}>Duration: {item.duration}s</Text>
      <Text style={styles.itemDetails}>Category: {item.category}</Text>
      <Text style={styles.itemTime}>Completed at: {item.completionTime}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer History</Text>
      <Button title="Export Timer Data" onPress={exportTimerData} />
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No completed timers yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemDetails: { fontSize: 16, color: '#333' },
  itemTime: { fontSize: 14, color: '#666' },
});

export default HistoryScreen;
