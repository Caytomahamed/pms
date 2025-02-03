import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useOrdersStore } from './ordersStore';
import { useUsersStore } from './usersStore';
import { useInventoryStore } from './InvertoryStore';
import { useReplacementStore } from './replacementStore';
import { useSalesStore } from './salesStore';
import { useProductionStore } from './productionStore';
import { useReportStore } from './useReports';

export const useStore = create(
  persist(
    () => ({
      ordersStore: useOrdersStore,
      usersStore: useUsersStore,
      inventoryStore: useInventoryStore,
      replacementStore: useReplacementStore,
      salesStore: useSalesStore,
      productionStore: useProductionStore,
      reportStore: useReportStore,
    }),
    {
      name: 'poultry-management-storage',
    }
  )
);
