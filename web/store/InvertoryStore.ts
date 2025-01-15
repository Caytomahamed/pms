import { create } from 'zustand';
import { Inventory } from '@/types';

const BASE_URL = 'http://localhost:9000/api/v1/inventory';

interface InventoryStore {
  invertories: Inventory[];
  addError: string | null;
  updateError: string | null;
  deleteError: string | null;
  fetchData: () => Promise<void>;
  addInventory: (Inventory: Omit<Inventory, 'id'>) => Promise<void>;
  updateInventory: (id: number, updates: Partial<Inventory>) => Promise<void>;
  deleteInventory: (id: number) => Promise<void>;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  invertories: [],
  addError: null,
  updateError: null,
  deleteError: null,

  fetchData: async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch invertories');
      }
      const data: Inventory[] = await response.json().then((data) => data.data);
      set({ invertories: data });
    } catch (error) {
      console.error('Error fetching invertories:', error);
    }
  },

  addInventory: async (Inventory) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Inventory),
      });

      if (!response.ok) {
        throw new Error('Failed to add Inventory');
      }

      const newInventory: Inventory = await response
        .json()
        .then((data) => data.data);

      set((state) => ({ invertories: [...state.invertories, newInventory] }));

      set({ addError: null });
    } catch (error) {
      console.error('Error adding Inventory:', error);
      set({ addError: (error as Error).message });
    }
  },

  updateInventory: async (id, updates) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update inventory');
      }

      const updatedInventory = await response.json().then((data) => data.data);

      set((state) => ({
        invertories: state.invertories.map((item) =>
          item.id === id ? { ...item, ...updatedInventory } : item
        ),
        updateError: null,
      }));
    } catch (error) {
      console.error('Error updating inventory:', error);
      set({ updateError: (error as Error).message });
    }
  },

  deleteInventory: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete inventory');
      }

      set((state) => ({
        invertories: state.invertories.filter((item) => item.id !== id),
        deleteError: null,
      }));
    } catch (error) {
      console.error('Error deleting inventory:', error);
      set({ deleteError: (error as Error).message });
    }
  },
}));
