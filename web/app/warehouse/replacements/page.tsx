'use client';

import { useState, useEffect } from 'react';
import { useReplacementStore } from '@/store/replacementStore';
import Toast from '../../components/Toast';
import {
  Dialog,
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
import { CalendarIcon, Edit, Trash } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Replacement } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { format } from 'date-fns';

export default function ReplacementPage() {
  const {
    replacements,
    fetchData,
    addReplacement,
    updateReplacement,
    deleteReplacement,
  } = useReplacementStore();

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [replacementForm, setReplacementForm] = useState({
    orderId: '',
    quantity: '',
    reason: '',
    deadline: new Date(),
    status: 'pending',
  });

  const [editReplacementId, setEditReplacementId] = useState<number | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editReplacementId) {
        await updateReplacement(editReplacementId, {
          orderId: parseInt(replacementForm.orderId),
          quantity: parseInt(replacementForm.quantity),
          reason: replacementForm.reason,
          deadline: replacementForm.deadline,
        });
        setToast({
          message: 'Replacement updated successfully!',
          type: 'success',
        });
      } else {
        await addReplacement({
          // name: replacementForm.name,
          quantity: parseInt(replacementForm.quantity),
          reason: replacementForm.reason,
          // notes: replacementForm.notes,
          deadline: new Date(),
          status: 'pending',
          orderId: 1,
        });
        setToast({
          message: 'Replacement added successfully!',
          type: 'success',
        });
      }
      setReplacementForm({
        orderId: '',
        quantity: '',
        reason: '',
        deadline: new Date(),
        status: 'pending',
      });
      setEditReplacementId(null);
      setDialogOpen(false);
    } catch {
      setToast({ message: 'Error saving replacement', type: 'error' });
    }
  };

  const handleEdit = (item: Replacement) => {
    setReplacementForm({
      orderId: '' + item.orderId,
      quantity: '' + item.quantity,
      deadline: item.deadline,
      reason: item.reason,
      status: item.status,
    });
    setEditReplacementId(Number(item.id));
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReplacement(id);
      setToast({
        message: 'Replacement deleted successfully!',
        type: 'success',
      });
    } catch {
      setToast({ message: 'Error deleting replacement', type: 'error' });
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
        Add Replacement
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editReplacementId ? 'Edit Replacement' : 'Add Replacement'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Label htmlFor="name">Original Order ID</Label>
            <Input
              id="name"
              value={replacementForm.orderId}
              onChange={(e) =>
                setReplacementForm({
                  ...replacementForm,
                  orderId: e.target.value,
                })
              }
            />
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={replacementForm.quantity}
              onChange={(e) =>
                setReplacementForm({
                  ...replacementForm,
                  quantity: e.target.value,
                })
              }
            />
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="notes"
              value={replacementForm.reason}
              onChange={(e) =>
                setReplacementForm((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
            />
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(replacementForm.deadline, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white shadow-2xl">
                  <Calendar
                    mode="single"
                    selected={replacementForm.deadline}
                    onSelect={(date) =>
                      date &&
                      setReplacementForm((prev) => ({
                        ...prev,
                        deadline: date,
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <DialogFooter>
              <Button className="w-full mt-5" type="submit">
                Save Replacement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="replacement-list">
        <Card>
          <CardHeader>
            <CardTitle>Current Replacements</CardTitle>
            <CardDescription>Overview of all replacements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {replacements.length > 0 ? (
                replacements.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Order #{item.orderId}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Reason: {item.reason}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            DeadLine:{' '}
                            {new Date(item.deadline).toLocaleDateString()}
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
                  No replacement records found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
