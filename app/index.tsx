import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Button, FAB, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useWorkbookStore, useFolderStore } from '../src/store';
import { createEmptyWorkbook } from '../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const workbooks = useWorkbookStore((s) => Array.from(s.workbooks.values()));
  const folders = useFolderStore((s) => s.folders);
  const addWorkbook = useWorkbookStore((s) => s.addWorkbook);
  const setActiveWorkbook = useWorkbookStore((s) => s.setActiveWorkbook);
  const addFolder = useFolderStore((s) => s.addFolder);

  const handleCreateWorkbook = () => {
    const workbook = addWorkbook(createEmptyWorkbook('Untitled Workbook'));
    router.push(`/editor/${workbook.id}`);
  };

  const handleOpenWorkbook = (workbookId: string) => {
    setActiveWorkbook(workbookId);
    router.push(`/editor/${workbookId}`);
  };

  const handleDeleteWorkbook = (workbookId: string) => {
    Alert.alert(
      'Delete Workbook',
      'Are you sure you want to delete this workbook?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Delete logic here
          },
        },
      ]
    );
  };

  const handleCreateFolder = () => {
    addFolder('New Folder');
  };

  const renderWorkbook = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => handleOpenWorkbook(item.id)}
      onLongPress={() => handleDeleteWorkbook(item.id)}
    >
      <View style={styles.fileIcon}>
        <Text style={styles.fileIconText}>📊</Text>
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileDate}>
          {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Workbooks</Text>
      </View>

      {folders.length > 0 && (
        <View style={styles.folderSection}>
          <Text style={styles.sectionTitle}>Folders</Text>
          {folders.map((folder) => (
            <Chip key={folder.id} icon="folder">
              {folder.name}
            </Chip>
          ))}
        </View>
      )}

      <FlatList
        data={workbooks}
        renderItem={renderWorkbook}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No workbooks yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first workbook to get started
            </Text>
          </View>
        }
      />

      <FAB icon="plus" style={styles.fab} onPress={handleCreateWorkbook} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#107c41',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  folderSection: {
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileIconText: {
    fontSize: 24,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  fileDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#107c41',
  },
});
