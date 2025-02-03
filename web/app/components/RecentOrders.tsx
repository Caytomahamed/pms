import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { EggOrder } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function RecentOrders({ orders }: { orders: EggOrder[] }) {
  console.log('orders', orders);
  return (
    <Table className="col-span-3">
      <TableHeader>
        <TableRow>
          <TableHead>Farm</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Deadline</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders &&
          orders.map((order: EggOrder) => (
            <TableRow key={order.id}>
              <TableCell>{order.username?.split(' ')[0]}</TableCell>
              <TableCell>{order.quantity} Cartoon</TableCell>
              <TableCell>
                <div
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                    order.status === 'pending' &&
                      'bg-yellow-100 text-yellow-800',
                    order.status === 'declined' && 'bg-red-100 text-red-800',
                    order.status === 'accepted' && 'bg-blue-100 text-blue-800',
                    order.status === 'completed' &&
                      'bg-green-100 text-green-800'
                  )}
                >
                  {order.status}
                </div>
              </TableCell>
              <TableCell>
                {' '}
                {format(order.created_at ?? '', 'MMMM do, yyyy')}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
