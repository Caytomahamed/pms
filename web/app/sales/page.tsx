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
import { CalendarIcon, Edit, Trash } from 'lucide-react';
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
    fetchSaleman('salesman');
    fetchCustomer('customer');
    console.log('fetching data');

    if (addError) {
      showToast(addError, 'error');
    }

    if (updateError) {
      showToast(updateError, 'error');
    }

    if (deleteError) {
      showToast(deleteError, 'error');
    }
  }, [
    fetchCustomer,
    fetchCustomer,
    fetchData,
    addError,
    updateError,
    deleteError,
  ]);

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

    if (editing) {
      updateSale(Number(formData.id), {
        salesmanId: Number(formData.salesmanId),
        customerId: Number(formData.customerId),
        quantity: Number(formData.quantity),
        estimatedPrice: formData.estimatedPrice,
        deadline: formData.deadline.toString(),
        status: formData.status as Sales['status'],
      });
      if (!updateError) showToast('Sales updated successfully', 'success');
    } else {
      createSale({
        salesmanId: Number(formData.salesmanId),
        customerId: Number(formData.customerId),
        quantity: Number(formData.quantity),
        estimatedPrice: formData.estimatedPrice,
        deadline: formData.deadline.toString(),
      });
      if (!addError) showToast('Sales Create successfully', 'success');
    }

    resetForm();
  };

  const handleUpdate = (sale: Sales) => {
    setFormData({
      id: '' + sale.id,
      salesmanId: '' + sale.salesmanId,
      customerId: '' + sale.customerId,
      quantity: '' + sale.quantity,
      estimatedPrice: sale.estimatedPrice,
      deadline: new Date(sale.deadline),
      status: '' + sale.status,
    });
    setEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteSale(id);
    if (!deleteError) showToast('Delete successfully', 'success');
  };

  const [activeTab, setActiveTab] = useState<Sales['status']>('in_progress');

  const filteredSales = sales.filter((sale) => sale.status === activeTab);

  return (
    <div className="md:grid-cols-2">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex justify-end">
              <Button onClick={() => resetForm()}>Assigned Salesmen</Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? 'Edit Egg Order' : 'Create Egg Order'}
              </DialogTitle>
              <CardDescription>
                {editing
                  ? 'Modify the selected Sales.'
                  : 'Assign the Salesmen into sale the Egg.'}
              </CardDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="farmerId">Salesman ID</Label>
                {SalesMen.length > 0 ? (
                  <select
                    id="farmerId"
                    value={formData.salesmanId || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salesmanId: e.target.value,
                      }))
                    }
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="" disabled>
                      Select a Salesmen
                    </option>
                    {SalesMen.map((salesman) => (
                      <option key={salesman.id} value={salesman.id}>
                        {salesman.username}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>Loading farmers...</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmerId">Customer ID</Label>
                {Customers.length > 0 ? (
                  <select
                    id="farmerId"
                    value={formData.customerId || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customerId: e.target.value,
                      }))
                    }
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="" disabled>
                      Select a Customer
                    </option>
                    {Customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.username}
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
                      quantity: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Estimated Price</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.estimatedPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      estimatedPrice: e.target.value,
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
                      {format(new Date(), 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(date) =>
                        date &&
                        setFormData((prev) => ({
                          ...prev,
                          deadline: date,
                        }))
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
                          status: e.target.value,
                        }))
                      }
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="in_progress">in_progress</option>
                      <option value="completed">completed</option>
                    </select>
                  </>
                )}
              </div>

              <Button type="submit" className="w-full">
                {editing ? 'Update Sale' : 'Assign Sale'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs for filtering orders */}
      <div className="flex justify-start space-x-4 mb-4">
        {['in_progress', 'completed'].map((status) => (
          <Button
            key={status}
            variant={activeTab === status ? 'default' : 'outline'}
            onClick={() =>
              setActiveTab((status as Sales['status']) || 'in_progress')
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            {(activeTab || 'in_progress').charAt(0).toUpperCase() +
              (activeTab || 'in_progress').slice(1)}{' '}
            Sales
          </CardTitle>
          <CardDescription>
            This section displays all sales with status:{' '}
            {(activeTab || 'in_progress').charAt(0).toUpperCase() +
              (activeTab || 'in_progress').slice(1)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <Card
                  key={sale.id}
                  className={`${
                    activeTab === 'completed' ? 'bg-green-50' : 'bg-red-100'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Sale #{sale.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Salesman: {sale.salesmanId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Customer: {sale.customerId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {sale.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Estimated Price: ${sale.estimatedPrice}
                        </p>
                      </div>
                      <div
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                          sale.status === 'in_progress' &&
                            'bg-blue-100 text-blue-800',
                          sale.status === 'completed' &&
                            'bg-orange-100 text-green-800'
                        )}
                      >
                        {sale.status}
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdate(sale)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(Number(sale.id))}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center">
                No sales found for this status:{' '}
                {(activeTab || 'in_progress').charAt(0).toUpperCase() +
                  (activeTab || 'in_progress').slice(1)}
                .
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
