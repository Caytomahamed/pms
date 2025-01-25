export type OrderStatus = 'pending' | 'accepted' | 'declined' | 'completed';
export type ReplacementStatus = 'pending' | 'approved' | 'delivered';
export type AssignmentStatus = 'pending' | 'in_progress' | 'completed';
export type UserRole = 'admin' | 'farm' | 'warehouse' | 'salesman';

export type ReplacementImage = {
  type: string;
  name: string;
  size: number;
};

export type userStatus = 'Active' | 'inActive';

// Users
export interface User {
  id?: string;
  username: string;
  fullName: string;
  password?: string;
  phone: string;
  address: string;
  role: string;
  status?: userStatus;
  created_at?: string;
}

export interface EggOrder {
  id?: number;
  deadline: Date;
  notes?: string;
  quantity: number;
  status: OrderStatus;
  farmerId: number;
  reason?: string;
  username?: string;
}

export interface Replacement {
  id?: number;
  quantity: number;
  deadline: Date;
  reason: string;
  orderId: number;
  created_at?: string;
  updated_at?: string;
  image?: FileList | string;
  status: ReplacementStatus;
}

export interface Inventory {
  id?: number;
  total: number;
  damaged: number;
  note: string;
  orderId: number;
  created_at?: string;
  updated_at?: string;
}

export interface Sales {
  id?: number;
  quantity: number;
  estimatedPrice: string;
  deadline: string;
  actualQuantity?: string;
  actualPrice?: string;
  status?: 'in_progress' | 'completed';
  salesmanId?: number;
  customerId?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Report {
  id: string;
  type: 'farm' | 'salesman' | 'customer';
  period: {
    start: string;
    end: string;
  };
  data: {
    totalOrders: number;
    successRate: number;
    replacementRate?: number;
    deliveryEfficiency?: number;
    customerSatisfaction?: number;
  };
}
