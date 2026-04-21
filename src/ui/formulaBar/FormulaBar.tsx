import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface FormulaBarProps {
  selectedCell: string | null;
  formula: string | null;
  onFormulaChange: (formula: string) => void;
}

export const FormulaBar: React.FC<FormulaBarProps> = ({
  selectedCell,
  formula,
  onFormulaChange,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [localFormula, setLocalFormula] = useState('');

  const handleFocus = () => {
    setEditMode(true);
    setLocalFormula(formula || '');
  };

  const handleBlur = () => {
    setEditMode(false);
    onFormulaChange(localFormula);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cellIndicator}>
        <Text style={styles.cellIndicatorText}>fx</Text>
      </View>
      <TextInput
        style={styles.input}
        value={editMode ? localFormula : (formula || '')}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Enter value or formula"
        placeholderTextColor="#999999"
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  cellIndicator: {
    width: 40,
    height: 36,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cellIndicatorText: {
    fontSize: 12,
    color: '#666666',
  },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 14,
  },
});
