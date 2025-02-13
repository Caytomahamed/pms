'use client';

import { useEffect, useState } from 'react';
import { useOrdersStore } from '@/store/ordersStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
// import { cn } from '@/lib/utils';

import { EggOrder } from '@/types';
import Toast from '../components/Toast';
import { useUsersStore } from '../../store/usersStore';
import OrderCard from '../components/OrderCard';

export default function OrdersPage() {
  const {
    createOrder,
    orders,
    fetchData,
    updateOrder,
    deleteOrder,
    addError,
    updateError,
    deleteError,
  } = useOrdersStore();

  const { fetchUsers, Users } = useUsersStore();

  const [formData, setFormData] = useState<EggOrder>({
    id: 0,
    deadline: new Date(),
    notes: '',
    quantity: 0,
    status: 'pending',
    farmerId: 2,
    reason: '',
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  // Show a toast message when there is an error
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    fetchData();
    fetchUsers('farmer');

    if (addError) {
      showToast(addError, 'error');
    }

    if (updateError) {
      showToast(updateError, 'error');
    }

    if (deleteError) {
      showToast(deleteError, 'error');
    }
  }, [fetchUsers, fetchData, addError, updateError, deleteError]);

  const resetForm = () => {
    setFormData({
      id: 0,
      deadline: new Date(),
      notes: '',
      quantity: 0,
      status: 'pending',
      farmerId: 1,
      reason: '',
    });
    setEditing(false);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.farmerId || !formData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    if (editing) {
      updateOrder(Number(formData.id), {
        ...formData,
        deadline: formData.deadline,
      });
      if (!updateError) showToast('Order updated successfully', 'success');
    } else {
      createOrder({
        ...formData,
        deadline: formData.deadline,
      });
      if (!addError) showToast('Order Create successfully', 'success');
    }

    resetForm();
  };

  const handleUpdate = (order: EggOrder) => {
    setFormData({
      ...order,
      deadline: new Date(order.deadline),
    });
    setEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteOrder(id);
    if (!deleteError) showToast('Order Delete successfully', 'success');
  };

  const [activeTab, setActiveTab] = useState<
    'pending' | 'accepted' | 'declined' | 'completed'
  >('pending');

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <div className="md:grid-cols-2">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-2xl font-bold mt-10 mb-5">Orders Management</h1>
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex justify-end">
              <Button onClick={() => resetForm()}>Create Egg Order</Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? 'Edit Egg Order' : 'Create Egg Order'}
              </DialogTitle>
              <CardDescription>
                {editing
                  ? 'Modify the selected order.'
                  : 'Submit a new egg order to farms.'}
              </CardDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="farmerId">Farmer</Label>
                {Users.length > 0 ? (
                  <select
                    id="farmerId"
                    value={formData.farmerId || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        farmerId: Number(e.target.value),
                      }))
                    }
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="" disabled>
                      Select a farmer
                    </option>
                    {Users.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.fullName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>Loading farmers...</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.deadline, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(date) =>
                        date &&
                        setFormData((prev) => ({ ...prev, deadline: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                {editing && (
                  <>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as EggOrder['status'],
                        }))
                      }
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                      <option value="completed">Completed</option>
                    </select>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                />
              </div>

              <Button type="submit" className="w-full">
                {editing ? 'Update Order' : 'Submit Order'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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

      <div className="mb-10">
        <CardHeader className="ml-[-15px]">
          <CardTitle>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders
          </CardTitle>
          <CardDescription>
            This section displays all orders with status:{' '}
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </CardDescription>
        </CardHeader>

        <div className="space-y-4 flex flex-wrap space-x-1">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                handleDelete={handleDelete}
                handleEdit={handleUpdate}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center">
              No orders found for this status:{' '}
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
