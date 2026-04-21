import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Worksheet } from '../../types';

interface SheetTabsProps {
  sheets: Worksheet[];
  activeSheetIndex: number;
  onSheetPress: (index: number) => void;
  onAddSheet: () => void;
}

export const SheetTabs: React.FC<SheetTabsProps> = ({
  sheets,
  activeSheetIndex,
  onSheetPress,
  onAddSheet,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sheets.map((sheet, index) => (
          <TouchableOpacity
            key={sheet.id}
            style={[
              styles.tab,
              index === activeSheetIndex && styles.activeTab,
            ]}
            onPress={() => onSheetPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                index === activeSheetIndex && styles.activeTabText,
              ]}
            >
              {sheet.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addTab} onPress={onAddSheet}>
          <Text style={styles.addTabText}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    height: 40,
  },
  tab: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#107c41',
  },
  tabText: {
    fontSize: 13,
    color: '#666666',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  addTab: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTabText: {
    fontSize: 20,
    color: '#107c41',
  },
});
