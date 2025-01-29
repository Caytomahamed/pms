import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Productions } from '@/types';
import { format } from 'date-fns';
import { addCommas } from '../page';

export default function LastestProduction({
  productions,
}: {
  productions: Productions[];
}) {
  return (
    <Table className="col-span-3">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Farm</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productions &&
          productions.map((production: Productions) => (
            <TableRow key={production.id}>
              <TableCell>
                {' '}
                {format(production.created_at ?? '', 'MMMM do, yyyy')}
              </TableCell>
              <TableCell>{production.username} </TableCell>
              <TableCell>
                {' '}
                {addCommas(
                  production.cartoon * 360 +
                    production.tray * 30 +
                    production.piece
                )}{' '}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
