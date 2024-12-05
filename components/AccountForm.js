import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

const AccountForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Account name cannot be empty');
      return;
    }

    if (!balance.trim() || isNaN(balance)) {
      Alert.alert('Validation Error', 'Please enter a valid numeric value for balance');
      return;
    }

    const newAccount = {
      id: Date.now().toString(),
      name,
      balance: parseFloat(balance),
    };
    console.log('Attempting to submit account:', newAccount);

    // Call the onSubmit function passed from parent
    onSubmit(newAccount);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Account Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Initial Balance"
        value={balance}
        onChangeText={setBalance}
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onCancel} color="red" />
        <Button title="Save" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10, padding: 8 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});

export default AccountForm;
