import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EggOrder } from '@/types';

export function RecentOrders({ orders }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>FarmId</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Deadline</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order: EggOrder) => (
          <TableRow key={order.id}>
            <TableCell>{order.farmerId}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>
              <Badge
                variant={
                  order.status === 'accepted'
                    ? 'secondary'
                    : order.status === 'declined'
                    ? 'destructive'
                    : 'default'
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{order.deadline}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
