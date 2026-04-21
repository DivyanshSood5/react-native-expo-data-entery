import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Cell as CellType } from '../../types';

interface CellProps {
  cellId: string;
  cellData: CellType | null;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

export const Cell: React.FC<CellProps> = ({
  cellId,
  cellData,
  isSelected,
  onPress,
  onLongPress,
}) => {
  const style = cellData?.style;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.cell,
        isSelected && styles.selectedCell,
        style && {
          backgroundColor: style.backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.cellText,
          style && {
            color: style.textColor,
            fontWeight: style.bold ? 'bold' : 'normal',
            fontStyle: style.italic ? 'italic' : 'normal',
            textDecorationLine: style.underline ? 'underline' : 'none',
            fontSize: style.fontSize,
            textAlign: style.horizontalAlign,
          },
        ]}
      >
        {cellData?.formattedValue || ''}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    minWidth: 80,
    height: 40,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  selectedCell: {
    borderColor: '#2196f3',
    borderWidth: 2,
  },
  cellText: {
    fontSize: 14,
    color: '#000000',
  },
});
