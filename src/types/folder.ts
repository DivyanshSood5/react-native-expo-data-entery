export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

export function createFolder(name: string): Folder {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    name,
    createdAt: new Date(),
  };
}
