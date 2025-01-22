import { create } from 'zustand';
import { User, Sales, EggOrder } from '@/types';

const BASE_URL = 'http://localhost:9000/api/v1/users';
const BASE_URI = 'http://localhost:9000/api/v1/reports';

interface Report {
  totalFarms: number;
  currentStock: number;
  salesToday: number;
  totalOrders: number;
  salesOverview: Partial<Sales>[];
  orders: EggOrder[];
}

interface UsersStore {
  Users: User[];
  reports: Report;
  addError: string | null;
  updateError: string | null;
  deleteError: string | null;
  loginError: string | null;
  fetchUsers: (role: string) => Promise<void>;
  fetchReport: () => Promise<void>;
  addUser: (User: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: number, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  loginUser: (username: string, password: string) => Promise<boolean>;
  logOut: () => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
  Users: [],
  addError: null,
  updateError: null,
  deleteError: null,
  loginError: null,
  reports: {
    totalFarms: 0,
    currentStock: 0,
    salesToday: 0,
    totalOrders: 0,
    salesOverview: [],
    orders: [],
  },

  loginUser: async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        console.log('user', result);
        set(() => ({ loginError: result.message || 'Login failed' }));
        throw new Error(result.message || 'Login failed');
      }

      const { user, token, isLogin } = await response
        .json()
        .then((data) => data);

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('isLogin', isLogin);
      set(() => ({ loginError: null }));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      set(() => ({ loginError: (error as Error).message }));
      return false;
    }
  },

  // Fetch Users from the API
  fetchUsers: async (role) => {
    try {
      const response = await fetch(`${BASE_URL}/role/${role}`);
      if (!response.ok) {
        console.log('error', await response.json());
        throw new Error('Failed to fetch Users');
      }
      const Users: User[] = await response.json().then((data) => data.data);
      // console.log('users', Users);
      set(() => ({ Users }));
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  },

  fetchReport: async () => {
    try {
      const response = await fetch(`${BASE_URI}`);
      if (!response.ok) {
        console.log('error', await response.json());
        throw new Error('Failed to fetch Users');
      }
      const reports: Report = await response.json().then((data) => data.data);
      set(() => ({ reports }));
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  },

  // Add a User using the API
  addUser: async (User) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...User }),
      });

      if (!response.ok) {
        const result = await response.json();
        set(() => ({ addError: result.message || 'Failed to add User' }));
        throw new Error(result.message || 'Failed to add User');
      }

      const newUser: User = await response.json().then((data) => data.data);

      set((state) => ({
        Users: [...state.Users, newUser],
        addError: null, // Clear error on success
      }));
    } catch (error) {
      console.error('Error adding User:', error);
      set(() => ({ addError: (error as Error).message }));
    }
  },

  // Update a User using the API
  updateUser: async (id, updates) => {
    delete updates.id; // Remove the ID from the updates object
    delete updates.created_at; // Remove the created_at from the updates object

    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const result = await response.json();
        set(() => ({
          updateError: result.message || 'Failed to update User',
        }));
        throw new Error(result.message || 'Failed to update User');
      }

      const [updatedUser] = await response.json().then((data) => data.data);

      set((state) => ({
        Users: state.Users.map((User) =>
          Number(User.id) === id ? updatedUser : User
        ),
        updateError: null, // Clear error on success
      }));
    } catch (error) {
      console.error('Error updating User:', error);
      set(() => ({ updateError: (error as Error).message }));
    }
  },

  // Delete a User using the API
  deleteUser: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        set(() => ({
          deleteError: result.message || 'Failed to delete User',
        }));
        throw new Error(result.message || 'Failed to delete User');
      }

      set((state) => ({
        Users: state.Users.filter((User) => Number(User.id) !== id),
        deleteError: null, // Clear error on success
      }));
    } catch (error) {
      console.error('Error deleting User:', error);
      set(() => ({ deleteError: (error as Error).message }));
    }
  },

  logOut: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isLogin');
    window.location.reload(); // Refreshes the page
  },
}));
