import { createSlice } from '@reduxjs/toolkit';
import {
  saveAccounts,
  loadAccounts,
  saveDebts,
  loadDebts,
  saveIncome,
  loadIncome,
  saveTransactionHistory,
  loadTransactionHistory,
  addTransactionRecord,
} from '../services/financeService';

const initialState = {
  accounts: [],
  debts: [],
  incomeStreams: [],
  transactionHistory: [],
  loading: true,
};

const debtsSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    setAccounts(state, action) {
      console.log('Setting accounts:', action.payload);
      state.accounts = action.payload;
      state.loading = false;
    },
    setDebts(state, action) {
      console.log('Setting debts:', action.payload);
      state.debts = action.payload;
      state.loading = false;
    },
    setIncomeStreams(state, action) {
      console.log('Setting income streams:', action.payload);
      state.incomeStreams = action.payload;
      state.loading = false;
    },
    setTransactionHistory(state, action) {
      console.log('Setting transaction history:', action.payload);
      state.transactionHistory = action.payload;
      state.loading = false;
    },
    addAccount(state, action) {
      console.log('Adding new account:', action.payload);
      state.accounts.push(action.payload);
      saveAccounts([...state.accounts])
        .then(() => console.log('Accounts saved successfully after adding new account:', state.accounts))
        .catch((error) => console.error('Error saving accounts after adding new account:', error));
    },
    addDebt(state, action) {
      console.log('Adding new debt:', action.payload);
      state.debts.push(action.payload);
      saveDebts([...state.debts])
        .then(() => console.log('Debts saved successfully after adding new debt:', state.debts))
        .catch((error) => console.error('Error saving debts after adding new debt:', error));
    },
    deleteDebt(state, action) {
      console.log('Deleting debt with ID:', action.payload);
      const deletedDebt = state.debts.find((debt) => debt.id === action.payload);
      state.debts = state.debts.filter((debt) => debt.id !== action.payload);
      saveDebts([...state.debts])
        .then(() => {
          console.log('Debts saved successfully after deleting debt:', state.debts);
          if (deletedDebt) {
            // Add to transaction history
            const transaction = {
              id: `transaction-${Date.now()}`,
              type: 'debt-deletion',
              amount: deletedDebt.amount,
              description: deletedDebt.description,
              date: new Date().toISOString(),
              linkedAccountId: deletedDebt.accountId,
            };
            addTransactionRecord(transaction);
          }
        })
        .catch((error) => console.error('Error saving debts after deleting debt:', error));
    },
    addIncomeStream(state, action) {
      console.log('Adding new income stream:', action.payload);
      state.incomeStreams.push(action.payload);
      saveIncome([...state.incomeStreams])
        .then(() => console.log('Income streams saved successfully after adding new income stream:', state.incomeStreams))
        .catch((error) => console.error('Error saving income streams after adding new income stream:', error));
    },
    updateDebt(state, action) {
      console.log('Updating debt:', action.payload);
      const index = state.debts.findIndex((debt) => debt.id === action.payload.id);
      if (index !== -1) {
        state.debts[index] = action.payload;
        saveDebts([...state.debts])
          .then(() => console.log('Debts saved successfully after updating debt:', state.debts))
          .catch((error) => console.error('Error saving debts after updating:', error));
      } else {
        console.error(`Debt with ID ${action.payload.id} not found for update.`);
      }
    },
    updateIncomeStream(state, action) {
      console.log('Updating income stream:', action.payload);
      const index = state.incomeStreams.findIndex((stream) => stream.id === action.payload.id);
      if (index !== -1) {
        state.incomeStreams[index] = action.payload;
        saveIncome([...state.incomeStreams])
          .then(() => console.log('Income streams saved successfully after updating:', state.incomeStreams))
          .catch((error) => console.error('Error saving income streams after updating:', error));
      } else {
        console.error(`Income stream with ID ${action.payload.id} not found for update.`);
      }
    },
    deleteIncomeStream(state, action) {
      console.log('Deleting income stream with ID:', action.payload);
      const deletedIncome = state.incomeStreams.find((stream) => stream.id === action.payload);
      state.incomeStreams = state.incomeStreams.filter((stream) => stream.id !== action.payload);
      saveIncome([...state.incomeStreams])
        .then(() => {
          console.log('Income streams saved successfully after deleting:', state.incomeStreams);
          if (deletedIncome) {
            // Add to transaction history
            const transaction = {
              id: `transaction-${Date.now()}`,
              type: 'income-deletion',
              amount: deletedIncome.amount,
              description: deletedIncome.description,
              date: new Date().toISOString(),
              linkedAccountId: deletedIncome.accountId,
            };
            addTransactionRecord(transaction);
          }
        })
        .catch((error) => console.error('Error saving income streams after deleting:', error));
    },
  },
});

export const {
  setAccounts,
  setDebts,
  setIncomeStreams,
  setTransactionHistory,
  addAccount,
  addDebt,
  deleteDebt,
  addIncomeStream,
  updateDebt,
  updateIncomeStream,
  deleteIncomeStream,
} = debtsSlice.actions;

// Load initial data from storage
export const loadInitialData = () => async (dispatch) => {
  try {
    console.log('Loading initial data from storage...');
    const accountsData = await loadAccounts();
    const debtsData = await loadDebts();
    const incomeData = await loadIncome();
    const transactionHistoryData = await loadTransactionHistory();
    console.log('Loaded data from storage:', { accountsData, debtsData, incomeData, transactionHistoryData });
    dispatch(setAccounts(accountsData));
    dispatch(setDebts(debtsData));
    dispatch(setIncomeStreams(incomeData));
    dispatch(setTransactionHistory(transactionHistoryData));
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

export default debtsSlice.reducer;
