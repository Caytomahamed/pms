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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Edit, Trash } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
    } catch (error) {
      setToast({ message: 'Error saving inventory', type: 'error' });
    }
  };

  const handleEdit = (item: any) => {
    setInventoryForm({
      orderId: item.orderId.toString(),
      totalDelivered: item.total.toString(),
      damagedCount: item.damaged.toString(),
      notes: item.note || '',
    });
    setEditInventoryId(item.id);
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
      <div className="inventory-list">
        <Card>
          <CardHeader>
            <CardTitle>Current Inventory</CardTitle>
            <CardDescription>Overview of available eggs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invertories.length > 0 ? (
                invertories.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Order #{item.orderId}</p>
                          <p className="text-sm text-muted-foreground">
                            Inventory Id : {item.id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Delivered: {item.total}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Available: {item.total - item.damaged}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Damaged: {item.damaged}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            CreateAt:{' '}
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(Number(item.id))}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-center">
                  No inventory records found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
