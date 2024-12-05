import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveTasks, loadTasks } from '../services/storageService';
import { scheduleTaskReminder } from '../services/notificationService';

// Initial State
const initialState = {
  tasks: [],
  isLoading: false,
  hasLoaded: false, // Track if initial load is done
};

// Load initial tasks from local storage
export const loadInitialTasks = createAsyncThunk('tasks/loadInitialTasks', async () => {
  try {
    const tasks = await loadTasks();
    return tasks;
  } catch (error) {
    console.error('Error loading initial tasks:', error);
    return [];
  }
});

// Slice Definition
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action) {
      state.tasks.push(action.payload);
    },
    updateTask(state, action) {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadInitialTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
      state.isLoading = false;
      state.hasLoaded = true;
    });
    builder.addCase(loadInitialTasks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadInitialTasks.rejected, (state) => {
      state.isLoading = false;
      state.hasLoaded = true;
    });
  },
});

export const { addTask, updateTask, deleteTask } = tasksSlice.actions;

// Thunks for managing tasks and updating AsyncStorage
export const addNewTask = (task) => async (dispatch, getState) => {
  console.log('Creation begins');
  dispatch(addTask(task));
  try {
    // Wait for state to update before saving
    const tasks = getState().tasks.tasks;
    console.log('Saving tasks to storage after adding:', tasks);
    await saveTasks(tasks);
    console.log('Task successfully saved to storage after adding');
    await scheduleTaskReminder(task);
  } catch (error) {
    console.error('Error saving new task to storage:', error);
  }
};

export const updateExistingTask = (task) => async (dispatch, getState) => {
  console.log('Update begins');
  dispatch(updateTask(task));
  try {
    // Wait for state to update before saving
    const tasks = getState().tasks.tasks;
    console.log('Saving tasks to storage after updating:', tasks);
    await saveTasks(tasks);
    console.log('Task successfully updated in storage');
    await scheduleTaskReminder(task); // Reschedule reminder
  } catch (error) {
    console.error('Error updating task in storage:', error);
  }
};

export const deleteExistingTask = (taskId) => async (dispatch, getState) => {
  console.log('Deletion begins');
  dispatch(deleteTask(taskId));
  try {
    // Wait for state to update before saving
    const tasks = getState().tasks.tasks;
    console.log('Saving tasks to storage after deleting:', tasks);
    await saveTasks(tasks);
    console.log('Task successfully deleted from storage');
  } catch (error) {
    console.error('Error deleting task from storage:', error);
  }
};

export default tasksSlice.reducer;
