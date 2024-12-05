import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateExistingTask, deleteExistingTask } from '../redux/tasksSlice';

const TaskDetailsScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { task } = route.params;

  const [localTask, setLocalTask] = useState(task);

  useEffect(() => {
    setLocalTask(task); // Update the local state whenever the task prop changes
  }, [task]);

  const handleOpenAttachment = (attachment) => {
    if (attachment.mimeType.startsWith('image/')) {
      navigation.navigate('ImagePreview', { uri: attachment.uri });
    } else if (attachment.mimeType.startsWith('video/') || attachment.mimeType.startsWith('audio/')) {
      navigation.navigate('MediaPreview', {
        uri: attachment.uri,
        mimeType: attachment.mimeType,
      });
    } else {
      alert('Unsupported media type');
    }
  };

  const handleEditTask = () => {
    navigation.navigate('Main', {
      screen: 'Tasks',
      params: { editTask: localTask },
    });
  };

  const handleDeleteTask = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteExistingTask(localTask.id));
          navigation.goBack();
        },
      },
    ]);
  };

  const handleCompleteTask = () => {
    Alert.alert('Complete Task', 'Are you sure you want to mark this task as complete?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        style: 'default',
        onPress: () => {
          dispatch(deleteExistingTask(localTask.id)); // Delete task after marking complete
          navigation.goBack();
        },
      },
    ]);
  };

  const handleCompleteSubtask = (subtaskId) => {
    Alert.alert('Complete Subtask', 'Are you sure you want to mark this subtask as complete?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        style: 'default',
        onPress: () => {
          const updatedSubtasks = localTask.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed: true } : subtask
          );
          const updatedTask = { ...localTask, subtasks: updatedSubtasks };
          setLocalTask(updatedTask); // Update local state to trigger re-render
          dispatch(updateExistingTask(updatedTask));
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{localTask.title}</Text>
      <Text style={styles.detailText}>Description: {localTask.description}</Text>
      <Text style={styles.detailText}>Priority: {localTask.priority}</Text>
      <Text style={styles.detailText}>Recurrence: {localTask.recurrence}</Text>
      <Text style={styles.detailText}>Category: {localTask.category}</Text>
      <Text style={styles.detailText}>Due Date: {new Date(localTask.dueDate).toLocaleString()}</Text>
      {localTask.dueTime && <Text style={styles.detailText}>Due Time: {new Date(localTask.dueTime).toLocaleTimeString()}</Text>}

      {localTask.attachments && localTask.attachments.length > 0 && (
        <View style={styles.attachmentContainer}>
          <Text style={styles.attachmentHeader}>Attachments:</Text>
          {localTask.attachments.map((attachment, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleOpenAttachment(attachment)}
              style={styles.attachmentButton}
            >
              <Text style={styles.attachmentText}>{attachment.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {localTask.subtasks && localTask.subtasks.length > 0 && (
        <View style={styles.subtaskContainer}>
          <Text style={styles.subtaskHeader}>Subtasks:</Text>
          {localTask.subtasks.map((subtask) => (
            <View key={subtask.id} style={styles.subtaskItem}>
              <Text style={styles.subtaskText}>
                {subtask.title} - {subtask.completed ? 'Completed' : 'Pending'}
              </Text>
              {!subtask.completed && (
                <TouchableOpacity
                  onPress={() => handleCompleteSubtask(subtask.id)}
                  style={styles.markCompleteButton}
                >
                  <Text style={styles.markCompleteButtonText}>Mark as Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Edit Task" onPress={handleEditTask} />
        <Button title="Delete Task" color="red" onPress={handleDeleteTask} />
        {!localTask.completed && <Button title="Mark as Complete" onPress={handleCompleteTask} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  attachmentContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  attachmentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  attachmentButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  attachmentText: {
    fontSize: 16,
  },
  subtaskContainer: {
    marginTop: 20,
  },
  subtaskHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtaskItem: {
    marginBottom: 10,
  },
  subtaskText: {
    fontSize: 16,
    marginBottom: 5,
  },
  markCompleteButton: {
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  markCompleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default TaskDetailsScreen;
