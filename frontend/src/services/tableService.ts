import api from './api';
import { Table, PublicTablePayload, Order } from '../types';

export interface TableInput {
  tableNumber: number;
  name: string;
  capacity: number;
  location: string;
  status?: string;
  isActive?: boolean;
}

export const tableService = {
  // Admin endpoints
  async getTables() {
    const response = await api.get<{ data: { tables: Table[] } }>('/tables');
    return response.data.data.tables;
  },

  async getTableById(id: string) {
    const response = await api.get<{ data: { table: Table } }>(`/tables/${id}`);
    return response.data.data.table;
  },

  async createTable(data: TableInput) {
    const response = await api.post<{ data: { table: Table } }>('/tables', data);
    return response.data.data.table;
  },

  async updateTable(id: string, data: Partial<TableInput>) {
    const response = await api.put<{ data: { table: Table } }>(`/tables/${id}`, data);
    return response.data.data.table;
  },

  async deleteTable(id: string) {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
  },

  async regenerateTableQr(id: string) {
    const response = await api.post<{ data: { table: Table } }>(`/tables/${id}/regenerate-qr`);
    return response.data.data.table;
  },

  // Public customer endpoints
  async getPublicTableDetails(slug: string) {
    const response = await api.get<{ data: PublicTablePayload }>(`/public/tables/${slug}`);
    return response.data.data;
  },

  async placeTableOrder(slug: string, items: { menuItemId: string; quantity: number }[]) {
    const response = await api.post<{ data: { order: Order } }>(`/public/tables/${slug}/orders`, { items });
    return response.data.data.order;
  }
};
