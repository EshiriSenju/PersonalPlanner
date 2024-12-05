import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, FlatList, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {
  loadInitialData,
  updateDebt,
  deleteDebt,
  updateIncomeStream,
  deleteIncomeStream,
} from '../redux/debtsSlice';

const FilteredDebtIncomeScreen = () => {
  const [selectedType, setSelectedType] = useState('One-Time');
  const [showingData, setShowingData] = useState('Debts');

  const dispatch = useDispatch();
  const debts = useSelector((state) => state.debts.debts);
  const incomeStreams = useSelector((state) => state.debts.incomeStreams);

  useEffect(() => {
    dispatch(loadInitialData());
  }, [dispatch]);

  // Map the selected type to an index for SegmentedControl
  const getSelectedTypeIndex = () => {
    switch (selectedType) {
      case 'One-Time':
        return 0;
      case 'Recurring':
        return 1;
      case 'Manual':
        return 2;
      default:
        return 0;
    }
  };

  // Map the showing data to an index for SegmentedControl
  const getShowingDataIndex = () => {
    return showingData === 'Debts' ? 0 : 1;
  };

  // Filter debts and incomes based on the selected type
  const filteredDebts = debts.filter((debt) => debt.type === selectedType.toLowerCase());
  const filteredIncomes = incomeStreams.filter((income) => income.type === selectedType.toLowerCase());

  return (
    <View style={styles.container}>
      <SegmentedControl
        values={['One-Time', 'Recurring', 'Manual']}
        selectedIndex={getSelectedTypeIndex()}
        onChange={(event) => {
          setSelectedType(event.nativeEvent.value);
        }}
      />
      <SegmentedControl
        values={['Debts', 'Incomes']}
        selectedIndex={getShowingDataIndex()}
        onChange={(event) => {
          setShowingData(event.nativeEvent.value);
        }}
      />

      <FlatList
        data={showingData === 'Debts' ? filteredDebts : filteredIncomes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.description} - ${item.amount.toFixed(2)}</Text>
            <Text>Status: {item.status}</Text>
            <Button
              title="Edit"
              onPress={() => {
                if (showingData === 'Debts') {
                  dispatch(updateDebt(item));
                } else {
                  dispatch(updateIncomeStream(item));
                }
              }}
            />
            <Button
              title="Delete"
              onPress={() => {
                if (showingData === 'Debts') {
                  dispatch(deleteDebt(item.id));
                } else {
                  dispatch(deleteIncomeStream(item.id));
                }
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  item: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default FilteredDebtIncomeScreen;
