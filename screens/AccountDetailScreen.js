import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { loadTransactionHistory } from '../services/financeService';

const AccountDetailScreen = () => {
  const route = useRoute();
  const { account } = route.params;

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionHistory = await loadTransactionHistory();
      const filteredTransactions = transactionHistory.filter(
        (transaction) => transaction.accountId === account.id
      );
      setTransactions(filteredTransactions);
    };

    fetchTransactions();
  }, [account]);

  return (
    <View style={styles.container}>
      <Text style={styles.accountTitle}>{account.name}</Text>
      <Text style={styles.accountBalance}>Balance: ${account.balance.toFixed(2)}</Text>
      <Text style={styles.sectionTitle}>Transactions:</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>{item.transactionType === 'debt' ? 'Debt' : 'Income'} - {item.description}</Text>
            <Text>Amount: ${item.amount.toFixed(2)}</Text>
            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  accountTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  accountBalance: { fontSize: 18, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  transactionItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default AccountDetailScreen;
