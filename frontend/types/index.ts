export interface VaultItem {
  _id: string;
  userId: string;
  title: string;
  username?: string;
  password: string; // encrypted string
  url?: string;
  notes?: string;
  createdAt: string;
}
