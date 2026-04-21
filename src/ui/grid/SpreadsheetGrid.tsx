import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Worksheet } from '../../types';
import { Cell } from './Cell';
import { colToLetter } from '../../core/formula';

interface SpreadsheetGridProps {
  sheet: Worksheet;
  selectedCell: string | null;
  onCellPress: (cellId: string) => void;
  onCellLongPress: (cellId: string) => void;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  sheet,
  selectedCell,
  onCellPress,
  onCellLongPress,
}) => {
  const maxColumns = 26; // A-Z
  const maxRows = 100;

  const columnHeaders = useMemo(() => {
    return Array.from({ length: maxColumns }, (_, i) => colToLetter(i + 1));
  }, []);

  const rowNumbers = useMemo(() => {
    return Array.from({ length: maxRows }, (_, i) => i + 1);
  }, []);

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <View style={styles.cornerCell} />
      {columnHeaders.map((col) => (
        <View key={col} style={styles.columnHeader}>
          <Text style={styles.columnHeaderText}>{col}</Text>
        </View>
      ))}
    </View>
  );

  const renderRow = ({ item: rowIndex }: { item: number }) => (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowHeaderText}>{rowIndex}</Text>
      </View>
      {columnHeaders.map((col) => {
        const cellId = col + rowIndex;
        const cellData = sheet.cells.get(cellId) || null;
        return (
          <Cell
            key={cellId}
            cellId={cellId}
            cellData={cellData}
            isSelected={selectedCell === cellId}
            onPress={() => onCellPress(cellId)}
            onLongPress={() => onCellLongPress(cellId)}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={rowNumbers}
        renderItem={renderRow}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
  },
  cornerCell: {
    width: 50,
    height: 40,
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
  },
  columnHeader: {
    flex: 1,
    minWidth: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  columnHeaderText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  rowHeader: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRightWidth: 2,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  rowHeaderText: {
    fontSize: 12,
    color: '#666666',
  },
});
