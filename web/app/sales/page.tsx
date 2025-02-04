'use client';

import { useEffect, useState } from 'react';
import { useSalesStore } from '@/store/salesStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  CalendarIcon,
  Edit,
  Trash,
  Clock,
  CheckCircle2,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sales } from '@/types';
import Toast from '../components/Toast';

export default function OrdersPage() {
  const {
    createSale,
    sales,
    fetchData,
    updateSale,
    deleteSale,
    addError,
    updateError,
    deleteError,
    SalesMen,
    Customers,
    fetchCustomer,
    fetchSaleman,
  } = useSalesStore();

  const [formData, setFormData] = useState({
    id: '',
    salesmanId: '',
    customerId: '',
    quantity: '',
    estimatedPrice: '',
    deadline: new Date(),
    status: 'in_progress',
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [activeTab, setActiveTab] = useState<Sales['status']>('in_progress');

  useEffect(() => {
    fetchData();
    fetchSaleman('salesman');
    fetchCustomer('customer');

    if (addError) showToast(addError, 'error');
    if (updateError) showToast(updateError, 'error');
    if (deleteError) showToast(deleteError, 'error');
  }, [
    fetchCustomer,
    fetchSaleman,
    fetchData,
    addError,
    updateError,
    deleteError,
  ]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      salesmanId: '',
      customerId: '',
      quantity: '',
      estimatedPrice: '',
      deadline: new Date(),
      status: 'in_progress',
    });
    setEditing(false);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.salesmanId || !formData.customerId || !formData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    const saleData = {
      salesmanId: Number(formData.salesmanId),
      customerId: Number(formData.customerId),
      quantity: Number(formData.quantity),
      estimatedPrice: formData.estimatedPrice,
      deadline: formData.deadline.toISOString(),
      status: formData.status as Sales['status'],
    };

    if (editing) {
      updateSale(Number(formData.id), saleData);
      !updateError && showToast('Sales updated successfully', 'success');
    } else {
      createSale(saleData);
      !addError && showToast('Sales created successfully', 'success');
    }

    resetForm();
  };

  const handleUpdate = (sale: Sales) => {
    setFormData({
      id: String(sale.id),
      salesmanId: String(sale.salesmanId),
      customerId: String(sale.customerId),
      quantity: String(sale.quantity),
      estimatedPrice: sale.estimatedPrice,
      deadline: new Date(sale.deadline),
      status: sale.status,
    });
    setEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteSale(id);
    !deleteError && showToast('Sale deleted successfully', 'success');
  };

  const filteredSales = sales.filter((sale) => sale.status === activeTab);

  const calculateProgress = (createdAt: string, deadline: string) => {
    const created = new Date(createdAt).getTime();
    const deadlineTime = new Date(deadline).getTime();
    const now = Date.now();

    const total = deadlineTime - created;
    const elapsed = now - created;

    if (total <= 0) return 100;
    const progress = (elapsed / total) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="container mx-auto p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sales Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editing ? 'Edit Sale' : 'Create New Sale'}
              </DialogTitle>
              <CardDescription>
                {editing ? 'Update sale details' : 'Enter new sale information'}
              </CardDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Salesman</Label>
                <select
                  value={formData.salesmanId}
                  onChange={(e) =>
                    setFormData({ ...formData, salesmanId: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Salesman</option>
                  {SalesMen.map((salesman) => (
                    <option key={salesman.id} value={salesman.id}>
                      {salesman.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Customer</Label>
                <select
                  value={formData.customerId}
                  onChange={(e) =>
                    setFormData({ ...formData, customerId: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Customer</option>
                  {Customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Price</Label>
                  <Input
                    type="number"
                    value={formData.estimatedPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedPrice: e.target.value,
                      })
                    }
                  />
                </div>
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
                        date && setFormData({ ...formData, deadline: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {editing && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {editing ? 'Update Sale' : 'Create Sale'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex gap-2">
        {['in_progress', 'completed'].map((status) => (
          <Button
            key={status}
            variant={activeTab === status ? 'default' : 'outline'}
            onClick={() => setActiveTab(status as Sales['status'])}
            className="capitalize"
          >
            {status.replace('_', ' ')}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSales.map((sale) => {
          const progress = calculateProgress(sale.created_at, sale.deadline);
          const isOverdue = progress >= 100;

          return (
            <Card key={sale.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4">
                  <span
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-sm',
                      sale.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    )}
                  >
                    {sale.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                    ) : (
                      <Clock className="w-4 h-4 mr-1" />
                    )}
                    {sale.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Sale #{sale.id}</h3>
                  <p className="text-sm text-gray-500">
                    Created: {format(new Date(sale.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Salesman</p>
                      <p className="font-medium">{sale.salesman}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{sale.customerName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium text-xl text-blue-600">
                        {sale.quantity}
                        <span className="text-sm ml-1 text-gray-500">
                          units
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Price</p>
                      <p className="font-medium text-xl text-green-600">
                        ${parseFloat(sale.estimatedPrice).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {sale.status === 'completed' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Actual Quantity</p>
                        <p className="font-medium text-xl text-blue-600">
                          {sale.actualQuantity}
                          <span className="text-sm ml-1 text-gray-500">
                            units
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Actual Price</p>
                        <p className="font-medium text-xl text-green-600">
                          ${parseFloat(sale.actualPrice).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Deadline</span>
                      <span className="font-medium">
                        {format(new Date(sale.deadline), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="relative pt-2">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              'h-2 rounded-full',
                              isOverdue
                                ? 'bg-red-500'
                                : sale.status === 'completed'
                                ? 'bg-green-500'
                                : 'bg-blue-500'
                            )}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdate(sale)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(Number(sale.id))}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSales.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No {activeTab.replace('_', ' ')} sales found
          </p>
        </div>
      )}
    </div>
  );
}
