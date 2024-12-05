import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TaskItem = ({ task, onEdit, onDelete, onView }) => {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return styles.highPriority;
      case 'Medium':
        return styles.mediumPriority;
      case 'Low':
        return styles.lowPriority;
      default:
        return styles.defaultPriority;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onView} style={styles.viewButton}>
        <Text style={[styles.priority, getPriorityStyle(task.priority)]}>{task.priority}</Text>
        <Text style={styles.title}>{task.title}</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  viewButton: { flex: 1 },
  priority: { fontWeight: 'bold', padding: 4, borderRadius: 5 },
  highPriority: { color: '#fff', backgroundColor: '#f00' },
  mediumPriority: { color: '#fff', backgroundColor: '#ffa500' },
  lowPriority: { color: '#fff', backgroundColor: '#008000' },
  title: { fontWeight: 'bold', fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  edit: { color: 'blue' },
  delete: { color: 'red' },
});

export default TaskItem;
