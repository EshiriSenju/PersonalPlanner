import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './redux/tasksSlice';
import debtsReducer from './redux/debtsSlice';
import TasksScreen from './screens/TasksScreen';
import DebtScreen from './screens/DebtScreen';
import TaskDetailsScreen from './screens/TaskDetailsScreen';
import TaskStorageViewer from './components/TaskStorageViewer';
import ImagePreviewScreen from './screens/ImagePreviewScreen'; // New import
import MediaPreviewScreen from './screens/MediaPreviewScreen'; // New import
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { checkAndProcessDueTransactions } from './services/financeService'; // Import check function
import { useAppState } from '@react-native-community/hooks'; // Import App State Hook
import AccountDetailScreen from './screens/AccountDetailScreen'; // Import the new screen
import FilteredDebtIncomeScreen from './screens/FilteredDebtIncomeScreen'; // Import the filtered screen

// Configure the Redux store
const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    debts: debtsReducer,
  },
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Bottom Tab Navigator to include Tasks, Debts, Storage Viewer, and Filtered Debt/Income screens
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Tasks') {
            iconName = focused ? 'list-circle' : 'list-circle-outline';
          } else if (route.name === 'Debts') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Storage Viewer') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Filtered View') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Debts" component={DebtScreen} />
      <Tab.Screen name="Storage Viewer" component={TaskStorageViewer} />
      <Tab.Screen name="Filtered View" component={FilteredDebtIncomeScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  const appState = useAppState();

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      if (Constants.isDevice) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission for notifications is required to enable reminders.');
        }
      } else {
        alert('Notifications are not supported on this simulator.');
      }
    };

    requestPermissions();
  }, []);

  // Check and process due transactions on app load and resume
  useEffect(() => {
    const processDueTransactions = async () => {
      await checkAndProcessDueTransactions();
    };

    if (appState === 'active') {
      processDueTransactions();
    }
  }, [appState]);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ title: 'Task & Debt Manager' }}
          />
          <Stack.Screen
            name="TaskDetails"
            component={TaskDetailsScreen}
            options={{ title: 'Task Details' }}
          />
          <Stack.Screen
            name="ImagePreview"
            component={ImagePreviewScreen}
            options={{ title: 'Image Preview' }}
          />
          <Stack.Screen
            name="MediaPreview"
            component={MediaPreviewScreen}
            options={{ title: 'Media Preview' }}
          />
          <Stack.Screen
            name="AccountDetails"
            component={AccountDetailScreen}
            options={{ title: 'Account Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
