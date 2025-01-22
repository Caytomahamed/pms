// Store
import { create } from 'zustand';
import { Replacement } from '@/types';

const BASE_URL = 'http://localhost:9000/api/v1/replacements';

interface ReplacementStore {
  replacements: Replacement[];
  addError: string | null;
  updateError: string | null;
  deleteError: string | null;
  myReplacements: Replacement[];
  fetchData: () => Promise<void>;
  fetchMyData: (farmerId: number) => Promise<void>;
  addReplacement: (replacement: Omit<Replacement, 'id'>) => Promise<void>;
  updateReplacement: (
    id: number,
    updates: Partial<Replacement>
  ) => Promise<void>;
  updateMyReplacement: (
    id: number,
    updates: Partial<Replacement>
  ) => Promise<void>;
  deleteReplacement: (id: number) => Promise<void>;
}

export const useReplacementStore = create<ReplacementStore>((set) => ({ 
  replacements: [],
  addError: null,
  updateError: null,
  deleteError: null,
  myReplacements: [],

  fetchData: async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch replacements');
      }
      const data: Replacement[] = await response
        .json()
        .then((data) => data.data);
      set({ replacements: data });
    } catch (error) {
      console.error('Error fetching replacements:', error);
    }
  },

  fetchMyData: async (farmerId) => {
    try {
      const response = await fetch(`${BASE_URL}/farmer/${farmerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch replacements');
      }
      const data: Replacement[] = await response
        .json()
        .then((data) => data.data);
      set({ myReplacements: data });
    } catch (error) {
      console.error('Error fetching replacements:', error);
    }
  },

  addReplacement: async (replacement) => {
    try {
      const { image, ...replacementData } = replacement; // Destructure to separate the image file from other data

      const formData = new FormData();
      formData.append('body', JSON.stringify(replacementData)); // Add replacement data
      if (image && image.length > 0) {
        formData.append('file', image[0]); // Add the file directly to FormData
      }

      const response = await fetch(BASE_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Server Error:', errorResponse);
        throw new Error(
          `Failed to add replacement: ${response.statusText} (${errorResponse.message})`
        );
      }

      const newReplacement: Replacement = await response
        .json()
        .then((data) => data.data);

      set((state) => ({
        replacements: [...state.replacements, newReplacement],
        addError: null,
      }));
    } catch (error) {
      console.error('Error adding replacement:', error);
      set({ addError: (error as Error).message });
    }
  },

  updateReplacement: async (id, updates) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        console.log('ReP', await response.json());
        throw new Error('Failed to update replacement');
      }

      const updatedReplacement: Replacement = await response
        .json()
        .then((data) => data.data);

      set((state) => ({
        replacements: state.replacements.map((item) =>
          item.id === id ? updatedReplacement : item
        ),
        updateError: null,
      }));
    } catch (error) {
      console.error('Error updating replacement:', error);
      set({ updateError: (error as Error).message });
    }
  },
  updateMyReplacement: async (id, updates) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        console.log('ReP', await response.json());
        throw new Error('Failed to update replacement');
      }

      const updatedReplacement: Replacement = await response
        .json()
        .then((data) => data.data);

      set((state) => ({
        myReplacements: state.myReplacements.map((item) =>
          item.id === id ? updatedReplacement : item
        ),
        updateError: null,
      }));
    } catch (error) {
      console.error('Error updating replacement:', error);
      set({ updateError: (error as Error).message });
    }
  },

  deleteReplacement: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete replacement');
      }

      set((state) => ({
        replacements: state.replacements.filter((item) => item.id !== id),
        deleteError: null,
      }));
    } catch (error) {
      console.error('Error deleting replacement:', error);
      set({ deleteError: (error as Error).message });
    }
  },
}));
