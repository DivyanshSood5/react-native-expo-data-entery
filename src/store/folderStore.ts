import { create } from 'zustand';
import { Folder, createFolder } from '../types';

interface FolderStore {
  folders: Folder[];

  addFolder: (name: string) => Folder;
  removeFolder: (id: string) => void;
  renameFolder: (id: string, name: string) => void;
  getFolder: (id: string) => Folder | undefined;
}

export const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],

  addFolder: (name) => {
    const folder = createFolder(name);
    set((state) => ({ folders: [...state.folders, folder] }));
    return folder;
  },

  removeFolder: (id) => {
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
    }));
  },

  renameFolder: (id, name) => {
    set((state) => ({
      folders: state.folders.map((f) =>
        f.id === id ? { ...f, name } : f
      ),
    }));
  },

  getFolder: (id) => {
    return get().folders.find((f) => f.id === id);
  },
}));
