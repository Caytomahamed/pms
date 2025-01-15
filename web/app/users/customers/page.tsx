'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { useUsersStore } from '../../../store/usersStore';
import { User } from '@/types';

import Toast from '../../components/Toast';

export default function CustomersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    username: '',
    password: '',
    status: 'active' as User['status'],
  });

  // store
  const {
    fetchUsers,
    Users,
    addUser,
    deleteUser,
    updateUser,
    addError,
    updateError,
    deleteError,
  } = useUsersStore();

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
    fetchUsers('customer'); // Fetch customers when the component mounts
    if (addError) {
      showToast(addError, 'error');
    }

    if (updateError) {
      showToast(updateError, 'error');
    }

    if (deleteError) {
      showToast(deleteError, 'error');
    }
  }, [addError, updateError, deleteError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(Number(editingUser.id), {
        ...editingUser,
        ...formData,
        status: formData.status as User['status'],
      });
      if (!updateError) showToast('Customer updated successfully', 'success');
    } else {
      addUser({
        ...formData,
        role: 'customer', // or any default role
      });

      if (!addError) {
        showToast('Customer added successfully', 'success');
      }
    }
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({
      fullName: '',
      address: '',
      phone: '',
      username: '',
      password: '',
      status: 'active' as User['status'],
    });
  };

  const handleEdit = (customer: User) => {
    setEditingUser(customer);
    setFormData({
      fullName: customer.fullName,
      address: customer.address,
      phone: customer.phone,
      username: customer.username,
      password: customer.password || '',
      status: 'Active' as User['status'],
    });

    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers Management</h1>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit Customer' : 'Add New Customer'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Customer FulL Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Customer UserName"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Current Area"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Contact Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                {editingUser && (
                  <>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as User['status'],
                        }))
                      }
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </>
                )}
              </div>
              <Button type="submit" className="w-full">
                {editingUser ? 'Update Customer' : 'Add Customer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#Id</TableHead>
              <TableHead>UserName</TableHead>
              <TableHead>FullName</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Current Area</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Users.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.username}</TableCell>
                <TableCell>{customer.fullName}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address} </TableCell>
                <TableCell>
                  {customer.created_at
                    ? new Date(customer.created_at).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      customer.status === 'Active' ? 'default' : 'destructive'
                    }
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(customer)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        deleteUser(Number(customer.id));
                        showToast('Customer deleted successfully', 'success');
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {Users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground text-center"
                >
                  No Customers found. Please add a new Customer.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
