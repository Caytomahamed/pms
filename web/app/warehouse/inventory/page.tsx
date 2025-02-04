'use client';

import { useState, useEffect } from 'react';
import { useInventoryStore } from '@/store/InvertoryStore';
import Toast from '../../components/Toast';
import {
  Dialog,
  // DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Edit, Trash, MoreVertical } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Inventory } from '@/types';
import { format } from 'date-fns';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WarehousePage() {
  const {
    invertories,
    fetchData,
    addInventory,
    updateInventory,
    deleteInventory,
  } = useInventoryStore();

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [inventoryForm, setInventoryForm] = useState({
    orderId: '',
    totalDelivered: '',
    damagedCount: '',
    notes: '',
  });

  const [editInventoryId, setEditInventoryId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editInventoryId) {
        await updateInventory(editInventoryId, {
          orderId: parseInt(inventoryForm.orderId),
          total: parseInt(inventoryForm.totalDelivered),
          damaged: parseInt(inventoryForm.damagedCount) || 0,
          note: inventoryForm.notes,
        });
        setToast({
          message: 'Inventory updated successfully!',
          type: 'success',
        });
      } else {
        await addInventory({
          orderId: parseInt(inventoryForm.orderId),
          total: parseInt(inventoryForm.totalDelivered),
          damaged: parseInt(inventoryForm.damagedCount) || 0,
          note: inventoryForm.notes,
        });
        setToast({ message: 'Inventory added successfully!', type: 'success' });
      }
      setInventoryForm({
        orderId: '',
        totalDelivered: '',
        damagedCount: '',
        notes: '',
      });
      setEditInventoryId(null);
      setDialogOpen(false);
    } catch {
      setToast({ message: 'Error saving inventory', type: 'error' });
    }
  };

  const handleEdit = (item: Inventory) => {
    setInventoryForm({
      orderId: item.orderId.toString(),
      totalDelivered: item.total.toString(),
      damagedCount: item.damaged.toString(),
      notes: item.note || '',
    });
    if (item.id !== undefined) {
      setEditInventoryId(item.id);
    }
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteInventory(id);
      setToast({ message: 'Inventory deleted successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Error deleting inventory', type: 'error' });
    }
  };

  return (
    <div className="w-full mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <h1 className="text-2xl font-bold my-10">Inventory Management</h1>
      <Button onClick={() => setDialogOpen(true)} className="mb-5">
        Add Inventory
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editInventoryId ? 'Edit Inventory' : 'Add Inventory'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              value={inventoryForm.orderId}
              onChange={(e) =>
                setInventoryForm({ ...inventoryForm, orderId: e.target.value })
              }
            />
            <Label htmlFor="totalDelivered">Total Delivered</Label>
            <Input
              id="totalDelivered"
              type="number"
              value={inventoryForm.totalDelivered}
              onChange={(e) =>
                setInventoryForm({
                  ...inventoryForm,
                  totalDelivered: e.target.value,
                })
              }
            />
            <Label htmlFor="damagedCount">Damaged Count</Label>
            <Input
              id="damagedCount"
              type="number"
              value={inventoryForm.damagedCount}
              onChange={(e) =>
                setInventoryForm({
                  ...inventoryForm,
                  damagedCount: e.target.value,
                })
              }
            />
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={inventoryForm.notes}
              onChange={(e) =>
                setInventoryForm({ ...inventoryForm, notes: e.target.value })
              }
            />

            <DialogFooter>
              <Button className="w-full mt-5" type="submit">
                Record Inventory
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="inventory-list mb-20">
        <CardHeader className="ml-[-15px]">
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>Overview of available eggs</CardDescription>
        </CardHeader>

        <div className="flex flex-wrap gap-4">
          {invertories.length > 0 ? (
            invertories.map((item) => (
              <div
                className="max-w-md  bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-[300px]"
                key={item.id}
              >
                {/* <!-- Card Header --> */}
                <div className="p-6 pb-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                        {item.username
                          ? item.username.slice(0, 1).toUpperCase()
                          : ''}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {item.username
                            ? item.username.slice(0, 1).toUpperCase() +
                              item.username.slice(1)
                            : ''}
                        </h2>
                        <p className="text-gray-500 text-sm">
                          Order #{item.orderId}
                        </p>
                      </div>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800  font-medium px-2.5 py-0.5  cursor-pointer rounded-full">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          {/* <Button variant="outline">Open</Button> */}
                          <MoreVertical className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-20 bg-white shadow-md rounded-lg p-2">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => handleEdit(item)}
                              className="flex outline-none"
                            >
                              <Edit size={16} />
                              <span className="ml-1">Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(Number(item.id))}
                              className="flex outline-none"
                            >
                              <Trash color="red" size={16} />
                              <span className="text-red-500 ml-1">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </span>
                  </div>
                </div>

                {/* <!-- Card Content --> */}
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {item.total}
                      </p>
                      <p className="text-sm text-gray-500">Total Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {item.damaged}
                      </p>
                      <p className="text-sm text-gray-500">Damaged</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Note:</span>
                      <span className="text-gray-700 font-medium truncate max-w-[200px]">
                        {item.note}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-700">
                        {format(item.created_at ?? '', 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* <!-- Card Footer --> */}
                <div className="bg-gray-50 px-6 py-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Inventory ID:</span>
                    <span className="font-medium text-gray-700">
                      #{item.id}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center">
              No inventory records found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
