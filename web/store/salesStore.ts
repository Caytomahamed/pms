import { create } from 'zustand';
import { Sales, User } from '@/types';

const BASE_URL = 'http://localhost:9000/api/v1/sales';
const BASE_URL1 = 'http://localhost:9000/api/v1/users/role';

interface SalesStore {
  sales: Sales[]; // The list of orders
  mySales: Sales[]; // The list of orders
  SalesMen: User[];
  Customers: User[];
  addError: string | null;
  updateError: string | null;
  deleteError: string | null;
  statusError: string | null;
  fetchData: () => Promise<void>; // Load data from the API
  fetchSaleman: (role: string) => Promise<void>; // Load data from the API
  fetchCustomer: (role: string) => Promise<void>; // Load data from the API
  fetchSalesmanSales: (salesmanId: number) => Promise<void>; // Load data from the API
  createSale: (order: Omit<Sales, 'id' | 'status'>) => Promise<void>; // Create a new order
  updateSale: (
    id: number,
    updatedOrder: Partial<Omit<Sales, 'id'>>
  ) => Promise<void>; // Update an order
  deleteSale: (id: number) => Promise<void>; // Delete an order by ID
  updateSaleStatus: (
    id: number,
    status: Sales['status'],
    data: Partial<Omit<Sales, 'id'>>
  ) => Promise<void>; // Update order status
}

export const useSalesStore = create<SalesStore>((set) => ({
  sales: [],
  addError: null,
  updateError: null,
  deleteError: null,
  statusError: null,
  mySales: [],
  SalesMen: [],
  Customers: [],

  fetchData: async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data: Sales[] = await response.json().then((data) => data.data);
      set({ sales: data });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  },
  fetchSaleman: async (role) => {
    try {
      const response = await fetch(`${BASE_URL1}/${role}`);
      if (!response.ok) {
        console.log('Failed to fetch Saleman', await response.json());
        throw new Error('Failed to fetch Saleman');
      }
      const data: User[] = await response.json().then((data) => data.data);
      set({ SalesMen: data });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  },

  fetchCustomer: async (role) => {
    try {
      const response = await fetch(`${BASE_URL1}/${role}`);
      if (!response.ok) throw new Error('Failed to fetch Customer');
      const data: User[] = await response.json().then((data) => data.data);
      set({ Customers: data });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  },

  fetchSalesmanSales: async (salesmanId) => {
    console.log("salesmanId", salesmanId);
    try {
      const response = await fetch(`${BASE_URL}/salesman/${salesmanId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data: Sales[] = await response.json().then((data) => data.data);

      console.log('sales', data);

      set({ mySales: data });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  },

  createSale: async (sale) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...sale, status: 'in_progress' }),
      });
      if (!response.ok) {
        const result = await response.json();
        console.log('result sale', result);
        set(() => ({ addError: result.message || 'Failed to add User' }));
        throw new Error('Failed to create order');
      }
      const newSale: Sales = await response.json().then((data) => data.data);
      set((state) => ({ sales: [...state.sales, newSale] }));
    } catch (error) {
      console.error('Error creating order:', error);
      set(() => ({ addError: (error as Error).message }));
    }
  },

  updateSale: async (id, updateSale) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateSale),
      });
      if (!response.ok) {
        const result = await response.json();
        set(() => ({ updateError: result.message || 'Failed to add User' }));
        throw new Error('Failed to update order');
      }
      const updated: Sales = await response.json().then((data) => data.data);
      set((state) => ({
        sales: state.sales.map((order) => (order.id === id ? updated : order)),
      }));
    } catch (error) {
      console.error('Error updating order:', error);
      set(() => ({ updateError: (error as Error).message }));
    }
  },

  deleteSale: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const result = await response.json();
        set(() => ({ deleteError: result.message || 'Failed to add User' }));
        throw new Error('Failed to delete order');
      }
      set((state) => ({
        sales: state.sales.filter((sale) => sale.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting order:', error);
      set(() => ({ deleteError: (error as Error).message }));
    }
  },

  updateSaleStatus: async (id, status, data) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, ...data }),
      });
      if (!response.ok) {
        const result = await response.json();
        set(() => ({ statusError: result.message || 'Failed to add User' }));
        throw new Error('Failed to update order status');
      }
      const updated: Sales = await response.json().then((data) => data.data);
      set((state) => ({
        mySales: state.mySales.map((order) =>
          order.id === id ? updated : order
        ),
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
      set(() => ({ statusError: (error as Error).message }));
    }
  },
}));
