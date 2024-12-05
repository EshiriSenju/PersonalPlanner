import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import { loadInitialTasks, addNewTask, updateExistingTask, deleteExistingTask } from '../redux/tasksSlice';
import { useNavigation, useRoute } from '@react-navigation/native';

const TasksScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('Due Date');

  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);

  useEffect(() => {
    dispatch(loadInitialTasks());

    if (route.params?.editTask) {
      setEditingTask(route.params.editTask);
      setShowForm(true);
    }
  }, [dispatch, route.params]);

  const sortedTasks = tasks.slice().sort((a, b) => {
    if (sortCriteria === 'Priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortCriteria === 'Due Date') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  const handleAddTask = (task) => {
    dispatch(addNewTask(task));
    setShowForm(false);
  };

  const handleUpdateTask = (task) => {
    dispatch(updateExistingTask(task));
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteExistingTask(taskId));
  };

  const handleViewTask = (task) => {
    navigation.navigate('TaskDetails', { task });
  };

  return (
    <View style={styles.container}>
      {showForm ? (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          initialData={editingTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      ) : (
        <>
          <Picker
            selectedValue={sortCriteria}
            onValueChange={(itemValue) => setSortCriteria(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Sort by Due Date" value="Due Date" />
            <Picker.Item label="Sort by Priority" value="Priority" />
          </Picker>
          <Button title="Add Task" onPress={() => setShowForm(true)} />
          <FlatList
            data={sortedTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onEdit={(task) => {
                  setEditingTask(task);
                  setShowForm(true);
                }}
                onDelete={() => handleDeleteTask(item.id)}
                onView={() => handleViewTask(item)}
              />
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  picker: { marginBottom: 10, padding: 8 },
});

export default TasksScreen;
