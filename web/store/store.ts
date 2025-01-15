import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  EggOrder,
  Replacement,
  Inventory,
  Assignment,
  Sale,
  Report,
  OrderStatus,
  ReplacementStatus,
  AssignmentStatus,
  Farmer,
  Customer,
  Salesman,
} from '../types';

interface Store {
  orders: EggOrder[];
  replacements: Replacement[];
  inventory: Inventory[];
  assignments: Assignment[];
  sales: Sale[];
  reports: Report[];
  farmers: Farmer[];
  customers: Customer[];
  salesmen: Salesman[];

  // Existing operations
  createOrder: (
    order: Omit<EggOrder, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    declineReason?: string
  ) => void;
  createReplacement: (
    replacement: Omit<Replacement, 'id' | 'status' | 'createdAt'>
  ) => void;
  updateReplacementStatus: (
    replacementId: string,
    status: ReplacementStatus
  ) => void;
  addInventory: (inventory: Omit<Inventory, 'id'>) => void;
  updateInventory: (inventoryId: string, updates: Partial<Inventory>) => void;
  createAssignment: (
    assignment: Omit<Assignment, 'id' | 'status' | 'deliveryConfirmation'>
  ) => void;
  updateAssignmentStatus: (
    assignmentId: string,
    status: AssignmentStatus,
    confirmation?: Assignment['deliveryConfirmation']
  ) => void;
  recordSale: (sale: Omit<Sale, 'id'>) => void;
  generateReport: (type: Report['type'], period: Report['period']) => void;

  // Farmer operations
  addFarmer: (farmer: Omit<Farmer, 'id'>) => void;
  updateFarmer: (id: string, updates: Partial<Farmer>) => void;
  deleteFarmer: (id: string) => void;

  // Customer operations
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Salesman operations
  addSalesman: (salesman: Omit<Salesman, 'id'>) => void;
  updateSalesman: (id: string, updates: Partial<Salesman>) => void;
  deleteSalesman: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      orders: [],
      replacements: [],
      inventory: [],
      assignments: [],
      sales: [],
      reports: [],
      farmers: [],
      customers: [],
      salesmen: [],

      // Existing methods
      createOrder: (order) => {
        const newOrder: EggOrder = {
          ...order,
          id: Math.random().toString(),
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [...state.orders, newOrder] }));
      },

      updateOrderStatus: (orderId, status, declineReason) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  declineReason,
                  updatedAt: new Date().toISOString(),
                }
              : order
          ),
        }));
      },

      createReplacement: (replacement) => {
        const newReplacement: Replacement = {
          ...replacement,
          id: Math.random().toString(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          replacements: [...state.replacements, newReplacement],
        }));
      },

      updateReplacementStatus: (replacementId, status) => {
        set((state) => ({
          replacements: state.replacements.map((replacement) =>
            replacement.id === replacementId
              ? { ...replacement, status }
              : replacement
          ),
        }));
      },

      addInventory: (inventory) => {
        const newInventory: Inventory = {
          ...inventory,
          id: Math.random().toString(),
        };
        set((state) => ({
          inventory: [...state.inventory, newInventory],
        }));
      },

      updateInventory: (inventoryId, updates) => {
        set((state) => ({
          inventory: state.inventory.map((inv) =>
            inv.id === inventoryId ? { ...inv, ...updates } : inv
          ),
        }));
      },

      createAssignment: (assignment) => {
        const newAssignment: Assignment = {
          ...assignment,
          id: Math.random().toString(),
          status: 'pending',
        };
        set((state) => ({
          assignments: [...state.assignments, newAssignment],
        }));
      },

      updateAssignmentStatus: (assignmentId, status, confirmation) => {
        set((state) => ({
          assignments: state.assignments.map((assignment) =>
            assignment.id === assignmentId
              ? {
                  ...assignment,
                  status,
                  deliveryConfirmation: confirmation,
                }
              : assignment
          ),
        }));
      },

      recordSale: (sale) => {
        const newSale: Sale = {
          ...sale,
          id: Math.random().toString(),
        };
        set((state) => ({
          sales: [...state.sales, newSale],
        }));
      },

      generateReport: (type, period) => {
        const { orders } = get();

        const reportData = {
          totalOrders: orders.length,
          successRate: 0,
          replacementRate: 0,
          deliveryEfficiency: 0,
          customerSatisfaction: 0,
        };

        const successfulOrders = orders.filter(
          (order) => order.status === 'completed'
        ).length;
        reportData.successRate = (successfulOrders / orders.length) * 100;

        const newReport: Report = {
          id: Math.random().toString(),
          type,
          period,
          data: reportData,
        };

        set((state) => ({
          reports: [...state.reports, newReport],
        }));
      },

      // Farmer operations
      addFarmer: (farmer) =>
        set((state) => ({
          farmers: [
            ...state.farmers,
            { ...farmer, id: Math.random().toString() },
          ],
        })),

      updateFarmer: (id, updates) =>
        set((state) => ({
          farmers: state.farmers.map((farmer) =>
            farmer.id === id ? { ...farmer, ...updates } : farmer
          ),
        })),

      deleteFarmer: (id) =>
        set((state) => ({
          farmers: state.farmers.filter((farmer) => farmer.id !== id),
        })),

      // Customer operations
      addCustomer: (customer) =>
        set((state) => ({
          customers: [
            ...state.customers,
            { ...customer, id: Math.random().toString() },
          ],
        })),

      updateCustomer: (id, updates) =>
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id ? { ...customer, ...updates } : customer
          ),
        })),

      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
        })),

      // Salesman operations
      addSalesman: (salesman) =>
        set((state) => ({
          salesmen: [
            ...state.salesmen,
            { ...salesman, id: Math.random().toString() },
          ],
        })),

      updateSalesman: (id, updates) =>
        set((state) => ({
          salesmen: state.salesmen.map((salesman) =>
            salesman.id === id ? { ...salesman, ...updates } : salesman
          ),
        })),

      deleteSalesman: (id) =>
        set((state) => ({
          salesmen: state.salesmen.filter((salesman) => salesman.id !== id),
        })),
      fetchCustomers: async () => {
        try {
          const response = await fetch('/api/customers'); // Replace with your API endpoint
          if (!response.ok) {
            throw new Error('Failed to fetch customers');
          }
          const customers: Customer[] = await response.json();
          set(() => ({ customers }));
        } catch (error) {
          console.error('Error fetching customers:', error);
        }
      },
    }),
    {
      name: 'poultry-management-storage',
    }
  )
);
