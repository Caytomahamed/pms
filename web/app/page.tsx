'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Package, ShoppingCart, Users } from 'lucide-react';
import { SalesChart } from './components/charts/SalesChart';
import { RecentOrders } from './components/RecentOrders';

import { useUsersStore } from '@/store/usersStore';
import { useEffect } from 'react';

export default function Home() {
  const { reports, fetchReport } = useUsersStore();

  useEffect(() => {
    fetchReport();
  }, []);

  const addCommas = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const noSales = [
    {
      created_at: '2025-01-14T21:26:30.000Z',
      estimatedPrice: '100',
    },
    {
      created_at: '2025-01-14T21:26:30.000Z',
      estimatedPrice: '200',
    },
    {
      created_at: '2025-01-14T21:26:30.000Z',
      estimatedPrice: '300',
    },
    {
      created_at: '2025-01-14T21:26:30.000Z',
      estimatedPrice: '400',
    },
    {
      created_at: '2025-01-14T21:26:30.000Z',
      estimatedPrice: '500',
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addCommas(reports.totalOrders) || addCommas(100)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Status
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addCommas(reports.currentStock) || addCommas(1000)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current eggs in stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Farms</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {' '}
              {addCommas(reports.totalFarms) || addCommas(1000)}
            </div>
            <p className="text-xs text-muted-foreground">2 pending approvals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Delivery Schedule
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {' '}
              {addCommas(reports.salesToday) || addCommas(1000)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sales scheduled today
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8 ">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart sales={reports.salesOverview || noSales} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={reports.orders} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
