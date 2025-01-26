import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { User } from '@/types';

export default function TopUser({ users }: { users: User[] }) {
  return (
    <Table className="col-span-3">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Sales</TableHead>
          <TableHead>TotalRevenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users &&
          users.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.phone} </TableCell>
              <TableCell>{user.count}</TableCell>
              <TableCell>{user.totalRevenue}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
