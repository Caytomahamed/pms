import { create } from 'zustand';

const BASE_URL = 'http://localhost:9000/api/v1/reports';

type stutus = {
  status: string;
  count: number;
  fill: string;
};

export interface Status {
  rate: string;
  data: stutus[];
}

interface Compirison {
  month: string;
  sales: number;
  orders: number;
  production: number;
}

interface salesOveriew {
  created_at: string;
  estimatedPrice: string;
}

interface reportStore {
  topCustomers: [];
  topSalesMan: [];
  latestProdutions: [];
  latestOrders: [];
  orders: Status;
  sales: Status;
  replacements: Status;
  production: Status;
  salesOverview: salesOveriew[];
  comperison: Compirison[];
  fetchOrdersStatus: (
    inputMonth: number,
    inputYear: number,
    type: string
  ) => Promise<void>;
  fetchSalesStatus: (
    inputMonth: number,
    inputYear: number,
    type: string
  ) => Promise<void>;
  fetchReplacementStatus: (
    inputMonth: number,
    inputYear: number,
    type: string
  ) => Promise<void>;
  fetchProductionStatus: (
    inputMonth: number,
    inputYear: number
  ) => Promise<void>;
  fetchComperison: (inputYear: number) => Promise<void>;
  fetchSaleOveriew: (inputYear: number) => Promise<void>;
  fetchLatesOrder: () => Promise<void>;
  fetchTopCustomers: () => Promise<void>;
  fetchTopSalesMan: () => Promise<void>;
  fetchLatestProdutions: () => Promise<void>;
}

export const useReportStore = create<reportStore>((set) => ({
  orders: {
    rate: '',
    data: [],
  },
  sales: {
    rate: '',
    data: [],
  },
  replacements: {
    rate: '',
    data: [],
  },
  production: {
    rate: '',
    data: [],
  },
  comperison: [],
  salesOverview: [],
  latestOrders: [],
  topCustomers: [],
  topSalesMan: [],
  latestProdutions: [],

  fetchLatestProdutions: async () => {
    try {
      const response = await fetch(`${BASE_URL}/lastest-production`);
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch Report status');
      }
      const data = await response.json().then((data) => data.data);
      set({ latestProdutions: data });
    } catch (error) {
      console.error('Error fetching Report status', error);
    }
  },

  fetchTopCustomers: async () => {
    try {
      const response = await fetch(`${BASE_URL}/top-customers`);
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch Report status');
      }
      const data = await response.json().then((data) => data.data);
      set({ topCustomers: data });
    } catch (error) {
      console.error('Error fetching Report status', error);
    }
  },

  fetchTopSalesMan: async () => {
    try {
      const response = await fetch(`${BASE_URL}/top-salesman`);
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch Report status');
      }
      const data = await response.json().then((data) => data.data);
      set({ topSalesMan: data });
    } catch (error) {
      console.error('Error fetching Report status', error);
    }
  },

  fetchLatesOrder: async () => {
    try {
      const response = await fetch(`${BASE_URL}/latest-orders`);
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch Report status');
      }
      const data = await response.json().then((data) => data.data);
      set({ latestOrders: data });
    } catch (error) {
      console.error('Error fetching Report status', error);
    }
  },

  fetchSaleOveriew: async (inputYear) => {
    try {
      const response = await fetch(
        `${BASE_URL}/sales-overview?year=${inputYear}`
      );
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch Report status');
      }
      const data: salesOveriew[] = await response
        .json()
        .then((data) => data.data);
      set({ salesOverview: data });
    } catch (error) {
      console.error('Error fetching Report status', error);
    }
  },
  fetchComperison: async (inputYear) => {
    try {
      const response = await fetch(`${BASE_URL}/comparison?year=${inputYear}`);
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch Report status');
      }
      const data: Compirison[] = await response
        .json()
        .then((data) => data.data);
      set({ comperison: data });
    } catch (error) {
      console.error('Error fetching Report status', error);
    }
  },
  fetchOrdersStatus: async (inputMonth, inputYear, type) => {
    try {
      const response = await fetch(
        `${BASE_URL}/status/${type}/?month=${inputMonth}&year=${inputYear}`
      );
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch Report status');
      }
      const data: Status = await response.json().then((data) => data.data);
      set({ orders: data });
    } catch (error) {
      console.error('Error fetching Report status', error);
    }
  },
  fetchSalesStatus: async (inputMonth, inputYear, type) => {
    try {
      const response = await fetch(
        `${BASE_URL}/status/${type}/?month=${inputMonth}&year=${inputYear}`
      );
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch Report status');
      }
      const data: Status = await response.json().then((data) => data.data);
      set({ sales: data });
    } catch (error) {
      console.error('Error fetching Report status', error);
    }
  },
  fetchReplacementStatus: async (inputMonth, inputYear, type) => {
    try {
      const response = await fetch(
        `${BASE_URL}/status/${type}/?month=${inputMonth}&year=${inputYear}`
      );
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch Report status');
      }
      const data: Status = await response.json().then((data) => data.data);
      set({ replacements: data });
    } catch (error) {
      console.error('Error fetching Report status', error);
    }
  },
  fetchProductionStatus: async (inputMonth, inputYear) => {
    try {
      const response = await fetch(
        `${BASE_URL}/prodution-status?month=${inputMonth}&year=${inputYear}`
      );
      if (!response.ok) {
        console.log('response', await response.json());
        throw new Error('Failed to fetch Report status');
      }
      const data: Status = await response.json().then((data) => data.data);
      set({ production: data });
    } catch (error) {
      console.error('Error fetching Report status', error);
    }
  },
}));
