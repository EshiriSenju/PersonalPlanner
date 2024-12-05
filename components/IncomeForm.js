import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DatePickerModal } from 'react-native-paper-dates';

const IncomeForm = ({ onSubmit, accounts = [], onCancel, initialData }) => {
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState(initialData?.type || 'one-time'); // 'one-time', 'recurring', or 'manual'
  const [accountId, setAccountId] = useState(initialData?.accountId || (accounts.length > 0 ? accounts[0].id : ''));
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? new Date(initialData.dueDate) : new Date());
  const [recurringDay, setRecurringDay] = useState(initialData?.recurringDay || initialData?.recurringDayOfMonth || '');
  const [recurringMonth, setRecurringMonth] = useState(initialData?.recurringMonth || '');
  const [recurringFrequency, setRecurringFrequency] = useState(initialData?.recurringFrequency || 'monthly');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  // Update accountId when accounts array changes
  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts]);

  // Ensure proper loading of values during editing
  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'one-time');
      setRecurringFrequency(initialData.recurringFrequency || 'monthly');
      if (initialData.recurringDayOfMonth) {
        setRecurringDay(initialData.recurringDayOfMonth);
      }
      if (initialData.recurringDay) {
        setRecurringDay(initialData.recurringDay);
      }
      if (initialData.recurringMonth) {
        setRecurringMonth(initialData.recurringMonth);
      }
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!amount || !description || !accountId || (type === 'recurring' && !recurringFrequency)) {
      setValidationMessage('All fields are required. Please fill in every field.');
      return;
    }

    let newIncome = {
      id: initialData?.id || Date.now().toString(),
      amount: parseFloat(amount),
      description,
      type,
      accountId,
    };

    if (type === 'one-time') {
      newIncome.dueDate = dueDate.toISOString();
    } else if (type === 'recurring') {
      newIncome.recurringFrequency = recurringFrequency;
      if (recurringFrequency === 'weekly') {
        newIncome.recurringDay = recurringDay;
      } else if (recurringFrequency === 'monthly') {
        newIncome.recurringDayOfMonth = recurringDay;
      } else if (recurringFrequency === 'yearly') {
        newIncome.recurringMonth = recurringMonth;
        newIncome.recurringDayOfMonth = recurringDay;
      }
    }

    onSubmit(newIncome);
  };

  const handleDateConfirm = (params) => {
    setDueDate(params.date);
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      {validationMessage ? <Text style={styles.validationText}>{validationMessage}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          if (validationMessage) setValidationMessage('');
        }}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          if (validationMessage) setValidationMessage('');
        }}
      />
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => {
          setType(itemValue);
          if (validationMessage) setValidationMessage('');
        }}
        style={styles.picker}
      >
        <Picker.Item label="One-time" value="one-time" />
        <Picker.Item label="Recurring" value="recurring" />
        <Picker.Item label="Manual" value="manual" />
      </Picker>

      {type === 'one-time' && (
        <>
          <Button title={`Select Due Date: ${dueDate.toLocaleDateString()}`} onPress={() => setShowDatePicker(true)} />
          <DatePickerModal
            mode="single"
            visible={showDatePicker}
            onDismiss={() => setShowDatePicker(false)}
            date={dueDate}
            onConfirm={handleDateConfirm}
          />
        </>
      )}

      {type === 'recurring' && (
        <>
          <Picker
            selectedValue={recurringFrequency}
            onValueChange={(itemValue) => setRecurringFrequency(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Weekly" value="weekly" />
            <Picker.Item label="Monthly" value="monthly" />
            <Picker.Item label="Yearly" value="yearly" />
          </Picker>

          {recurringFrequency === 'weekly' && (
            <Picker
              selectedValue={recurringDay}
              onValueChange={(itemValue) => setRecurringDay(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Sunday" value="sunday" />
              <Picker.Item label="Monday" value="monday" />
              <Picker.Item label="Tuesday" value="tuesday" />
              <Picker.Item label="Wednesday" value="wednesday" />
              <Picker.Item label="Thursday" value="thursday" />
              <Picker.Item label="Friday" value="friday" />
              <Picker.Item label="Saturday" value="saturday" />
            </Picker>
          )}

          {recurringFrequency === 'monthly' && (
            <TextInput
              style={styles.input}
              placeholder="Day of Month (e.g., 15)"
              value={recurringDay}
              onChangeText={(text) => setRecurringDay(text)}
              keyboardType="numeric"
            />
          )}

          {recurringFrequency === 'yearly' && (
            <>
              <Picker
                selectedValue={recurringMonth}
                onValueChange={(itemValue) => setRecurringMonth(itemValue)}
                style={styles.picker}
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December',
                ].map((month, index) => (
                  <Picker.Item key={index} label={month} value={index + 1} />
                ))}
              </Picker>
              <TextInput
                style={styles.input}
                placeholder="Day of Month (e.g., 15)"
                value={recurringDay}
                onChangeText={(text) => setRecurringDay(text)}
                keyboardType="numeric"
              />
            </>
          )}
        </>
      )}

      <Picker
        selectedValue={accountId}
        onValueChange={(itemValue) => {
          setAccountId(itemValue);
          if (validationMessage) setValidationMessage('');
        }}
        style={styles.picker}
      >
        {accounts.map((account) => (
          <Picker.Item key={account.id} label={account.name} value={account.id} />
        ))}
      </Picker>
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onCancel} color="red" />
        <Button title="Save" onPress={handleSubmit} disabled={!accountId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10, padding: 8 },
  picker: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  validationText: { color: 'red', marginBottom: 10 },
});

export default IncomeForm;
