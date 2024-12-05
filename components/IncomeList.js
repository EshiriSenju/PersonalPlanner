import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const IncomeList = ({ incomeStreams, onEdit, onDelete }) => {
  return (
    <View>
      {incomeStreams.map((income) => (
        <View key={income.id} style={styles.incomeItem}>
          <Text>{income.description} - ${income.amount}</Text>
          <Button title="Edit" onPress={() => onEdit(income)} />
          <Button title="Delete" onPress={() => onDelete(income.id)} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  incomeItem: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default IncomeList;
