import { create } from 'zustand';
import { Productions } from '@/types';

const BASE_URL = 'http://localhost:9000/api/v1/productions';

export interface ProductionStatus {
  totalCartoon: number;
  totalTray: number;
  totalPiece: number;
  username: string;
  total: number;
  fill: string;
}

interface ProductionsStore {
  productions: Productions[];
  myProductions: Productions[];
  latestProductions: Productions[];
  statusProduction: ProductionStatus[];
  addError: string | null;
  updateError: string | null;
  deleteError: string | null;
  fetchData: () => Promise<void>;
  fetchMyData: (farmerId: number) => Promise<void>;
  fetchStatus: () => Promise<void>;
  fetchLastest: () => Promise<void>;
  addProduction: (production: Productions) => Promise<void>;
  updateProduction: (
    id: number,
    updates: Partial<Productions>
  ) => Promise<void>;
  deleteProduction: (id: number) => Promise<void>;
}

export const useProductionStore = create<ProductionsStore>((set) => ({
  productions: [],
  addError: null,
  updateError: null,
  deleteError: null,
  myProductions: [],
  latestProductions: [],
  statusProduction: [],

  fetchStatus: async () => {
    try {
      const response = await fetch(`${BASE_URL}/status`);
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch invertories');
      }
      const data: ProductionStatus[] = await response
        .json()
        .then((data) => data.data);
      set({ statusProduction: data });
    } catch (error) {
      console.error('Error fetching invertories:', error);
    }
  },

  fetchLastest: async () => {
    try {
      const response = await fetch(`${BASE_URL}/latest`);
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch invertories');
      }
      const data: Productions[] = await response
        .json()
        .then((data) => data.data);
      set({ latestProductions: data });
    } catch (error) {
      console.error('Error fetching invertories:', error);
    }
  },

  fetchData: async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch invertories');
      }
      const data: Productions[] = await response
        .json()
        .then((data) => data.data);
      set({ productions: data });
    } catch (error) {
      console.error('Error fetching invertories:', error);
    }
  },

  fetchMyData: async (farmerId) => {
    try {
      const response = await fetch(`${BASE_URL}/farm/${farmerId}`);
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch invertories');
      }
      const data: Productions[] = await response
        .json()
        .then((data) => data.data);
      set({ myProductions: data });
    } catch (error) {
      console.error('Error fetching invertories:', error);
    }
  },

  addProduction: async (Inventory) => {
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

      const newInventory: Productions = await response
        .json()
        .then((data) => data.data);

      set((state) => ({ productions: [...state.productions, newInventory] }));

      set({ addError: null });
    } catch (error) {
      console.error('Error adding Inventory:', error);
      set({ addError: (error as Error).message });
    }
  },

  updateProduction: async (id, updates) => {
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

      const updatedProduction = await response.json().then((data) => data.data);

      set((state) => ({
        productions: state.productions.map((item) =>
          item.id === id ? { ...item, ...updatedProduction } : item
        ),
        updateError: null,
      }));
    } catch (error) {
      console.error('Error updating inventory:', error);
      set({ updateError: (error as Error).message });
    }
  },

  deleteProduction: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete inventory');
      }

      set((state) => ({
        productions: state.productions.filter((item) => item.id !== id),
        deleteError: null,
      }));
    } catch (error) {
      console.error('Error deleting inventory:', error);
      set({ deleteError: (error as Error).message });
    }
  },
}));
