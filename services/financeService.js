import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCOUNTS_STORAGE_KEY = '@accounts';
const DEBTS_STORAGE_KEY = '@debts';
const INCOME_STORAGE_KEY = '@income';
const TRANSACTION_HISTORY_KEY = '@transactionHistory';

// ----------- Accounts Management -----------

// Save accounts to storage
export const saveAccounts = async (accounts) => {
  try {
    console.log('saveAccounts called with:', accounts);
    const accountsJsonValue = JSON.stringify(accounts);
    await AsyncStorage.setItem(ACCOUNTS_STORAGE_KEY, accountsJsonValue);
    console.log('Accounts saved successfully to AsyncStorage:', accounts);
  } catch (e) {
    console.error('Error saving accounts:', e);
  }
};

// Load accounts from storage
export const loadAccounts = async () => {
  try {
    console.log('loadAccounts called');
    const jsonValue = await AsyncStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (jsonValue != null) {
      const accounts = JSON.parse(jsonValue);
      if (Array.isArray(accounts)) {
        console.log('Accounts loaded successfully from AsyncStorage:', accounts);
        return accounts;
      } else {
        console.error('Invalid data format in storage: Expected an array.');
        return [];
      }
    }
    console.log('No accounts found in storage, returning empty array');
    return [];
  } catch (e) {
    console.error('Error loading accounts:', e);
    return [];
  }
};

// ----------- Debts Management -----------

// Save debts to storage
export const saveDebts = async (debts) => {
  try {
    console.log('saveDebts called with:', debts);
    const debtsJsonValue = JSON.stringify(debts);
    await AsyncStorage.setItem(DEBTS_STORAGE_KEY, debtsJsonValue);
    console.log('Debts saved successfully to AsyncStorage:', debts);
  } catch (e) {
    console.error('Error saving debts:', e);
  }
};

// Load debts from storage
export const loadDebts = async () => {
  try {
    console.log('loadDebts called');
    const jsonValue = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
    if (jsonValue != null) {
      const debts = JSON.parse(jsonValue);
      if (Array.isArray(debts)) {
        console.log('Debts loaded successfully from AsyncStorage:', debts);
        return debts;
      } else {
        console.error('Invalid data format in storage: Expected an array.');
        return [];
      }
    }
    console.log('No debts found in storage, returning empty array');
    return [];
  } catch (e) {
    console.error('Error loading debts:', e);
    return [];
  }
};

// Add a new debt
export const addDebt = async (debt) => {
  try {
    const debts = await loadDebts();
    const updatedDebts = [...debts, debt];
    await saveDebts(updatedDebts);
  } catch (e) {
    console.error('Error adding debt:', e);
  }
};

// Update an existing debt
export const updateDebt = async (updatedDebt) => {
  try {
    const debts = await loadDebts();
    const updatedDebts = debts.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt));
    await saveDebts(updatedDebts);
  } catch (e) {
    console.error('Error updating debt:', e);
  }
};

// Delete a debt
export const deleteDebt = async (debtId) => {
  try {
    const debts = await loadDebts();
    const updatedDebts = debts.filter((debt) => debt.id !== debtId);
    await saveDebts(updatedDebts);
  } catch (e) {
    console.error('Error deleting debt:', e);
  }
};

// ----------- Income Management -----------

// Save incomes to storage
export const saveIncome = async (income) => {
  try {
    console.log('saveIncome called with:', income);
    const incomeJsonValue = JSON.stringify(income);
    await AsyncStorage.setItem(INCOME_STORAGE_KEY, incomeJsonValue);
    console.log('Income saved successfully to AsyncStorage:', income);
  } catch (e) {
    console.error('Error saving income:', e);
  }
};

// Load incomes from storage
export const loadIncome = async () => {
  try {
    console.log('loadIncome called');
    const jsonValue = await AsyncStorage.getItem(INCOME_STORAGE_KEY);
    if (jsonValue != null) {
      const income = JSON.parse(jsonValue);
      if (Array.isArray(income)) {
        console.log('Income loaded successfully from AsyncStorage:', income);
        return income;
      } else {
        console.error('Invalid data format in storage: Expected an array.');
        return [];
      }
    }
    console.log('No income found in storage, returning empty array');
    return [];
  } catch (e) {
    console.error('Error loading income:', e);
    return [];
  }
};

// Add a new income stream
export const addIncome = async (incomeStream) => {
  try {
    const income = await loadIncome();
    const updatedIncome = [...income, incomeStream];
    await saveIncome(updatedIncome);
  } catch (e) {
    console.error('Error adding income:', e);
  }
};

// Update an existing income stream
export const updateIncome = async (updatedIncomeStream) => {
  try {
    const income = await loadIncome();
    const updatedIncome = income.map((stream) =>
      stream.id === updatedIncomeStream.id ? updatedIncomeStream : stream
    );
    await saveIncome(updatedIncome);
  } catch (e) {
    console.error('Error updating income:', e);
  }
};

// Delete an income stream
export const deleteIncome = async (incomeId) => {
  try {
    const income = await loadIncome();
    const updatedIncome = income.filter((stream) => stream.id !== incomeId);
    await saveIncome(updatedIncome);
  } catch (e) {
    console.error('Error deleting income:', e);
  }
};

// ----------- Transaction History Management -----------

// Save transaction history to storage
export const saveTransactionHistory = async (transactionHistory) => {
  try {
    console.log('saveTransactionHistory called with:', transactionHistory);
    const transactionHistoryJsonValue = JSON.stringify(transactionHistory);
    await AsyncStorage.setItem(TRANSACTION_HISTORY_KEY, transactionHistoryJsonValue);
    console.log('Transaction history saved successfully to AsyncStorage:', transactionHistory);
  } catch (e) {
    console.error('Error saving transaction history:', e);
  }
};

// Load transaction history from storage
export const loadTransactionHistory = async () => {
  try {
    console.log('loadTransactionHistory called');
    const jsonValue = await AsyncStorage.getItem(TRANSACTION_HISTORY_KEY);
    if (jsonValue != null) {
      const transactionHistory = JSON.parse(jsonValue);
      if (Array.isArray(transactionHistory)) {
        console.log('Transaction history loaded successfully from AsyncStorage:', transactionHistory);
        return transactionHistory;
      } else {
        console.error('Invalid data format in storage: Expected an array.');
        return [];
      }
    }
    console.log('No transaction history found in storage, returning empty array');
    return [];
  } catch (e) {
    console.error('Error loading transaction history:', e);
    return [];
  }
};

// Add a new transaction record to history
export const addTransactionRecord = async (transaction) => {
  try {
    const transactionHistory = await loadTransactionHistory();
    const updatedHistory = [...transactionHistory, transaction];
    await saveTransactionHistory(updatedHistory);
  } catch (e) {
    console.error('Error adding transaction record:', e);
  }
};

// ----------- Check and Process Due Transactions -----------
export const checkAndProcessDueTransactions = async () => {
  try {
    console.log('Checking and processing due transactions...');

    const accounts = await loadAccounts();
    const debts = await loadDebts();
    const incomes = await loadIncome();
    const currentDate = new Date();

    let updatedAccounts = [...accounts];
    let updatedDebts = [...debts];
    let updatedIncomes = [...incomes];

    // Process One-Time Debts
    updatedDebts = updatedDebts.filter((debt) => {
      if (debt.type === 'one-time' && new Date(debt.dueDate) <= currentDate) {
        const accountIndex = updatedAccounts.findIndex((account) => account.id === debt.accountId);
        if (accountIndex !== -1) {
          updatedAccounts[accountIndex].balance -= debt.amount;
          addTransactionRecord({ ...debt, transactionType: 'debt', executedAt: currentDate.toISOString() });
        }
        return false; // Remove this debt after processing
      }
      return true; // Keep it if not yet due
    });

    // Process Recurring Debts
    updatedDebts.forEach((debt) => {
      if (debt.type === 'recurring' && isDueForRecurring(debt, currentDate)) {
        const accountIndex = updatedAccounts.findIndex((account) => account.id === debt.accountId);
        if (accountIndex !== -1) {
          updatedAccounts[accountIndex].balance -= debt.amount;
          addTransactionRecord({ ...debt, transactionType: 'debt', executedAt: currentDate.toISOString() });
        }
      }
    });

    // Process One-Time Incomes
    updatedIncomes = updatedIncomes.filter((income) => {
      if (income.type === 'one-time' && new Date(income.dueDate) <= currentDate) {
        const accountIndex = updatedAccounts.findIndex((account) => account.id === income.accountId);
        if (accountIndex !== -1) {
          updatedAccounts[accountIndex].balance += income.amount;
          addTransactionRecord({ ...income, transactionType: 'income', executedAt: currentDate.toISOString() });
        }
        return false; // Remove this income after processing
      }
      return true; // Keep it if not yet due
    });

    // Process Recurring Incomes
    updatedIncomes.forEach((income) => {
      if (income.type === 'recurring' && isDueForRecurring(income, currentDate)) {
        const accountIndex = updatedAccounts.findIndex((account) => account.id === income.accountId);
        if (accountIndex !== -1) {
          updatedAccounts[accountIndex].balance += income.amount;
          addTransactionRecord({ ...income, transactionType: 'income', executedAt: currentDate.toISOString() });
        }
      }
    });

    // Save updated data
    await saveAccounts(updatedAccounts);
    await saveDebts(updatedDebts);
    await saveIncome(updatedIncomes);

    console.log('Due transactions processed successfully.');
  } catch (e) {
    console.error('Error checking and processing due transactions:', e);
  }
};

// Helper function to determine if a recurring debt/income is due
const isDueForRecurring = (transaction, currentDate) => {
  const recurringFrequency = transaction.recurringFrequency;

  if (recurringFrequency === 'weekly') {
    const recurringDay = transaction.recurringDay; // Sunday, Monday, etc.
    const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return recurringDay === dayOfWeek;
  }

  if (recurringFrequency === 'monthly') {
    return parseInt(transaction.recurringDayOfMonth) === currentDate.getDate();
  }

  if (recurringFrequency === 'yearly') {
    return parseInt(transaction.recurringDayOfMonth) === currentDate.getDate() &&
      parseInt(transaction.recurringMonth) === currentDate.getMonth() + 1;
  }

  return false;
};

// ----------- Clear All Data -----------

// Clear all accounts, debts, income, and transaction history data from storage
export const clearAllData = async () => {
  try {
    console.log('Clearing all data from storage');
    await AsyncStorage.removeItem(ACCOUNTS_STORAGE_KEY);
    await AsyncStorage.removeItem(DEBTS_STORAGE_KEY);
    await AsyncStorage.removeItem(INCOME_STORAGE_KEY);
    await AsyncStorage.removeItem(TRANSACTION_HISTORY_KEY);
    console.log('All data cleared successfully from storage');
  } catch (e) {
    console.error('Error clearing all data from storage:', e);
  }
};
