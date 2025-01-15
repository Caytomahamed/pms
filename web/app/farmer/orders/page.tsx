'use client';

import { useEffect, useState } from 'react';
import { useOrdersStore } from '@/store/ordersStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '../../../utlis';

import Toast from '../../components/Toast';
import { User } from '@/types';

export default function FarmPage() {
  const { myOrders, updateOrderStatus, fetchFarmersOrder, statusError } =
    useOrdersStore();
  const [declineReason, setDeclineReason] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  // Show a toast message when there is an error
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userlogin = localStorage.getItem('user');
    if (userlogin) {
      setUser(JSON.parse(userlogin));
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log('salesman user', user);
      fetchFarmersOrder(Number(user.id));
    }
  }, [user]);

  const handleOrderResponse = (
    orderId: number,
    status: 'accepted' | 'declined'
  ) => {
    updateOrderStatus(orderId, status, declineReason || '');
    setDeclineReason('');
    setSelectedOrder(null);

    if (!statusError) {
      showToast('Order updated successfully', 'success');
    }
  };

  const [activeTab, setActiveTab] = useState<
    'pending' | 'accepted' | 'declined' | 'completed'
  >('pending');

  const filteredOrders = myOrders.filter((order) => order.status === activeTab);

  const getTitleAndDescription = (
    tab: 'pending' | 'accepted' | 'declined' | 'completed'
  ) => {
    switch (tab) {
      case 'pending':
        return {
          title: 'Pending Orders',
          description: 'Review and respond to egg orders',
        };
      case 'accepted':
        return {
          title: 'Accepted Orders',
          description: 'View and manage accepted orders',
        };
      case 'declined':
        return {
          title: 'Declined Orders',
          description: 'Review declined orders and feedback',
        };
      case 'completed':
        return {
          title: 'Completed Orders',
          description: 'Track and review completed orders',
        };
      default:
        return { title: 'Orders', description: 'Manage your orders' };
    }
  };

  const { title, description } = getTitleAndDescription(activeTab);

  return (
    <div className="w-full mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Tabs for filtering orders */}
      <div className="flex justify-start space-x-4 mb-4">
        {['pending', 'accepted', 'declined', 'completed'].map((status) => (
          <Button
            key={status}
            variant={activeTab === status ? 'default' : 'outline'}
            onClick={() =>
              setActiveTab(
                status as 'pending' | 'accepted' | 'declined' | 'completed'
              )
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {order.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Deadline:{' '}
                          {new Date(order.deadline).toLocaleDateString()}
                        </p>
                        {order.notes && (
                          <p className="text-sm text-muted-foreground">
                            Notes: {order.notes}
                          </p>
                        )}
                      </div>
                      <div
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                          order.status === 'pending' &&
                            'bg-yellow-100 text-yellow-800',
                          order.status === 'declined' &&
                            'bg-red-100 text-red-800',
                          order.status === 'accepted' &&
                            'bg-blue-100 text-blue-800',
                          order.status === 'completed' &&
                            'bg-green-100 text-green-800'
                        )}
                      >
                        {order.status}
                      </div>
                    </div>

                    {Number(selectedOrder) === order.id ? (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Reason for declining (optional)"
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              handleOrderResponse(Number(order.id), 'accepted')
                            }
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() =>
                              handleOrderResponse(Number(order.id), 'declined')
                            }
                            variant="destructive"
                            className="flex-1"
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setSelectedOrder(Number(order.id))}
                        className="w-full"
                      >
                        Review Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center">
              No orders found for this status:{' '}
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
