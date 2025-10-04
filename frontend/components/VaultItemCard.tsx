import React from 'react';
import { VaultItem } from '../types';

export default function VaultItemCard({ item, onEdit, onDelete, onCopy }: { item: VaultItem; onEdit: (id: string) => void; onDelete: (id: string) => void; onCopy: (text: string) => void }) {
  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex justify-between">
        <h3 className="font-medium">{item.title}</h3>
        <div className="space-x-2">
          <button onClick={() => onEdit(item._id)} className="text-sm text-blue-600">Edit</button>
          <button onClick={() => onDelete(item._id)} className="text-sm text-red-600">Delete</button>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-700">
        <div>Username: {item.username}</div>
        <div className="flex items-center">Password: <code className="ml-2">{item.password}</code>
          <button onClick={() => onCopy(item.password)} className="ml-2 text-xs text-gray-600">Copy</button>
        </div>
        <div>URL: {item.url}</div>
        <div>Notes: {item.notes}</div>
      </div>
    </div>
  );
}
