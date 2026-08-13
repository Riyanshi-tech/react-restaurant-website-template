export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'INACTIVE';

export interface Table {
  id?: string;
  _id?: string;
  tableNumber: number;
  name: string;
  slug: string;
  capacity: number;
  status: TableStatus;
  location: string;
  isActive: boolean;
  qrCodeUrl?: string;
  activeOrder?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItem {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'desserts' | 'drinks';
  description: string;
  tag?: string;
  image?: string;
}

export interface OrderItem {
  menuItem: any;
  name: string;
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  id?: string;
  _id?: string;
  orderNumber: string;
  table: any;
  guestName?: string;
  guestPhone?: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'PAID' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID';
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicTablePayload {
  table: {
    id: string;
    tableNumber: number;
    name: string;
    capacity: number;
    location: string;
    status: TableStatus;
    slug: string;
  };
  restaurant: {
    name: string;
    logo: string;
    address: string;
    phone: string;
  };
  menu: {
    categories: string[];
    items: MenuItem[];
  };
  activeOrder: Order | null;
  ordering: {
    allowOrdering: boolean;
    allowMultipleOrders: boolean;
  };
}
