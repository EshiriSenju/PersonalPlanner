import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

const TaskForm = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState(initialData?.priority || 'Medium');
  const [recurrence, setRecurrence] = useState(initialData?.recurrence || 'None');
  const [category, setCategory] = useState(initialData?.category || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? new Date(initialData.dueDate) : new Date());
  const [dueTime, setDueTime] = useState(initialData?.dueTime ? new Date(initialData.dueTime) : null);
  const [attachments, setAttachments] = useState(initialData?.attachments || []);
  const [subtasks, setSubtasks] = useState(initialData?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type !== 'cancel' && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newAttachment = {
          uri: asset.uri,
          name: asset.name || 'Unnamed file',
          mimeType: asset.mimeType || 'unknown',
        };
        setAttachments((prevAttachments) => [...prevAttachments, newAttachment]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks((prevSubtasks) => [
        ...prevSubtasks,
        { id: Date.now().toString(), title: newSubtaskTitle, completed: false },
      ]);
      setNewSubtaskTitle('');
    }
  };

  const handleDeleteSubtask = (subtaskId) => {
    setSubtasks((prevSubtasks) => prevSubtasks.filter((subtask) => subtask.id !== subtaskId));
  };

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({
        title,
        description,
        priority,
        recurrence,
        category,
        dueDate: dueDate.toISOString(),
        dueTime: dueTime ? dueTime.toISOString() : null,
        attachments,
        subtasks,
        id: initialData?.id || Date.now().toString(),
      });
    }
  };

  const handleDateConfirm = (params) => {
    const selectedDate = params.date;
    const today = new Date();
    // Ensure that only today or a future date can be selected
    if (selectedDate >= today.setHours(0, 0, 0, 0)) {
      setDueDate(selectedDate);
    } else {
      alert('Please select a future date.');
    }
    setShowDatePicker(false);
  };

  const handleTimeConfirm = (params) => {
    const updatedTime = new Date(dueDate);
    updatedTime.setHours(params.hours);
    updatedTime.setMinutes(params.minutes);

    const now = new Date();
    if (
      updatedTime > now ||
      updatedTime.toDateString() !== now.toDateString()
    ) {
      setDueTime(updatedTime);
    } else {
      alert('Please select a future time.');
    }
    setShowTimePicker(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Task Description"
            value={description}
            onChangeText={setDescription}
          />
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="High" value="High" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Low" value="Low" />
          </Picker>
          <Picker
            selectedValue={recurrence}
            onValueChange={(itemValue) => setRecurrence(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="None" value="None" />
            <Picker.Item label="Daily" value="Daily" />
            <Picker.Item label="Weekly" value="Weekly" />
          </Picker>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Personal" value="Personal" />
            <Picker.Item label="Bills" value="Bills" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {dueDate ? `Due Date: ${dueDate.toLocaleDateString()}` : 'Select Due Date'}
            </Text>
          </TouchableOpacity>
          <DatePickerModal
            visible={showDatePicker}
            onDismiss={() => setShowDatePicker(false)}
            date={dueDate}
            onConfirm={handleDateConfirm}
            mode="single"
            minimumDate={new Date()} // Disable past dates
          />
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {dueTime ? `Due Time: ${dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Select Due Time'}
            </Text>
          </TouchableOpacity>
          <TimePickerModal
            visible={showTimePicker}
            onDismiss={() => setShowTimePicker(false)}
            hours={dueTime ? dueTime.getHours() : 12}
            minutes={dueTime ? dueTime.getMinutes() : 0}
            onConfirm={handleTimeConfirm}
          />
          <TouchableOpacity onPress={handleAttachment} style={styles.attachmentButton}>
            <Text style={styles.attachmentText}>Attach image/file/video</Text>
          </TouchableOpacity>
          {attachments.length > 0 && (
            <View style={styles.attachmentPreview}>
              {attachments.map((attachment, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <Text style={styles.attachmentInfo}>Attached: {attachment.name}</Text>
                </View>
              ))}
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="New Subtask"
            value={newSubtaskTitle}
            onChangeText={setNewSubtaskTitle}
          />
          <Button title="Add Subtask" onPress={handleAddSubtask} />
          <View style={styles.subtaskList}>
            {subtasks.map((subtask) => (
              <View key={subtask.id} style={styles.subtaskItem}>
                <Text>{subtask.title}</Text>
                <Button title="Delete" onPress={() => handleDeleteSubtask(subtask.id)} />
              </View>
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: { padding: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10, padding: 8 },
  picker: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10 },
  dateButton: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  dateButtonText: { fontSize: 16, color: '#000' },
  attachmentButton: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  attachmentText: { fontSize: 16, color: '#000' },
  attachmentPreview: { marginBottom: 10, alignItems: 'center' },
  attachmentItem: { marginBottom: 10 },
  subtaskList: { marginBottom: 20 },
  subtaskItem: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#f00',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#00f',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default TaskForm;
