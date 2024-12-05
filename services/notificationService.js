import * as Notifications from 'expo-notifications';

export const scheduleTaskReminder = async (task) => {
  const { title, dueDate, recurrence } = task;

  try {
    const trigger = new Date(dueDate);

    // Ensure the trigger date is in the future
    if (trigger > new Date()) {
      let notificationTrigger = {
        date: trigger,
        repeats: false,
      };

      // Setup recurrence
      if (recurrence === 'Daily') {
        // Trigger daily at the same time
        notificationTrigger = {
          hour: trigger.getHours(),
          minute: trigger.getMinutes(),
          repeats: true,
        };
      } else if (recurrence === 'Weekly') {
        // Trigger weekly on the same day and time
        notificationTrigger = {
          weekday: trigger.getDay() + 1, // getDay() returns 0 for Sunday, Expo uses 1-7
          hour: trigger.getHours(),
          minute: trigger.getMinutes(),
          repeats: true,
        };
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: `Don't forget to complete: ${title}`,
        },
        trigger: notificationTrigger,
      });
    }
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};
