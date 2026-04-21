import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Cell as CellType } from '../../types';
import { conditionalFormattingEngine } from '../../core/conditionalFormatting';

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
  const borders = style?.borders;

  // Apply conditional formatting
  let conditionalFormat = {};
  if (cellData) {
    conditionalFormat = conditionalFormattingEngine.applyConditionalFormatting(cellData, cellId);
  }

  const getBorderWidth = (border: any) => {
    if (!border || border.style === 'none') return 0;
    return 1;
  };

  const getBorderColor = (border: any) => {
    return border?.color || '#e0e0e0';
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.cell,
        {
          borderLeftWidth: getBorderWidth(borders?.left),
          borderRightWidth: getBorderWidth(borders?.right),
          borderTopWidth: getBorderWidth(borders?.top),
          borderBottomWidth: getBorderWidth(borders?.bottom),
          borderLeftColor: getBorderColor(borders?.left),
          borderRightColor: getBorderColor(borders?.right),
          borderTopColor: getBorderColor(borders?.top),
          borderBottomColor: getBorderColor(borders?.bottom),
        },
        isSelected && styles.selectedCell,
        style && {
          backgroundColor: conditionalFormat.backgroundColor || style.backgroundColor,
        },
        conditionalFormat.backgroundColor && {
          backgroundColor: conditionalFormat.backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.cellText,
          style && {
            color: conditionalFormat.textColor || style.textColor,
            fontWeight: conditionalFormat.bold ? 'bold' : style.bold ? 'bold' : 'normal',
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
