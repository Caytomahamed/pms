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

export default function SalesmanPage() {
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
    fetchUsers('salesman'); // Fetch customers when the component mounts
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
      if (!updateError) showToast('Salesmen updated successfully', 'success');
    } else {
      addUser({
        ...formData,
        role: 'salesman', // or any default role
      });

      if (!addError) {
        showToast('Salesman added successfully', 'success');
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

  const handleEdit = (salesman: User) => {
    setEditingUser(salesman);
    setFormData({
      fullName: salesman.fullName,
      address: salesman.address,
      phone: salesman.phone,
      username: salesman.username,
      password: salesman.password || '',
      status: 'Active' as User['status'],
    });

    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Salesman Management</h1>

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
              Add Salesman
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit Salesman' : 'Add New Salesman'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Salesman FulL Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Salesman UserName"
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
                  placeholder="Assign Area"
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
                {editingUser ? 'Update Salesman' : 'Add Salesman'}
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
              <TableHead>Assign Area</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Users.map((salesman) => (
              <TableRow key={salesman.id}>
                <TableCell>{salesman.id}</TableCell>
                <TableCell>{salesman.username}</TableCell>
                <TableCell>{salesman.fullName}</TableCell>
                <TableCell>{salesman.phone}</TableCell>
                <TableCell>{salesman.address}</TableCell>
                <TableCell>
                  {salesman.created_at
                    ? new Date(salesman.created_at).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      salesman.status === 'Active' ? 'default' : 'destructive'
                    }
                  >
                    {salesman.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(salesman)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        deleteUser(Number(salesman.id));
                        showToast('Salesman deleted successfully', 'success');
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
                  No Salesman found. Please add a new Salesman.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
