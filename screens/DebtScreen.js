import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, FlatList, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DebtForm from '../components/DebtForm';
import IncomeForm from '../components/IncomeForm';
import AccountForm from '../components/AccountForm';
import { addDebt, updateDebt, deleteDebt, addAccount, addIncomeStream, updateIncomeStream, deleteIncomeStream, loadInitialData } from '../redux/debtsSlice';

const DebtScreen = () => {
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);

  const dispatch = useDispatch();
  const debts = useSelector((state) => state.debts.debts);
  const accounts = useSelector((state) => state.debts.accounts);
  const incomeStreams = useSelector((state) => state.debts.incomeStreams);

  useEffect(() => {
    dispatch(loadInitialData());
  }, [dispatch]);

  const handleAddDebt = (debt) => {
    if (editingDebt) {
      dispatch(updateDebt(debt));
    } else {
      dispatch(addDebt(debt));
    }
    setShowDebtForm(false);
    setEditingDebt(null);
  };

  const handleDeleteDebt = (debtId) => {
    dispatch(deleteDebt(debtId));
  };

  const handleaddIncomeStream = (incomeStream) => {
    if (editingIncome) {
      dispatch(updateIncomeStream(incomeStream));
    } else {
      dispatch(addIncomeStream(incomeStream));
    }
    setShowIncomeForm(false);
    setEditingIncome(null);
  };

  const handledeleteIncomeStream = (incomeId) => {
    dispatch(deleteIncomeStream(incomeId));
  };

  const handleAddAccount = (account) => {
    dispatch(addAccount(account));
    setShowAccountForm(false);
  };

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.totalBalanceContainer}>
        <Text style={styles.totalBalanceText}>Total Balance: ${totalBalance.toFixed(2)}</Text>
      </View>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.accountItem}>
            <Text>{item.name} - ${item.balance.toFixed(2)}</Text>
          </View>
        )}
      />
      <Button title="Add Account" onPress={() => setShowAccountForm(true)} />
      <Button title="Add Debt" onPress={() => setShowDebtForm(true)} />
      <Button title="Add Income" onPress={() => setShowIncomeForm(true)} />
    </View>
  );

  return (
    <View style={styles.container}>
      {showDebtForm ? (
        <DebtForm
          onSubmit={handleAddDebt}
          accounts={accounts}
          onCancel={() => {
            setShowDebtForm(false);
            setEditingDebt(null);
          }}
          initialData={editingDebt} // Pass initial data when editing
        />
      ) : showIncomeForm ? (
        <IncomeForm
          onSubmit={handleaddIncomeStream}
          accounts={accounts}
          onCancel={() => {
            setShowIncomeForm(false);
            setEditingIncome(null);
          }}
          initialData={editingIncome} // Pass initial data when editing
        />
      ) : showAccountForm ? (
        <AccountForm
          onSubmit={handleAddAccount}
          onCancel={() => {
            setShowAccountForm(false);
          }}
        />
      ) : (
        <>
          <FlatList
            data={debts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.debtItem}>
                <Text>{item.description} - ${item.amount.toFixed(2)}</Text>
                <Text>Status: {item.status}</Text>
                <Button
                  title="Edit"
                  onPress={() => {
                    setEditingDebt(item);
                    setShowDebtForm(true);
                  }}
                />
                <Button title="Delete" onPress={() => handleDeleteDebt(item.id)} />
              </View>
            )}
            ListHeaderComponent={renderHeader}
          />
          <FlatList
            data={incomeStreams}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.debtItem}>
                <Text>{item.description} - ${item.amount.toFixed(2)}</Text>
                <Text>Status: {item.status}</Text>
                <Button
                  title="Edit"
                  onPress={() => {
                    setEditingIncome(item);
                    setShowIncomeForm(true);
                  }}
                />
                <Button title="Delete" onPress={() => handledeleteIncomeStream(item.id)} />
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  headerContainer: {
    paddingBottom: 20,
  },
  totalBalanceContainer: {
    padding: 15,
    backgroundColor: '#d1e7dd',
    borderRadius: 10,
    marginBottom: 10,
  },
  totalBalanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f5132',
    textAlign: 'center',
  },
  accountItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  debtItem: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default DebtScreen;
