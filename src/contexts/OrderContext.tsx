import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Order {
  id: string;
  customerName: string;
  customerAddress: string;
  customerMobile: string;
  products: string[];
  status: 'pending' | 'dispatched' | 'delivered' | 'returned' | 'return-pending';
  dispatchPhoto?: string;
  returnPhoto?: string;
  returnReason?: string;
  returnAccepted?: boolean;
  orderDate: string;
  totalAmount: number;
}

interface OrderContextType {
  orders: Order[];
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  getOrder: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const mockOrders: Order[] = [
  {
    id: '001',
    customerName: 'John Doe',
    customerAddress: '123 Main St, City, State 12345',
    customerMobile: '+1234567890',
    products: ['Smartphone', 'Wireless Headphones'],
    status: 'pending',
    orderDate: '2024-01-15',
    totalAmount: 899.99,
  },
  {
    id: '002',
    customerName: 'Jane Smith',
    customerAddress: '456 Oak Ave, City, State 67890',
    customerMobile: '+1234567891',
    products: ['Laptop', 'Mouse', 'Keyboard'],
    status: 'dispatched',
    orderDate: '2024-01-14',
    totalAmount: 1299.99,
  },
  {
    id: '003',
    customerName: 'Mike Johnson',
    customerAddress: '789 Pine Rd, City, State 11111',
    customerMobile: '+1234567892',
    products: ['Tablet', 'Case'],
    status: 'delivered',
    orderDate: '2024-01-13',
    totalAmount: 549.99,
  },
  {
    id: '004',
    customerName: 'Sarah Wilson',
    customerAddress: '321 Elm St, City, State 22222',
    customerMobile: '+1234567893',
    products: ['Smart Watch', 'Charger'],
    status: 'return-pending',
    orderDate: '2024-01-12',
    totalAmount: 299.99,
  },
];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const getOrder = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{ orders, updateOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}