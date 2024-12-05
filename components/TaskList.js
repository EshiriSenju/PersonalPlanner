import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TaskList = ({ tasks, onView }) => {
  return (
    <View>
      {tasks.map((task) => (
        <TouchableOpacity key={task.id} style={styles.taskItem} onPress={() => onView(task)}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text>{task.priority}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskList;
