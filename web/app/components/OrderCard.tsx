import React, { JSX } from 'react';
import { format, differenceInMilliseconds } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Clock,
  CheckCheck,
  MoreVertical,
  Edit,
  Trash,
} from 'lucide-react';
import { EggOrder } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';

const OrderCard: React.FC<{
  order: EggOrder;
  handleDelete: (id: number) => void;
  handleEdit: (order: EggOrder) => void;
}> = ({ order, handleDelete, handleEdit }) => {
  const createdAt = new Date(format(order.created_at ?? '', 'yyyy-MM-dd'));
  const deadline = new Date(order.deadline);
  const now = new Date();

  // Define status colors & icons
  interface StatusConfig {
    color: string;
    icon: JSX.Element;
  }

  const statusConfig: Record<EggOrder['status'], StatusConfig> = {
    pending: { color: 'bg-yellow-400', icon: <Clock size={16} /> },
    accepted: { color: 'bg-blue-500', icon: <CheckCircle size={16} /> },
    declined: { color: 'bg-red-500', icon: <XCircle size={16} /> },
    completed: { color: 'bg-green-500', icon: <CheckCheck size={16} /> },
  };

  const { color, icon } = statusConfig[order.status];

  // Calculate progress percentage
  let progress = 0;
  if (order.status === 'completed') {
    progress = 100;
  } else {
    const totalDuration = differenceInMilliseconds(deadline, createdAt);
    const elapsedDuration = differenceInMilliseconds(now, createdAt);
    progress = Math.min((elapsedDuration / totalDuration) * 100, 100);
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 w-80">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm font-medium"># {order.id}</span>
        <span
          className={`flex items-center gap-1 text-xs font-medium ${color} text-white px-2 py-1 rounded`}
        >
          {icon} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Order Details */}
      <h3 className="text-sm font-semibold mt-2">{order.notes}</h3>
      <p className="text-xs text-gray-500">Quantity: {order.quantity}</p>

      {/* Progress Bar with Status Color */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{format(createdAt, 'dd MMM, yyyy')}</span>
          <span>{format(deadline, 'dd MMM, yyyy')}</span>
        </div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
          <div
            className={`h-1.5 rounded-full ${color}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Farmer Info */}
      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="bg-gray-800 text-white w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold">
            {(order.fullName ?? '')
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </span>
          <span className="text-gray-700 font-medium">{order.fullName}</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* <Button variant="outline">Open</Button> */}
              <MoreVertical className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-15 bg-white shadow-md rounded-lg p-2">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleEdit(order)}
                  className="flex"
                >
                  <Edit size={16} />
                  <span className="ml-1">Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(Number(order.id))}
                  className="flex"
                >
                  <Trash color="red" size={16} />
                  <span className="text-red-500 ml-1">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
