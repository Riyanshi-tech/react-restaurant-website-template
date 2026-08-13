import api from './api';
import { MenuItem, Order, Table } from '../types';

export interface DashboardStats {
  users: number;
  tables: number;
  menuItems: number;
  openOrders: number;
  occupiedTables: number;
  todaySales: number;
  todayOrderCount: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/dashboard/stats');
    return res.data.data;
  }
};

export type MenuInput = {
  name: string;
  price: number;
  category: MenuItem['category'];
  description: string;
  tag?: string;
  image?: string;
};

export const menuService = {
  getItems: async (category?: string): Promise<MenuItem[]> => {
    const res = await api.get('/menu', { params: category ? { category } : {} });
    return res.data.data.items;
  },
  create: async (data: MenuInput): Promise<MenuItem> => {
    const res = await api.post('/menu', data);
    return res.data.data.item;
  },
  update: async (id: string, data: Partial<MenuInput>): Promise<MenuItem> => {
    const res = await api.put(`/menu/${id}`, data);
    return res.data.data.item;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/menu/${id}`);
  },
  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('image', file);
    const res = await api.post('/menu/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data.url;
  }
};

export const orderService = {
  getOrders: async (params?: Record<string, string>): Promise<{ orders: Order[]; totalSales: number; count: number }> => {
    const res = await api.get('/orders', { params });
    return res.data.data;
  },
  create: async (tableId: string, items: { menuItemId: string; quantity: number }[]): Promise<Order> => {
    const res = await api.post('/orders', { tableId, items });
    return res.data.data.order;
  },
  update: async (id: string, data: { status?: string; paymentStatus?: string }): Promise<Order> => {
    const res = await api.patch(`/orders/${id}`, data);
    return res.data.data.order;
  }
};

export type BillingSettings = {
  restaurantName: string;
  address: string;
  phone: string;
  gstin: string;
  gstPercent: number;
  cgstPercent: number;
  sgstPercent: number;
  whatsappCountryCode: string;
  billFooter: string;
};

export const settingsService = {
  get: async () => {
    const res = await api.get('/settings');
    return res.data.data as BillingSettings & {
      frontendUrl: string;
      resolvedBaseUrl: string;
      cloudinaryConfigured: boolean;
      port: string | number;
      nodeEnv: string;
    };
  },
  getBilling: async () => {
    const res = await api.get('/settings/billing');
    return res.data.data as BillingSettings;
  },
  update: async (data: Partial<BillingSettings>) => {
    const res = await api.put('/settings', data);
    return res.data.data as BillingSettings;
  }
};
