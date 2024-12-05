import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DebtList = ({ debts, onEdit, onDelete }) => {
  return (
    <View>
      {debts.map((debt) => (
        <View key={debt.id} style={styles.debtItem}>
          <Text>{debt.description} - ${debt.amount}</Text>
          <Text>Status: {debt.status}</Text>
          <Button title="Edit" onPress={() => onEdit(debt)} />
          <Button title="Delete" onPress={() => onDelete(debt.id)} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  debtItem: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default DebtList;
