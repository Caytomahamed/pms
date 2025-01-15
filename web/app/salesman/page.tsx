'use client';

import { useEffect, useState } from 'react';
import { useSalesStore } from '@/store/salesStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Sales, User } from '@/types';
import { User } from 'lucide-react';

export default function SalesPage() {
  const { mySales, fetchSalesmanSales, updateSaleStatus } = useSalesStore();

  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(
    null
  );
  const [saleForm, setSaleForm] = useState({
    quantity: '',
    price: '',
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userlogin = localStorage.getItem('user');
    if (userlogin) {
      setUser(JSON.parse(userlogin));
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log('salesman user', user);
      fetchSalesmanSales(Number(user.id));
    }
  }, [user]);

  const handleSaleSubmit = (assignmentId: string) => {
    if (!saleForm.quantity || !saleForm.price) {
      alert('Please fill in all required fields');
      return;
    }

    const assignment = mySales.find((a) => a.id === Number(assignmentId));
    if (!assignment) return;

    updateSaleStatus(Number(assignmentId), 'completed', {
      actualQuantity: saleForm.quantity,
      actualPrice: '' + saleForm.price,
    });

    setSelectedAssignment(null);
    setSaleForm({
      quantity: '',
      price: '',
    });
  };

  const [activeTab, setActiveTab] = useState<Sales['status']>('in_progress');

  const filteredSales = mySales.filter((sale) => sale.status === activeTab);

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-start space-x-4 mb-4">
        {['in_progress', 'completed'].map((status) => (
          <Button
            key={status}
            variant={activeTab === status ? 'default' : 'outline'}
            onClick={() =>
              setActiveTab((status as Sales['status']) || 'in_progress')
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Assignments</CardTitle>
          <CardDescription>
            Record sales for completed deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSales.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Sale #{assignment.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Salesman: {assignment.salesmanId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Customer: {assignment.customerId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {assignment.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Est. Price: ${assignment.estimatedPrice}
                        </p>
                      </div>
                      {assignment.status === 'completed' && (
                        <div className="mt-2 ml-2">
                          <h1>AFter assignment</h1>
                          <p className="text-sm text-muted-foreground">
                            Actual Quantity: ${assignment.actualQuantity}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Actaul Price: ${assignment.actualPrice}
                          </p>
                        </div>
                      )}
                      {assignment.status === 'in_progress' && (
                        <p className="text-sm text-muted-foreground">
                          Deadline:{' '}
                          {new Date(assignment.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {Number(selectedAssignment) === Number(assignment.id) ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Actual Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={saleForm.quantity}
                            onChange={(e) =>
                              setSaleForm((prev) => ({
                                ...prev,
                                quantity: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="price">Actual Price</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={saleForm.price}
                            onChange={(e) =>
                              setSaleForm((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSaleSubmit('' + assignment.id)}
                            className="flex-1"
                          >
                            Complete Sale
                          </Button>
                          <Button
                            onClick={() => setSelectedAssignment(null)}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() =>
                          setSelectedAssignment('' + assignment.id)
                        }
                        className="w-full"
                      >
                        Record Sale
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
