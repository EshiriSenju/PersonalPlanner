import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@tasks';

export const saveTasks = async (tasks) => {
  try {
    console.log('saveTasks called with:', tasks); // Log what is being saved
    if (!Array.isArray(tasks)) {
      throw new Error('Invalid data format: tasks should be an array.');
    }
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    console.log('Tasks saved successfully to AsyncStorage:', tasks);
  } catch (e) {
    console.error('Error saving tasks:', e);
  }
};

export const loadTasks = async () => {
  try {
    console.log('loadTasks called'); // Log whenever loadTasks is called
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      const tasks = JSON.parse(jsonValue);
      if (Array.isArray(tasks)) {
        //console.log('Tasks loaded successfully from AsyncStorage:', tasks);
        return tasks;
      } else {
        console.error('Invalid data format in storage: Expected an array.');
        return [];
      }
    }
    console.log('No tasks found in storage, returning empty array');
    return [];
  } catch (e) {
    console.error('Error loading tasks:', e);
    return [];
  }
};
