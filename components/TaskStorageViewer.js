import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { loadTasks } from '../services/storageService';

const TaskStorageViewer = () => {
  const tasks = useSelector((state) => state.tasks.tasks); // Subscribe to tasks from Redux

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Stored Tasks Data</Text>
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <View key={task.id || index} style={styles.taskItem}>
            <Text style={styles.taskTitle}>Title: {task.title}</Text>
            <Text>Description: {task.description}</Text>
            <Text>Priority: {task.priority}</Text>
            <Text>Recurrence: {task.recurrence}</Text>
            <Text>Category: {task.category}</Text>
            <Text>Due Date: {new Date(task.dueDate).toLocaleString()}</Text>
            {task.dueTime && <Text>Due Time: {new Date(task.dueTime).toLocaleTimeString()}</Text>}
            {task.attachments && task.attachments.length > 0 && (
              <Text>Attachments: {task.attachments.map((attachment) => attachment.name).join(', ')}</Text>
            )}
            {task.subtasks && task.subtasks.length > 0 && (
              <Text>Subtasks: {task.subtasks.map((subtask) => subtask.title).join(', ')}</Text>
            )}
          </View>
        ))
      ) : (
        <Text>No tasks found in storage.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskStorageViewer;
