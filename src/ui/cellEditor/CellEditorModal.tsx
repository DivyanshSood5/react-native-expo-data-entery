import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { IconButton, Chip } from 'react-native-paper';
import { Cell as CellType, CellStyle } from '../../types';

interface CellEditorModalProps {
  visible: boolean;
  cell: CellType | null;
  onClose: () => void;
  onSave: (updates: Partial<CellType>) => void;
  onApplyStyle: (style: Partial<CellStyle>) => void;
}

export const CellEditorModal: React.FC<CellEditorModalProps> = ({
  visible,
  cell,
  onClose,
  onSave,
  onApplyStyle,
}) => {
  const [editValue, setEditValue] = useState(cell?.formattedValue || '');
  const [activeTab, setActiveTab] = useState<'value' | 'format' | 'validation'>('value');

  const style = cell?.style;

  const handleSave = () => {
    onSave({
      value: editValue === '' ? null : editValue,
      formattedValue: editValue,
    });
    onClose();
  };

  const toggleBold = () => {
    onApplyStyle({ bold: !style?.bold });
  };

  const toggleItalic = () => {
    onApplyStyle({ italic: !style?.italic });
  };

  const toggleUnderline = () => {
    onApplyStyle({ underline: !style?.underline });
  };

  const applyNumberFormat = (format: string) => {
    onApplyStyle({ numberFormat: format });
  };

  const applyAlignment = (align: CellStyle['horizontalAlign']) => {
    onApplyStyle({ horizontalAlign: align });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="close" onPress={onClose} />
          <Text style={styles.headerTitle}>Cell Editor</Text>
          <IconButton icon="check" onPress={handleSave} />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Chip
            mode={activeTab === 'value' ? 'flat' : 'outlined'}
            onPress={() => setActiveTab('value')}
          >
            Value
          </Chip>
          <Chip
            mode={activeTab === 'format' ? 'flat' : 'outlined'}
            onPress={() => setActiveTab('format')}
          >
            Format
          </Chip>
          <Chip
            mode={activeTab === 'validation' ? 'flat' : 'outlined'}
            onPress={() => setActiveTab('validation')}
          >
            Validation
          </Chip>
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          {activeTab === 'value' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cell Value</Text>
              <TextInput
                style={styles.input}
                value={editValue}
                onChangeText={setEditValue}
                placeholder="Enter value or formula (e.g., =SUM(A1:A10))"
                multiline
              />
            </View>
          )}

          {activeTab === 'format' && (
            <View>
              {/* Text Formatting */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Text Style</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.formatButton, style?.bold && styles.activeButton]}
                    onPress={toggleBold}
                  >
                    <Text style={styles.formatButtonText}>B</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formatButton, style?.italic && styles.activeButton]}
                    onPress={toggleItalic}
                  >
                    <Text style={[styles.formatButtonText, { fontStyle: 'italic' }]}>
                      I
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formatButton, style?.underline && styles.activeButton]}
                    onPress={toggleUnderline}
                  >
                    <Text style={[styles.formatButtonText, { textDecorationLine: 'underline' }]}>
                      U
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Alignment */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Alignment</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.formatButton, style?.horizontalAlign === 'left' && styles.activeButton]}
                    onPress={() => applyAlignment('left')}
                  >
                    <Text style={styles.formatButtonText}>L</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formatButton, style?.horizontalAlign === 'center' && styles.activeButton]}
                    onPress={() => applyAlignment('center')}
                  >
                    <Text style={styles.formatButtonText}>C</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formatButton, style?.horizontalAlign === 'right' && styles.activeButton]}
                    onPress={() => applyAlignment('right')}
                  >
                    <Text style={styles.formatButtonText}>R</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Number Format */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Number Format</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.formatButton, style?.numberFormat === 'general' && styles.activeButton]}
                    onPress={() => applyNumberFormat('general')}
                  >
                    <Text style={styles.formatButtonText}>123</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formatButton, style?.numberFormat === 'currency' && styles.activeButton]}
                    onPress={() => applyNumberFormat('currency')}
                  >
                    <Text style={styles.formatButtonText}>$</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formatButton, style?.numberFormat === 'percentage' && styles.activeButton]}
                    onPress={() => applyNumberFormat('percentage')}
                  >
                    <Text style={styles.formatButtonText}>%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formatButton, style?.numberFormat === 'date' && styles.activeButton]}
                    onPress={() => applyNumberFormat('date')}
                  >
                    <Text style={styles.formatButtonText}>Date</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Colors */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Colors</Text>
                <View style={styles.colorRow}>
                  <View style={styles.colorOption}>
                    <TouchableOpacity
                      style={[styles.colorButton, { backgroundColor: '#000000' }]}
                      onPress={() => onApplyStyle({ textColor: '#000000' })}
                    />
                    <Text style={styles.colorLabel}>Black</Text>
                  </View>
                  <View style={styles.colorOption}>
                    <TouchableOpacity
                      style={[styles.colorButton, { backgroundColor: '#FFFFFF', borderColor: '#ccc' }]}
                      onPress={() => onApplyStyle({ backgroundColor: '#FFFFFF' })}
                    />
                    <Text style={styles.colorLabel}>White</Text>
                  </View>
                  <View style={styles.colorOption}>
                    <TouchableOpacity
                      style={[styles.colorButton, { backgroundColor: '#FFD54F' }]}
                      onPress={() => onApplyStyle({ backgroundColor: '#FFD54F' })}
                    />
                    <Text style={styles.colorLabel}>Yellow</Text>
                  </View>
                  <View style={styles.colorOption}>
                    <TouchableOpacity
                      style={[styles.colorButton, { backgroundColor: '#66BB6A' }]}
                      onPress={() => onApplyStyle({ backgroundColor: '#66BB6A' })}
                    />
                    <Text style={styles.colorLabel}>Green</Text>
                  </View>
                  <View style={styles.colorOption}>
                    <TouchableOpacity
                      style={[styles.colorButton, { backgroundColor: '#42A5F5' }]}
                      onPress={() => onApplyStyle({ backgroundColor: '#42A5F5' })}
                    />
                    <Text style={styles.colorLabel}>Blue</Text>
                  </View>
                  <View style={styles.colorOption}>
                    <TouchableOpacity
                      style={[styles.colorButton, { backgroundColor: '#EF5350' }]}
                      onPress={() => onApplyStyle({ backgroundColor: '#EF5350' })}
                    />
                    <Text style={styles.colorLabel}>Red</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'validation' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Validation</Text>
              <Text style={styles.validationDescription}>
                Restrict what can be entered in this cell
              </Text>
              <View style={styles.validationOptions}>
                <TouchableOpacity
                  style={styles.validationOption}
                  onPress={() =>
                    onSave({
                      validation: {
                        type: 'list',
                        criteria: 'dropdown',
                        allowedValues: ['Yes', 'No', 'Maybe'],
                        showDropdown: true,
                      },
                    })
                  }
                >
                  <Text style={styles.validationOptionText}>Dropdown List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.validationOption}
                  onPress={() =>
                    onSave({
                      validation: {
                        type: 'whole',
                        criteria: 'between',
                        allowedValues: ['1', '100'],
                        showDropdown: false,
                      },
                    })
                  }
                >
                  <Text style={styles.validationOptionText}>Whole Number (1-100)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.validationOption}
                  onPress={() =>
                    onSave({
                      validation: null,
                    })
                  }
                >
                  <Text style={styles.validationOptionText}>Remove Validation</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#107c41',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  tabs: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  formatButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeButton: {
    backgroundColor: '#e8f5e9',
    borderColor: '#107c41',
  },
  formatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    alignItems: 'center',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  colorLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  validationDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  validationOptions: {
    gap: 8,
  },
  validationOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  validationOptionText: {
    fontSize: 14,
    color: '#333333',
  },
});
