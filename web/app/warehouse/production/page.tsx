'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

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

import { format } from 'date-fns';

import { useProductionStore } from '../../../store/productionStore';
import { Productions, User } from '@/types';

import Toast from '../../components/Toast';
import { addCommas } from '@/app/page';

export default function CustomersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduction, setEditingProduction] =
    useState<Productions | null>(null);
  const [formData, setFormData] = useState({
    cartoon: '',
    tray: '',
    piece: '',
    farmerId: '',
  });

  // store
  const {
    fetchData,
    addProduction,
    updateProduction,
    productions,
    deleteProduction,
    addError,
    updateError,
    deleteError,
  } = useProductionStore();

  const [user, setUser] = useState<User | null>(null);

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
    if (addError) {
      showToast(addError, 'error');
    }

    if (updateError) {
      showToast(updateError, 'error');
    }

    if (deleteError) {
      showToast(deleteError, 'error');
    }

    const localUser = localStorage.getItem('user');

    if (localUser) setUser(JSON.parse(localUser));
  }, [addError, updateError, deleteError, fetchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduction) {
      updateProduction(Number(editingProduction.id), {
        cartoon: Number(formData.cartoon),
        tray: Number(formData.tray),
        piece: Number(formData.piece),
        farmerId: Number(formData.farmerId),
      });
      if (!updateError) showToast('updated successfully', 'success');
    } else {
      addProduction({
        cartoon: Number(formData.cartoon),
        tray: Number(formData.tray),
        piece: Number(formData.piece),
        farmerId: Number(formData.farmerId),
      });

      if (!addError) {
        showToast('added successfully', 'success');
      }
    }
    setIsDialogOpen(false);
    setEditingProduction(null);
    setFormData({
      cartoon: '',
      tray: '',
      piece: '',
      farmerId: '',
    });
  };

  const handleEdit = (production: Productions) => {
    setEditingProduction(production);
    setFormData({
      cartoon: production.cartoon.toString(),
      tray: production.tray.toString(),
      piece: production.piece.toString(),
      farmerId: production.farmerId.toString(),
    });

    setIsDialogOpen(true);
  };

  console.log('users', user);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productions Management</h1>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduction ? 'Edit Customer' : 'Add New Customer'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Enter cartoons"
                  value={formData.cartoon}
                  onChange={(e) =>
                    setFormData({ ...formData, cartoon: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Enter tray"
                  value={formData.tray}
                  onChange={(e) =>
                    setFormData({ ...formData, tray: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Enter piece"
                  value={formData.piece}
                  onChange={(e) =>
                    setFormData({ ...formData, piece: e.target.value })
                  }
                  required
                />
              </div>

              <Input
                placeholder="Current Area"
                value={formData.farmerId}
                onChange={(e) =>
                  setFormData({ ...formData, farmerId: e.target.value })
                }
                required
              />

              <Button type="submit" className="w-full">
                {editingProduction ? 'Update Customer' : 'Add Customer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Farm</TableHead>
              <TableHead>Cartoon</TableHead>
              <TableHead>Tray</TableHead>
              <TableHead>Piece</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productions.map((production) => (
              <TableRow key={production.id}>
                <TableCell>
                  {format(production.created_at ?? '', 'MMMM do, yyyy')}
                </TableCell>
                <TableCell>{production.username} </TableCell>
                <TableCell>{production.cartoon}</TableCell>
                <TableCell>{production.tray}</TableCell>
                <TableCell>{production.piece}</TableCell>
                <TableCell>
                  {addCommas(
                    production.cartoon * 360 +
                      production.tray * 30 +
                      production.piece
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(production)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        deleteProduction(Number(production.id));
                        showToast('deleted successfully', 'success');
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {productions.length === 0 && (
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
