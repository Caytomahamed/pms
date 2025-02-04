import { create } from 'zustand';
import { EggOrder } from '@/types';

const BASE_URL = 'http://localhost:9000/api/v1/orders';

interface OrdersStore {
  orders: EggOrder[]; // The list of orders
  myOrders: EggOrder[]; // The list of orders
  addError: string | null;
  updateError: string | null;
  deleteError: string | null;
  statusError: string | null;
  fetchData: () => Promise<void>; // Load data from the API
  fetchFarmersOrder: (farmerId: number) => Promise<void>; // Load data from the API
  createOrder: (order: Omit<EggOrder, 'id' | 'status'>) => Promise<void>; // Create a new order
  updateOrder: (
    id: number,
    updatedOrder: Partial<Omit<EggOrder, 'id'>>
  ) => Promise<void>; // Update an order
  deleteOrder: (id: number) => Promise<void>; // Delete an order by ID
  updateOrderStatus: (
    id: number,
    status: EggOrder['status'],
    reason?: string
  ) => Promise<void>; // Update order status
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: [],
  addError: null,
  updateError: null,
  deleteError: null,
  statusError: null,
  myOrders: [],

  fetchData: async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        console.log('reponse', response.json());
        throw new Error('Failed to fetch orders');
      }
      const data: EggOrder[] = await response.json().then((data) => data.data);
      console.log('orders', data);
      set({ orders: data });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  },

  fetchFarmersOrder: async (farmerId) => {
    try {
      const response = await fetch(`${BASE_URL}/farmer/${farmerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data: EggOrder[] = await response.json().then((data) => data.data);

      set({ myOrders: data });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  },

  createOrder: async (order) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...order, status: 'pending' }),
      });
      if (!response.ok) {
        const result = await response.json();
        console.log('order created', result);
        set(() => ({ addError: result.message || 'Failed to add User' }));
        throw new Error('Failed to create order');
      }
      const newOrder: EggOrder = await response
        .json()
        .then((data) => data.data);
      set((state) => ({ orders: [...state.orders, newOrder] }));
    } catch (error) {
      console.error('Error creating order:', error);
      set(() => ({ addError: (error as Error).message }));
    }
  },

  updateOrder: async (id, updatedOrder) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });
      if (!response.ok) {
        const result = await response.json();
        set(() => ({ updateError: result.message || 'Failed to add User' }));
        throw new Error('Failed to update order');
      }
      const updated: EggOrder = await response.json().then((data) => data.data);
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id
            ? { ...updated, fullName: updatedOrder.fullName }
            : order
        ),
      }));
    } catch (error) {
      console.error('Error updating order:', error);
      set(() => ({ updateError: (error as Error).message }));
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const result = await response.json();
        console.log('error', result);
        set(() => ({ deleteError: result.message || 'Failed to add User' }));
        throw new Error('Failed to delete order');
      }
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting order:', error);
      set(() => ({ deleteError: (error as Error).message }));
    }
  },

  updateOrderStatus: async (id, status, reason) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, reason }),
      });
      if (!response.ok) {
        const result = await response.json();
        set(() => ({ statusError: result.message || 'Failed to add User' }));
        throw new Error('Failed to update order status');
      }
      const updated: EggOrder = await response.json().then((data) => data.data);
      set((state) => ({
        myOrders: state.myOrders.map((order) =>
          order.id === id ? updated : order
        ),
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
      set(() => ({ statusError: (error as Error).message }));
    }
  },
}));
