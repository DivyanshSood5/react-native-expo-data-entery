import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onTextColor: () => void;
  onBgColor: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onNumberFormat: () => void;
  onBorders: () => void;
  currentStyle?: any;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onBold,
  onItalic,
  onUnderline,
  onTextColor,
  onBgColor,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onNumberFormat,
  onBorders,
  currentStyle,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {/* Text formatting */}
      <TouchableOpacity
        style={[styles.button, currentStyle?.bold && styles.activeButton]}
        onPress={onBold}
      >
        <Text style={styles.buttonText}>B</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, currentStyle?.italic && styles.activeButton]}
        onPress={onItalic}
      >
        <Text style={[styles.buttonText, { fontStyle: 'italic' }]}>I</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, currentStyle?.underline && styles.activeButton]}
        onPress={onUnderline}
      >
        <Text style={[styles.buttonText, { textDecorationLine: 'underline' }]}>
          U
        </Text>
      </TouchableOpacity>

      {/* Colors */}
      <IconButton
        icon="palette"
        size={20}
        onPress={onTextColor}
        iconColor={currentStyle?.textColor || '#000000'}
      />

      <IconButton
        icon="content-paste"
        size={20}
        onPress={onBgColor}
        iconColor={currentStyle?.backgroundColor || '#FFFFFF'}
      />

      {/* Alignment */}
      <IconButton
        icon="format-align-left"
        size={20}
        onPress={onAlignLeft}
        disabled={currentStyle?.horizontalAlign !== 'left'}
      />

      <IconButton
        icon="format-align-center"
        size={20}
        onPress={onAlignCenter}
        disabled={currentStyle?.horizontalAlign !== 'center'}
      />

      <IconButton
        icon="format-align-right"
        size={20}
        onPress={onAlignRight}
        disabled={currentStyle?.horizontalAlign !== 'right'}
      />

      {/* Number format */}
      <TouchableOpacity style={styles.button} onPress={onNumberFormat}>
        <Text style={styles.buttonText}>123</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onNumberFormat}>
        <Text style={styles.buttonText}>$</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onNumberFormat}>
        <Text style={styles.buttonText}>%</Text>
      </TouchableOpacity>

      {/* Borders */}
      <IconButton icon="border-all" size={20} onPress={onBorders} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    height: 50,
    alignItems: 'center',
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 4,
  },
  activeButton: {
    backgroundColor: '#e3f2fd',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
});
