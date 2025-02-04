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
import {
  CalendarIcon,
  Edit,
  Trash,
  MoreVertical,
  Clock,
  CheckCircle2,
  Truck,
  ImageIcon,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Replacement } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { format } from 'date-fns';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { addCommas } from '@/app/page';

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
  const [viewingEvidenceId, setViewingEvidenceId] = useState<number | null>(
    null
  );

  const [replacementForm, setReplacementForm] = useState<{
    orderId: string;
    quantity: string;
    reason: string;
    deadline: Date;
    status: Replacement['status'];
    image: FileList | undefined;
  }>({
    orderId: '',
    quantity: '',
    reason: '',
    deadline: new Date(),
    status: 'pending',
    image: undefined,
  });

  const [editReplacementId, setEditReplacementId] = useState<number | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateProgress = (createdAt: Date, deadline: Date) => {
    const created = new Date(createdAt).getTime();
    const deadlineTime = new Date(deadline).getTime();
    const now = Date.now();

    const total = deadlineTime - created;
    const elapsed = now - created;

    if (total <= 0) return 100;
    const progress = (elapsed / total) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const StatusBadge = ({ status }: { status: Replacement['status'] }) => {
    const baseClasses =
      'text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center';
    const iconClasses = 'w-4 h-4 mr-1';

    switch (status) {
      case 'approved':
        return (
          <span className={`bg-green-100 text-green-800 ${baseClasses}`}>
            <CheckCircle2 className={iconClasses} />
            Approved
          </span>
        );
      case 'delivered':
        return (
          <span className={`bg-blue-100 text-blue-800 ${baseClasses}`}>
            <Truck className={iconClasses} />
            Delivered
          </span>
        );
      default:
        return (
          <span className={`bg-yellow-100 text-yellow-800 ${baseClasses}`}>
            <Clock className={iconClasses} />
            Pending
          </span>
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editReplacementId) {
        await updateReplacement(editReplacementId, {
          orderId: parseInt(replacementForm.orderId),
          quantity: parseInt(replacementForm.quantity),
          reason: replacementForm.reason,
          deadline: replacementForm.deadline,
          status: replacementForm.status as Replacement['status'],
        });
        setToast({
          message: 'Replacement updated successfully!',
          type: 'success',
        });
      } else {
        await addReplacement({
          quantity: parseInt(replacementForm.quantity),
          reason: replacementForm.reason,
          deadline: new Date(),
          status: 'pending',
          orderId: Number(replacementForm.orderId),
          image: replacementForm.image,
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
        image: undefined,
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
      image: item.image ? (item.image as FileList) : undefined,
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

  const displayReplacementImageOrVideo = (filename: string) => {
    const fileType = filename.split('.')[1];

    if (['jpg', 'jpeg', 'png'].includes(fileType)) {
      return (
        <Image
          src={`http://localhost:9000/uploads/${filename}`}
          width={200}
          height={200}
          style={{ objectFit: 'cover' }}
          alt={`Replacement image for order ${filename}`}
        />
      );
    } else if (['mp4'].includes(fileType)) {
      return (
        <video width="200" height="200" controls>
          <source
            src={`http://localhost:9000/uploads/${filename}`}
            type="video/mp4"
          />
        </video>
      );
    }
  };

  function calculatePackaging(totalPieces) {
    const CARTON_SIZE = 360;
    const TRAY_SIZE = 30;

    let cartons = Math.floor(totalPieces / CARTON_SIZE);
    let remainingAfterCartons = totalPieces % CARTON_SIZE;

    let trays = Math.floor(remainingAfterCartons / TRAY_SIZE);
    let pieces = remainingAfterCartons % TRAY_SIZE;

    return {
      cartons,
      trays,
      pieces,
    };
  }

  return (
    <div className="w-full mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-2xl font-bold my-10">Replacement Management</h1>
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

              <Label>Replacement Image</Label>
              <Input
                id="image"
                type="file"
                onChange={(e) => {
                  if (!e.target.files) return;
                  setReplacementForm({
                    ...replacementForm,
                    image: e.target.files,
                  });
                }}
              />

              {editReplacementId && (
                <>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={replacementForm.status}
                    onChange={(e) =>
                      setReplacementForm({
                        ...replacementForm,
                        status: e.target.value as Replacement['status'],
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </>
              )}
            </div>

            <DialogFooter>
              <Button className="w-full mt-5" type="submit">
                Save Replacement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!viewingEvidenceId}
        onOpenChange={() => setViewingEvidenceId(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Replacement Evidence</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto">
            {viewingEvidenceId &&
              displayReplacementImageOrVideo(
                replacements.find((r) => r.id === viewingEvidenceId)?.image ||
                  ''
              )}
          </div>
        </DialogContent>
      </Dialog>

      <CardHeader className="ml-[-15px]">
        <CardTitle>Current Replacements</CardTitle>
        <CardDescription>Overview of all replacements</CardDescription>
      </CardHeader>

      <div className="replacement-list flex flex-wrap gap-4 mb-10">
        {replacements.length > 0 ? (
          replacements.map((item) => {
            const progress = calculateProgress(
              new Date(item.created_at),
              new Date(item.deadline)
            );
            const isOverdue = progress >= 100;

            return (
              <div
                className="max-w-md bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative md:w-[430px]"
                key={item.id}
              >
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 bg-white shadow-lg rounded-md p-2">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleEdit(item)}
                          className="flex items-center p-2 hover:bg-gray-100 rounded"
                        >
                          <Edit size={16} className="mr-2" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(Number(item.id))}
                          className="flex items-center p-2 hover:bg-gray-100 rounded"
                        >
                          <Trash size={16} className="mr-2 text-red-500" />
                          <span className="text-red-500">Delete</span>
                        </DropdownMenuItem>
                        {item.image && (
                          <DropdownMenuItem
                            onClick={() => setViewingEvidenceId(item.id)}
                            className="flex items-center p-2 hover:bg-gray-100 rounded"
                          >
                            <ImageIcon size={16} className="mr-2" />
                            <span>View Evidence</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="p-6 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Replace Request #{item.id}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Order #{item.orderId}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-100 p-3 rounded-lg mr-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {calculatePackaging(item.quantity)['cartons']},
                        {calculatePackaging(item.quantity)['trays']},
                        {calculatePackaging(item.quantity)['pieces']}
                      </p>
                      <p className="text-sm text-gray-500">
                        Replacement Needed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Reason
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.reason}
                      </p>
                    </div>

                    <div className="flex flex-col items-start text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Deadline</p>
                        <p className="text-red-600 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4 mr-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                            />
                          </svg>
                          {format(new Date(item.deadline), "PPP 'at' p")}
                        </p>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
                        <div
                          className={`h-full ${
                            isOverdue
                              ? 'bg-red-500'
                              : item.status === 'delivered'
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-6 py-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      Created:{' '}
                      {item.created_at
                        ? format(new Date(item.created_at), 'dd MMM, yyyy')
                        : 'N/A'}
                    </span>
                    <span>ID: #{item.id}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No replacement records found</p>
        )}
      </div>
    </div>
  );
}
