import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import { Header, IconButton } from 'react-native-paper';
import { useLocalParams, useRouter } from 'expo-router';
import { useWorkbookStore } from '../../src/store';
import { SpreadsheetGrid } from '../../src/ui/grid';
import { FormulaBar } from '../../src/ui/formulaBar';
import { SheetTabs } from '../../src/ui/sheetTabs';
import { Toolbar } from '../../src/ui/toolbar';
import { CellEditorModal } from '../../src/ui/cellEditor';
import { CellStyle } from '../../src/types';

export default function EditorScreen() {
  const { workbookId } = useLocalParams<{ workbookId: string }>();
  const router = useRouter();
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [showCellEditor, setShowCellEditor] = useState(false);

  const workbook = useWorkbookStore((s) => s.workbooks.get(workbookId));
  const setActiveSheet = useWorkbookStore((s) => s.setActiveSheet);
  const addSheet = useWorkbookStore((s) => s.addSheet);
  const setCellValue = useWorkbookStore((s) => s.setCellValue);
  const setCellFormula = useWorkbookStore((s) => s.setCellFormula);
  const setCellStyle = useWorkbookStore((s) => s.setCellStyle);

  const activeSheetIndex = workbook?.activeSheetIndex ?? 0;
  const activeSheet = workbook?.sheets[activeSheetIndex];
  const selectedCellData = selectedCell && activeSheet?.cells.get(selectedCell);
  const selectedCellStyle = selectedCellData?.style;

  const handleFormulaChange = (formula: string) => {
    if (!workbookId || !selectedCell) return;

    if (formula.startsWith('=')) {
      setCellFormula(workbookId, activeSheetIndex, selectedCell, formula);
    } else {
      setCellValue(workbookId, activeSheetIndex, selectedCell, formula || null);
    }
  };

  const currentFormula = selectedCell && activeSheet?.cells.get(selectedCell)?.formula;

  // Toolbar handlers
  const toggleBold = () => {
    if (!workbookId || !selectedCell) return;
    const current = selectedCellStyle?.bold ?? false;
    setCellStyle(workbookId, activeSheetIndex, selectedCell, { bold: !current });
  };

  const toggleItalic = () => {
    if (!workbookId || !selectedCell) return;
    const current = selectedCellStyle?.italic ?? false;
    setCellStyle(workbookId, activeSheetIndex, selectedCell, { italic: !current });
  };

  const toggleUnderline = () => {
    if (!workbookId || !selectedCell) return;
    const current = selectedCellStyle?.underline ?? false;
    setCellStyle(workbookId, activeSheetIndex, selectedCell, { underline: !current });
  };

  const handleAlignLeft = () => {
    if (!workbookId || !selectedCell) return;
    setCellStyle(workbookId, activeSheetIndex, selectedCell, { horizontalAlign: 'left' });
  };

  const handleAlignCenter = () => {
    if (!workbookId || !selectedCell) return;
    setCellStyle(workbookId, activeSheetIndex, selectedCell, { horizontalAlign: 'center' });
  };

  const handleAlignRight = () => {
    if (!workbookId || !selectedCell) return;
    setCellStyle(workbookId, activeSheetIndex, selectedCell, { horizontalAlign: 'right' });
  };

  const handleNumberFormat = () => {
    setShowCellEditor(true);
  };

  const handleBorders = () => {
    setShowCellEditor(true);
  };

  const handleCellLongPress = (cellId: string) => {
    setSelectedCell(cellId);
    setShowCellEditor(true);
  };

  const handleCellSave = (updates: any) => {
    if (!workbookId || !selectedCell) return;
    if (updates.value !== undefined || updates.formattedValue !== undefined) {
      setCellValue(workbookId, activeSheetIndex, selectedCell, updates.value);
    }
    if (updates.validation !== undefined) {
      // Store validation in cell
    }
  };

  const handleApplyStyle = (style: Partial<CellStyle>) => {
    if (!workbookId || !selectedCell) return;
    setCellStyle(workbookId, activeSheetIndex, selectedCell, style);
  };

  if (!workbook || !activeSheet) {
    return (
      <View style={styles.container}>
        <Text>Workbook not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#107c41" />
      <Header
        left={() => (
          <IconButton icon="arrow-left" onPress={() => router.back()} />
        )}
        title={workbook.name}
        right={() => (
          <>
            <IconButton icon="format-paint" onPress={() => setShowCellEditor(true)} />
            <IconButton icon="share-variant" onPress={() => {}} />
          </>
        )}
        style={styles.header}
        textStyle={styles.headerTitle}
      />
      <FormulaBar
        selectedCell={selectedCell}
        formula={currentFormula}
        onFormulaChange={handleFormulaChange}
      />
      <Toolbar
        onBold={toggleBold}
        onItalic={toggleItalic}
        onUnderline={toggleUnderline}
        onTextColor={() => setShowCellEditor(true)}
        onBgColor={() => setShowCellEditor(true)}
        onAlignLeft={handleAlignLeft}
        onAlignCenter={handleAlignCenter}
        onAlignRight={handleAlignRight}
        onNumberFormat={handleNumberFormat}
        onBorders={handleBorders}
        currentStyle={selectedCellStyle}
      />
      <SpreadsheetGrid
        sheet={activeSheet}
        selectedCell={selectedCell}
        onCellPress={setSelectedCell}
        onCellLongPress={handleCellLongPress}
      />
      <SheetTabs
        sheets={workbook.sheets}
        activeSheetIndex={activeSheetIndex}
        onSheetPress={(index) => setActiveSheet(workbookId, index)}
        onAddSheet={() => addSheet(workbookId)}
      />
      <CellEditorModal
        visible={showCellEditor}
        cell={selectedCellData || null}
        onClose={() => setShowCellEditor(false)}
        onSave={handleCellSave}
        onApplyStyle={handleApplyStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#107c41',
  },
  headerTitle: {
    color: '#ffffff',
  },
});
