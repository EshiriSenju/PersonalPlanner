import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

const NotificationLogScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      setNotifications(scheduledNotifications);
    };

    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scheduled Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text>{item.content.title}</Text>
            <Text>{item.content.body}</Text>
            <Text>{JSON.stringify(item.trigger)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  notification: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
});

export default NotificationLogScreen;
