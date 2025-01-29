import React, { JSX } from 'react';
import { format, differenceInMilliseconds } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Clock,
  CheckCheck,
  ArrowRight,
} from 'lucide-react';

interface Order {
  id: number;
  deadline: string;
  notes: string;
  quantity: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  farmerId: number;
  created_at: string;
  updated_at: string;
  fullName: string;
}

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const createdAt = new Date(order.created_at);
  const deadline = new Date(order.deadline);
  const now = new Date();

  // Define status colors & icons
interface StatusConfig {
    color: string;
    icon: JSX.Element;
}

const statusConfig: Record<Order['status'], StatusConfig> = {
    pending: { color: 'bg-yellow-400', icon: <Clock size={16} /> },
    accepted: { color: 'bg-blue-500', icon: <CheckCircle size={16} /> },
    declined: { color: 'bg-red-500', icon: <XCircle size={16} /> },
    completed: { color: 'bg-green-500', icon: <CheckCheck size={16} /> },
};

  const { color, icon } = statusConfig[order.status];

  // Calculate progress percentage
  let progress = 0;
  if (order.status === 'completed' || order.status === 'declined') {
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
            {order.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </span>
          <span className="text-gray-700 font-medium">{order.fullName}</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200">
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
